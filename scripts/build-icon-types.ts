/**
 * Generates ALL DTS output that tsup's `dts: { resolve: true }` used to
 * produce — but without running TypeScript on the 6,600+ icon files.
 *
 * Why this is safe:
 *   Every icon component follows the same pattern:
 *     const XxxIcon = ({ width, height, color, ...props }: IconProps) => <svg>…</svg>
 *   Their type is always `React.FC<IconProps>`, nothing to infer.
 *
 * What this script generates:
 *   dist/icons/ITUI/index.d.ts  — all icon declarations (this file)
 *   dist/index.d.ts             — re-export barrel (mirrors src/index.ts)
 *
 * tsc (via build:dts:components) only sees ~46 component files.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

// Works whether invoked from repo root or packages/ui
const root = resolve(process.cwd());

// ── 1. Generate dist/icons/ITUI/index.d.ts ───────────────────────────────────

const ituiSrc = join(root, 'src/icons/ITUI');
const mainBarrel = readFileSync(join(ituiSrc, 'index.ts'), 'utf-8');

// `export * from './airplane';` → 'airplane'
const subDirs = [
  ...mainBarrel.matchAll(/^export \* from '\.\/([^']+)';?$/gm),
].map((m) => m[1]);

const iconNames: string[] = [];
for (const dir of subDirs) {
  let content: string;
  try {
    content = readFileSync(join(ituiSrc, dir, 'index.ts'), 'utf-8');
  } catch {
    continue;
  }
  // `export { default as AirplaneRegularIcon } from './…';`
  const names = [
    ...content.matchAll(/export \{ default as (\w+) \} from/g),
  ].map((m) => m[1]);
  iconNames.push(...names);
}

const ituiOutDir = join(root, 'dist/icons/ITUI');
mkdirSync(ituiOutDir, { recursive: true });

const iconsDts = [
  `import type { SVGProps } from 'react';`,
  `import type { FC } from 'react';`,
  ``,
  `type IconProps = SVGProps<SVGSVGElement> & {`,
  `  width?: number;`,
  `  height?: number;`,
  `  color?: string;`,
  `};`,
  ``,
  ...iconNames.map((name) => `export declare const ${name}: FC<IconProps>;`),
  ``,
].join('\n');

writeFileSync(join(ituiOutDir, 'index.d.ts'), iconsDts);
console.log(`✓ ${iconNames.length} icon types  →  dist/icons/ITUI/index.d.ts`);

// ── 2. Generate dist/index.d.ts  ─────────────────────────────────────────────
//    Mirrors src/index.ts, stripping the CSS import and rewriting paths so
//    TypeScript consumers resolve correctly from dist/.

const srcIndex = readFileSync(join(root, 'src/index.ts'), 'utf-8');

const distIndex = srcIndex
  // drop `import './styles/global.css'`
  .replace(/^import '\.\/styles\/.*';?\n/gm, '')
  // `export * from './components/button'`
  // → `export * from './components/button/index'`
  // (tsc emits individual files; index.d.ts is the barrel)
  // Actually the re-export path is fine as-is — TypeScript resolves it
  .trim();

writeFileSync(join(root, 'dist/index.d.ts'), distIndex + '\n');
console.log(`✓ dist/index.d.ts`);
