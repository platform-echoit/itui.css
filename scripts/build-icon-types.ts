/**
 * Writes the declarations for the icon entry, and mirrors src/index.ts into
 * dist/index.d.ts.
 *
 * Runs AFTER `tsc`, which matters: tsc still reaches part of src/icons through
 * component imports (`exclude` only filters the `include` globs — it does not
 * stop import resolution) and would overwrite anything written before it.
 *
 * Why the names come from source, not from tsc's emit: since I-29 no component
 * imports the ITUI barrel, so tsc's program holds only the ~250 icon files that
 * components actually use. Its emit is no longer a complete list of the 6,615 —
 * source is. The earlier attempt at reading source failed only because it missed
 * the 9 icons declared directly in `icons.tsx` (`XIcon`, `CaretRight`, …), which
 * are the ones apps/ import most, so those get an explicit branch below.
 *
 * Why collapse at all: every icon's type is the same shape, so 2.51 MB across
 * 7,869 files says exactly what 51 kB in one file says (I-10). Collapsing is also
 * what keeps `./icons` the only spelling: a deep import would resolve at runtime
 * but land on a declaration this script has just deleted.
 */

import { readFileSync, writeFileSync } from 'fs';
import { existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

// Works whether invoked from repo root or packages/ui
const root = resolve(process.cwd());
const ituiSrc = join(root, 'src/icons/ITUI');
const ituiDist = join(root, 'dist/icons/ITUI');
const barrel = join(ituiDist, 'index.d.ts');

const srcBarrel = join(ituiSrc, 'index.ts');
if (!existsSync(srcBarrel)) {
  console.error(`✗ ${srcBarrel} missing — the icon set moved`);
  process.exit(1);
}

// ── 1. Collect every exported name from the source barrel ────────────────────

/** Folder index: `export { default as StarIcon } from './StarIcon'`. */
const RE_EXPORTED_NAME = /export \{ default as (\w+) \}/g;
/** icons.tsx declares its 9 in place: `export const XIcon = (…)`. */
const DECLARED_NAME = /export const (\w+)/g;

const names = new Set<string>();

/**
 * Look the target up on disk instead of pasting an extension on: each barrel
 * line is either a file (`./icons` → icons.tsx) or a directory
 * (`./address-book` → address-book/index.ts).
 */
function resolveSrc(specifier: string): string | null {
  const base = join(ituiSrc, specifier);
  for (const candidate of [
    `${base}.ts`,
    `${base}.tsx`,
    join(base, 'index.ts'),
  ]) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

for (const match of readFileSync(srcBarrel, 'utf-8').matchAll(
  /export \* from '\.\/([^']+)'/g,
)) {
  const target = resolveSrc(match[1]);
  if (!target) {
    console.error(
      `✗ barrel re-exports ${match[1]} but no source file for it exists under ${ituiSrc}`,
    );
    process.exit(1);
  }
  const source = readFileSync(target, 'utf-8');
  const pattern = target.endsWith('index.ts') ? RE_EXPORTED_NAME : DECLARED_NAME;
  for (const name of source.matchAll(pattern)) names.add(name[1]);
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

/**
 * What tsc did emit is kept. Before I-29 it emitted all 7,869 icon declarations
 * and this script deleted them; now it emits only the ~250 icon files components
 * import directly, and those are exactly the ones `dist/components/**\/*.d.ts`
 * points at — deleting them would break the component types instead of the icon
 * ones. tsup runs with `clean: true`, so nothing stale survives a build.
 */
function countDeclarations(dir: string): number {
  let found = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found += countDeclarations(full);
    else if (/\.d\.ts$/.test(entry.name) && full !== barrel) found++;
  }
  return found;
}

const kept = countDeclarations(ituiDist);
writeFileSync(barrel, iconsDts);
console.log(
  `✓ ${names.size} icon types  →  dist/icons/ITUI/index.d.ts  ` +
    `(${kept} per-icon .d.ts kept for component imports)`,
);

// ── 2b. Declaration for the `./icons` entry ──────────────────────────────────
//    tsc skips src/icons/index.ts for the same reason it skips src/index.ts:
//    nothing in its program imports it. `build:paths` adds the extension.

writeFileSync(
  join(root, 'dist/icons/index.d.ts'),
  `export * from './ITUI';\n`,
);
console.log(`✓ dist/icons/index.d.ts`);

// ── 3. Mirror src/index.ts into dist/index.d.ts ──────────────────────────────
//    tsc never emits this one: nothing in its program imports src/index.ts.

const srcIndex = readFileSync(join(root, 'src/index.ts'), 'utf-8');

const distIndex = srcIndex
  // The CSS import is a runtime side effect; it has no place in a .d.ts.
  .replace(/^import '\.\/styles\/.*';?\n/gm, '')
  .trim();

writeFileSync(join(root, 'dist/index.d.ts'), distIndex + '\n');
console.log(`✓ dist/index.d.ts`);
