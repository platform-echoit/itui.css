/**
 * Public entry for the ITUI icon set — `@echoit/itui.css/icons`.
 *
 * ITUI only, on purpose. The other two sets under `src/icons/` already reach
 * consumers through the component that owns them (`icons/file-type` via
 * `components/file-type`, `icons/toast` via `components/toast`), so re-exporting
 * them here would give the same component two public names.
 *
 * This file exists so that one spelling resolves the same way through all three
 * paths that reach this package: the `exports` map on npm, the `@echoit/itui.css/*`
 * tsconfig path in apps/web, and the Vite alias in apps/storybook — the last two
 * point at `src/`, which is why the entry cannot live at `icons/ITUI/index.ts` alone.
 */
export * from './ITUI';
