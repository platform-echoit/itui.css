/**
 * Acceptance test for I-01: build the packed tarball under Next.js App Router.
 *
 * Run `pnpm build` first — this packs whatever is in dist/ right now.
 * See fixtures/next-app/README.md for what a green run does and does not prove.
 *
 * Usage:  tsx scripts/check-rsc.ts
 */

import { rmSync } from 'fs';
import { join, resolve } from 'path';

import { packTarball, requireBuild, run } from './pack-tarball';

const root = resolve(process.cwd());
const fixture = join(root, 'fixtures/next-app');

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
