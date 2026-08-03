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

import { packTarball, requireBuild, run } from './pack-tarball';

const root = resolve(process.cwd());
const fixture = join(root, 'fixtures/vite-app');

/** From the plan: one Button must stay under this, measured raw. */
const BUDGET_RAW = 260_000;

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
for (const entry of ENTRIES) {
  run('pnpm build', fixture, { ENTRY: entry });
  results.set(entry, measure(entry));
}

const baseline = results.get('baseline')!;

console.log('\n  entry      JS raw      JS gzip     vs baseline (raw)   CSS');
console.log('  ' + '-'.repeat(64));
for (const entry of ENTRIES) {
  const m = results.get(entry)!;
  const d = entry === 'baseline' ? '—' : delta(m.raw - baseline.raw);
  console.log(
    `  ${entry.padEnd(10)} ${kb(m.raw).padStart(9)} ${kb(m.gzip).padStart(11)} ${d.padStart(19)}   ${kb(m.css)}`,
  );
}

const cost = results.get('barrel')!.raw - baseline.raw;
console.log(
  `\n  library cost for one Button: ${kb(cost)} raw (budget ${kb(BUDGET_RAW)})`,
);

if (cost > BUDGET_RAW) {
  console.error('\n✗ over budget — tree-shaking is not reaching the library');
  process.exit(1);
}
console.log('✓ within budget');
