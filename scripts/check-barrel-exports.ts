/**
 * Two rules about barrels, both of which cost the consumer something real:
 *
 *   R1 — a component barrel must not re-export a client module with `export *`.
 *   R2 — a component must not import an icon through the ITUI barrel.
 *
 * ── R1: `export *` over a client module (I-27)
 *
 * Why this is a build error and not a style preference (I-27):
 *   A barrel cannot state its own exports without evaluating the modules it
 *   spreads, so one `"use client"` inside turns the *whole barrel* into a client
 *   reference. `src/index.ts` then spreads that barrel, and a consumer who
 *   renders one component from a Server Component receives the entire library —
 *   Lexical, date-fns and sonner included. Measured in fixtures/next-app:
 *   1,336,571 B of client JS with `export *`, 869,581 B with named re-exports.
 *
 *   Named re-exports fix it because the bundler learns which binding is the
 *   client reference without running anything, so the boundary stays narrow.
 *
 * Why no gate caught it before:
 *   `check:bundle` runs on Vite, which has no RSC boundary, and `check:rsc` only
 *   asked whether the build was green. Both stayed green for a whole milestone.
 *   That is the same failure mode as I-26 — a rule nobody could see being broken.
 *
 * Scope — component barrels only, deliberately:
 *   The root `src/index.ts` uses `export *` and is *harmless*: verified in the
 *   fixture, `avatar` reaches a consumer through that very barrel without
 *   leaking. Only the module tier decides the boundary, so flagging the root
 *   would be noise. The 16 barrels that spread none of a client module today are
 *   left alone for the same reason — this guard reports them the day a
 *   `useState` lands inside, which is exactly when the shape has to change.
 *
 * ── R2: importing an icon through the ITUI barrel (I-29)
 *
 *   `src/icons/ITUI/index.ts` is 1,263 `export *` lines, so a bundler has to load
 *   all 7,912 icon modules to resolve one name from it. Seven components did, and
 *   that alone was 83% of every module a consumer's build had to transform:
 *   9,137 modules through the barrel entry, 1,517 once each icon is imported from
 *   the file that declares it. Production output is byte-identical — this is a
 *   dev-server and build-time cost, which is exactly why no size gate saw it.
 *
 *   Icons leaving the root barrel (I-02) did *not* fix this on its own: components
 *   reach the ITUI barrel directly, so the whole set kept arriving by that route.
 *
 * Usage:  tsx scripts/check-barrel-exports.ts
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { dirname, join, resolve, sep } from 'path';

const root = resolve(process.cwd());
const componentsDir = join(root, 'src/components');

/** Same shape as check-client-boundary.ts: comments may precede the directive. */
const DIRECTIVE = /^\s*(\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*)*['"]use client['"]/;

/** `export * from './X'` and `export * as ns from './X'`. */
const STAR_EXPORT = /export\s+\*(?:\s+as\s+[A-Za-z_$][\w$]*)?\s+from\s*['"]([^'"]+)['"]/g;

/** Any `from './X'` — used to follow a named re-export chain. */
const ANY_EXPORT_FROM = /export\s+(?:type\s+)?(?:\*|\{[\s\S]*?\})(?:\s+as\s+[A-Za-z_$][\w$]*)?\s+from\s*['"]([^'"]+)['"]/g;

/** Any `import … from './X'`, including a bare side-effect import. */
const ANY_IMPORT_FROM = /import\s+(?:[\s\S]*?\s+from\s*)?['"]([^'"]+)['"]/g;

/** The barrels R2 forbids: both spread the whole 6,615-icon set. */
const ICON_BARRELS = [
  join(root, 'src/icons/ITUI/index.ts'),
  join(root, 'src/icons/index.ts'),
];

// ── Resolution ───────────────────────────────────────────────────────────────

/** Mirrors the extensionless source style; `build:paths` adds extensions later. */
function resolveRelative(fromFile: string, spec: string): string | null {
  if (!spec.startsWith('.')) return null; // a bare specifier is a dep, not ours
  const base = resolve(dirname(fromFile), spec);
  for (const candidate of [
    `${base}.tsx`,
    `${base}.ts`,
    join(base, 'index.tsx'),
    join(base, 'index.ts'),
  ]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/**
 * Does this module carry a directive, or reach one through its own re-exports?
 * The transitive walk matters for nested barrels: spreading a barrel that
 * spreads a client module leaks just the same.
 */
function isClientModule(file: string, seen = new Set<string>()): string | null {
  if (seen.has(file)) return null;
  seen.add(file);

  const source = readFileSync(file, 'utf-8');
  if (DIRECTIVE.test(source)) return file;

  for (const match of source.matchAll(ANY_EXPORT_FROM)) {
    const target = resolveRelative(file, match[1]);
    if (!target) continue;
    const found = isClientModule(target, seen);
    if (found) return found;
  }
  return null;
}

// ── Discovery ────────────────────────────────────────────────────────────────

function collectBarrels(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectBarrels(full, acc);
    else if (/^index\.tsx?$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

function collectSources(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectSources(full, acc);
    else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      acc.push(full);
    }
  }
  return acc;
}

const rel = (file: string) => file.slice(root.length + 1).split(sep).join('/');

// ── Check ────────────────────────────────────────────────────────────────────

type Violation = { barrel: string; statement: string; client: string };

const violations: Violation[] = [];
let barrelCount = 0;
let starCount = 0;

for (const barrel of collectBarrels(componentsDir)) {
  barrelCount += 1;
  const source = readFileSync(barrel, 'utf-8');

  for (const match of source.matchAll(STAR_EXPORT)) {
    starCount += 1;
    const target = resolveRelative(barrel, match[1]);
    if (!target) continue;

    const client = isClientModule(target);
    if (client) {
      // Echo the statement as written — `export * as ns from` is a real form,
      // and reprinting it as a plain `export *` sends the reader to a line that
      // is not in the file.
      violations.push({
        barrel: rel(barrel),
        statement: match[0].replace(/\s+/g, ' '),
        client: rel(client),
      });
    }
  }
}

// ── R2: no component may import an icon through the ITUI barrel ─────────────

type IconImport = { file: string; statement: string };

const iconImports: IconImport[] = [];
const sources = collectSources(componentsDir);

for (const file of sources) {
  const source = readFileSync(file, 'utf-8');
  for (const match of source.matchAll(ANY_IMPORT_FROM)) {
    const target = resolveRelative(file, match[1]);
    if (target && ICON_BARRELS.includes(target)) {
      iconImports.push({ file: rel(file), statement: match[0].replace(/\s+/g, ' ') });
    }
  }
}

// ── Report ───────────────────────────────────────────────────────────────────

if (!violations.length && !iconImports.length) {
  console.log(
    `✓ barrel exports: no client module is spread with \`export *\` ` +
      `(${barrelCount} barrels, ${starCount} \`export *\` remaining), and no ` +
      `component imports the ITUI barrel (${sources.length} files)`,
  );
  process.exit(0);
}

if (violations.length) {
  console.error(
    `\n✗ ${violations.length} \`export *\` re-export(s) pull a client module ` +
      `into a barrel:\n`,
  );
  for (const { barrel, statement, client } of violations) {
    console.error(`  ${barrel}`);
    console.error(`      ${statement}  →  ${client} is "use client"`);
  }
  console.error(
    '\nReplace the `export *` with named re-exports, splitting types out:\n' +
      "    export { Thing } from './Thing';\n" +
      "    export type { ThingProps } from './Thing';\n" +
      '\n`isolatedModules` requires the `export type` half. `pnpm check:docs`\n' +
      'confirms afterwards that no export was dropped in the rewrite (I-27).\n',
  );
}

if (iconImports.length) {
  console.error(
    `\n✗ ${iconImports.length} component import(s) reach an icon through the ` +
      'ITUI barrel, which loads all 7,912 icon modules:\n',
  );
  for (const { file, statement } of iconImports) {
    console.error(`  ${file}`);
    console.error(`      ${statement}`);
  }
  console.error(
    '\nImport the file that declares the icon instead — it is a default export:\n' +
      "    import XRegularIcon from '../../icons/ITUI/x/XRegularIcon';\n" +
      '\nThe folder name is the icon name in kebab-case; the 9 hand-written ones\n' +
      "live in `icons/ITUI/icons` and stay named imports (I-29).\n",
  );
}

process.exit(1);
