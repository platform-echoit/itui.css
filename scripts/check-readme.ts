/**
 * The README may only name exports and subpaths that exist.
 *
 * ── What breaks without this (ISS-30, F-28)
 *
 *   The README is hand-written and nothing ever read it against the build. Its
 *   "Picking between similar names" table told readers to use `NavigationV2`,
 *   an export that never existed (the real ones are `TopNavigationV2`,
 *   `BottomNavigationV2`, `BottomNavigationItemV2`), and `./fonts.css` shipped in
 *   `1.1.1` with no line of README to say so — so `--font-sans` quietly fell back
 *   to `system-ui` for anyone who did not go reading `package.json#exports`.
 *   API.md cannot drift (it is generated, and `check:docs` guards it); the README
 *   can, so it needs its own gate.
 *
 * ── Rules (README text against the type checker and package.json)
 *
 *   R1 — every `PascalCase` code span in the "Picking between similar names"
 *        section is an export of `src/index.ts`.
 *   R2 — every name in `import { … } from '@echoit/itui.css…'` inside a fenced
 *        code block is an export of the entry it names: the root barrel, the
 *        `./icons` entry, or (through `./*`) the root barrel again.
 *   R3 — every key of `package.json#exports`, other than `.`, `./package.json`,
 *        `./*` and the allowlist below, appears in the README as
 *        `@echoit/itui.css/<key>`.
 *   R4 — every `@echoit/itui.css/<sub>` the README mentions is an `exports` key,
 *        or resolves through `./*` to a component folder that has an index.
 *
 *   HTML comments are ignored: they are notes to maintainers, not to readers.
 *
 * Usage:  tsx scripts/check-readme.ts [--self-test]
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import ts from 'typescript';

const PKG = '@echoit/itui.css';

/**
 * Exported but deliberately not advertised: the `1.0.x` spelling of the
 * stylesheet path, kept so old `@import`s keep resolving.
 */
const UNADVERTISED_EXPORTS = ['./src/styles/global.css'];

export type ReadmeContext = {
  exports: Set<string>;
  iconExports: Set<string>;
  exportKeys: string[];
  componentDirs: Set<string>;
};

export type Violation = {
  rule: 'R1' | 'R2' | 'R3' | 'R4';
  detail: string;
};

const stripComments = (text: string) => text.replace(/<!--[\s\S]*?-->/g, '');

/** Body of the `### Picking between similar names` section, up to the next `##`/`###`. */
function similarNamesSection(text: string): string {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) =>
    /^###\s+Picking between similar names/.test(l),
  );
  if (start === -1) return '';
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => /^#{2,3}\s/.test(l));
  return (end === -1 ? rest : rest.slice(0, end)).join('\n');
}

function fencedBlocks(text: string): string[] {
  return [...text.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map((m) => m[1]);
}

export function checkReadme(readme: string, ctx: ReadmeContext): Violation[] {
  const text = stripComments(readme);
  const violations: Violation[] = [];

  // R1
  const seen = new Set<string>();
  for (const m of similarNamesSection(text).matchAll(
    /`([A-Z][A-Za-z0-9]*)`/g,
  )) {
    const name = m[1];
    if (seen.has(name)) continue;
    seen.add(name);
    if (!ctx.exports.has(name)) {
      violations.push({
        rule: 'R1',
        detail: `\`${name}\` is not an export (table "Picking between similar names")`,
      });
    }
  }

  // R2
  const importRe = new RegExp(
    `import\\s*(?:type\\s+)?\\{([^}]*)\\}\\s*from\\s*['"]${PKG.replace('.', '\\.')}(/[^'"]*)?['"]`,
    'g',
  );
  for (const block of fencedBlocks(text)) {
    for (const m of block.matchAll(importRe)) {
      const sub = m[2] ?? '';
      const pool = sub === '/icons' ? ctx.iconExports : ctx.exports;
      const names = m[1]
        .split(',')
        .map(
          (s) =>
            s
              .trim()
              .replace(/^type\s+/, '')
              .split(/\s+as\s+/)[0],
        )
        .filter(Boolean);
      for (const name of names) {
        if (!pool.has(name)) {
          violations.push({
            rule: 'R2',
            detail: `\`${name}\` is imported from '${PKG}${sub}' in a README example, but that entry does not export it`,
          });
        }
      }
    }
  }

  // R3
  for (const key of ctx.exportKeys) {
    if (key === '.' || key === './package.json' || key === './*') continue;
    if (UNADVERTISED_EXPORTS.includes(key)) continue;
    if (!text.includes(`${PKG}${key.slice(1)}`)) {
      violations.push({
        rule: 'R3',
        detail: `${key} is in package.json#exports but the README never mentions ${PKG}${key.slice(1)}`,
      });
    }
  }

  // R4
  const mentioned = new Set(
    [
      ...text.matchAll(/@echoit\/itui\.css\/([A-Za-z0-9._/-]*[A-Za-z0-9])/g),
    ].map((m) => m[1]),
  );
  for (const sub of mentioned) {
    if (ctx.exportKeys.includes(`./${sub}`)) continue;
    if (ctx.exportKeys.includes('./*') && ctx.componentDirs.has(sub)) continue;
    violations.push({
      rule: 'R4',
      detail: `${PKG}/${sub} is mentioned in the README but resolves to nothing in package.json#exports`,
    });
  }

  return violations;
}

// ─── Context from the real package ────────────────────────────────────────────

function loadContext(pkgRoot: string): ReadmeContext {
  // Program set-up mirrors generate-api-docs.ts, so both read the same surface.
  const srcDir = join(pkgRoot, 'src');
  const entry = join(srcDir, 'index.ts');
  const iconsEntry = join(srcDir, 'icons/index.ts');

  const config = ts.readConfigFile(
    join(pkgRoot, 'tsconfig.json'),
    ts.sys.readFile,
  );
  if (config.error) {
    console.error('✗ cannot read tsconfig.json');
    process.exit(1);
  }
  const { options } = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    pkgRoot,
  );
  const program = ts.createProgram([entry, iconsEntry], options);
  const checker = program.getTypeChecker();

  const namesOf = (file: string): Set<string> => {
    const source = program.getSourceFile(file);
    const symbol = source && checker.getSymbolAtLocation(source);
    if (!symbol) {
      console.error(`✗ ${file} is not part of the program`);
      process.exit(1);
    }
    return new Set(checker.getExportsOfModule(symbol).map((s) => s.name));
  };

  const pkg = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf-8'));
  const componentsDir = join(srcDir, 'components');
  const componentDirs = new Set(
    readdirSync(componentsDir).filter(
      (d) =>
        existsSync(join(componentsDir, d, 'index.ts')) ||
        existsSync(join(componentsDir, d, 'index.tsx')),
    ),
  );

  return {
    exports: namesOf(entry),
    iconExports: namesOf(iconsEntry),
    exportKeys: Object.keys(pkg.exports ?? {}),
    componentDirs,
  };
}

// ─── Self-test ────────────────────────────────────────────────────────────────

function selfTest(): number {
  const ctx: ReadmeContext = {
    exports: new Set(['Button', 'Tab', 'toast']),
    iconExports: new Set(['XIcon']),
    exportKeys: ['.', './icons', './fonts.css', './package.json', './*'],
    componentDirs: new Set(['button']),
  };
  const table = (cell: string) =>
    `### Picking between similar names\n\n| a | b |\n| --- | --- |\n| ${cell} | x |\n\n### Button\n`;
  const block = (code: string) => '```tsx\n' + code + '\n```\n';
  const mentions = `${PKG}/icons ${PKG}/fonts.css`;

  const cases: Array<[string, string, number]> = [
    [
      'R1 unknown PascalCase name in the table → flagged',
      table('`Tab` · `NavigationV2`') + mentions,
      1,
    ],
    [
      'R2 import of real exports, root and icons → clean',
      block(
        `import { Button, toast } from '${PKG}';\nimport { XIcon } from '${PKG}/icons';\nimport { Button as B } from '${PKG}/button';`,
      ) + mentions,
      0,
    ],
    [
      'R2 lowercase typo in an import → flagged',
      block(`import { tost } from '${PKG}';`) + mentions,
      1,
    ],
    [
      'R3 exports key the README never mentions → flagged',
      `${PKG}/icons only`,
      1,
    ],
    [
      'R4 subpath that matches ./* but has no component folder → flagged',
      `${mentions} ${PKG}/buton`,
      1,
    ],
  ];

  let failed = 0;
  console.log('self-test');
  for (const [name, readme, expected] of cases) {
    const got = checkReadme(readme, ctx).length;
    const ok = got === expected;
    if (!ok) failed++;
    console.log(
      `  ${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : ` (expected ${expected}, got ${got})`}`,
    );
  }
  console.log('');
  return failed;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

if (process.argv.includes('--self-test')) {
  process.exit(selfTest() === 0 ? 0 : 1);
}

const pkgRoot = resolve(process.cwd());
const ctx = loadContext(pkgRoot);
const violations = checkReadme(
  readFileSync(join(pkgRoot, 'README.md'), 'utf-8'),
  ctx,
);

if (violations.length === 0) {
  console.log(
    `✓ readme: every name and subpath it mentions exists ` +
      `(${ctx.exports.size} exports, ${ctx.exportKeys.length} exports keys)`,
  );
  process.exit(0);
}

console.error(
  `\n✗ README.md names ${violations.length} thing(s) the package does not ship:\n`,
);
for (const v of violations) console.error(`  ${v.rule}  ${v.detail}`);
console.error('');
process.exit(1);
