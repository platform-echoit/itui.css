/**
 * Fails the build when a component barrel re-exports a client module with
 * `export *`.
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

if (!violations.length) {
  console.log(
    `✓ barrel exports: no client module is spread with \`export *\` ` +
      `(${barrelCount} barrels, ${starCount} \`export *\` remaining)`,
  );
  process.exit(0);
}

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
process.exit(1);
