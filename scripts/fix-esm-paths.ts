/**
 * Rewrites the three paths that only make sense once the code has moved to dist/.
 * Source keeps its own conventions — none of this is editable at the source level.
 *
 *   1. `from './lib/utils'` → `from './lib/utils.js'`
 *      esbuild emits relative specifiers exactly as written, and extensionless
 *      specifiers are illegal in Node ESM (`ERR_MODULE_NOT_FOUND`). Bundlers
 *      forgive it, Node does not — and "works in Vite" is not a package
 *      contract. Directory specifiers resolve to `/index.js`, which is why the
 *      filesystem is consulted instead of blindly appending `.js`.
 *
 *   2. `import './styles/global.css'` → `import './index.css'` (dist/index.js)
 *      The CSS build flattens `src/styles/global.css` into dist/index.css, so
 *      the barrel's side-effect import has to follow it. Getting this wrong is
 *      how the old bundle lost its stylesheet silently (I-03).
 *
 *   3. `@source "../"` → `@source "./"` (dist/index.css)
 *      This one is load-bearing, not cosmetic: Tailwind v4 does not scan
 *      node_modules on its own, so without `@source` a consumer gets the tokens
 *      and none of the utility classes the components use — measured, 99.8 kB of
 *      CSS collapses to 7.3 kB. In src/ the path means "scan src/"; verbatim in
 *      dist/ it means "scan the whole published package", which drags Tailwind
 *      across 23k icon files. `./` is byte-identical output, 35% faster.
 *
 * `.d.ts` files get rewrite 1 as well: TypeScript maps `./x.js` back to
 * `./x.d.ts`, so this is the form NodeNext consumers need.
 *
 * Usage:  tsx scripts/fix-esm-paths.ts
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';

const dist = join(resolve(process.cwd()), 'dist');

/** `from './x'` and side-effect / dynamic `import('./x')`. */
const SPECIFIER = /((?:from|import)\s*\(?\s*)(['"])(\.[^'"]*)\2/g;

const HAS_EXTENSION = /\.(js|mjs|cjs|json|css|svg|png)$/;

function collect(dir: string, suffix: RegExp, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collect(full, suffix, acc);
    else if (suffix.test(entry.name)) acc.push(full);
  }
  return acc;
}

/** Specifiers that match nothing on disk — a broken emit, reported at the end. */
const unresolved: string[] = [];

/**
 * `./components/button` is a directory in dist/, so it must become
 * `./components/button/index.js`, not `./components/button.js`.
 */
function withExtension(
  spec: string,
  fromDir: string,
  declaration: boolean,
): string {
  if (HAS_EXTENSION.test(spec)) return spec;

  const target = join(fromDir, spec);
  const file = declaration ? `${target}.d.ts` : `${target}.js`;
  if (existsSync(file)) return `${spec}.js`;

  const index = join(target, declaration ? 'index.d.ts' : 'index.js');
  if (existsSync(index)) return `${spec}/index.js`;

  // Nothing on disk matches — leave it untouched rather than invent a path,
  // and report it so a broken emit cannot pass silently.
  unresolved.push(
    `${spec}  (from ${fromDir.slice(dist.length + 1) || 'dist'})`,
  );
  return spec;
}

let rewritten = 0;
let filesTouched = 0;

for (const declaration of [false, true]) {
  for (const file of collect(dist, declaration ? /\.d\.ts$/ : /\.js$/)) {
    const source = readFileSync(file, 'utf-8');
    const fromDir = dirname(file);

    let next = source.replace(SPECIFIER, (match, lead, quote, spec) => {
      const fixed = withExtension(spec, fromDir, declaration);
      if (fixed === spec) return match;
      rewritten++;
      return `${lead}${quote}${fixed}${quote}`;
    });

    if (file === join(dist, 'index.js')) {
      next = next.replace(/(['"])\.\/styles\/global\.css\1/, "'./index.css'");
    }

    if (next !== source) {
      writeFileSync(file, next);
      filesTouched++;
    }
  }
}

console.log(`✓ ${rewritten} specifiers rewritten across ${filesTouched} files`);

// ── 3. Narrow the stylesheet's @source to the published dist/

const stylesheet = join(dist, 'index.css');
const css = readFileSync(stylesheet, 'utf-8');
const scoped = css.replace(/@source\s+(['"])\.\.\/\1/, '@source "./"');
if (scoped === css) {
  console.error(
    '\n✗ dist/index.css has no `@source "../"` — Tailwind will emit tokens but\n' +
      '  no utility classes for consumers. Check src/styles/global.css.',
  );
  process.exit(1);
}
writeFileSync(stylesheet, scoped);
console.log('✓ dist/index.css  @source "../"  →  "./"');

if (unresolved.length) {
  console.error(
    `\n✗ ${unresolved.length} specifier(s) resolve to nothing in dist:\n`,
  );
  for (const item of [...new Set(unresolved)]) console.error(`  ${item}`);
  process.exit(1);
}
