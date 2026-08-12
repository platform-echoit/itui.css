/**
 * Every focusable node a component renders must show where focus is.
 *
 * ── What breaks without this
 *
 *   A missing focus indicator is invisible in code review. It is one absent
 *   class in a string of twenty, it renders perfectly, every other gate stays
 *   green — the bundle is byte-identical, RSC does not break, the docs do not
 *   drift — and the only way to see it is to tab through the component in a
 *   browser and watch nothing happen. The focus-visible audit that produced this
 *   script had to read all ~30 components by hand to find 13 nodes with no
 *   indicator at all, and a `<button>` in `resource-modal` still slipped past it
 *   because that component has no story to tab through.
 *
 * ── Rules (syntactic; no type checker needed)
 *
 *   R1 — a focusable node carries no focus-visible indicator, and nothing above
 *        it delegates one. Focusable means: `<button>`, `<a href>`, `<input>`
 *        (not `type="hidden"`), `<select>`, `<textarea>`, a non-negative
 *        `tabIndex`, or a Radix part that is a tab stop by construction
 *        (`X.Trigger`, `X.Item`, `X.Thumb`, …).
 *
 *   R2 — one node carries both `focus-ring` and `focus-ring-inset`.
 *        `tailwind-merge` knows neither utility, so it keeps the pair and the
 *        winner is whichever lands later in the generated stylesheet — decided
 *        by cascade rather than by the order you wrote them in.
 *
 *   An indicator counts when the node's own class string carries
 *   `focus-visible:` (including `focus-visible:outline-none`, which is a
 *   deliberate opt-out and reads as one), or when an ancestor delegates with
 *   `has-[…focus-visible…]`, `peer-focus-visible:`, `group-focus-visible:` or
 *   `focus-within:` — the library paints ~118 of its indicators on a node other
 *   than the one that holds focus, so a rule that only looked at the focused
 *   node would report most of the `Checkbox` family as broken.
 *
 *   Class strings are resolved through the constants they are assembled from —
 *   module-scope (`ROW_BASE`, a `cva()` base) and in-component alike
 *   (`const classes = cn(buttonVariants(…), className)`) — and through the
 *   components that ring on another's behalf, since `InputFieldShell` draws the
 *   indicator for an `<input>` a file away.
 *
 *   Three things are not this package's to ring, and are skipped rather than
 *   opted out one by one: a node behind `asChild` (the consumer's child is the
 *   control), a Radix part we only re-export without styling, and a hard-coded
 *   `tabIndex={-1}`. Anything left that genuinely draws nothing opts out with a
 *   `focus-ok:` comment giving the reason.
 *
 * Usage:  tsx scripts/check-focus.ts [--self-test]
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';
import ts from 'typescript';

const root = resolve(process.cwd());
const componentsDir = join(root, 'src/components');

/** Elements that are a tab stop by being what they are. */
const INTRINSIC_FOCUSABLE = new Set(['button', 'input', 'select', 'textarea']);

/**
 * Radix parts that are tab stops by construction. Matched on the member name of
 * a dotted tag (`RadixSelect.Trigger`), which is how this package imports Radix.
 */
const RADIX_FOCUSABLE =
  /^(Trigger|SubTrigger|Item|RadioItem|CheckboxItem|Thumb|Close|Link)$/;

/** The node draws its own indicator — or deliberately suppresses it. */
const OWN_INDICATOR = /focus-visible:|focus-ring|has-\[[^\]]*focus-visible/;

/** An ancestor draws the indicator on this node's behalf. */
const DELEGATES =
  /has-\[[^\]]*focus-visible|peer-focus-visible:|group-focus-visible:|group-has-\[[^\]]*focus-visible|focus-within:/;

/** `focus-ring` on its own, not the `focus-ring-inset` that contains it. */
const OUTWARD_RING = /(?<![-\w])focus-ring(?!-inset)(?![-\w])/;
const INSET_RING = /(?<![-\w])focus-ring-inset(?![-\w])/;

/** Opt-out: `// focus-ok: <reason>` in the comment above the node. */
const OPT_OUT = /focus-ok:/;

interface Violation {
  file: string;
  line: number;
  tag: string;
  rule: 'R1' | 'R2';
  detail: string;
}

function collectFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...collectFiles(full));
    else if (/\.tsx$/.test(entry)) out.push(full);
  }
  return out;
}

type Element = ts.JsxOpeningElement | ts.JsxSelfClosingElement;

function isElement(node: ts.Node): node is Element {
  return ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node);
}

function attribute(
  element: Element,
  name: string,
): ts.JsxAttribute | undefined {
  for (const property of element.attributes.properties) {
    if (ts.isJsxAttribute(property) && property.name.getText() === name) {
      return property;
    }
  }
  return undefined;
}

/**
 * Every `const NAME = …` in the file, at any depth. Half the class strings here
 * are module-scope (`ROW_BASE`, a `cva()` base) and half are computed in the
 * component body (`const classes = cn(buttonVariants(…), className)`), so a
 * module-scope-only pass would report `Button` itself as having no indicator.
 */
function classConstants(source: ts.SourceFile): Map<string, string> {
  const constants = new Map<string, string>();

  const visit = (node: ts.Node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer
    ) {
      constants.set(node.name.text, node.initializer.getText());
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
  return constants;
}

/**
 * Comments, gone. They are full of the very utility names being searched for —
 * a row explaining "pass `focus-visible:focus-ring-inset` when a panel clips"
 * would otherwise read as a node carrying both rings.
 */
function stripComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');
}

/**
 * The class string of one node, with module-scope constants folded in. Two
 * passes, so `cn(ROW_BASE)` where `ROW_BASE = cva(BASE)` still resolves.
 */
function classText(element: Element, constants: Map<string, string>): string {
  const attr = attribute(element, 'className');
  if (!attr?.initializer) return '';

  let text = stripComments(attr.initializer.getText());
  for (let pass = 0; pass < 2; pass++) {
    const source = ts.createSourceFile(
      'expr.tsx',
      text,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const names = new Set<string>();
    const visit = (node: ts.Node) => {
      if (ts.isIdentifier(node)) names.add(node.text);
      ts.forEachChild(node, visit);
    };
    visit(source);

    let grown = text;
    for (const name of names) {
      const value = constants.get(name);
      if (!value) continue;
      const stripped = stripComments(value);
      if (!text.includes(stripped)) grown += ` ${stripped}`;
    }
    if (grown === text) break;
    text = grown;
  }

  return text;
}

/** Every JSX element enclosing this one, innermost first. */
function ancestors(element: Element): Element[] {
  const out: Element[] = [];
  for (let n: ts.Node | undefined = element.parent; n; n = n.parent) {
    if (ts.isJsxElement(n)) out.push(n.openingElement);
    else if (isElement(n) && n !== element) out.push(n);
  }
  return out;
}

type TabIndex = 'none' | 'positive' | 'hard-negative' | 'conditional';

/**
 * A hard-coded `tabIndex={-1}` takes the node out of the tab order for good —
 * `WheelPicker`'s options are driven from the listbox above them and are never
 * focused at all. A *conditional* one is the roving-tabindex idiom instead
 * (`PopoverMenu` promotes exactly one row to 0), where the node is reached by
 * arrow key and very much does need an indicator, so it stays checked.
 */
function tabIndexKind(element: Element): TabIndex {
  const initializer = attribute(element, 'tabIndex')?.initializer;
  if (!initializer || !ts.isJsxExpression(initializer)) return 'none';

  const expression = initializer.expression;
  if (!expression) return 'none';
  if (ts.isPrefixUnaryExpression(expression)) return 'hard-negative';
  if (ts.isNumericLiteral(expression)) return 'positive';
  return /(?<![-\w])0(?![.\w])/.test(expression.getText())
    ? 'conditional'
    : 'none';
}

/** A class string this package wrote, rather than one it only passes along. */
const AUTHORED_CLASS = /(['"`])[^'"`]*[A-Za-z][^'"`]*\1/;

function isFocusable(element: Element, tag: string, own: string): boolean {
  // `asChild` renders the child in this node's place, so the child is the tab
  // stop and carries the class. Radix triggers are written this way throughout.
  if (attribute(element, 'asChild') !== undefined) return false;

  const tabIndex = tabIndexKind(element);
  if (tabIndex === 'hard-negative') return false;
  if (tabIndex === 'positive' || tabIndex === 'conditional') return true;

  if (INTRINSIC_FOCUSABLE.has(tag)) {
    const type = attribute(element, 'type')?.initializer?.getText() ?? '';
    return !/hidden/.test(type);
  }
  if (tag === 'a') return attribute(element, 'href') !== undefined;

  const member = tag.includes('.') ? tag.slice(tag.lastIndexOf('.') + 1) : '';
  if (!RADIX_FOCUSABLE.test(member)) return false;

  // `DialogTrigger` and friends are re-exports: `<Primitive.Trigger {...props} />`
  // with no class of our own, or `cn(className)` carrying only the consumer's.
  // The control they render is the consumer's `asChild` child, and so is its
  // ring. A Radix part is ours to ring only once we have styled it.
  return AUTHORED_CLASS.test(own);
}

/**
 * Components that ring something inside themselves, collected across the whole
 * package. `InputText` renders a bare `<input>` and nothing in *that* file draws
 * an indicator — `InputFieldShell`, one import away, watches the control with
 * `has-[:focus-visible]:focus-ring`. A per-file rule cannot see that, and would
 * report the entire field family as broken.
 */
function delegatingComponents(files: string[]): Set<string> {
  const names = new Set<string>();

  for (const file of files) {
    const source = ts.createSourceFile(
      file,
      readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );

    const record = (name: string, body: ts.Node) => {
      if (!/^[A-Z]/.test(name)) return;
      if (DELEGATES.test(stripComments(body.getText()))) names.add(name);
    };

    for (const statement of source.statements) {
      if (ts.isFunctionDeclaration(statement) && statement.name) {
        record(statement.name.text, statement);
      } else if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name)) {
            record(declaration.name.text, declaration);
          }
        }
      }
    }
  }

  return names;
}

/** Leading comments on the node, or on the JSX attribute list above it. */
function optedOut(element: Element, text: string): boolean {
  const ranges = ts.getLeadingCommentRanges(text, element.pos) ?? [];
  for (const range of ranges) {
    if (OPT_OUT.test(text.slice(range.pos, range.end))) return true;
  }
  // A comment inside the attribute list, which is where these usually read best.
  return OPT_OUT.test(
    text.slice(element.attributes.pos, element.attributes.end),
  );
}

function checkSource(
  file: string,
  text: string,
  delegating: Set<string> = new Set(),
): Violation[] {
  const source = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const constants = classConstants(source);
  const violations: Violation[] = [];
  const fileDelegatesPeer = /peer-focus-visible:/.test(text);
  const fileDelegatesGroup = /group-focus-visible:|group-has-\[/.test(text);

  const visit = (node: ts.Node) => {
    if (isElement(node)) {
      const tag = node.tagName.getText();
      const own = classText(node, constants);
      const line =
        source.getLineAndCharacterOfPosition(node.getStart()).line + 1;

      if (OUTWARD_RING.test(own) && INSET_RING.test(own)) {
        violations.push({
          file,
          line,
          tag,
          rule: 'R2',
          detail:
            'carries focus-ring and focus-ring-inset; tailwind-merge keeps both',
        });
      }

      if (isFocusable(node, tag, own) && !optedOut(node, text)) {
        const delegated =
          ancestors(node).some((a) => {
            const tag = a.tagName.getText();
            if (delegating.has(tag)) return true;
            const parentClass = classText(a, constants);
            if (DELEGATES.test(parentClass)) return true;
            // `asChild` hands this node the parent's classes.
            return (
              attribute(a, 'asChild') !== undefined &&
              OWN_INDICATOR.test(parentClass)
            );
          }) ||
          (fileDelegatesPeer && /(?<![-\w])peer(?![-\w])/.test(own)) ||
          (fileDelegatesGroup && /(?<![-\w])group(?![-\w/])/.test(own));

        if (!OWN_INDICATOR.test(own) && !delegated) {
          violations.push({
            file,
            line,
            tag,
            rule: 'R1',
            detail: 'focusable, but nothing here draws a focus indicator',
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
  return violations;
}

// ─── Self-test ────────────────────────────────────────────────────────────────

function selfTest(): number {
  const cases: Array<[string, string, number, Set<string>?]> = [
    [
      'bare button → flagged',
      'const C = () => <button className="px-2" />;',
      1,
    ],
    [
      'button with the ring → clean',
      'const C = () => <button className="px-2 focus-visible:focus-ring" />;',
      0,
    ],
    [
      'ring folded into a module-scope const → clean',
      "const ROW = 'px-2 focus-visible:focus-ring';\nconst C = () => <button className={cn(ROW)} />;",
      0,
    ],
    [
      'shell delegates with has-[:focus-visible] → clean',
      'const C = () => <div className="has-[:focus-visible]:focus-ring"><input /></div>;',
      0,
    ],
    [
      'hidden input is not a tab stop → clean',
      'const C = () => <input type="hidden" value="x" />;',
      0,
    ],
    [
      'peer input ringed by its sibling → clean',
      'const C = () => <label><input className="peer sr-only" /><span className="peer-focus-visible:focus-ring" /></label>;',
      0,
    ],
    [
      'anchor without href is not a tab stop → clean',
      'const C = () => <a className="text-sm">x</a>;',
      0,
    ],
    [
      'anchor with href → flagged',
      'const C = () => <a href="/x" className="text-sm">x</a>;',
      1,
    ],
    [
      'tabIndex={0} on a div → flagged',
      'const C = () => <div tabIndex={0} className="px-2" />;',
      1,
    ],
    [
      'tabIndex={-1} is not a tab stop → clean',
      'const C = () => <div tabIndex={-1} className="px-2" />;',
      0,
    ],
    [
      'Radix Trigger we styled → flagged',
      'const C = () => <Select.Trigger className="px-2" />;',
      1,
    ],
    [
      'Radix Trigger we only re-export → clean, the consumer owns the control',
      'const C = (props) => <Dialog.Trigger data-slot="x" {...props} />;',
      0,
    ],
    [
      'Radix Trigger forwarding only the consumer class → clean',
      'const C = ({ className, ...props }) => <Popover.Trigger className={cn(className)} {...props} />;',
      0,
    ],
    [
      'component known to delegate wraps the control → clean',
      'const C = () => <InputFieldShell><input /></InputFieldShell>;',
      0,
      new Set(['InputFieldShell']),
    ],
    [
      'a comment naming the other ring is not a second ring',
      'const C = () => <button className={cn(\n// pass focus-visible:focus-ring-inset when a panel clips\n"focus-visible:focus-ring")} />;',
      0,
    ],
    [
      'class string computed in the component body → clean',
      "const C = () => { const classes = cn('px-2 focus-visible:focus-ring'); return <button className={classes} />; };",
      0,
    ],
    [
      'focus-ok opt-out → clean',
      'const C = () => <button /* focus-ok: script-focused container */ className="px-2" />;',
      0,
    ],
    [
      'both ring utilities on one node → flagged as R2',
      'const C = () => <button className="focus-visible:focus-ring focus-visible:focus-ring-inset" />;',
      1,
    ],
    [
      'inset ring alone → clean, not mistaken for the pair',
      'const C = () => <button className="focus-visible:focus-ring-inset" />;',
      0,
    ],
    [
      'asChild parent hands its ring down → clean',
      'const C = () => <Slot asChild className="focus-visible:focus-ring"><button /></Slot>;',
      0,
    ],
  ];

  let failed = 0;
  console.log('self-test');
  for (const [name, code, expected, delegating] of cases) {
    const got = checkSource('self-test.tsx', code, delegating).length;
    const ok = got === expected;
    if (!ok) failed++;
    console.log(
      `  ${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : ` (expected ${expected}, got ${got})`}`,
    );
  }
  console.log('');
  return failed;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

if (process.argv.includes('--self-test')) {
  process.exit(selfTest() === 0 ? 0 : 1);
}

const files = collectFiles(componentsDir);
const delegating = delegatingComponents(files);
const violations = files.flatMap((f) =>
  checkSource(f, readFileSync(f, 'utf8'), delegating),
);

if (violations.length > 0) {
  console.error(
    `✗ focus: ${violations.length} node(s) with no focus indicator, or with two\n`,
  );
  for (const v of violations) {
    console.error(
      `  ${relative(root, v.file)}:${v.line}  <${v.tag}> — ${v.detail}  [${v.rule}]`,
    );
  }
  console.error(
    '\n  Add `focus-visible:focus-ring` — or `focus-visible:focus-ring-inset` when an\n' +
      '  ancestor clips, never both — or opt the node out with a `focus-ok:` comment\n' +
      '  saying why it draws nothing. See ACCESSIBILITY.md, "Focus indicators".',
  );
  process.exit(1);
}

console.log(
  `✓ focus: every focusable node draws an indicator (${files.length} files)`,
);
