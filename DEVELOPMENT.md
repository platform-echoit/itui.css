# Development & Publishing Guide

This guide is for maintainers of `@echoit/itui.css` who need to build and publish new versions to npm.

## Prerequisites

- Ensure you are logged into npm with an account that has access to the `echoit` organization.
- You should have an npm Access Token if publishing via CI or restricted environments.

```bash
npm login
```

## Publishing Workflow

Every time you want to push a new version, follow these steps:

### 1. Build the project

Always build before publishing to ensure the `dist` folder contains the latest changes.

```bash
pnpm build
```

⚠️ Run the **full** `pnpm build`, never `pnpm build:js` on its own. `build` is three stages —
`build:js && build:dts && build:paths` — and `build:paths` is the one that makes `dist`
loadable: it adds file extensions to every relative import (Node ESM refuses
`./Button`), repoints the barrel's CSS import at `./index.css`, and narrows the
stylesheet's `@source` so Tailwind does not crawl the 23k icon files. A `dist` built
without it looks complete and fails at the consumer.

### 2. Increment Version

Use `pnpm version` to bump the version number. This will also update `package.json`.

```bash
pnpm version patch # 1.0.3 -> 1.0.4
# or
pnpm version minor # 1.0.3 -> 1.1.0
```

⚠️ **Do not use the `publish:latest` / `publish:beta` shortcuts to release.** They run
`pnpm build && npm publish` and skip this step entirely, so `package.json` in git keeps the
old number while npm moves on. That is how the repo ended up pinned at `1.0.10` while npm
served `1.0.14` — four releases with no bump commit. Bump with `pnpm version` (which commits
and tags), then publish.

### 3. Publish to npm

Since this is a scoped package, it must be published with public access (for the free tier).

```bash
pnpm publish --access public
```

_Note: If you have already configured `publishConfig` in `package.json`, you can just run `pnpm publish`._

## Troubleshooting

### "Cannot publish over previously published version"

You cannot publish a version that has existed before, even if it was deleted. You must increment the version number.

### "402 Payment Required"

This happens if you try to publish as a private package without a paid npm plan. Ensure `"access": "public"` is set in `package.json` under `publishConfig`.

### Git Unclean Tree

If `pnpm` refuses to publish due to uncommitted changes, either commit your work or use:

```bash
pnpm publish --no-git-checks
```
