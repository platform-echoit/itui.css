/**
 * Icon sources must not carry kebab-case SVG attributes.
 *
 * ── What breaks without this (ISS-28, F-26)
 *
 *   86 icon sources — the `FileIcon` / `FileType` logos, every `*TextFlatLogo`
 *   and `*TextColorLogo`, three social logos — came out of the SVG → TSX step
 *   with `stop-color`, `stroke-opacity` and `fill-opacity` left as written.
 *   That is valid SVG and React even renders it (an unknown lowercase attribute
 *   passes through verbatim), so nothing looked wrong. But React knows those
 *   names and wants the camelCase spelling, so every consumer who rendered one
 *   got `Invalid DOM property 'stroke-opacity'. Did you mean 'strokeOpacity'?`
 *   in their console — from a library component, with no way to turn it off.
 *
 * ── Why a guard and not a one-off codemod
 *
 *   The icons are generated outside this repo and re-dropped in bulk; the next
 *   drop can bring the next attribute (`clip-path`, `stroke-width`, `xlink:href`
 *   …). No existing gate renders an icon, so none of them could ever see this
 *   class of bug — same shape as I-29 and I-31.
 *
 * ── Rules (syntactic; no type checker needed)
 *
 *   R1 — a JSX attribute whose name contains `-` or `:` is a violation, unless
 *        it starts with `data-` or `aria-` (those are the only hyphenated names
 *        React accepts as-is).
 *
 *   `--render` additionally renders every export of `src/icons/index.ts`,
 *   `src/icons/file-type/*` and `src/icons/toast/*` with react-dom/server and
 *   fails on any `console.error`. React dedupes a warning per attribute name,
 *   so render mode only says *that* something is wrong — the scan says where.
 *   It is the slower, broader net: it catches whatever the scan has no rule for.
 *
 * Usage:  tsx scripts/check-icons.ts [--self-test] [--render]
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';
import { pathToFileURL } from 'url';
import ts from 'typescript';

const root = resolve(process.cwd());
const iconsDir = join(root, 'src/icons');

/** Repo-relative, forward slashes on every OS — the list is meant to be grep-able. */
const rel = (file: string) => relative(root, file).replace(/\\/g, '/');

export type KebabAttribute = { line: number; attr: string };

/**
 * Cheap text gate so the 6,600 clean files never reach the TypeScript parser:
 * whitespace, a lowercase run, then `-` or `:` followed by a letter. False
 * positives (`className="flex items-center"`) only cost one parse.
 */
const CANDIDATE = /\s[a-z]+[-:][a-z]/;

export function findKebabAttributes(
  fileName: string,
  source: string,
): KebabAttribute[] {
  if (!CANDIDATE.test(source)) return [];

  const sf = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const found: KebabAttribute[] = [];

  const visit = (node: ts.Node) => {
    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText(sf);
      if (/[-:]/.test(name) && !/^(data|aria)-/.test(name)) {
        found.push({
          line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1,
          attr: name,
        });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  return found;
}

function collectFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collectFiles(full, acc);
    else if (entry.endsWith('.tsx')) acc.push(full);
  }
  return acc;
}

const CAMEL: Record<string, string> = {
  'stop-color': 'stopColor',
  'stroke-opacity': 'strokeOpacity',
  'fill-opacity': 'fillOpacity',
  'clip-path': 'clipPath',
  'clip-rule': 'clipRule',
  'fill-rule': 'fillRule',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stop-opacity': 'stopOpacity',
  'xlink:href': 'xlinkHref',
  'xml:space': 'xmlSpace',
};

function scan(): number {
  const files = collectFiles(iconsDir);
  const hits: Array<{ file: string } & KebabAttribute> = [];
  for (const file of files) {
    for (const hit of findKebabAttributes(file, readFileSync(file, 'utf-8'))) {
      hits.push({ file, ...hit });
    }
  }

  if (hits.length === 0) {
    console.log(
      `✓ icons: no kebab-case SVG attribute in ${files.length} icon sources`,
    );
    return 0;
  }

  const fileCount = new Set(hits.map((h) => h.file)).size;
  console.error(
    `\n✗ ${hits.length} kebab-case SVG attributes in ${fileCount} icon sources — ` +
      `React prints "Invalid DOM property" for each of them.\n` +
      `  camelCase the name (stroke-opacity → strokeOpacity); the value stays.\n`,
  );
  for (const h of hits) {
    const hint = CAMEL[h.attr] ? ` → ${CAMEL[h.attr]}` : '';
    console.error(`  ${rel(h.file)}:${h.line}  ${h.attr}${hint}`);
  }
  console.error('');
  return 1;
}

// ─── Render smoke ─────────────────────────────────────────────────────────────

async function renderAll(): Promise<number> {
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');

  const files = [join(iconsDir, 'index.ts')];
  for (const dir of ['file-type', 'toast']) {
    for (const entry of readdirSync(join(iconsDir, dir))) {
      if (entry.endsWith('.tsx')) files.push(join(iconsDir, dir, entry));
    }
  }

  const errors: string[] = [];
  const original = console.error;
  console.error = (...args: unknown[]) => {
    errors.push(args.map(String).join(' '));
  };

  let rendered = 0;
  try {
    for (const file of files) {
      const mod = (await import(pathToFileURL(file).href)) as Record<
        string,
        unknown
      >;
      for (const [name, value] of Object.entries(mod)) {
        const isComponent =
          typeof value === 'function' ||
          (typeof value === 'object' && value !== null && '$$typeof' in value);
        if (!isComponent) continue;
        try {
          renderToStaticMarkup(createElement(value as React.ComponentType));
          rendered++;
        } catch (thrown) {
          errors.push(`${rel(file)}#${name} threw: ${String(thrown)}`);
        }
      }
    }
  } finally {
    console.error = original;
  }

  if (errors.length === 0) {
    console.log(`✓ icons: 0 console.error across ${rendered} rendered icons`);
    return 0;
  }

  console.error(
    `\n✗ ${errors.length} console.error while rendering ${rendered} icons ` +
      `(React dedupes by attribute name — run the scan for the full list):\n`,
  );
  for (const e of errors.slice(0, 10)) console.error(`  ${e.split('\n')[0]}`);
  if (errors.length > 10) console.error(`  … ${errors.length - 10} more`);
  console.error('');
  return 1;
}

// ─── Self-test ────────────────────────────────────────────────────────────────

function selfTest(): number {
  const cases: Array<[string, string, number]> = [
    [
      'kebab-case presentation attribute → flagged',
      'const I = () => <svg stroke-opacity="0.1" />;',
      1,
    ],
    [
      'camelCase plus data-/aria- → clean',
      'const I = () => <svg strokeOpacity="0.1" data-x="1" aria-label="a" />;',
      0,
    ],
    [
      'namespaced attribute → flagged',
      'const I = () => <svg><use xlink:href="#a" /></svg>;',
      1,
    ],
    [
      'two bad attributes on one element → both reported',
      'const I = () => <stop stop-color="#fff" fill-opacity="1" />;',
      2,
    ],
  ];

  let failed = 0;
  console.log('self-test');
  for (const [name, code, expected] of cases) {
    const got = findKebabAttributes('self-test.tsx', code).length;
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
} else if (process.argv.includes('--render')) {
  renderAll().then((code) => process.exit(code));
} else {
  process.exit(scan());
}
