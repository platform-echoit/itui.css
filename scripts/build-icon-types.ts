/**
 * Collapses the icon declarations tsc emits into one self-contained file, and
 * mirrors src/index.ts into dist/index.d.ts.
 *
 * Runs AFTER `tsc`, which matters: tsc pulls src/icons into its program anyway
 * (20 components import icons, and `exclude` only filters the `include` globs —
 * it does not stop import resolution), so it emits 7,869 declaration files and
 * overwrites anything written before it. The previous version of this script ran
 * first and had its icon output silently thrown away.
 *
 * Why collapse at all: every icon's type is the same shape, so 2.51 MB across
 * 7,869 files says exactly what 51 kB in one file says (I-10). Consumers cannot
 * deep-import an icon either — `exports` only exposes `./icons`.
 *
 * The name list is read from tsc's own emit rather than from source. Parsing
 * source missed the 9 icons declared directly in `src/icons/ITUI/icons.ts`
 * (`XIcon`, `CaretRight`, …) — which are the ones apps/ actually import.
 */

import { readFileSync, rmSync, writeFileSync } from 'fs';
import { existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

// Works whether invoked from repo root or packages/ui
const root = resolve(process.cwd());
const ituiDist = join(root, 'dist/icons/ITUI');
const barrel = join(ituiDist, 'index.d.ts');

if (!existsSync(barrel)) {
  console.error(`✗ ${barrel} missing — run tsc (build:dts) before this script`);
  process.exit(1);
}

// ── 1. Collect every exported name from tsc's emitted declaration tree ───────

/** `export { default as StarIcon } from './StarIcon.js'` and `export declare const StarIcon` */
const EXPORTED_NAME =
  /export \{ default as (\w+) \}|export declare const (\w+)/g;

const names = new Set<string>();

/**
 * Look the target up on disk instead of pasting an extension on. This runs
 * before `build:paths`, so tsc's specifiers are still extensionless, and each
 * one is either a file (`./icons`) or a directory (`./address-book`).
 */
function resolveDts(specifier: string): string | null {
  const base = join(ituiDist, specifier.replace(/\.js$/, ''));
  for (const candidate of [`${base}.d.ts`, join(base, 'index.d.ts')]) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

for (const match of readFileSync(barrel, 'utf-8').matchAll(
  /export \* from '\.\/([^']+)'/g,
)) {
  const target = resolveDts(match[1]);
  if (!target) {
    console.error(
      `✗ barrel re-exports ${match[1]} but no .d.ts for it exists under ${ituiDist}`,
    );
    process.exit(1);
  }
  for (const name of readFileSync(target, 'utf-8').matchAll(EXPORTED_NAME)) {
    names.add(name[1] ?? name[2]);
  }
}

// A wrong regex here would silently ship a package with no icon types.
if (names.size < 6000) {
  console.error(`✗ only ${names.size} icon names collected — expected 6,000+`);
  process.exit(1);
}

// ── 2. Replace the tree with one self-contained declaration ──────────────────

const iconsDts = [
  `import type { FC, SVGProps } from 'react';`,
  ``,
  `type IconProps = SVGProps<SVGSVGElement> & {`,
  `  width?: number;`,
  `  height?: number;`,
  `  color?: string;`,
  `};`,
  ``,
  ...[...names]
    .sort()
    .map((name) => `export declare const ${name}: FC<IconProps>;`),
  ``,
].join('\n');

/** Declarations only — the icon .js files are the runtime and must stay. */
function removeDeclarations(dir: string): number {
  let removed = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) removed += removeDeclarations(full);
    else if (/\.d\.ts(\.map)?$/.test(entry.name) && full !== barrel) {
      rmSync(full);
      removed++;
    }
  }
  return removed;
}

const removed = removeDeclarations(ituiDist);
writeFileSync(barrel, iconsDts);
console.log(
  `✓ ${names.size} icon types  →  dist/icons/ITUI/index.d.ts  (${removed} .d.ts files removed)`,
);

// ── 3. Mirror src/index.ts into dist/index.d.ts ──────────────────────────────
//    tsc never emits this one: nothing in its program imports src/index.ts.

const srcIndex = readFileSync(join(root, 'src/index.ts'), 'utf-8');

const distIndex = srcIndex
  // The CSS import is a runtime side effect; it has no place in a .d.ts.
  .replace(/^import '\.\/styles\/.*';?\n/gm, '')
  .trim();

writeFileSync(join(root, 'dist/index.d.ts'), distIndex + '\n');
console.log(`✓ dist/index.d.ts`);
