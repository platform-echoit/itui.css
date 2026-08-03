# Recommendations — `@echoit/itui.css@1.0.14`

Ordered by *DX return per unit of effort*. Effort is a rough engineering estimate.

The headline: **every P0 below is a packaging, build-config or documentation defect.** None
require redesigning a component API. The component design, the TypeScript surface and the
token system are already good. Fixing the delivery layer is what moves this package from
`NOT READY` (4.4) toward `GOOD DX` (8.0+).

---

## Tier 0 — Ship-blockers

### R-01 · Emit `"use client"` and split the build into per-component entry points

**Fixes:** F-01 (RSC build failure), F-03 (tree-shaking) · **Effort:** M · **Impact:** +2.0 overall

These are one problem: a single 17 MB barrel with no client boundary. Fixing the build fixes
both the worst blocker and the worst performance defect.

1. Add a `"use client"` banner to every component chunk that uses React context, state or
   effects. In `tsup`:
   ```ts
   export default defineConfig({
     entry: ['src/index.ts', 'src/components/*/index.ts'],
     format: ['esm', 'cjs'],
     splitting: true,
     treeshake: true,
     banner: { js: '"use client"' },   // or per-entry, keeping pure components server-safe
   })
   ```
2. Publish subpath exports so bundlers can split the graph:
   ```json
   "exports": {
     ".":            { "types": "./dist/index.d.ts",  "import": "./dist/index.js" },
     "./button":     { "types": "./dist/button.d.ts", "import": "./dist/button.js" },
     "./dialog":     { "types": "./dist/dialog.d.ts", "import": "./dist/dialog.js" },
     "./styles.css": "./dist/index.css",
     "./package.json": "./package.json"
   }
   ```
3. Keep the barrel for convenience, but let `import { Button } from '@echoit/itui.css/button'`
   cost ~10 kB instead of 229 kB.

**Acceptance test:** a Next.js Server Component importing `Button` builds successfully, and a
Vite app importing only `Button` produces a bundle under 260 kB raw.

---

### R-02 · Fix the two README snippets that break first-run setup

**Fixes:** F-02 · **Effort:** S (under an hour) · **Impact:** +1.5 overall

This is the cheapest high-value fix in the entire list. Today, following the README produces a
silently unstyled app.

Replace README §1–2 with a single correct path:

~~~markdown
## Installation

```bash
npm install @echoit/itui.css tailwindcss @tailwindcss/vite
```

### 1. Add the Tailwind plugin

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [react(), tailwindcss()] })
```

### 2. Import the stylesheet from your CSS entry

```css
/* src/index.css */
@import 'tailwindcss';
@import '@echoit/itui.css';
```

> Import from **CSS**, not from JavaScript. `import '@echoit/itui.css'` in a `.tsx` file
> resolves to the JS entry point and will **not** load styles.
~~~

Also:

- **Delete the `@source` paragraph entirely.** It demands a directive that never appears in the
  docs and that is provably unnecessary — builds with and without it produce byte-identical
  CSS.
- Make Tailwind v4 part of the install step, not a footnote under "Requirements".
- Reconcile "React 19+" with `peerDependencies: ^18 || ^19`.

**Acceptance test:** a developer copy-pasting the README into a fresh Vite app sees a styled
button on the first run.

---

### R-03 · Publish the documentation site, or inline the API reference

**Fixes:** F-13 · **Effort:** M–L · **Impact:** +1.0 overall

`https://itui.echoit.co.kr` does not resolve, and it is the README's only pointer to docs for
the ~39 undocumented component modules.

Short term (hours): remove the dead link, and add a generated table of every export with its
props — the `.d.ts` files already contain the data, so this can be scripted.

Medium term: publish the site. Given `TOKENS.md` already exists and is good, most of the
theming content is written.

Also fix `./TOKENS.md` and `./DEVELOPMENT.md` to absolute GitHub URLs so they work from the
npm page.

---

### R-04 · Restore Radix's focus management in `Dialog`

**Fixes:** F-04 · **Effort:** S · **Impact:** +0.5 overall, large accessibility impact

Radix Dialog already does this correctly; the wrapper is suppressing it. Check for
`onOpenAutoFocus={e => e.preventDefault()}`, a custom portal, or a `modal={false}` default.

Required behaviour:
- Move focus into the content on open.
- Trap Tab within the dialog.
- Restore focus to the trigger on close.
- Set `aria-modal="true"`.

**Acceptance test:** open the dialog by keyboard, press Tab six times, and assert focus never
leaves the dialog.

---

### R-05 · Make `TableRow disabled` actually disable

**Fixes:** F-05 · **Effort:** S · **Impact:** +0.3 overall

Currently the prop only applies a grey background; the row still fires `onClick` and still
selects. Apply `aria-disabled="true"`, `data-disabled`, `pointer-events: none`, reduced
opacity, and suppress the row's own handlers.

While in the file, remove the leaked container classes from `<tr>`
(`overflow-x-auto w-full min-w-0 shadow-downwards-sm [&>div]:overflow-visible`), which have no
effect on a table row.

---

## Tier 1 — High value, low effort

### R-06 · Apply `tailwind-merge` to incoming `className`

**Fixes:** F-07 · **Effort:** S (likely one line per component) · **Impact:** +0.4

`tailwind-merge` is already a dependency. It just is not applied, so `rounded-full` silently
loses to the library's `rounded-lg` while `bg-purple-600` wins — an inconsistency the consumer
cannot predict.

```ts
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export const cn = (...i: ClassValue[]) => twMerge(clsx(i))

// then, in every component:
<button className={cn(buttonVariants({ variant, size }), className)} />
```

Audit all 56 modules — this should be a shared `cn()` helper used uniformly.

---

### R-07 · Externalise the hardcoded Korean strings

**Fixes:** F-08 · **Effort:** M · **Impact:** +0.3, removes an adoption blocker for non-Korean teams

41 Korean strings ship in the bundle, including validation messages and `aria-label`s. Two
options, cheapest first:

1. **Props with English defaults** — e.g. `Spinner`'s label, `InputFileUpload`'s prompt,
   `InputPhoneNumber`'s validation message. Minimal API surface, immediate relief.
2. **An optional `<ITUIProvider locale>`** with a string table, if broader i18n is planned.

Whichever is chosen, default to English for an internationally published package and document
the override.

---

### R-08 · Add `files` to `package.json` and stop shipping sourcemaps

**Fixes:** F-12 · **Effort:** S · **Impact:** +0.3

98 MB and 16,129 files is roughly 3× MUI for a smaller library, and 40 MB of that is
sourcemaps consumers cannot use.

```json
"files": ["dist"],
```

and in the build, either disable `sourcemap` for the published artifact or exclude `*.map`
from the package. Expected result: well under 10 MB.

---

### R-09 · Fix dependency classification

**Fixes:** F-09, F-12 · **Effort:** S · **Impact:** +0.3

| Package | Now | Should be |
| --- | --- | --- |
| `@types/react` | `dependencies` | `peerDependencies` (optional) — currently installs a duplicate copy of React's types |
| `tailwindcss`, `@tailwindcss/vite` | `dependencies` | `peerDependencies` + `devDependencies` |
| `sonner` | `dependencies` | keep, **and re-export `toast`** so consumers stop importing a phantom dependency |
| `radix-ui` umbrella | `dependencies` | drop — the individual `@radix-ui/react-*` packages are already there |
| `lucide-react` **or** `@phosphor-icons/react` | both | pick one |

Also switch the exact pins (`1.1.15`, `0.48.0`, …) to caret ranges so consumers who use Radix
directly do not end up with duplicate instances.

Add `"./package.json": "./package.json"` to `exports`.

---

### R-10 · Complete the accessibility wiring on form and table primitives

**Fixes:** F-11 · **Effort:** S–M · **Impact:** +0.4

| Component | Change |
| --- | --- |
| `Input` with `error` | set `aria-invalid="true"` and link the message via `aria-describedby` |
| `TableHead` with `sortDirection` | set `aria-sort="ascending" \| "descending"` |
| `<th>` | add `scope="col"` |
| Sortable headers | wrap contents in a `<button>` so sorting is keyboard-reachable |
| `Button` with `loading` | also set `disabled` (or `aria-disabled`) to prevent keyboard double-submit |
| `PopoverItem` | use menu roles when the popover is acting as a menu |

Each is small, and together they close most of the gap against the "Accessible by default"
claim.

---

## Tier 2 — API consistency (plan for a 2.0)

### R-11 · Resolve the duplicate and overlapping component families

**Fixes:** naming confusion documented in DX-REPORT §9 · **Effort:** L · **Impact:** +0.3

The public API currently exposes several pairs with no documented difference:

- `Input` / `InputV2`
- `navigation` / `navigation-v2`
- `tab` / `tabs`
- `dialog` / `modals` / `popup` / `bottom-sheet`
- `toast` / `snackbar`

For each: pick a winner, `@deprecated`-tag the other with a JSDoc pointer to the replacement,
and document the migration. Shipping both without guidance means every consumer makes an
uninformed coin-flip.

### R-12 · Rename `PopoverRoot` → `Popover`

**Fixes:** F-10 · **Effort:** S (breaking) · **Impact:** +0.2

Align with `Dialog`, `Tabs` and `Tooltip`, and with the runtime error that already says
``must be used within `Popover` ``. Requires renaming the component currently exported as
`Popover`. Keep `PopoverRoot` as a deprecated alias for one minor version.

### R-13 · Unify the form event model

**Fixes:** friction noted in S04 · **Effort:** M (breaking) · **Impact:** +0.2

`Checkbox` uses native `onChange(e.target.checked)` while `Select` uses Radix's
`onValueChange(value)`. Pick one convention. If native is kept for inputs, document the split
explicitly so it reads as a decision rather than an accident.

Also allow `SelectTrigger`'s `placeholder` to flow to `SelectValue` so it need not be passed
twice.

### R-14 · Reconsider exporting design-token showcases as components

**Effort:** S · **Impact:** +0.1

`colors`, `radius`, `shadow`, `spacing`, `typography` and `grid` are exported from the main
entry alongside real UI components. If these are documentation/Storybook aids, move them out
of the public API.

---

## Suggested sequence

| Milestone | Contents | Expected score |
| --- | --- | --- |
| **1.0.15** (patch, days) | R-02 (README), R-04 (focus trap), R-05 (disabled row), R-06 (`cn()`), R-08 (`files`) | ~5.8 |
| **1.1.0** (minor, weeks) | R-01 (`"use client"` + subpath exports), R-09 (deps), R-10 (a11y), R-07 (i18n) | ~7.5 |
| **1.2.0** | R-03 (docs site) | ~8.2 |
| **2.0.0** | R-11 … R-14 (breaking API cleanup) | ~8.8 |

The 1.0.15 milestone alone removes three of the six critical blockers and costs perhaps two
days of work.

---

## What not to change

Worth stating explicitly, so a cleanup effort does not damage what already works:

- **The TypeScript surface.** Named exported union types, JSDoc on non-obvious props, and
  diagnostics good enough to suggest `Did you mean 'label'?`. This is genuinely above average —
  preserve it through any refactor, and keep types co-located with components.
- **`TOKENS.md`.** 1,651 lines mapping tokens to CSS variables, light/dark values and the
  Tailwind classes that consume them. Fix the two stale entries (`--primary`, the `TODO`
  placeholders), but the structure is a model other libraries should copy.
- **The token architecture itself.** Scoped overrides work, dark mode works, and the
  `@theme inline` approach is the right call for Tailwind v4.
- **`Input`'s `fieldClassName` / `boxClassName` escape hatches.** Well named, well documented,
  and exactly the kind of pressure valve that prevents `!important` in consumer code.
- **The compound-component shapes** for `Card`, `Sidebar`, `Table` and `Dialog`. These compose
  naturally and read well in application code.
