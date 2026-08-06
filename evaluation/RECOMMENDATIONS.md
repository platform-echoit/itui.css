# Recommendations — `@echoit/itui.css@1.0.15`

Ordered by *DX return per unit of effort*. Effort is a rough engineering estimate.

**Context.** The previous report's headline was that every P0 was a packaging, build-config or
documentation defect, and that fixing the delivery layer would move the package from `NOT READY`
(4.4) toward `GOOD DX` (8.0+). That is exactly what happened: `1.0.15` scores **8.4**, and twelve
of the fourteen recommendations below `R-11` were implemented in full.

The list is now much shorter. Three items — two of them one-line changes — are what separate this
package from roughly 9.0 and an unqualified recommendation.

---

## Status of the 1.0.14 recommendations

| ID | Recommendation | Status |
| --- | --- | --- |
| R-01 | Emit `"use client"`, split into per-component entries | **Done, 3 files missed** → see R-15 |
| R-02 | Fix the README snippets that break first-run setup | **Done** |
| R-03 | Publish the docs site, or inline the API reference | **Done** (inlined as `API.md`; site still down) |
| R-04 | Restore Radix's focus management in `Dialog` | **Done** |
| R-05 | Make `TableRow disabled` actually disable | **Done** (leaked `<tr>` classes also removed) |
| R-06 | Apply `tailwind-merge` to incoming `className` | **Done** |
| R-07 | Externalise the hardcoded Korean strings | **Done** (41 → 0) |
| R-08 | Add `files`, stop shipping sourcemaps | **Done** (98 MB → 17.85 MB) |
| R-09 | Fix dependency classification | **Done** (incl. re-exporting `toast`) |
| R-10 | Complete the a11y wiring on form and table primitives | **Done for `Input`/`Table`/`Button`/`Popover`; not for `Select`** → see R-16 |
| R-11 | Resolve the duplicate/overlapping component families | **Partly** — documented well, only 2 of 5 tagged `@deprecated` → see R-18 |
| R-12 | Rename `PopoverRoot` → `Popover` | **Done**, but shipped in a patch release → see R-17 |
| R-13 | Unify the form event model | **Done** (`onCheckedChange` everywhere; `SelectTrigger placeholder` shorthand) |
| R-14 | Stop exporting token showcases as components | **Not done** → carried forward |

---

## Tier 0 — Ship-blockers

### R-15 · Make `Tag`, `Chip` and `Pagination` safe in a Server Component

**Fixes:** F-15 · **Effort:** XS (one line each) · **Impact:** +1.0 on SSR, removes the last blocker

These three are the only files in `dist` that lack a `"use client"` banner *and* hand a function
to a DOM prop unconditionally. The guard already exists in `Tag` and `Chip` — it just is not
applied to `onKeyDown`:

```js
// dist/components/tag/Tag.js — current
onClick:   isInteractive ? () => onClick?.() : void 0,
onKeyDown: handleKeyDown,                                  // ungated

// fix
onKeyDown: isInteractive ? handleKeyDown : undefined,
```

`Pagination` needs either the same treatment or a `"use client"` banner, since its page buttons
are interactive by definition.

Prefer gating over banners where the component can be genuinely static — a decorative
`<Tag>Enterprise</Tag>` should stay server-renderable rather than dragging a client boundary into
the page.

**Why this is urgent beyond the mechanics:** the README's component guide opens by telling people
to use `Tag` or `Chip` instead of `Badge`. That advice is correct, and it currently walks App
Router users into a build failure.

**Acceptance test:** extend `check:rsc` to render every export in an RSC environment, not a
sample. The scripts `check:client` and `check:rsc` already exist in `package.json`; whatever they
assert today passed a build that fails on three components.

---

### R-16 · Give `SelectTrigger` the same accessibility contract as `InputText`

**Fixes:** F-16, F-17 · **Effort:** S · **Impact:** +1.5 on Accessibility

Three defects in one component, all in the same place:

1. **Restore a focus indicator.** The class list contains `focus-visible:ring-0
   focus-visible:outline-none`, so a keyboard-focused select is pixel-identical to an unfocused
   one. Match `Button`'s `focus-visible:outline focus-visible:outline-2
   focus-visible:outline-brand`, or `Checkbox`'s `ring-2 ring-brand ring-offset` treatment. This
   is a WCAG 2.1 SC 2.4.7 failure today.
2. **Associate the `label`.** The trigger has no `id` and the rendered `<label>` has no `for`, so
   the combobox's accessible name falls back to its placeholder. Generate an id (the same
   `useId()` mechanism `InputText` already uses) and wire `for` — or set `aria-labelledby`.
3. **Wire the `error`.** When `error` is set, emit `aria-invalid="true"` and `aria-describedby`
   pointing at the message node, exactly as `InputText` now does.

The broader point is worth acting on: this release's accessibility work was excellent but applied
per component. A shared `useFieldA11y({ label, error })` hook — consumed by `InputText`,
`SelectTrigger`, and any future field — would make the next component correct by construction
instead of by review.

**Acceptance test:** for each field component, assert (a) a computed accessible name equal to the
`label`, (b) `aria-invalid` and a resolvable `aria-describedby` when `error` is set, and (c) a
computed style difference between focused and unfocused.

---

## Tier 1 — High value, low effort

### R-17 · Fix the version story around the `Popover` rename

**Fixes:** F-18 · **Effort:** XS (documentation) or S (release policy) · **Impact:** +0.3

`Popover` changed from a DOM panel to the Radix root between `1.0.14` and `1.0.15` — a patch
release. Both the README and `API.md` describe the change as belonging to `2.0`, and `API.md` adds
that the alias "is removed in the next minor".

Two things to reconcile, and either order works:

- **If the rename is intentional now:** correct every "2.0" reference to the version that actually
  shipped it, and add a short "Migrating from 1.0.14" note (`<Popover className>` →
  `<PopoverPanel className>`). Consider a `1.1.0` re-tag so the semver signal matches the change.
- **If `2.0` is the plan:** revert `Popover` to the panel in a `1.0.16`, keep `PopoverRoot` as the
  root for the `1.x` line, and land the rename with the major.

While in the file, improve the migration error. Today a `1.x` consumer gets:

```
error TS2322: Type '{ children: Element[]; className: string; }' is not assignable
              to type 'IntrinsicAttributes & PopoverProps'.
```

A `/** @deprecated className moved to PopoverPanel */`-style hint, or an explicitly-typed
`className?: never` with a JSDoc pointer, would name the fix instead of only the symptom.

---

### R-18 · Put the duplicate-family guidance in the types, not only the README

**Fixes:** F-22, residual R-11 · **Effort:** XS · **Impact:** +0.3

The README's "Picking between similar names" table is the single best piece of prose in the
documentation and answers every question `1.0.14` left open. But only `PopoverRoot` and `Input`
carry `@deprecated` in the shipped `.d.ts`. A developer working from autocomplete gets no signal
for the rest:

| Export | Should carry |
| --- | --- |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `@deprecated Use \`Tab\` — \`Tabs\` uses raw slate-* classes and ignores your theme and dark mode.` |
| `Navigation` | `@deprecated Use \`NavigationV2\`.` |
| `Toast` / `Snackbar`, `Dialog` / `Modal` / `Popup` / `BottomSheet` | not deprecated — but a one-line `@see` in each JSDoc pointing at the README table would stop the coin-flip |

Costs minutes; converts a document people may not read into a signal the editor shows them.

---

### R-19 · Fix `Tab`'s composition error message

**Fixes:** F-19 · **Effort:** XS · **Impact:** +0.2

```
`TabsTrigger` must be used within `Tabs`      <- what you get
`TabTrigger` must be used within `Tab`        <- what you wrote
```

The message leaks Radix's internal names, and they collide with this library's own legacy `Tabs`
export — so it reads as advice to migrate to the family the README warns against. Every sibling
family gets this right now (`` `SelectItem` must be used within `Select` ``), which makes the odd
one out conspicuous. Pass the wrapper's own display names into the Radix context factory.

---

### R-20 · Document the Server Component story

**Fixes:** F-15 (the discoverability half), F-22 · **Effort:** S · **Impact:** +0.5 on SSR

The engineering is done — 35 files carry `"use client"`, and `package.json` ships `check:client`
and `check:rsc`. None of it is written down. Add a short README section:

~~~markdown
## Next.js / React Server Components

Components that manage state, focus or events ship a `"use client"` banner, so you can import
them from a Server Component without adding a boundary of your own.

```tsx
// app/page.tsx — a Server Component, no "use client" needed
import { Button, Card, Table } from '@echoit/itui.css';
```

Load the stylesheet once from `app/globals.css` with `@tailwindcss/postcss`:

```css
@import '@echoit/itui.css';
```

Interactive components (`Dialog`, `Select`, `Popover`, `Toaster`, …) work inside your own
`"use client"` files as normal.
~~~

Once R-15 lands, that section is simply true, with no caveat list to maintain.

---

## Tier 2 — Worth doing next

### R-21 · Split the icons into their own package

**Fixes:** F-20 · **Effort:** M · **Impact:** +0.5 on Installation

`dist/icons` is 17.36 MB across 8,208 files — 97% of the installed package — and every consumer
downloads it whether or not they import an icon. The isolation is already correct (own subpath,
off the barrel, absent from a `Button`-only bundle), so this is purely about install and CI-cache
cost.

Publish `@echoit/itui.icons` and either re-export it from `./icons` as an optional peer, or leave
`./icons` as a documented alias for one minor version. Expected result: a typical install drops
from 17.85 MB to roughly 500 kB.

### R-22 · Fill in the empty prop descriptions in `API.md`

**Fixes:** F-22 · **Effort:** M (mostly JSDoc in source) · **Impact:** +0.3

`API.md` is generated from source, so the blanks are missing JSDoc rather than a generator
problem. A large share of rows read `—`, including on the most-used components:

```
| `variant?` | `ButtonVariant` | `'primary'` | — |
| `size?`    | `ButtonSize`    | `'md'`      | — |
| `selected?`| `boolean`       | —           | — |
```

Where JSDoc does exist it is genuinely excellent — `PopoverItem.asMenuItem`,
`SelectTrigger.placeholder` and `InputText.boxClassName` each explain *when to reach for this*,
not just what it is. Bring the top twenty components up to that bar and the reference stops being
a type dump. Prioritise `Button`, `Table`, `Card`, `Dialog` and the `Input` family.

### R-23 · Add accessibility documentation

**Effort:** S–M · **Impact:** +0.2

The behaviour is now good enough to advertise specifically. Per component: which element receives
focus, what the keyboard model is, and which ARIA attributes the component owns versus which the
consumer must supply. Two entries are load-bearing today: `Toggle` has no `label` prop (an
`aria-label` is required), and `Tooltip` requires a `TooltipProvider` ancestor while `Popover` and
`Dialog` do not.

### R-24 · Improve the `require()` error path

**Effort:** XS · **Impact:** +0.1

```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: No "exports" main defined in …/package.json
```

The package does define `.`, but only under the `import` condition, so CJS consumers get a message
that reads like a packaging bug. Add a tiny CJS stub under a `require` condition that throws
`'@echoit/itui.css is ESM-only. Use `import`, or `await import()` from CommonJS.'` The README
already documents this; the runtime should say it too.

### R-25 · Carried forward from 1.0.14 — stop exporting token showcases as components

**Fixes:** residual R-14 · **Effort:** S · **Impact:** +0.1

`colors`, `radius`, `shadow`, `spacing`, `typography` and `grid` are still exported from the main
entry alongside real UI components, and they now occupy six of the 56 sections in `API.md`. If
they are Storybook/documentation aids, move them out of the public API.

---

## Suggested sequence

| Milestone | Contents | Expected score |
| --- | --- | --- |
| **1.0.16** (patch, hours) | R-15 (three one-line gates), R-19 (error message), R-17 docs half, R-18 (`@deprecated` tags) | ~8.8 — removes the last critical blocker |
| **1.1.0** (minor, days) | R-16 (`Select` a11y contract + shared field hook), R-20 (RSC docs), R-24 | ~9.1 |
| **1.2.0** (weeks) | R-21 (icons package), R-22 (prop descriptions), R-23 (a11y docs) | ~9.4 |
| **2.0.0** | R-25, plus whatever the `Popover` version decision in R-17 implies | — |

`1.0.16` is a few hours of work and is the difference between "adopt with a caveat" and "adopt".

---

## What not to change

Restated from the previous report, because the refactor preserved all of it — and extended it:

- **The TypeScript surface.** Named exported union types, `Did you mean 'label'?`-grade
  diagnostics, and a ~40-component app that typechecks clean on the first attempt. Moving
  `@types/react` to an optional peer this release removed the one real hazard.
- **`API.md` as a generated, CI-checked artifact.** Coverage went from 30% to 100% in one release
  precisely because it is generated rather than hand-maintained. Keep `check:docs` in CI.
- **The README's "Picking between similar names" table** and the `Badge`-truncates-`"Enterprise"`
  warning. This is documentation doing the thing documentation is uniquely good at — recording
  what the types cannot express. More of this.
- **The token architecture**, and the new prose explaining *why* `--primary` and `--radius` look
  like no-ops. Explaining a footgun beats silently removing it.
- **The barrel that imports its own CSS.** One line in `dist/index.js` eliminated the worst defect
  in the previous evaluation.
- **Per-component entries with a barrel on top.** Byte-identical production output either way, and
  a 22-module dev graph instead of 1,511 when you want it.
- **`Input`'s `fieldClassName`/`boxClassName` escape hatches** and the compound shapes for `Card`,
  `Sidebar`, `Table` and `Dialog`.
