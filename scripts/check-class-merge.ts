/**
 * A consumer's class string must reach `cn()`, never a raw concatenation.
 *
 * ── What breaks without this (I-08, and I-31 which is I-08 come back)
 *
 *   `cn()` runs tailwind-merge, so `fieldClassName="text-sm"` *replaces* the
 *   library's `text-base`. Joining the two strings instead emits both, and since
 *   they carry the same specificity the winner is decided by their order in the
 *   generated stylesheet — not by the order in the attribute. The consumer's
 *   class loses, silently, and only for the utilities that happen to collide.
 *   Measured on the real code path before the fix:
 *
 *     Input      text-base kept: true   | text-sm kept: true   → both emitted
 *     InputText  text-base kept: false  | text-sm kept: true   → merged
 *
 * ── Why a guard and not a one-off audit
 *
 *   I-08 already fixed this once and declared "only 3 modules were missing
 *   `cn()`, the other 46 are fine". Four sites survived that audit, because it
 *   counted *modules* while the bug lives per *class-merge site*: `progress/`
 *   was cleared since `Progress.tsx` calls `cn`, and `SyncProgressBar.tsx` next
 *   to it — which imports `cn` not once — was never looked at. Grepping for
 *   `cn(` cannot answer this: a file may call it on one branch and concatenate
 *   on the other. Only a per-site rule can.
 *
 *   Every existing gate is blind to it, too. The bundle is byte-identical, RSC
 *   does not break, the docs do not drift — same shape as I-29.
 *
 * ── Rules (syntactic; no type checker needed)
 *
 *   Subject: an identifier bound in a *parameter* object pattern whose name ends
 *   in `className`/`ClassName` — i.e. a prop the consumer passed in. Locals like
 *   `const rowClassName = cn(...)` are not subjects: they are already merged.
 *
 *   R1 — subject interpolated into a template literal, outside any `cn()` call.
 *   R2 — subject inside an array literal that is `.join(...)`-ed, outside any
 *        `cn()` call.
 *
 *   Anything inside `cn(...)` passes, including `cn(\`… ${className}\`)`:
 *   tailwind-merge resolves conflicts within a single string just as well.
 *   A bare forward (`className={className}`) passes too — the child merges it.
 *
 * Usage:  tsx scripts/check-class-merge.ts [--self-test]
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';
import ts from 'typescript';

const root = resolve(process.cwd());
const componentsDir = join(root, 'src/components');

/** `className`, `fieldClassName`, `boxClassName`, … — a class string from props. */
const CLASS_PROP = /[cC]lassName$/;

interface Violation {
  file: string;
  line: number;
  name: string;
  rule: 'R1' | 'R2';
  detail: string;
}

function collectFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...collectFiles(full));
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

/** Names destructured out of a function parameter — i.e. props, not locals. */
function propClassNames(source: ts.SourceFile): Set<string> {
  const names = new Set<string>();

  const visit = (node: ts.Node) => {
    if (
      ts.isParameter(node) &&
      node.name &&
      ts.isObjectBindingPattern(node.name)
    ) {
      for (const element of node.name.elements) {
        if (ts.isIdentifier(element.name) && CLASS_PROP.test(element.name.text)) {
          names.add(element.name.text);
        }
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
  return names;
}

/** True when `node` sits inside a `cn(...)` argument. */
function insideCn(node: ts.Node): boolean {
  for (let n: ts.Node | undefined = node.parent; n; n = n.parent) {
    if (
      ts.isCallExpression(n) &&
      ts.isIdentifier(n.expression) &&
      n.expression.text === 'cn'
    ) {
      return true;
    }
  }
  return false;
}

/** The template literal this node is interpolated into, if any. */
function enclosingTemplate(node: ts.Node): ts.TemplateExpression | undefined {
  for (let n: ts.Node | undefined = node.parent; n; n = n.parent) {
    if (ts.isTemplateExpression(n)) return n;
    // A nested call or JSX boundary means the value left the template.
    if (ts.isCallExpression(n) || ts.isJsxExpression(n)) return undefined;
  }
  return undefined;
}

/** The array literal this node belongs to, when that array is `.join(...)`-ed. */
function enclosingJoinedArray(node: ts.Node): ts.ArrayLiteralExpression | undefined {
  for (let n: ts.Node | undefined = node.parent; n; n = n.parent) {
    if (!ts.isArrayLiteralExpression(n)) continue;

    // Walk the chain hanging off the array: `.filter(Boolean).join(' ')`.
    for (let outer: ts.Node | undefined = n.parent; outer; outer = outer.parent) {
      if (!ts.isPropertyAccessExpression(outer)) break;
      if (outer.name.text === 'join') return n;
      outer = outer.parent; // step over the CallExpression of `.filter(…)`
      if (!outer || !ts.isCallExpression(outer)) break;
    }
    return undefined;
  }
  return undefined;
}

function checkSource(file: string, text: string): Violation[] {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const subjects = propClassNames(source);
  if (subjects.size === 0) return [];

  const violations: Violation[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isIdentifier(node) && subjects.has(node.text)) {
      // Skip the binding site itself and property *names* (`{ className: x }`).
      const isBinding =
        ts.isBindingElement(node.parent) && node.parent.name === node;
      const isPropName =
        ts.isPropertyAssignment(node.parent) && node.parent.name === node;

      if (!isBinding && !isPropName && !insideCn(node)) {
        const { line } = source.getLineAndCharacterOfPosition(node.getStart());
        const template = enclosingTemplate(node);
        const array = enclosingJoinedArray(node);

        if (template) {
          violations.push({
            file,
            line: line + 1,
            name: node.text,
            rule: 'R1',
            detail: 'interpolated into a template literal instead of cn()',
          });
        } else if (array) {
          violations.push({
            file,
            line: line + 1,
            name: node.text,
            rule: 'R2',
            detail: "joined with .join(' ') instead of cn()",
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
  const cases: Array<[string, string, number]> = [
    [
      'template literal without cn → flagged',
      'const C = ({ className }) => <div className={`a b ${className}`} />;',
      1,
    ],
    [
      'template literal inside cn → clean (twMerge still resolves one string)',
      'const C = ({ className }) => <div className={cn(`a b ${className}`)} />;',
      0,
    ],
    [
      ".join(' ') without cn → flagged",
      "const C = ({ fieldClassName }) => <i className={['a', fieldClassName].filter(Boolean).join(' ')} />;",
      1,
    ],
    [
      "cn() spread over the same list → clean",
      "const C = ({ fieldClassName }) => <i className={cn('a', fieldClassName)} />;",
      0,
    ],
    [
      'bare forward to a child → clean, the child merges it',
      'const C = ({ className }) => <Shell className={className} />;',
      0,
    ],
    [
      'local computed name ending in ClassName → not a subject',
      "const C = () => { const rowClassName = cn('a'); return <div className={`x ${rowClassName}`} />; };",
      0,
    ],
    [
      'two bad sites in one file → both reported',
      'const C = ({ className, boxClassName }) => <div className={`a ${className}`}><i className={`b ${boxClassName}`} /></div>;',
      2,
    ],
  ];

  let failed = 0;
  console.log('self-test');
  for (const [name, code, expected] of cases) {
    const got = checkSource('self-test.tsx', code).length;
    const ok = got === expected;
    if (!ok) failed++;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : ` (expected ${expected}, got ${got})`}`);
  }
  console.log('');
  return failed;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

if (process.argv.includes('--self-test')) {
  process.exit(selfTest() === 0 ? 0 : 1);
}

const files = collectFiles(componentsDir);
const violations = files.flatMap((f) => checkSource(f, readFileSync(f, 'utf8')));

if (violations.length > 0) {
  console.error(
    `✗ class merge: ${violations.length} site(s) concatenate a consumer class instead of passing it to cn()\n`,
  );
  for (const v of violations) {
    console.error(`  ${relative(root, v.file)}:${v.line}  ${v.name} — ${v.detail}  [${v.rule}]`);
  }
  console.error(
    '\n  cn() runs tailwind-merge; a plain join emits both classes and lets the\n' +
      '  stylesheet order decide, so the consumer silently loses. See I-08 / I-31.',
  );
  process.exit(1);
}

console.log(
  `✓ class merge: every consumer class prop reaches cn() (${files.length} files)`,
);
