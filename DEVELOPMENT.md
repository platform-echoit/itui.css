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

### 2. Increment Version
Use `pnpm version` to bump the version number. This will also update `package.json`.

```bash
pnpm version patch # 1.0.3 -> 1.0.4
# or
pnpm version minor # 1.0.3 -> 1.1.0
```

### 3. Publish to npm
Since this is a scoped package, it must be published with public access (for the free tier).

```bash
pnpm publish --access public
```

*Note: If you have already configured `publishConfig` in `package.json`, you can just run `pnpm publish`.*

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
