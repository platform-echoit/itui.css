/**
 * Acceptance test for I-02: importing one component must not pull in the library.
 *
 * Builds the same trivial Vite app three times against the packed tarball —
 * `baseline` (React only), `barrel` (`from '@echoit/itui.css'`), `subpath`
 * (`from '@echoit/itui.css/button'`) — and reports each as a delta against the
 * baseline, so the number is the library's cost and nothing else.
 *
 * Before the bundleless build this delta was ~784 kB raw / 229 kB gzip: one
 * `Button` dragged in Lexical, sonner, date-fns, the calendar and the carousel.
 *
 * Run `pnpm build` first.
 *
 * Usage:  tsx scripts/check-bundle.ts
 */

import { existsSync, readFileSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { gzipSync } from 'zlib';

import { packTarball, requireBuild, run, runCapture } from './pack-tarball';

const root = resolve(process.cwd());
const fixture = join(root, 'fixtures/vite-app');

/** From the plan: one Button must stay under this, measured raw. */
const BUDGET_RAW = 260_000;

/**
 * How many modules the barrel entry may make a consumer's bundler transform.
 * Production bytes cannot see this: importing an icon through the ITUI barrel
 * cost 7,912 extra modules (9,137 vs 1,517) while shipping a byte-identical
 * bundle (I-29). The budget sits between the two, so a regression is unmissable
 * and adding a component is not.
 */
const BUDGET_MODULES = 3_000;

const ENTRIES = ['baseline', 'barrel', 'subpath'] as const;

type Measured = { raw: number; gzip: number; css: number };

function measure(entry: string): Measured {
  const dir = join(fixture, `dist-${entry}`);
  const js = join(dir, 'bundle.js');
  const css = join(dir, 'bundle.css');
  const code = readFileSync(js);
  return {
    raw: code.byteLength,
    gzip: gzipSync(code).byteLength,
    css: existsSync(css) ? statSync(css).size : 0,
  };
}

const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} kB`;
const delta = (bytes: number) => `${bytes >= 0 ? '+' : ''}${kb(bytes)}`;

requireBuild(root);
packTarball(root, fixture);
run('pnpm install --ignore-workspace --no-frozen-lockfile', fixture);

const results = new Map<string, Measured>();
const modules = new Map<string, number>();
for (const entry of ENTRIES) {
  const output = runCapture('pnpm build', fixture, { ENTRY: entry });
  const count = output.match(/(\d[\d,]*) modules transformed/);
  if (!count) {
    console.error(`\n✗ ${entry}: Vite printed no module count to assert on`);
    process.exit(1);
  }
  modules.set(entry, Number(count[1].replace(/,/g, '')));
  results.set(entry, measure(entry));
}

const baseline = results.get('baseline')!;

console.log(
  '\n  entry      JS raw      JS gzip     vs baseline (raw)   CSS        modules',
);
console.log('  ' + '-'.repeat(74));
for (const entry of ENTRIES) {
  const m = results.get(entry)!;
  const d = entry === 'baseline' ? '—' : delta(m.raw - baseline.raw);
  console.log(
    `  ${entry.padEnd(10)} ${kb(m.raw).padStart(9)} ${kb(m.gzip).padStart(11)} ${d.padStart(19)}   ` +
      `${kb(m.css).padEnd(9)}  ${String(modules.get(entry)).padStart(6)}`,
  );
}

const cost = results.get('barrel')!.raw - baseline.raw;
console.log(
  `\n  library cost for one Button: ${kb(cost)} raw (budget ${kb(BUDGET_RAW)})`,
);

let failed = false;

if (cost > BUDGET_RAW) {
  console.error('\n✗ over budget — tree-shaking is not reaching the library');
  failed = true;
}

const barrelModules = modules.get('barrel')!;
console.log(
  `  modules through the barrel:  ${barrelModules} (budget ${BUDGET_MODULES})`,
);
if (barrelModules > BUDGET_MODULES) {
  console.error(
    '\n✗ over module budget — something re-exports a set instead of a file.\n' +
      '  Production bytes will not show this; a dev server pays it on every page\n' +
      '  load. `pnpm check:barrels` names the import if it is the ITUI barrel (I-29).',
  );
  failed = true;
}

if (failed) process.exit(1);
console.log('✓ within budget');
