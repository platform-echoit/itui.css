/**
 * Acceptance test for I-01: build the packed tarball under Next.js App Router.
 *
 * Run `pnpm build` first — this packs whatever is in dist/ right now.
 * See fixtures/next-app/README.md for what a green run does and does not prove.
 *
 * Usage:  tsx scripts/check-rsc.ts
 */

import { existsSync, readdirSync, readFileSync, rmSync, statSync } from 'fs';
import { join, resolve } from 'path';

import { packTarball, requireBuild, run } from './pack-tarball';

const root = resolve(process.cwd());
const fixture = join(root, 'fixtures/next-app');

/**
 * The route both assertions below are measured on. It is not the whole app:
 * `/all` renders every export on purpose (I-15), so Lexical, date-fns and
 * sonner are legitimately in *its* bundle. Summing every chunk would retire
 * both assertions the day that page landed, so they are scoped to the curated
 * page instead, and `/all` is asserted by building at all.
 */
const MEASURED_ROUTE = '/';
const MEASURED_ROUTE_HTML = 'index.html';

/**
 * Client JS that route ships. A green build is not enough on its own: I-27
 * leaked the entire library into this bundle for a whole milestone while every
 * gate stayed green — `check:bundle` runs on Vite, which has no RSC boundary at
 * all, and this script only asked for an exit code.
 *
 * Measured: 869,581 B correct, 1,336,571 B while the `select` barrel used
 * `export *`. The budget sits between them with room for real growth.
 */
const BUDGET_CLIENT_JS = 1_000_000;

/**
 * Modules the measured route does not render. Their presence in *its* client
 * chunks means a barrel dragged them across the boundary — the sharp version of
 * the byte budget, which only says that something got heavier.
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

/**
 * The client chunks one route actually loads, read out of its own prerendered
 * HTML. Globbing `static/chunks` cannot tell which page pulled a chunk in, and
 * `app-build-manifest.json` — the obvious answer — is not written by Turbopack,
 * which is the default builder since Next 16. The HTML is the consumer's view
 * of the route, so it is also the more honest thing to measure.
 */
function routeChunks(htmlFile: string): string[] {
  const path = join(fixture, '.next/server/app', htmlFile);
  if (!existsSync(path)) {
    console.error(
      `\n✗ ${htmlFile} not prerendered — cannot measure the route.\n` +
        `  Static export layout changed; see .next/server/app/.`,
    );
    process.exit(1);
  }

  const html = readFileSync(path, 'utf-8');
  const files = [
    ...new Set([...html.matchAll(/static\/chunks\/[^"']*?\.js/g)].map((m) => m[0])),
  ];

  return files.map((f) => join(fixture, '.next', f));
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

const chunks = routeChunks(MEASURED_ROUTE_HTML);
const totalBytes = chunks.reduce((sum, f) => sum + statSync(f).size, 0);
const appChunks = jsFiles(join(fixture, '.next/static/chunks'));
const appBytes = appChunks.reduce((sum, f) => sum + statSync(f).size, 0);

const leaked: string[] = [];
for (const { label, match } of MUST_NOT_LEAK) {
  if (chunks.some((f) => readFileSync(f, 'utf-8').includes(match))) {
    leaked.push(label);
  }
}

console.log(
  `\n  client JS on ${MEASURED_ROUTE}: ${kb(totalBytes)} across ` +
    `${chunks.length} chunks (budget ${kb(BUDGET_CLIENT_JS)})` +
    `\n  whole fixture (all routes): ${kb(appBytes)} across ` +
    `${appChunks.length} chunks — reported, not asserted`,
);

if (leaked.length) {
  console.error(
    `\n✗ ${leaked.join(', ')} reached the client bundle of ${MEASURED_ROUTE}, ` +
      `which renders none of them.\n  A barrel is spreading a client module ` +
      `with \`export *\` — run \`pnpm check:barrels\` (I-27).\n`,
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
