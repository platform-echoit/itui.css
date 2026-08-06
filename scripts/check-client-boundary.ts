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
 * Three rules, all derived from facts rather than a hand-kept list:
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
 *   R3  The module hands a function it created to an `on*` prop that always
 *       renders. R1 and R2 both looked at *imports*, so `Tag` — `forwardRef`
 *       plus one bare `onKeyDown={handleKeyDown}`, no client dep — passed both
 *       while failing every consumer's `next build` with "Event handlers cannot
 *       be passed to Client Component props" (I-15). See `handlerSites` for
 *       which guards exempt a site and why only those.
 *
 * R3 covers the module's own JSX. It cannot see a handler that only reaches the
 * DOM at render time through a *dependency's* component, so the Next.js fixture
 * in CI stays the integration half of this pair — see fixtures/next-app/README.md.
 *
 * Usage:  tsx scripts/check-client-boundary.ts [--self-test]
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import { createRequire } from 'module';
import { dirname, join, resolve, sep } from 'path';
import ts from 'typescript';

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

// ── R3: handlers this module creates and always renders ──────────────────────

/**
 * Props a Server Component cannot supply, because a function is exactly what it
 * may not pass. That makes them the one honest exemption for R3: a site whose
 * handler only exists when `onClick` was given is unreachable from the server.
 */
const HANDLER_PROP = /^on[A-Z]/;

/** `on*` props of the module's own JSX — where a function would cross over. */
const HANDLER_ATTR = HANDLER_PROP;

/** Names bound to a function here: `const handleKeyDown = (e) => …`. */
function localFunctions(source: ts.SourceFile): Set<string> {
  const names = new Set<string>();

  const visit = (node: ts.Node) => {
    if (ts.isFunctionDeclaration(node) && node.name) names.add(node.name.text);
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      isFunctionExpression(node.initializer)
    ) {
      names.add(node.name.text);
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
  return names;
}

/** `useCallback(fn, deps)` is still a function — and legal under react-server. */
function isFunctionExpression(node: ts.Expression): boolean {
  if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) return true;
  return (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === 'useCallback'
  );
}

/**
 * Names whose value depends on a handler prop — the prop itself plus anything
 * computed from it (`const isInteractive = !!onClick && !disabled`). Iterated to
 * a fixpoint so a chain of locals still resolves back to the prop.
 */
function handlerDerivedNames(source: ts.SourceFile): Set<string> {
  const derived = new Set<string>();
  const locals: Array<{ name: string; initializer: ts.Expression }> = [];

  const visit = (node: ts.Node) => {
    if (ts.isParameter(node) && ts.isObjectBindingPattern(node.name)) {
      for (const element of node.name.elements) {
        const declared = element.propertyName ?? element.name;
        if (!ts.isIdentifier(declared) || !HANDLER_PROP.test(declared.text))
          continue;
        if (ts.isIdentifier(element.name)) derived.add(element.name.text);
      }
    }
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer
    ) {
      locals.push({ name: node.name.text, initializer: node.initializer });
    }
    ts.forEachChild(node, visit);
  };
  visit(source);

  for (let grew = true; grew; ) {
    grew = false;
    for (const { name, initializer } of locals) {
      if (derived.has(name)) continue;
      if (referencesAny(initializer, derived)) {
        derived.add(name);
        grew = true;
      }
    }
  }

  return derived;
}

function referencesAny(node: ts.Node, names: Set<string>): boolean {
  if (ts.isIdentifier(node) && names.has(node.text)) return true;
  return ts.forEachChild(node, (child) => referencesAny(child, names)) ?? false;
}

/**
 * The function value an `on*` prop renders, or `undefined` when every path to
 * one is decided by a handler prop.
 *
 * `&&` and `?:` are read as guards, `??` and `||` deliberately are not: their
 * right-hand side renders precisely when the left is missing, which on the
 * server is always.
 */
function unguardedFunction(
  expr: ts.Expression,
  fns: Set<string>,
  derived: Set<string>,
): ts.Expression | undefined {
  if (ts.isParenthesizedExpression(expr))
    return unguardedFunction(expr.expression, fns, derived);

  if (ts.isConditionalExpression(expr)) {
    if (referencesAny(expr.condition, derived)) return undefined;
    return (
      unguardedFunction(expr.whenTrue, fns, derived) ??
      unguardedFunction(expr.whenFalse, fns, derived)
    );
  }

  if (ts.isBinaryExpression(expr)) {
    const guarding =
      expr.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken;
    if (guarding && referencesAny(expr.left, derived)) return undefined;
    return (
      unguardedFunction(expr.left, fns, derived) ??
      unguardedFunction(expr.right, fns, derived)
    );
  }

  if (ts.isArrowFunction(expr) || ts.isFunctionExpression(expr)) return expr;
  if (ts.isIdentifier(expr) && fns.has(expr.text)) return expr;

  // A bare prop forward (`onClick={onClick}`) is the consumer's function, not
  // ours: whoever passed it already had to be a Client Component.
  return undefined;
}

/** Tests that stand between a node and the rendered output. */
function guardedByHandler(node: ts.Node, derived: Set<string>): boolean {
  for (let n: ts.Node = node; n.parent; n = n.parent) {
    const parent = n.parent;
    if (ts.isConditionalExpression(parent) && parent.condition !== n) {
      if (referencesAny(parent.condition, derived)) return true;
    } else if (
      ts.isBinaryExpression(parent) &&
      parent.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken &&
      parent.right === n
    ) {
      if (referencesAny(parent.left, derived)) return true;
    }
  }
  return false;
}

type HandlerSite = { line: number; prop: string };

/** Every `on*` prop in this module that renders a function unconditionally. */
function handlerSites(file: string, text: string): HandlerSite[] {
  const source = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const fns = localFunctions(source);
  const derived = handlerDerivedNames(source);
  const sites: HandlerSite[] = [];

  const visit = (node: ts.Node) => {
    if (
      ts.isJsxAttribute(node) &&
      ts.isIdentifier(node.name) &&
      HANDLER_ATTR.test(node.name.text) &&
      node.initializer &&
      ts.isJsxExpression(node.initializer) &&
      node.initializer.expression &&
      unguardedFunction(node.initializer.expression, fns, derived) &&
      !guardedByHandler(node, derived)
    ) {
      const { line } = source.getLineAndCharacterOfPosition(node.getStart());
      sites.push({ line: line + 1, prop: node.name.text });
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
  return sites;
}

// ── Self-test ────────────────────────────────────────────────────────────────

/**
 * R3 has no positive case left in `src/` once its findings are fixed, so the
 * rule would rot unnoticed. These cases keep it honest — same reason
 * `check:classes` carries one.
 */
function selfTest(): number {
  const cases: Array<[string, string, number]> = [
    [
      'bare local handler → flagged (the I-15 shape)',
      'const C = () => { const h = () => {}; return <div onKeyDown={h} />; };',
      1,
    ],
    [
      'inline arrow → flagged',
      'const C = ({ page }) => <button onClick={() => go(page)}>x</button>;',
      1,
    ],
    [
      'gated on a handler prop → clean, the server never has one',
      'const C = ({ onClick }) => { const on = !!onClick; const h = () => {}; return <div onKeyDown={on ? h : undefined} />; };',
      0,
    ],
    [
      'rendered only when a handler prop exists → clean',
      'const C = ({ onClose }) => { const h = () => {}; return <div>{onClose && <button onClick={h} />}</div>; };',
      0,
    ],
    [
      'gated on a plain prop → still flagged, that guard is true on the server',
      'const C = ({ showEdges }) => { const h = () => {}; return <div>{showEdges && <button onClick={h} />}</div>; };',
      1,
    ],
    [
      'bare prop forward → clean, the function is the consumer’s',
      'const C = ({ onClick }) => <button onClick={onClick}>x</button>;',
      0,
    ],
    [
      '?? fallback → flagged, the right side is what the server renders',
      'const C = ({ onClick }) => { const h = () => {}; return <button onClick={onClick ?? h} />; };',
      1,
    ],
  ];

  let failed = 0;
  console.log('self-test (R3)');
  for (const [name, code, expected] of cases) {
    const got = handlerSites('self-test.tsx', code).length;
    const ok = got === expected;
    if (!ok) failed++;
    console.log(
      `  ${ok ? 'PASS' : 'FAIL'}  ${name}` +
        `${ok ? '' : ` (expected ${expected}, got ${got})`}`,
    );
  }
  console.log('');
  return failed;
}

if (process.argv.includes('--self-test')) {
  process.exit(selfTest() === 0 ? 0 : 1);
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

  // Only .tsx can hold the JSX R3 reads, and parsing every .ts as TSX would
  // mis-read its generics.
  if (file.endsWith('.tsx')) {
    const sites = handlerSites(file, source);
    if (sites.length) {
      reasons.push(
        `handler rendered unconditionally: ${sites
          .map((s) => `${s.prop} (line ${s.line})`)
          .join(', ')}`,
      );
    }
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
    'individual @radix-ui/react-* package, which ships its own directive (I-11).\n' +
    '\nA "handler rendered unconditionally" report has a second fix worth\n' +
    'preferring: gate the handler on the prop that makes the component\n' +
    'interactive (`onKeyDown={isInteractive ? handleKeyDown : undefined}`).\n' +
    'A directive would work too, but it also makes the decorative case — a\n' +
    '<Tag> with no onClick — client-only for nothing (I-15).\n',
);
process.exit(1);
