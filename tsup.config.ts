import { defineConfig } from 'tsup';

export default defineConfig([
  {
    // Per-file emit, not a bundle. `"use client"` is a *per-module* directive,
    // so a single-file bundle can never carry it — that was the RSC crash. It
    // also gives consumers real tree-shaking and keeps dist/ 1:1 with the
    // .d.ts files tsc already emits (see build:dts).
    // `!*.d.ts` — the glob would otherwise transpile src/global.d.ts into an
    // empty dist/global.d.js.
    entry: ['src/**/*.ts', 'src/**/*.tsx', '!src/**/*.d.ts'],
    format: ['esm'],
    bundle: false,
    // DTS is generated separately via `tsc --emitDeclarationOnly`
    // to avoid ERR_WORKER_OUT_OF_MEMORY caused by resolving 1200+ icon types.
    dts: false,
    // Without bundling there are no chunks to split.
    splitting: false,
    // 40 MB of maps that point at sources consumers do not receive.
    sourcemap: false,
    clean: true,
    external: ['react', 'react-dom'],
  },
  {
    // CSS is the one thing that still has to be bundled: the `@import` chain
    // must be flattened into a single stylesheet. `@import "tailwindcss"` stays
    // external on purpose — the consumer's Tailwind resolves it.
    // Entry key `index` is what keeps the published path at dist/index.css.
    //
    // styles/fonts.css is deliberately NOT an entry here: esbuild resolves a CSS
    // `url()` like an import, so its root-absolute /fonts/*.woff2 fail the build
    // looking for files on disk, and `external` is not forwarded to the CSS
    // pipeline. It has no @import to flatten either, so it is copied verbatim by
    // the `build:css` script instead.
    entry: { index: 'src/styles/global.css' },
    // Would wipe the JS emit from the config above.
    clean: false,
  },
]);
