/**
 * Shared by check-rsc.ts and check-bundle.ts: both fixtures install the package
 * as a *packed tarball* rather than a workspace link.
 *
 * A symlink resolves `react` from packages/ui/node_modules, which gives the
 * fixture two React copies — a failure unrelated to what either fixture tests.
 * The tarball is also the only thing that exercises the real `files` and
 * `exports` contract.
 */

import { spawnSync } from 'child_process';
import { existsSync, readdirSync, renameSync, unlinkSync } from 'fs';
import { join } from 'path';

/** shell: true — npm/pnpm are .cmd shims on Windows. */
export function run(
  command: string,
  cwd: string,
  env?: Record<string, string>,
): void {
  console.log(`\n$ ${command}`);
  const { status } = spawnSync(command, {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...env },
  });
  if (status !== 0) process.exit(status ?? 1);
}

/**
 * Same, but hands back what the command printed. Used where the build log itself
 * carries a number worth asserting on — Vite's module count (I-29). The output is
 * echoed either way, so a failing build still reads the same in CI.
 */
export function runCapture(
  command: string,
  cwd: string,
  env?: Record<string, string>,
): string {
  console.log(`\n$ ${command}`);
  const result = spawnSync(command, {
    cwd,
    encoding: 'utf-8',
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
    env: { ...process.env, ...env },
  });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  process.stdout.write(output);
  if (result.status !== 0) process.exit(result.status ?? 1);
  return output;
}

export function requireBuild(root: string): void {
  if (!existsSync(join(root, 'dist/index.js'))) {
    console.error('✗ dist/index.js missing — run `pnpm build` first');
    process.exit(1);
  }
}

/**
 * Packs the current dist/ into `<fixture>/itui.tgz`. The filename is fixed so a
 * version bump never has to touch a fixture's package.json, and the fixture's
 * lockfile is dropped so pnpm re-resolves the new tarball hash.
 */
export function packTarball(root: string, fixture: string): void {
  for (const stale of [
    join(fixture, 'itui.tgz'),
    join(fixture, 'pnpm-lock.yaml'),
  ]) {
    if (existsSync(stale)) unlinkSync(stale);
  }

  run(`npm pack --pack-destination "${fixture}"`, root);

  const packed = readdirSync(fixture).find((f) => f.endsWith('.tgz'));
  if (!packed) {
    console.error('✗ npm pack produced no tarball');
    process.exit(1);
  }
  renameSync(join(fixture, packed), join(fixture, 'itui.tgz'));
  console.log(`✓ ${packed}  →  ${join(fixture, 'itui.tgz').split(root)[1]}`);
}
