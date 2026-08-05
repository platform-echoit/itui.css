/**
 * Fails the build when a module must be a Client Component but never says so.
 *
 * Why a script and not a one-off audit:
 *   The RSC crash (I-01) came from 17 modules that use client-only APIs
 *   without `"use client"`. Fixing them by hand rots after a few PRs — this
 *   runs in `prebuild` and CI so a missing directive fails *our* build
 *   instead of a consumer's `next build`. Grep cannot replace it: a comment
 *   mentioning `useContext` and an `import { type X }` both read as usage.
 *
 * Two rules, both derived from facts rather than a hand-kept list:
 *
 *   R1  The module uses a React API that does not exist under the
 *       `react-server` condition. React ships only 21 exports there, so
 *       `forwardRef` / `memo` / `useId` / `useMemo` / `useCallback` are fine
 *       and must NOT be flagged — 61 files use `forwardRef`.
 *
 *   R2  The module imports a client-only dependency that does not ship its
 *       own `"use client"`, so no boundary exists unless we declare one.
 *       Whether a dep self-declares is read from its ESM entry at run time:
 *       a dep upgrade that adds the directive relaxes the rule by itself, and
 *       dropping the `radix-ui` umbrella (I-11) makes those reports disappear.
 *
 * Known gap: passing a locally-defined handler into a client primitive (the
 * `dialog.tsx` case) is not detectable this way. The Next.js fixture in CI
 * covers it.
 *
 * Usage:  tsx scripts/check-client-boundary.ts
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import { createRequire } from 'module';
import { dirname, join, resolve, sep } from 'path';

const root = resolve(process.cwd());
const require_ = createRequire(import.meta.url);

/** React's exports under the `react-server` condition (verified: react 19.1.2). */
const REACT_SERVER_API = new Set([
  'Children',
  'Fragment',
  'Profiler',
  'StrictMode',
  'Suspense',
  'cache',
  'captureOwnerStack',
  'cloneElement',
  'createElement',
  'createRef',
  'forwardRef',
  'isValidElement',
  'lazy',
  'memo',
  'use',
  'useCallback',
  'useDebugValue',
  'useId',
  'useMemo',
  'version',
]);

/** Values React only exports outside `react-server`, but spelled PascalCase. */
const CLIENT_ONLY_PASCAL_API = new Set(['Component', 'PureComponent']);

/** Deps whose components own React state — they need a boundary somewhere. */
const CLIENT_ONLY_DEPS = [
  '@radix-ui/',
  'radix-ui',
  'sonner',
  'embla-carousel-react',
  'lexical',
  '@lexical/',
  '@daypicker/',
  'react-day-picker',
];

/**
 * Exceptions to `CLIENT_ONLY_DEPS`: they ship no directive because they need
 * none — verified to use only `react-server` APIs (`forwardRef`, `Children`,
 * `cloneElement`, `isValidElement`). Keeping presentational components
 * server-renderable depends on this list staying accurate.
 */
const SERVER_SAFE_DEPS = [
  '@radix-ui/react-slot',
  '@radix-ui/react-compose-refs',
];

/** Icons are 6.6k generated presentational files with no client API. */
const SKIP_DIRS = new Set(['icons']);

// ── Source discovery ─────────────────────────────────────────────────────────

function collectSources(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name))
        collectSources(join(dir, entry.name), acc);
    } else if (/\.tsx?$/.test(entry.name)) {
      acc.push(join(dir, entry.name));
    }
  }
  return acc;
}

// ── Directive & import parsing ───────────────────────────────────────────────

/** Leading comments are allowed before the directive; nothing else is. */
const DIRECTIVE = /^\s*(\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*)*['"]use client['"]/;

const IMPORT = /import\s+(type\s+)?([\s\S]*?)\s*from\s*['"]([^'"]+)['"]/g;

type Import = { typeOnly: boolean; clause: string; spec: string };

/**
 * `import { type Modifiers } from '@daypicker/react'` imports no runtime value,
 * so it creates no client boundary requirement — treat it like `import type`.
 */
function isTypeOnlyClause(clause: string): boolean {
  const named = clause.match(/\{([\s\S]*)\}/);
  if (!named) return false;
  if (clause.slice(0, clause.indexOf('{')).trim().replace(/,$/, ''))
    return false;
  return named[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .every((s) => s.startsWith('type '));
}

function parseImports(source: string): Import[] {
  return [...source.matchAll(IMPORT)].map((m) => ({
    typeOnly: Boolean(m[1]) || isTypeOnlyClause(m[2]),
    clause: m[2],
    spec: m[3],
  }));
}

/**
 * Comments are stripped before scanning `React.x` member access: a doc comment
 * reading "No createContext / useContext" is not usage (`Sidebar.tsx:50`).
 */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

/**
 * React APIs used by this module — named imports plus `React.x` member access
 * for default/namespace imports. Type positions are skipped: every React type
 * is PascalCase, and `import type` / `type X` specifiers are dropped outright.
 */
function reactApisUsed(source: string, imports: Import[]): string[] {
  const used = new Set<string>();

  for (const { typeOnly, clause, spec } of imports) {
    if (spec !== 'react' || typeOnly) continue;

    const named = clause.match(/\{([\s\S]*)\}/)?.[1] ?? '';
    for (const raw of named.split(',')) {
      const name = raw.trim();
      if (!name || name.startsWith('type ')) continue;
      used.add(name.split(/\s+as\s+/)[0].trim());
    }

    // `import React from 'react'` / `import * as React from 'react'`
    const local = clause.match(/^\s*(?:\*\s*as\s+)?([A-Za-z_$][\w$]*)/)?.[1];
    if (local) {
      const code = stripComments(source);
      for (const m of code.matchAll(new RegExp(`\\b${local}\\.(\\w+)`, 'g'))) {
        used.add(m[1]);
      }
    }
  }

  return [...used].filter((name) => {
    if (REACT_SERVER_API.has(name)) return false;
    if (CLIENT_ONLY_PASCAL_API.has(name)) return true;
    // PascalCase leftovers are types (FC, ReactNode, ComponentProps, …).
    return /^[a-z]/.test(name);
  });
}

// ── Dependency boundaries ────────────────────────────────────────────────────

function packageNameOf(spec: string): string {
  const parts = spec.split('/');
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

/** Follows `exports['.']`, then `module`, then `main`. */
function esmEntryOf(pkgDir: string, pkg: Record<string, any>): string | null {
  const candidates: unknown[] = [];
  const dot = pkg.exports?.['.'] ?? pkg.exports;
  const walk = (node: unknown): void => {
    if (typeof node === 'string') candidates.push(node);
    else if (node && typeof node === 'object') {
      const obj = node as Record<string, unknown>;
      for (const key of ['import', 'module', 'default']) {
        if (key in obj) walk(obj[key]);
      }
    }
  };
  walk(dot);
  candidates.push(pkg.module, pkg.main);

  for (const rel of candidates) {
    if (typeof rel !== 'string') continue;
    const abs = join(pkgDir, rel);
    if (existsSync(abs)) return abs;
  }
  return null;
}

const selfDeclaresCache = new Map<string, boolean>();

/**
 * Does the dep create its own client boundary? Unresolvable deps are reported
 * as `false` on purpose: a silent "probably fine" is what shipped I-01.
 */
function depSelfDeclares(spec: string): boolean {
  const name = packageNameOf(spec);
  const cached = selfDeclaresCache.get(name);
  if (cached !== undefined) return cached;

  let result = false;
  try {
    let dir = dirname(require_.resolve(spec));
    while (dir !== dirname(dir)) {
      const manifest = join(dir, 'package.json');
      if (existsSync(manifest)) {
        const pkg = JSON.parse(readFileSync(manifest, 'utf-8'));
        if (pkg.name === name) {
          const entry = esmEntryOf(dir, pkg);
          result = entry ? DIRECTIVE.test(readFileSync(entry, 'utf-8')) : false;
          break;
        }
      }
      dir = dirname(dir);
    }
  } catch {
    result = false;
  }

  selfDeclaresCache.set(name, result);
  return result;
}

// ── Report ───────────────────────────────────────────────────────────────────

type Violation = { file: string; reasons: string[] };

const violations: Violation[] = [];

for (const file of collectSources(join(root, 'src'))) {
  const source = readFileSync(file, 'utf-8');
  if (DIRECTIVE.test(source)) continue;

  const imports = parseImports(source);
  const reasons: string[] = [];

  const apis = reactApisUsed(source, imports);
  if (apis.length) {
    reasons.push(`React API missing under react-server: ${apis.join(', ')}`);
  }

  const unbounded = [
    ...new Set(
      imports
        .filter((i) => !i.typeOnly)
        .map((i) => i.spec)
        .filter((spec) => CLIENT_ONLY_DEPS.some((d) => spec.startsWith(d)))
        .filter((spec) => !SERVER_SAFE_DEPS.some((d) => spec.startsWith(d)))
        .filter((spec) => !depSelfDeclares(spec)),
    ),
  ];
  if (unbounded.length) {
    reasons.push(
      `client-only dep without its own directive: ${unbounded.join(', ')}`,
    );
  }

  if (reasons.length) {
    violations.push({
      file: file
        .slice(root.length + 1)
        .split(sep)
        .join('/'),
      reasons,
    });
  }
}

if (!violations.length) {
  console.log('✓ client boundary: every module that needs "use client" has it');
  process.exit(0);
}

console.error(`\n✗ ${violations.length} module(s) need "use client":\n`);
for (const { file, reasons } of violations) {
  console.error(`  ${file}`);
  for (const reason of reasons) console.error(`      ${reason}`);
}
console.error(
  '\nAdd "use client" at the top of each file, or remove the client-only API.\n' +
    'Reports naming the `radix-ui` umbrella also clear by switching to the\n' +
    'individual @radix-ui/react-* package, which ships its own directive (I-11).\n',
);
process.exit(1);
