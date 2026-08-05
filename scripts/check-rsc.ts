/**
 * Acceptance test for I-01: build the packed tarball under Next.js App Router.
 *
 * Run `pnpm build` first — this packs whatever is in dist/ right now.
 * See fixtures/next-app/README.md for what a green run does and does not prove.
 *
 * Usage:  tsx scripts/check-rsc.ts
 */

import { readdirSync, readFileSync, rmSync, statSync } from 'fs';
import { join, resolve } from 'path';

import { packTarball, requireBuild, run } from './pack-tarball';

const root = resolve(process.cwd());
const fixture = join(root, 'fixtures/next-app');

/**
 * Total client JS the fixture ships. A green build is not enough on its own:
 * I-27 leaked the entire library into this bundle for a whole milestone while
 * every gate stayed green — `check:bundle` runs on Vite, which has no RSC
 * boundary at all, and this script only asked for an exit code.
 *
 * Measured: 869,581 B correct, 1,336,571 B while the `select` barrel used
 * `export *`. The budget sits between them with room for real growth.
 */
const BUDGET_CLIENT_JS = 1_000_000;

/**
 * Modules no page of the fixture renders. Their presence in a *client* chunk
 * means a barrel dragged them across the boundary — the sharp version of the
 * byte budget, which only says that something got heavier.
 */
const MUST_NOT_LEAK = [
  { label: 'lexical', match: 'lexical' },
  { label: 'date-fns', match: 'formatDistance' },
  { label: 'sonner', match: 'toaster group' },
];

function jsFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) jsFiles(full, acc);
    else if (entry.name.endsWith('.js')) acc.push(full);
  }
  return acc;
}

const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} kB`;

requireBuild(root);
packTarball(root, fixture);

// --ignore-workspace: the fixture sits inside the parent monorepo's workspace,
// which would otherwise install the entire repo.
rmSync(join(fixture, '.next'), { recursive: true, force: true });
run('pnpm install --ignore-workspace --no-frozen-lockfile', fixture);
run('pnpm build', fixture);

console.log(
  '\n✓ RSC fixture built — Server Component imports resolve under App Router',
);

// ── Client bundle assertions ─────────────────────────────────────────────────

const chunks = jsFiles(join(fixture, '.next/static/chunks'));
const totalBytes = chunks.reduce((sum, f) => sum + statSync(f).size, 0);

const leaked: string[] = [];
for (const { label, match } of MUST_NOT_LEAK) {
  if (chunks.some((f) => readFileSync(f, 'utf-8').includes(match))) {
    leaked.push(label);
  }
}

console.log(
  `\n  client JS: ${kb(totalBytes)} across ${chunks.length} chunks ` +
    `(budget ${kb(BUDGET_CLIENT_JS)})`,
);

if (leaked.length) {
  console.error(
    `\n✗ ${leaked.join(', ')} reached the client bundle, but no page renders ` +
      `them.\n  A barrel is spreading a client module with \`export *\` — run ` +
      `\`pnpm check:barrels\` (I-27).\n`,
  );
  process.exit(1);
}

if (totalBytes > BUDGET_CLIENT_JS) {
  console.error(
    `\n✗ client JS over budget by ${kb(totalBytes - BUDGET_CLIENT_JS)}. ` +
      `Something crossed the RSC boundary that should not have.\n`,
  );
  process.exit(1);
}

console.log('✓ client bundle within budget, no unrendered module leaked');
