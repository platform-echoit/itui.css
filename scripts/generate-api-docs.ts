/**
 * Generates API.md — the complete prop reference — from the type checker.
 *
 * Why this is a script and not a hand-written document (I-06): the README used
 * to document 17 of the 482 non-icon exports, and the 17 it did document drifted
 * anyway (it advertised 5 `Button` variants long after the source grew to 7).
 * A reference that is transcribed by hand is a reference that rots, so nothing
 * here is transcribed: names, types, JSDoc and defaults are all read out of the
 * source that ships.
 *
 * Four decisions worth knowing before editing:
 *
 *   1. It reads `src/`, not `dist/`. Default values exist *only* in source —
 *      `.d.ts` keeps the destructuring pattern but drops the initializers, so
 *      `dist` cannot answer "what is the default variant". Reading src also
 *      means docs can be regenerated without a build.
 *
 *   2. Props are filtered to those *declared inside this package*. `ButtonProps`
 *      extends `ButtonHTMLAttributes`, so the checker reports 296 properties for
 *      `Button` — 6 of ours and 290 from lib.dom/@types/react. Listing all 296
 *      would bury the 6 that this library actually defines; the inherited set is
 *      reported once, as the `extends` clause.
 *
 *   3. Exports are grouped by the barrel line that re-exports them, not by the
 *      file that declares them. `toast` is re-exported from `sonner` (I-12), so
 *      grouping by declaration would file it under `node_modules/` instead of
 *      under the `toast` module where a reader looks for it.
 *
 *   4. A `XxxProps` interface that is already a documented component's props type
 *      gets no section of its own — it would repeat the component's table
 *      verbatim, minus the defaults. The index links such a name to the
 *      component instead, so looking up `ButtonProps` still lands somewhere.
 *
 * Two export groups are summarised rather than expanded, because a table each
 * would drown the document: the `src/icons/ITUI` barrel line (6,613 components
 * of one generated shape), and any run of five or more exports in a module whose
 * only own prop is `className` — that is the generated-logo shape, and
 * `file-type` alone ships 43 of them.
 *
 * Usage:  tsx scripts/generate-api-docs.ts           # writes API.md
 *         tsx scripts/generate-api-docs.ts --check    # CI: fails if API.md is stale
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, relative, resolve } from 'path';
import ts from 'typescript';

const pkgRoot = resolve(process.cwd());
const srcDir = join(pkgRoot, 'src');
const entry = join(srcDir, 'index.ts');
const outFile = join(pkgRoot, 'API.md');

const PKG_NAME = '@echoit/itui.css';

/** The one barrel line that is summarised instead of expanded. */
const ICONS_MODULE = './icons/ITUI';

/** How many identical `className`-only exports it takes to collapse the group. */
const LOGO_GROUP_MIN = 5;

/** Long resolved types (a 129-key colour record) are cut to stay readable. */
const TYPE_LIMIT = 160;

const check = process.argv.includes('--check');

// ── Program

const config = ts.readConfigFile(join(pkgRoot, 'tsconfig.json'), ts.sys.readFile);
if (config.error) {
  console.error('✗ cannot read tsconfig.json');
  process.exit(1);
}
const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, pkgRoot);

const program = ts.createProgram([entry], options);
const checker = program.getTypeChecker();
const entrySource = program.getSourceFile(entry);
if (!entrySource) {
  console.error(`✗ ${relative(pkgRoot, entry)} is not part of the program`);
  process.exit(1);
}

const posix = (file: string) => file.replace(/\\/g, '/');
const isOwnFile = (file: string) => posix(file).startsWith(`${posix(srcDir)}/`);

function resolveAlias(symbol: ts.Symbol): ts.Symbol {
  return symbol.flags & ts.SymbolFlags.Alias
    ? checker.getAliasedSymbol(symbol)
    : symbol;
}

/** `…/node_modules/sonner/dist/index.d.mts` → `sonner`, pnpm layout included. */
function packageOf(file: string): string | null {
  const parts = posix(file).split('/node_modules/');
  const tail = parts.at(-1);
  if (parts.length < 2 || !tail) return null;
  const segments = tail.split('/');
  return segments[0].startsWith('@')
    ? `${segments[0]}/${segments[1]}`
    : segments[0];
}

// ── Markdown helpers

/** One line, and `|` escaped — a union type would otherwise split the row. */
const cell = (text: string) => flat(text).replace(/\|/g, '\\|');

/** One line, unescaped: for fenced code, where `\|` would be a literal. */
const flat = (text: string) => text.replace(/\s+/g, ' ').trim();

const code = (text: string) => (text ? `\`${cell(text)}\`` : '—');

const clip = (text: string, limit = TYPE_LIMIT) =>
  text.length <= limit ? text : `${text.slice(0, limit)}…`;

/**
 * Component docblocks in this package double as Figma token maps — dozens of
 * lines mapping design tokens to classes. Only the lead paragraph is prose meant
 * for a consumer, so the rest is left to the source.
 */
function summary(symbol: ts.Symbol): string {
  const full = ts.displayPartsToString(symbol.getDocumentationComment(checker));
  const text = flat(full.split(/\n\s*\n/)[0] ?? '');
  if (text.length <= 300) return text;
  const cut = text.slice(0, 300);
  const lastStop = cut.lastIndexOf('. ');
  return `${lastStop > 120 ? cut.slice(0, lastStop + 1) : cut}…`;
}

// ── Extraction

/** The `XxxProps` a member was declared on, and what that type builds upon. */
interface Declarer {
  name: string;
  heritage: string;
}

interface PropRow {
  name: string;
  type: string;
  optional: boolean;
  default: string;
  description: string;
  /** Props type that declares it — shown only when a component has several. */
  declaredIn: Declarer | null;
}

/**
 * Half the props types here are interfaces and the rest are aliases over an
 * intersection (`type CalendarProps = DayPickerProps & { … }`), so both shapes
 * have to resolve to the same "name + what it extends" pair — that pair is the
 * one line that stands in for the ~290 inherited props left out of the table.
 */
function declarerOf(declaration: ts.Declaration): Declarer | null {
  const parent = declaration.parent;

  if (ts.isInterfaceDeclaration(parent)) {
    const heritage = parent.heritageClauses?.[0]?.types.map((type) => type.getText());
    return { name: parent.name.text, heritage: heritage?.join(', ') ?? '' };
  }

  if (!ts.isTypeLiteralNode(parent)) return null;

  // `{ … }` on its own, or one arm of an intersection the alias is built from.
  const intersection = ts.isIntersectionTypeNode(parent.parent) ? parent.parent : null;
  const alias = (intersection ?? parent).parent;
  if (!ts.isTypeAliasDeclaration(alias)) return null;

  const bases = intersection
    ? intersection.types.filter((type) => !ts.isTypeLiteralNode(type))
    : [];
  return {
    name: alias.name.text,
    heritage: bases.map((type) => flat(type.getText())).join(', '),
  };
}

/**
 * Default values, read from the destructuring pattern of the implementation.
 * Only props that made it into the table are kept: every component destructures
 * `className = ''`, and reporting that as API would be noise.
 */
function defaultsOf(declaration: ts.Declaration): Map<string, string> {
  const found = new Map<string, string>();

  let fn: ts.SignatureDeclaration | undefined;
  if (ts.isFunctionDeclaration(declaration)) {
    fn = declaration;
  } else if (ts.isVariableDeclaration(declaration) && declaration.initializer) {
    // Unwrap `forwardRef(…)` / `memo(forwardRef(…))` down to the render function.
    let node: ts.Node = declaration.initializer;
    while (ts.isCallExpression(node) && node.arguments.length > 0) {
      node = node.arguments[0];
    }
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) fn = node;
  }

  const first = fn?.parameters[0];
  if (first && ts.isObjectBindingPattern(first.name)) {
    for (const element of first.name.elements) {
      if (!element.initializer) continue;
      found.set(
        (element.propertyName ?? element.name).getText(),
        element.initializer.getText(),
      );
    }
  }
  return found;
}

interface ComponentDoc {
  kind: 'component';
  name: string;
  summary: string;
  props: PropRow[];
  /** `ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>`, verbatim. */
  propsType: string;
  /** Own interfaces behind those props — skipped as sections of their own. */
  propsInterfaces: string[];
  /** Third-party props accepted on top of the table. */
  forwardsTo: string[];
  unionProps: boolean;
}

interface ShapeDoc {
  kind: 'shape';
  name: string;
  summary: string;
  props: PropRow[];
}

interface AliasDoc {
  kind: 'alias';
  name: string;
  summary: string;
  text: string;
}

interface ValueDoc {
  kind: 'value';
  name: string;
  summary: string;
  type: string;
}

/** Exported straight through from a dependency, e.g. `toast` from sonner. */
interface ReexportDoc {
  kind: 'reexport';
  name: string;
  summary: string;
  type: string;
  from: string;
}

type ExportDoc = ComponentDoc | ShapeDoc | AliasDoc | ValueDoc | ReexportDoc;

/** Members declared in this package, plus where the rest came from. */
function collectProps(
  propsType: ts.Type,
  at: ts.Node,
  defaults: Map<string, string>,
) {
  const rows: PropRow[] = [];
  const foreign = new Set<string>();

  for (const prop of checker.getPropertiesOfType(propsType)) {
    const declaration = prop.declarations?.[0];
    const file = declaration?.getSourceFile().fileName;

    if (!declaration || !file || !isOwnFile(file)) {
      const pkg = file ? packageOf(file) : null;
      // lib.dom and the React types *are* the standard attribute surface;
      // naming them adds nothing the `extends` clause does not already say.
      if (pkg && pkg !== '@types/react' && pkg !== 'typescript') foreign.add(pkg);
      continue;
    }

    // The written annotation, not the resolved type: `ButtonVariant` reads
    // better than its 7 expanded literals, and the alias is exported too.
    const written =
      (ts.isPropertySignature(declaration) ||
        ts.isPropertyDeclaration(declaration)) &&
      declaration.type
        ? declaration.type.getText()
        : checker.typeToString(checker.getTypeOfSymbolAtLocation(prop, at));

    rows.push({
      name: prop.getName(),
      type: clip(flat(written)),
      optional: Boolean(prop.flags & ts.SymbolFlags.Optional),
      default: defaults.get(prop.getName()) ?? '',
      description: summary(prop),
      declaredIn: declarerOf(declaration),
    });
  }

  return { rows, foreign: [...foreign].sort() };
}

/** `interface ButtonProps extends X` → `ButtonProps extends X`. */
function propsTypeLabel(rows: PropRow[]): string {
  const entry = rows.find((row) => row.declaredIn)?.declaredIn;
  if (!entry) return '';
  return entry.heritage ? `${entry.name} extends ${entry.heritage}` : entry.name;
}

function describe(exported: ts.Symbol): ExportDoc | null {
  const symbol = resolveAlias(exported);
  const declaration = symbol.declarations?.[0];
  if (!declaration) return null;

  const name = exported.getName();
  const doc = summary(symbol);
  const file = declaration.getSourceFile().fileName;

  // Straight re-export of a dependency's API: it has no props table to build,
  // and its origin is the useful fact — `toast` is sonner's, not ours (I-12).
  if (!isOwnFile(file)) {
    // A type-only re-export has no value to type; asking for one yields `any`.
    const typeOnly =
      ts.isInterfaceDeclaration(declaration) || ts.isTypeAliasDeclaration(declaration);
    return {
      kind: 'reexport',
      name,
      summary: doc,
      type: typeOnly
        ? ''
        : clip(flat(checker.typeToString(
            checker.getTypeOfSymbolAtLocation(symbol, declaration),
          ))),
      from: packageOf(file) ?? 'an external module',
    };
  }

  if (ts.isTypeAliasDeclaration(declaration)) {
    // Source formats long unions with a leading `|` on its own line.
    const text = flat(declaration.type.getText()).replace(/^\|\s*/, '');
    return { kind: 'alias', name, summary: doc, text: `type ${name} = ${text}` };
  }

  if (ts.isInterfaceDeclaration(declaration)) {
    const { rows } = collectProps(
      checker.getDeclaredTypeOfSymbol(symbol),
      declaration,
      new Map(),
    );
    return { kind: 'shape', name, summary: doc, props: rows };
  }

  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const signatures = type.getCallSignatures();
  if (signatures.length === 0) {
    return {
      kind: 'value',
      name,
      summary: doc,
      type: clip(flat(checker.typeToString(type))),
    };
  }

  const parameter = signatures[0].parameters[0];
  const propsType = parameter
    ? checker.getTypeOfSymbolAtLocation(parameter, declaration)
    : null;
  const { rows, foreign } = propsType
    ? collectProps(propsType, declaration, defaultsOf(declaration))
    : { rows: [] as PropRow[], foreign: [] as string[] };

  return {
    kind: 'component',
    name,
    summary: doc,
    props: rows,
    propsType: propsTypeLabel(rows),
    propsInterfaces: [
      ...new Set(rows.map((row) => row.declaredIn?.name).filter(Boolean)),
    ] as string[],
    forwardsTo: foreign,
    unionProps: Boolean(propsType?.isUnion()),
  };
}

// ── Walk the barrel

interface ModuleDoc {
  /** Directory name, which is also the published subpath. */
  name: string;
  exports: ExportDoc[];
}

const modules: ModuleDoc[] = [];
let iconCount = 0;

for (const statement of entrySource.statements) {
  if (
    !ts.isExportDeclaration(statement) ||
    !statement.moduleSpecifier ||
    !ts.isStringLiteral(statement.moduleSpecifier)
  ) {
    continue;
  }

  const specifier = statement.moduleSpecifier.text;
  const moduleSymbol = checker.getSymbolAtLocation(statement.moduleSpecifier);
  if (!moduleSymbol) {
    console.error(`✗ cannot resolve barrel line \`export * from '${specifier}'\``);
    process.exit(1);
  }

  const exported = checker.getExportsOfModule(moduleSymbol);

  if (specifier === ICONS_MODULE) {
    iconCount = exported.length;
    continue;
  }

  modules.push({
    name: specifier.split('/').at(-1)!,
    exports: exported
      .map(describe)
      .filter((doc): doc is ExportDoc => doc !== null)
      .sort((a, b) => a.name.localeCompare(b.name)),
  });
}

modules.sort((a, b) => a.name.localeCompare(b.name));

if (iconCount === 0) {
  console.error(
    `✗ no barrel line matched \`${ICONS_MODULE}\` — src/index.ts changed shape, so this\n` +
      '  script is silently under-reporting. Update ICONS_MODULE.',
  );
  process.exit(1);
}

// ── Render

const lines: string[] = [];
const put = (text = '') => lines.push(text);

/** The anchor GitHub derives from a heading, before de-duplication. */
const slug = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

/**
 * GitHub lowercases headings, so `snackbar` (the function) and `Snackbar` (the
 * component) — both exported from the same module — collide, and it resolves the
 * second one to `#snackbar-1`. The index has to agree with that, which means
 * claiming anchors in the exact order the headings are written.
 */
const claimed = new Map<string, number>();

function claimAnchor(heading: string): string {
  const base = slug(heading);
  const seen = claimed.get(base) ?? 0;
  claimed.set(base, seen + 1);
  return seen === 0 ? base : `${base}-${seen}`;
}

/**
 * Generated icon components: one own prop, `className`, and nothing else. They
 * are real exports, so they stay listed by name — but 43 identical tables would
 * be 43 ways of saying the same thing.
 */
const isLogo = (doc: ExportDoc) =>
  doc.kind === 'component' &&
  doc.props.length === 1 &&
  doc.props[0].name === 'className' &&
  doc.forwardsTo.length === 0;

function propTable(rows: PropRow[]) {
  const declaring = new Set(rows.map((row) => row.declaredIn?.name).filter(Boolean));
  const multi = declaring.size > 1;
  const head = ['Prop', 'Type', 'Default', 'Description'];
  if (multi) head.splice(3, 0, 'From');

  put(`| ${head.join(' | ')} |`);
  put(`| ${head.map(() => '---').join(' | ')} |`);

  for (const row of rows) {
    const cells = [
      `\`${row.name}${row.optional ? '?' : ''}\``,
      code(row.type),
      code(row.default),
      row.description || '—',
    ];
    if (multi) cells.splice(3, 0, code(row.declaredIn?.name ?? ''));
    put(`| ${cells.join(' | ')} |`);
  }
  put();
}

interface Rendered {
  components: ComponentDoc[];
  logos: ComponentDoc[];
  shapes: ShapeDoc[];
  aliases: AliasDoc[];
  values: ValueDoc[];
  reexports: ReexportDoc[];
}

/** Splits a module's exports into the buckets the renderer treats differently. */
function bucket(module: ModuleDoc): Rendered {
  const all = module.exports;
  const components = all.filter(
    (doc): doc is ComponentDoc => doc.kind === 'component',
  );
  const logos = components.filter(isLogo);
  const collapse = logos.length >= LOGO_GROUP_MIN;

  // A props type repeats its component's table, so it is documented there — its
  // `extends` clause is the one part that is not in the table, and the `Props:`
  // line above the table already carries that.
  const propsTypes = new Set(components.flatMap((doc) => doc.propsInterfaces));

  return {
    components: collapse ? components.filter((doc) => !isLogo(doc)) : components,
    logos: collapse ? logos : [],
    shapes: all.filter(
      (doc): doc is ShapeDoc => doc.kind === 'shape' && !propsTypes.has(doc.name),
    ),
    aliases: all.filter(
      (doc): doc is AliasDoc => doc.kind === 'alias' && !propsTypes.has(doc.name),
    ),
    values: all.filter((doc): doc is ValueDoc => doc.kind === 'value'),
    reexports: all.filter((doc): doc is ReexportDoc => doc.kind === 'reexport'),
  };
}

const rendered = new Map(modules.map((module) => [module.name, bucket(module)]));

// Claim every heading up front, in the order the document writes them, so the
// index links match the anchors the sections will actually have.
const anchors = new Map<ExportDoc, string>();
for (const module of modules) {
  const parts = rendered.get(module.name)!;
  claimAnchor(`${PKG_NAME}/${module.name}`);
  for (const doc of parts.components) anchors.set(doc, claimAnchor(doc.name));
  if (parts.logos.length > 0) claimAnchor(`${module.name} logos`);
  for (const doc of parts.shapes) anchors.set(doc, claimAnchor(doc.name));
}

const exportCount = modules.reduce((n, module) => n + module.exports.length, 0);
const componentCount = modules
  .flatMap((module) => module.exports)
  .filter((doc) => doc.kind === 'component').length;

put('# API Reference');
put();
put(
  '<!-- Generated by scripts/generate-api-docs.ts. Do not edit by hand — run `pnpm docs:api`. -->',
);
put();
put(
  `**${exportCount} exports** across **${modules.length} modules**, ${componentCount} of them ` +
    'components. Every type, default and description below is read out of the source that ships, ' +
    'so this file cannot drift from the code — CI fails if it does.',
);
put();
put(
  `The ${iconCount.toLocaleString('en-US')} icon components exported from \`${PKG_NAME}\` are ` +
    'summarised rather than listed: they share one generated shape — `width`, `height` and every ' +
    '`svg` attribute — and their paths hardcode `fill="#101010"`, so tinting one needs ' +
    '`className="[&_path]:fill-current"` rather than a text colour.',
);
put();
put('Every module is importable two ways:');
put();
put('```tsx');
put(`import { Button } from '${PKG_NAME}';          // barrel, tree-shakes in production`);
put(`import { Button } from '${PKG_NAME}/button';   // subpath, also fast in dev`);
put('```');
put();
put(
  'The barrel pulls the stylesheet in with it; a subpath does not, so a consumer who only ever ' +
    `imports subpaths has to \`@import '${PKG_NAME}/dist/index.css'\` as well. See the ` +
    '[README](./README.md) for setup.');
put();
put('---');
put();
put('## Index');
put();
put('| Module | Subpath | Components | Also exports |');
put('| --- | --- | --- | --- |');
for (const module of modules) {
  const parts = rendered.get(module.name)!;
  const links = parts.components
    .map((doc) => `[${doc.name}](#${anchors.get(doc)})`)
    .join(', ');

  const count = (n: number, noun: string) => `${n} ${noun}${n === 1 ? '' : 's'}`;

  const extra: string[] = [];
  if (parts.logos.length > 0) extra.push(count(parts.logos.length, 'logo'));
  const types = parts.shapes.length + parts.aliases.length;
  if (types > 0) extra.push(count(types, 'type'));
  if (parts.values.length > 0) extra.push(count(parts.values.length, 'value'));
  if (parts.reexports.length > 0) {
    extra.push(count(parts.reexports.length, 're-export'));
  }

  put(
    `| **${module.name}** | \`${PKG_NAME}/${module.name}\` | ${links || '—'} | ` +
      `${extra.join(' · ') || '—'} |`,
  );
}
put();

for (const module of modules) {
  const parts = rendered.get(module.name)!;

  put('---');
  put();
  put(`## ${PKG_NAME}/${module.name}`);
  put();

  for (const doc of parts.components) {
    put(`### ${doc.name}`);
    put();
    if (doc.summary) {
      put(doc.summary);
      put();
    }

    if (doc.props.length > 0) {
      if (doc.propsType) {
        put(`Props: \`${doc.propsType}\``);
        put();
      }
      if (doc.unionProps) {
        put(
          '> Props are a union, so the table lists only what every arm has in common. The rest ' +
            'depend on the discriminant — set it and autocomplete narrows to them.',
        );
        put();
      }
      propTable(doc.props);
      if (doc.forwardsTo.length > 0) {
        put(
          `Also accepts the props of ${doc.forwardsTo.map((pkg) => `\`${pkg}\``).join(', ')}.`,
        );
        put();
      }
    } else if (doc.forwardsTo.length > 0) {
      put(
        'Declares no props of its own — everything is forwarded to ' +
          `${doc.forwardsTo.map((pkg) => `\`${pkg}\``).join(', ')}.`,
      );
      put();
    } else {
      put('Declares no props of its own beyond the standard DOM attributes.');
      put();
    }
  }

  if (parts.logos.length > 0) {
    put(`### ${module.name} logos`);
    put();
    put(
      `${parts.logos.length} generated icon components. Each takes a single optional ` +
        '`className` and nothing else:',
    );
    put();
    put(parts.logos.map((doc) => `\`${doc.name}\``).join(' · '));
    put();
  }

  for (const doc of parts.shapes) {
    put(`### ${doc.name}`);
    put();
    if (doc.summary) {
      put(doc.summary);
      put();
    }
    if (doc.props.length > 0) propTable(doc.props);
    else {
      put('No members declared in this package.');
      put();
    }
  }

  if (parts.aliases.length > 0) {
    put('**Types**');
    put();
    put('```ts');
    for (const doc of parts.aliases) put(`${doc.text};`);
    put('```');
    put();
  }

  if (parts.values.length > 0) {
    put('**Values**');
    put();
    for (const doc of parts.values) {
      put(
        `- \`${doc.name}\`: \`${cell(doc.type)}\`` +
          `${doc.summary ? ` — ${doc.summary}` : ''}`,
      );
    }
    put();
  }

  if (parts.reexports.length > 0) {
    put('**Re-exported from dependencies**');
    put();
    for (const doc of parts.reexports) {
      put(
        `- \`${doc.name}\` — from \`${doc.from}\`` +
          `${doc.type ? `, typed \`${cell(doc.type)}\`` : ' (type only)'}` +
          `${doc.summary ? `. ${doc.summary}` : ''}`,
      );
    }
    put();
  }
}

const output = `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;

// ── Write, or compare

if (check) {
  const current = existsSync(outFile) ? readFileSync(outFile, 'utf-8') : '';
  if (current === output) {
    console.log(
      `✓ API.md is in sync (${exportCount} exports, ${modules.length} modules)`,
    );
  } else {
    console.error(
      '✗ API.md is out of date — the exported surface changed but the reference did not.\n' +
        '  Run `pnpm docs:api` and commit the result.',
    );
    process.exit(1);
  }
} else {
  writeFileSync(outFile, output);
  console.log(
    `✓ API.md — ${exportCount} exports, ${componentCount} components, ` +
      `${modules.length} modules (${iconCount} icons summarised)`,
  );
}
