# Developer Experience Report — `@echoit/itui.css`

**Final score: 8.4 / 10 — `GOOD DX`**
Re-evaluated 2026-08-05 against version `1.0.15`, installed from the public npm registry into
two brand-new applications. Previous evaluation: `1.0.14`, 4.4 / 10, `NOT READY` (2026-07-29).

---

## 1. Executive summary

`1.0.15` is not a maintenance release. It is a rebuild of the delivery layer, and it fixes
**every one of the six critical blockers** raised against `1.0.14`. Each fix was re-verified by
installing the package from npm into a fresh project, writing code against the public
documentation, and running it — not by reading the changelog.

What changed, measured:

| | 1.0.14 | 1.0.15 |
| --- | ---: | ---: |
| Cost of one `Button` over an empty React app | +783 kB / +229 kB gzip | **+24 kB / +8 kB gzip** |
| Install footprint | 98 MB, 16,129 files | **17.85 MB, 8,495 files** |
| `dist/index.js` | 17.8 MB single bundle | **2.6 kB barrel of 56 re-exports** |
| Following the README's setup | silently unstyled | **styled, both documented paths** |
| Components documented | 17 of 56 | **56 of 56** (`API.md`, generated + CI-checked) |
| Server Component `next build` | crashes on every import | **passes for 53 of 56 modules** |
| Dialog focus trap | absent | **moves focus in, traps Tab, restores on close** |
| `TableRow disabled` | cosmetic only | **`aria-disabled`, `pointer-events:none`, click suppressed** |
| `className` overrides | concatenated, `rounded-*` silently lost | **`tailwind-merge` applied, consumer wins** |
| Hardcoded Korean strings in the bundle | 41 | **0** |

The component design and TypeScript surface — already the strongest parts of `1.0.14` — survived
the refactor intact and got better. A nine-file app using roughly forty components typechecked
clean on the first attempt, and eight deliberately wrong props produced eight precise
diagnostics.

**What is still wrong** is narrower and sharper than last time:

1. **Three components break a Next.js Server Component build**: `Tag`, `Chip` and `Pagination`
   hand an event handler to a DOM prop unconditionally and carry no `"use client"` banner. The
   sting is that the README's own guidance — *"Use `Tag` or `Chip` for a status or tier label"* —
   points straight at two of them.
2. **`SelectTrigger` has no visible focus indicator** (it explicitly sets
   `focus-visible:ring-0 focus-visible:outline-none`), and its `label` and `error` props are not
   wired to anything assistive technology can read. This is the same wiring that was correctly
   fixed on `InputText`, not applied to its sibling.
3. **A breaking rename shipped in a patch release.** `Popover` meant the panel in `1.0.14` and
   means the root in `1.0.15`. The README and `API.md` both describe this as *"Renamed in 2.0"*
   on a package published as `1.0.15`.

None of these is architectural. Two are one-line fixes; the third is a versioning decision.

**Can a new developer adopt this package today without help?** For a Vite/SPA project — yes,
comfortably. Copy-pasting the README produces a styled, accessible, correctly-typed app on the
first run. For a Next.js App Router project — yes, with one caveat they will hit at build time
and have to solve themselves, because nothing in the documentation mentions Server Components.

---

## 2. Package / version tested

| Field | Value |
| --- | --- |
| Package | `@echoit/itui.css` |
| Version | `1.0.15` (published 2026-08-05T03:17:37Z) |
| Previous version evaluated | `1.0.14` (2026-07-29) |
| Registry | public npm |
| Install command | `npm install @echoit/itui.css` |
| Integrity | `sha512-Jthxl3p6vekkImo9tfxYHNF8oRzNBwdOaFazSmPh8WpQluJ1fD5hMqJUXeYvc2sUjiBNilUN+ME1iawXDEUr5g==` |
| License | ISC |
| Repository | `github.com/platform-echoit/itui.css` |
| Peer deps | `react ^18\|\|^19`, `react-dom ^18\|\|^19`, `tailwindcss ^4`, `@types/react` (optional) |
| Runtime deps | 28, all caret ranges |
| Published size | 17.85 MB unpacked, 8,495 files |
| Module format | ESM only (`"type": "module"`, no CJS build) |
| Exports | `.`, `./icons`, `./*` (per-component subpaths), `./dist/index.css`, `./package.json` |

---

## 3. Environment

| Tool | Version |
| --- | --- |
| OS | Windows 11 Pro 10.0.26200 |
| Node.js | v24.14.1 |
| npm | 11.11.0 |
| Vite | 8.2.0 |
| TypeScript | 6.0.2 |
| React / React DOM | 19.2.8 |
| Tailwind CSS | 4.3.3 |
| Next.js | 16.3.0 (App Router, Turbopack) |
| Playwright | 1.62.0 (Chromium) |

Two applications were created from scratch for this run under `ui-package-dx-evaluation/v2/`:
a Vite React+TS app (`v2/app`) and a Next.js App Router app (`v2/next-app`). Neither reuses any
artifact, `node_modules` tree or lockfile from the `1.0.14` evaluation. The installed tarball's
integrity hash was checked against the registry metadata for `1.0.15`. No local checkout, `link`
or `file:` dependency was used at any point.

---

## 4. Installation experience

```
$ npm install @echoit/itui.css
added 99 packages, and audited 127 packages in 45s
found 0 vulnerabilities
```

No peer warnings, no postinstall scripts, no remediation. `tailwindcss` is now a declared peer,
so npm resolves it automatically; the README still (correctly) tells you to install it and its
bundler plugin explicitly, which is what makes the install reproducible.

What arrives is a different package from last month:

| Measurement | 1.0.14 | 1.0.15 |
| --- | ---: | ---: |
| On-disk size | 98 MB | **17.85 MB** |
| File count | 16,129 | **8,495** |
| `.map` files shipped | 8,055 (≈40 MB) | **0** |
| `dist/index.js` | 17.8 MB | **2,652 bytes** |
| `dist/index.cjs` | 17.7 MB | **not shipped** |
| `dist/components/**` | — | 973 kB across 56 module folders |
| `dist/icons` | 22 MB | 17.36 MB / 8,208 files |
| Packages added to the consumer | 152 | 99 |

Every dependency-hygiene finding from `1.0.14` is resolved: `@types/react` moved to an optional
peer (there is now exactly one copy of React's types in the tree), `tailwindcss` and
`@tailwindcss/vite` are no longer runtime dependencies, the `radix-ui` umbrella and the second
icon library are gone, all 28 remaining dependencies use caret ranges instead of exact pins,
`files: ["dist"]` is set, `./package.json` is exported, and the npm `description` no longer
begins with a stray `> `.

**The one remaining footprint problem is the icons.** `dist/icons` is 17.36 MB across 8,208
files — 97% of the installed package — and every consumer downloads it whether or not they
import a single icon. The icons are correctly kept off the main barrel (a `Button`-only bundle
contains none of them), so this is disk and install cost, not bundle cost. It is still the
difference between a 17.85 MB install and a ~500 kB one.

---

## 5. Scenario score table

| ID | Scenario | Status | Score | Was (1.0.14) | Δ |
| --- | --- | --- | ---: | ---: | ---: |
| S01 | Discover the API from public documentation | PASS | 8 | 4 | +4 |
| S02 | Install from npm into a fresh project | PASS | 8 | 4 | +4 |
| S03 | Render the first component (time to first pixel) | PASS | 9 | 3 | +6 |
| S04 | Build a realistic form | PASS | 8 | 7 | +1 |
| S05 | Modal / Dialog flow | PASS | 9 | 3 | +6 |
| S06 | Data table | PASS | 9 | 3 | +6 |
| S07 | Overlay composition (Popover / Tooltip / Tab) | PASS | 8 | 5 | +3 |
| S08 | Toasts | PASS | 9 | 5 | +4 |
| S09 | Theming via design tokens | PASS | 9 | 6 | +3 |
| S10 | Per-instance customization / `className` override | PASS | 9 | 4 | +5 |
| S11 | TypeScript DX | PASS | 9 | 8 | +1 |
| S12 | Accessibility defaults | PARTIAL | 7 | 3 | +4 |
| S13 | Error recovery / mistake tolerance | PASS | 8 | 6 | +2 |
| S14 | Realistic application screen | PASS | 9 | 7 | +2 |
| S15 | Next.js App Router / SSR | **PARTIAL** | 6 | 2 | +4 |
| S16 | Packaging, build output, tree-shaking | PASS | 9 | 1 | +8 |

No scenario was skipped or marked `N/A`.

---

## 6. Category score table

| Category | Score | Was | Weight | Contribution |
| --- | ---: | ---: | ---: | ---: |
| Documentation & Discovery | 8.5 | 4.0 | 15% | 1.275 |
| Installation & Setup | 8.5 | 3.5 | 15% | 1.275 |
| Core Component API | 8.5 | 4.5 | 15% | 1.275 |
| Composition & Realism | 9.0 | 6.0 | 10% | 0.900 |
| Customization & Theming | 9.0 | 5.0 | 10% | 0.900 |
| TypeScript DX | 9.0 | 8.0 | 10% | 0.900 |
| Accessibility | 7.0 | 3.0 | 8% | 0.560 |
| Error Recovery | 8.0 | 6.0 | 5% | 0.400 |
| SSR / Next.js | 6.0 | 2.0 | 7% | 0.420 |
| Packaging & Performance | 9.0 | 1.0 | 5% | 0.450 |
| **Weighted total** | | | | **8.36** |

---

## 7. Top 10 DX problems

Ordered by severity. Six of the ten problems in the `1.0.14` report no longer exist; these are
what is left, plus what this run surfaced for the first time.

### 1. `Tag`, `Chip` and `Pagination` fail a Next.js Server Component build — *critical*

```
✓ Compiled successfully in 7.6s
  Running TypeScript ... Finished TypeScript in 3.3s
  Collecting page data ...
Error occurred prerendering page "/"
Error: Event handlers cannot be passed to Client Component props.
  {ref: …, className: …, role: …, tabIndex: …, aria-pressed: …, onClick: …,
   onKeyDown: function onKeyDown, children: …}
                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

Bisected component by component against `next build`: `Button`, `Card`, `Table` (including
`sortDirection` and `disabled`), `Spinner`, `Avatar`, `Badge`, `Divider`, `Skeleton`, `Empty`,
`Label` and `Progress` all prerender cleanly. `Tag`, `Chip` and `Pagination` do not — and they
fail even when the consumer passes no handler at all.

The root cause is one unguarded line. `Tag` computes `isInteractive = !!onClick && !disabled`
and correctly gates `role`, `tabIndex`, `aria-pressed` and `onClick` on it — then passes
`onKeyDown: handleKeyDown` unconditionally. `Chip` is the same code. `Pagination` passes
`onClick: () => …` on its page buttons. Of the 56 shipped modules, 35 files carry a
`"use client"` banner; these three do not.

This is a small bug with an outsized cost, because the README's component guide opens with
*"Use `Tag` or `Chip` for a status or tier label"* — the correct advice, pointing at the two
components an App Router user cannot put on a server-rendered page.

### 2. `SelectTrigger` has no visible focus indicator — *critical accessibility defect*

Keyboard-focusing the trigger produces no perceptible change:

```
unfocused:  outline none        border rgb(237,237,237)
focused:    outline none        border rgb(237,237,237)
            :focus-visible matches = true
            box-shadow = rgba(0,0,0,0) 0 0 0 0  (transparent, zero spread)
```

The class list contains `focus-visible:ring-0 focus-visible:outline-none` explicitly. Screenshot:
`v2/screenshots/s12-select-focused.png` — the focused select is pixel-identical to an unfocused
one. For contrast, `Button` under the same test shows `solid 2px rgb(0,156,224)`
(`v2/screenshots/s12-button-focused.png`). This is a WCAG 2.1 SC 2.4.7 failure on one of the
most common form controls.

### 3. `SelectTrigger`'s `label` and `error` props are invisible to assistive technology

```
<div class="flex flex-col gap-2">
  <label class="…">Role</label>            <- no `for`
  <button role="combobox" …>               <- no `id`, no aria-labelledby,
                                              no aria-invalid, no aria-describedby
```

The accessible name of the combobox falls back to its own content — the *placeholder*. A screen
reader announces "Pick a role, combobox" instead of "Role". With `error="Pick something"` the
message renders in red and is announced to nobody.

This is precisely the defect that **was** fixed on `InputText` this release, which now emits
`aria-invalid="true"` and `aria-describedby` pointing at the message. The fix simply was not
applied to the sibling component, which makes it an API-consistency problem as much as an
accessibility one.

### 4. A breaking rename shipped in a patch release, documented as "2.0"

`1.0.14` exported `Popover` as `ForwardRefExoticComponent<PopoverProps & RefAttributes<HTMLDivElement>>`
— a panel element. `1.0.15` exports `Popover` as the Radix root. Any `1.x` code with
`<Popover className="…">` stops compiling on a patch upgrade.

The rename itself is right: it aligns Popover with `Dialog`/`Tabs`/`Tooltip` and it was the
top naming complaint last time. The problem is delivery. Both the README and `API.md` announce
it as *"Renamed in `2.0`"* and *"This alias is removed in the next minor"*, on a package
published as `1.0.15`. A developer reading that has no way to tell which version they are
actually reading about.

### 5. No Next.js or Server Component documentation at all

The README's Requirements section covers React, Tailwind, `@types/react`, Node and ESM. It never
mentions the App Router, `"use client"`, or which components are client-only — despite the
package having clearly done a deliberate client-boundary pass (35 files carry the banner, and
`package.json` ships `check:client` and `check:rsc` scripts). The work was done; the result was
never written down. A developer's first Next.js build failure is therefore a message about
"Client Component props" with no pointer to a fix.

### 6. Only 2 of the 5 duplicate component families are `@deprecated` in the types

The README's "Picking between similar names" table is genuinely good and answers every question
`1.0.14` left open. But only `PopoverRoot` and `Input` carry `@deprecated` JSDoc in the shipped
`.d.ts`. `Tabs` (superseded by `Tab`), `Navigation` (superseded by `NavigationV2`), and the
`Dialog`/`Modal`/`Popup`/`BottomSheet` and `Toast`/`Snackbar` families carry no signal at all.
A developer who reaches for autocomplete instead of the README gets no warning that `Tabs`
"paints itself with raw `slate-*` palette classes, so it ignores your theme and your dark mode"
— the README's own words.

### 7. `Tab`'s runtime error names the wrong exports

Rendering `TabTrigger` outside its root throws:

```
`TabsTrigger` must be used within `Tabs`
```

Neither name is what the developer wrote or what the README told them to use (`TabTrigger`
inside `Tab`). Worse, `Tabs` **is** also a real export of this library — the legacy one the
README steers you away from — so the message reads as an instruction to switch to the deprecated
family. The equivalent messages for Popover, Select and Tooltip are all correct now
(`` `SelectItem` must be used within `Select` ``), which makes this one stand out.

### 8. Prop descriptions in `API.md` are frequently empty

`API.md` covers all 56 modules and 245 exports, and the coverage is the single biggest
documentation win this release. But a large share of rows read `—` in the Description column,
including on the most-used components:

```
| `variant?` | `ButtonVariant` | `'primary'` | — |
| `size?`    | `ButtonSize`    | `'md'`      | — |
| `selected?`| `boolean`       | —           | — |     (TableRow)
```

Types and defaults are there, so the page is a usable reference; but it answers "what values are
legal" without answering "when would I use `alternative` rather than `secondary`". Where JSDoc
does exist it is excellent (see `PopoverItem.asMenuItem`, `SelectTrigger.placeholder`,
`InputText.boxClassName`) — it is just uneven.

### 9. 17.36 MB of icons are installed for every consumer

97% of the package is `dist/icons`: 8,208 files, 6,615 exported components. They are properly
isolated — off the main barrel, on their own `./icons` subpath, absent from a `Button`-only
production bundle — so the design decision is sound. The cost is that a project that never
imports an icon still downloads and stores 17.36 MB, and CI caches carry 8,208 files. A separate
`@echoit/itui.icons` package, or an optional peer, would take the install from 17.85 MB to
roughly 500 kB.

### 10. Silent unstyled rendering is still reachable via the subpath import

The `1.0.14` catastrophe — following the README and getting an unstyled app with no warning — is
gone: `dist/index.js` now begins with `import './index.css';`, so any barrel import loads the
stylesheet. Measured on a page that imports only `@echoit/itui.css/button` and no CSS anywhere:

```
background rgb(240,240,240)   height 21px   borderRadius 0px
document.styleSheets.length = 0
console output: none
```

The README documents this exactly, in a ⚠️ callout, with the fix. So it is a documented trade-off
rather than a trap — but it is still the one path where the failure mode is silence.

---

## 8. Top 10 strengths

1. **The delivery-layer rebuild is comprehensive and correct.** A 17.8 MB single-module bundle
   became a 2.6 kB barrel of 56 re-exports with per-component subpaths. That one change fixed the
   stylesheet bug, tree-shaking, and most of the Server Component problem simultaneously.
2. **Tree-shaking genuinely works.** One `Button` costs +24 kB raw / +8 kB gzip over a bare React
   app, and the bundle contains zero occurrences of `lexical`, `sonner`, `date-fns`, `embla`,
   `carousel` or `daypicker`. Barrel and subpath imports produce byte-identical output.
3. **`API.md` closed the documentation gap in one release** — 17 of 56 modules documented became
   56 of 56, 245 exports, generated from source and checked in CI so it cannot drift.
4. **The README now teaches the traps instead of falling into them.** The theming section
   explains *why* `--primary` and `--radius` look like no-ops; the component guide warns that
   `Badge` truncates `"Enterprise"` to `"erp"` and sends you to `Tag`; the "Picking between
   similar names" table resolves every duplicate-family question from last time.
5. **Dialog accessibility is now correct by default.** Focus moves into the content on open,
   Tab cycles within it (`Cancel → Delete → Close → Cancel …`), Escape closes, focus returns to
   the trigger, and the background is `aria-hidden`.
6. **The form event model is unified.** `onCheckedChange(next)` on `Checkbox`, `Radio`, `Toggle`
   and `Rating`, `onValueChange` on `Select` — and the native `onChange` still fires first on
   `Checkbox`, which is what lets a form library's field object be spread straight onto it.
7. **`className` merging is fixed and consistent.** `tailwind-merge` is applied: passing
   `rounded-full` removes the library's `rounded-lg` from the class list entirely rather than
   racing it in the cascade. Verified on `Button`, `Card` and `InputText`.
8. **TypeScript remains excellent and got better.** Eight deliberate mistakes produced eight
   precise diagnostics, including `Did you mean 'label'?`; a nine-file app using ~40 components
   typechecked clean first try with no `any`, casts or `@ts-expect-error`; and `@types/react`
   is now an optional peer, so the duplicate-types hazard is gone.
9. **Internationalisation is no longer a blocker.** The 41 hardcoded Korean strings are gone from
   the bundle. `Spinner` now takes `label` defaulting to `'Loading'`; `Tag`/`Chip` take
   `closeLabel` defaulting to `'Remove'`; `InputDate` takes `invalidMessage` and `calendarLabel`.
   The only Hangul left anywhere in `dist` is four characters inside source comments.
10. **Table semantics are complete.** `<th scope="col">`, `aria-sort` reflecting `sortDirection`,
    `aria-sort="none"` for `sortable`, header content wrapped in a real `<button>` so Enter sorts,
    and `disabled` rows that actually refuse clicks. The leaked container classes on `<tr>` are
    gone.

---

## 9. Most confusing APIs

The `1.0.14` list had ten entries. Six are resolved. What remains:

| API | Problem | Status vs 1.0.14 |
| --- | --- | --- |
| `Popover` | Now correctly the root — but its meaning changed in a **patch** release, and the docs call the change "2.0" | Fixed as an API, broken as a release |
| `Tab` vs `Tabs` | README explains which to use; the types do not mark `Tabs` deprecated, and `Tab`'s runtime error tells you to use `Tabs` | Partially fixed |
| `Navigation` vs `NavigationV2` | README explains; no `@deprecated` tag | Partially fixed |
| `Dialog`/`Modal`/`Popup`/`BottomSheet` | README explains they are four designs, not four versions — good answer, still four things to learn | Documented |
| `Toast` vs `Snackbar` | README explains they coexist and both need mounting | Documented |
| `Input` vs `InputText` vs `InputV2` | `Input` is `@deprecated` in the types with a pointer to the replacement | **Fixed** |
| `SelectTrigger` `label`/`error` | Look like `InputText`'s props, behave differently (no association, no `aria-invalid`) | **New** |
| `colors`/`radius`/`shadow`/`spacing`/`typography`/`grid` | Still exported from the main entry alongside real UI components | Unchanged |
| Provider requirements | `Tooltip` needs `TooltipProvider`; `Popover`/`Dialog` do not. Still undocumented, but the error now says so plainly: `` `Tooltip` must be used within `TooltipProvider` `` | Improved |
| `Checkbox` `label` vs `Radio` children | Two ways to label two adjacent controls | Unchanged, minor |

---

## 10. Documentation gaps

**Closed since 1.0.14:** the dead `itui.echoit.co.kr` link (the README now says plainly "There is
no hosted docs site yet"), the missing API reference, the self-contradictory `@source`
instructions, the wrong theming token names, Tailwind v4 buried under "Requirements", relative
links that broke on npm, the "React 19+" vs `^18 || ^19` contradiction, the `Badge`-vs-`Tag`
trap, and the absence of migration guidance for the duplicate families.

**Still open:**

- **No hosted documentation site.** `https://itui.echoit.co.kr` still fails DNS resolution. The
  README is now honest about it rather than linking to it, which is the right call, but the
  reference lives in a 2,743-line Markdown file on GitHub with no search.
- **`API.md` and `TOKENS.md` are not in the tarball** (`files` ships `dist` only), so an offline
  or air-gapped consumer has types and nothing else. The README states this explicitly.
- **Nothing about Next.js, the App Router or `"use client"`,** despite the package having done
  the client-boundary work.
- **No accessibility documentation** — no keyboard interaction tables, no ARIA notes, no
  statement of which components own focus management.
- **Many `API.md` prop descriptions are empty** (see problem 8).
- **Version labelling is wrong** — "Renamed in 2.0" on a 1.0.15 package (see problem 4).
- **Storybook is referenced** (`pnpm dev` in `apps/storybook`) but is only reachable by cloning
  the repository.

---

## 11. TypeScript findings

Still the package's strongest dimension, and now with one fewer hazard.

Eight deliberate mistakes, eight precise diagnostics:

```
error TS2322: Type '"danger"' is not assignable to type 'ButtonVariant | undefined'.
error TS2322: Type '"xl"' is not assignable to type 'ButtonSize | undefined'.
error TS2322: Type 'string' is not assignable to type 'boolean | undefined'.
error TS2322: Property 'labell' does not exist on type '… & InputTextProps & …'.
              Did you mean 'label'?
error TS2322: Type '"middle-center"' is not assignable to type 'PopoverPlacement | undefined'.
error TS2322: Type '"ascending"' is not assignable to type 'SortDirection | undefined'.
error TS2322: Type '"solid"' is not assignable to type 'TagVariant | undefined'.
error TS2322: Property 'placement' does not exist on type '… & ToasterProps'.
```

Wrong import casing (`import { button }`) and a non-existent name (`Buttons`) both fail at the
import site.

**Fixed this release:** `@types/react` is an optional `peerDependency` instead of a runtime
dependency, so there is exactly one copy of React's types in the tree — the duplicate-types
hazard flagged in `1.0.14` is gone. Deprecated exports now carry `@deprecated` JSDoc that editors
strike through.

**Verified documented claim.** The README states that a `1.x` `<Popover className="…">` "no
longer typechecks, deliberately". It does not:

```
error TS2322: Type '{ children: Element[]; className: string; }' is not assignable
              to type 'IntrinsicAttributes & PopoverProps'.
```

The claim holds. The message, however, does not name the fix — a migrating developer learns that
`className` is not allowed but not that the panel is now `PopoverPanel`.

**Remaining risks.** Only two of five duplicate families are `@deprecated`-tagged. Composition
errors (an overlay part outside its root) are still runtime-only, which matches Radix's own
behaviour and is not counted against the package.

---

## 12. Customization findings

| Mechanism | 1.0.14 | 1.0.15 |
| --- | --- | --- |
| Design tokens via CSS custom properties | Works (with `TOKENS.md` names, not the README's) | **Works, and the README now names them correctly** |
| Scoped token overrides (non-`:root`) | Works | Works |
| Dark mode via `.dark` | Works | Works — `bg-background` → `rgb(15,15,15)`, `text-foreground` → `rgb(245,245,245)` on a nested container |
| `className` on `Button` | **Unreliable** — `rounded-*` silently lost | **Works** — consumer class wins, library class removed from the list |
| `className` on `Card` | not tested | Works — `p-8 rounded-none` → `padding 32px`, `border-radius 0px` |
| `fieldClassName` / `boxClassName` on `InputText` | Works | Works |
| `asChild` polymorphism | Works | Works on `DialogTrigger`, `PopoverTrigger`, `TooltipTrigger` |

Measured token behaviour, three scopes on the same page:

| Scope | Background | Radius |
| --- | --- | --- |
| default | `rgb(0,156,224)` | 8px |
| `--color-brand` + `--radius-lg` (README's names) | `oklch(0.55 0.2 260)` | 9999px |
| `--primary` + `--radius` (the `1.x` README's names) | `rgb(0,156,224)` | 8px — unchanged |

The third row is still a no-op, but it is now a *documented* no-op: the README explains that
`Button` does not read `--primary`, and that `--radius` "only feeds `--radius-base`, and **no
component uses `rounded-base`**". `TOKENS.md`'s stale `--primary` entry has also been corrected
to the shipped `#009ce0`.

---

## 13. Accessibility findings

**Fixed since 1.0.14** — each re-verified in a browser:

| Defect | Evidence it is fixed |
| --- | --- |
| Dialog had no focus trap | Focus lands on `Close`; Tab cycles `Cancel → Delete → Close` and never leaves; Escape closes and returns focus to the trigger; background siblings are `aria-hidden` |
| `Input error` set no `aria-invalid` / `aria-describedby` | `aria-invalid="true"`, `aria-describedby="_r_0_-message"` resolving to "Enter a valid email address" |
| `TableHead sortDirection` set no `aria-sort` | `<th scope="col" aria-sort="ascending">` |
| Sortable headers were not keyboard-reachable | Header content is a real `<button>`; Enter toggled the sort |
| `<th>` had no `scope` | `scope="col"` present |
| `TableRow disabled` was cosmetic | `aria-disabled="true"`, `data-disabled`, `pointer-events:none`, click produced no state change |
| `Button loading` allowed keyboard double-submit | `aria-busy="true"` + `aria-disabled="true"`, stays focusable, and an activation while loading fired **0** submits |
| `PopoverItem` had no menu semantics | `PopoverMenu` renders `role="menu"`, `asMenuItem` renders `role="menuitem"`, ArrowDown moves between items |
| 41 hardcoded Korean strings incl. `aria-label`s | 0 Hangul in the production bundle or the rendered DOM; `Spinner` announces `Loading` |

**Still correct:** `InputText` label association via `<label for>`, `Checkbox` and `Radio` labelled
by a wrapping `<label>`, 2px brand focus ring on `Button`, `role="status"` on the spinner,
`aria-live="polite"` on toasts, `aria-labelledby`/`aria-describedby` on `Dialog`.

**Remaining defects:**

| Issue | Impact |
| --- | --- |
| **`SelectTrigger` shows no focus indicator** (`focus-visible:ring-0 focus-visible:outline-none`) | WCAG 2.4.7 failure. Keyboard users cannot see where they are in a form. |
| **`SelectTrigger label` is not associated** — no `for`, no `id`, no `aria-labelledby` | The combobox is announced by its placeholder, not its label. |
| **`SelectTrigger error` sets no `aria-invalid`/`aria-describedby`** | The validation message is visual-only — the exact defect fixed on `InputText`. |
| `Dialog` does not set `aria-modal` | Minor: the background is `aria-hidden` instead, which achieves the practical result. |
| `Toggle` has no `label` prop | Labelling requires a manual `aria-label`, unlike `Checkbox`/`Radio`. |

The pattern is worth naming: the accessibility work this release was real and thorough, but it
was applied per-component rather than as a shared contract. `InputText` got the full treatment;
`SelectTrigger`, which exposes the same-looking `label` and `error` props, got none of it.

---

## 14. Next.js / SSR findings

**Server Components — mostly fixed, three exceptions.**

`1.0.14` crashed on any import with `TypeError: (0, y.createContext) is not a function`. That is
gone. `1.0.15` compiles, typechecks and prerenders a Server Component page that uses `Button`,
`Card`, and a `Table` with a sorted header and a disabled row:

```
✓ Compiled successfully in 3.7s
  Running TypeScript ... Finished TypeScript in 2.5s
✓ Generating static pages (5/5)
Route (app):  ○ /   ○ /_not-found   ○ /client      (all static)
```

Bisecting the build one component at a time:

| Result | Components |
| --- | --- |
| **PASS in an RSC** | `Button`, `Card`, `Table` (+ `sortDirection`, + `disabled`), `Spinner`, `Avatar`, `Badge`, `Divider`, `Skeleton`, `Empty`, `Label`, `Progress` |
| **FAIL in an RSC** | `Tag`, `Chip`, `Pagination` — `Error: Event handlers cannot be passed to Client Component props` |

A static scan of `dist` agrees exactly: 35 files carry a `"use client"` banner, and precisely
three files lack one while handing a function to a DOM prop unconditionally —
`tag/Tag.js`, `chip/Chip.js`, `pagination/Pagination.js`.

**Client Components — clean.**

The `"use client"` page built, prerendered statically, hydrated with **zero** console warnings or
errors, and was fully interactive: the checkbox updated state, the dialog opened with focus
inside it, and Escape closed it.

**Cost.** Measured from the running production server:

| Route | JS transferred | CSS |
| --- | ---: | ---: |
| `/` (Server Component) | 441.0 kB | 102.2 kB |
| `/client` (Client Component) | 550.5 kB | 102.2 kB |

A control build with the library removed from `/` transferred byte-identical amounts, which
confirms the RSC route ships no library JavaScript of its own — 441 kB is the Next.js framework
plus chunks shared with `/client`. For comparison, `1.0.14`'s client page transferred 961 kB.

**Documentation.** Still nothing. No mention of the App Router, `"use client"`, or which
components are client-only, so the three failures above are discovered at build time with no
pointer to a cause.

---

## 15. Comparison against MUI / Radix

| Dimension | `@echoit/itui.css` 1.0.14 | `@echoit/itui.css` 1.0.15 | Radix UI | MUI |
| --- | --- | --- | --- | --- |
| Cost of one button (gzip) | ~229 kB | **~8 kB** | ~5–10 kB | ~30–40 kB |
| Tree-shaking | Non-functional | **Effective** | Per-package | Effective |
| Install footprint | 98 MB | 17.85 MB (97% icons) | 1–5 MB per primitive | ~30 MB |
| RSC / Server Components | Build failure | **Works, 3 components excepted** | `"use client"` in dist | `"use client"` in dist |
| Dialog focus trap | Absent | **Correct by default** | Correct | Correct |
| TypeScript quality | Strong | **Strong** | Strong | Strong |
| Design tokens | Strong (`TOKENS.md`) | Strong | None (unstyled) | Theme object |
| API documentation coverage | ~30% | **100% of exports** | ~100% | ~100% |
| Documentation *depth* | Low | Medium — types and defaults everywhere, prose unevenly | High | High |
| Styling model | Tailwind v4 tokens | Tailwind v4 tokens | Bring your own | Emotion / `sx` |

The instructive comparison remains Radix, since this library wraps it. Last month the verdict was
that the build pipeline discarded everything Radix provided for free — tree-shaking, client
boundaries, focus management. All three have been restored. `1.0.15` costs roughly the same per
component as Radix does, ships client boundaries the same way, and inherits the focus management
correctly.

Against MUI, the bundle behaviour is now clearly better and the token system is arguably cleaner.
MUI still wins decisively on documentation *depth* — a searchable site with prose, live examples
and accessibility notes per component, against a generated Markdown file in a repository.

---

## 16. Final score

```
Documentation & Discovery   8.5 × 15%  = 1.275
Installation & Setup        8.5 × 15%  = 1.275
Core Component API          8.5 × 15%  = 1.275
Composition & Realism       9.0 × 10%  = 0.900
Customization & Theming     9.0 × 10%  = 0.900
TypeScript DX               9.0 × 10%  = 0.900
Accessibility               7.0 ×  8%  = 0.560
Error Recovery              8.0 ×  5%  = 0.400
SSR / Next.js               6.0 ×  7%  = 0.420
Packaging & Performance     9.0 ×  5%  = 0.450
                                       ──────
FINAL                                    8.36
```

**Final score: 8.4 / 10** (was 4.4)

---

## 17. Release recommendation

# `GOOD DX`

*(≥ 8.0 on the CLAUDE.md scale)*

### Critical blocker — flagged independently of the score

**Rendering `Tag`, `Chip` or `Pagination` in a React Server Component fails `next build`,
with no documented workaround.** The rubric treats an App Router build failure without
documentation as a blocker regardless of the numeric score, and this qualifies. Its severity is
lower than `1.0.14`'s equivalent — 53 of 56 modules work, the failure is loud and named at build
time, and adding `"use client"` to the consumer's file resolves it — but the README's own
recommendation steers new users into it.

### Severe, but not blockers

- **`SelectTrigger` has no visible focus indicator** — a WCAG 2.4.7 failure on a core form
  control, in a library that advertises "Accessible by default".
- **`SelectTrigger`'s `label`/`error` are not exposed to assistive technology**, while the
  identical-looking props on `InputText` are.
- **A breaking rename (`Popover`) shipped in a patch release** and is documented as belonging to
  "2.0".

### Assessment

`1.0.14` was diagnosed as a delivery problem sitting on top of a sound design. That diagnosis
held: fixing the build, the package manifest and the documentation moved the package 4.0 points
in one release without redesigning a single component API. Every P0 and P1 from the previous
report is closed.

What remains is a short, concrete list — three unguarded event handlers, one component's focus
and labelling wiring, three missing `@deprecated` tags, one error message naming the wrong
export, and a version number that disagrees with its own documentation. A `1.0.16` addressing
the first two would put this package at roughly 9.0 and remove the last blocker to recommending
it without qualification.

---

## 18. Comparison with Previous Version

### 18.1 Overall score

| | 1.0.14 (2026-07-29) | 1.0.15 (2026-08-05) | Δ |
| --- | ---: | ---: | ---: |
| **Final score** | 4.4 | **8.4** | **+4.0** |
| Release recommendation | `NOT READY` | **`GOOD DX`** | ▲ 3 bands |
| Critical blockers | 6 | **1** | −5 |
| Scenarios scoring ≤ 4 | 9 of 16 | **0 of 16** | −9 |
| Scenarios scoring ≥ 8 | 1 of 16 | **14 of 16** | +13 |

### 18.2 Category scores, before and after

| Category | 1.0.14 | 1.0.15 | Δ | What moved it |
| --- | ---: | ---: | ---: | --- |
| Documentation & Discovery | 4.0 | 8.5 | **+4.5** | `API.md` covering all 56 modules; README rewritten; dead docs link removed and admitted |
| Installation & Setup | 3.5 | 8.5 | **+5.0** | 98 MB → 17.85 MB; dependency classification fixed; both documented CSS paths now work |
| Core Component API | 4.5 | 8.5 | **+4.0** | Dialog focus trap; `TableRow disabled`; `Popover` root rename; unified `onCheckedChange` |
| Composition & Realism | 6.0 | 9.0 | **+3.0** | `toast` re-exported from the package; dashboard composes with the right components |
| Customization & Theming | 5.0 | 9.0 | **+4.0** | `tailwind-merge` applied to `className`; README names the tokens components actually read |
| TypeScript DX | 8.0 | 9.0 | **+1.0** | `@types/react` demoted to an optional peer; `@deprecated` tags added |
| Accessibility | 3.0 | 7.0 | **+4.0** | Focus trap, `aria-invalid`, `aria-sort`, real disabled rows, Korean strings removed — offset by the `Select` defects |
| Error Recovery | 6.0 | 8.0 | **+2.0** | Popover error now names the right export; forgetting the stylesheet is no longer possible on the barrel path |
| SSR / Next.js | 2.0 | 6.0 | **+4.0** | RSC builds now succeed for 53 of 56 modules; hydration clean — still undocumented, still 3 broken components |
| Packaging & Performance | 1.0 | 9.0 | **+8.0** | Tree-shaking works; one button costs 8 kB gzip instead of 229 kB |

### 18.3 Issues fixed — verified by installing 1.0.15, writing code and running it

Every row below was re-tested. None is marked fixed on the basis of a changelog or a README.

| ID | Issue (1.0.14) | How it was fixed | Verification |
| --- | --- | --- | --- |
| **F-02** | Documented stylesheet import silently rendered everything unstyled | `dist/index.js` is now a 2.6 kB barrel whose first line is `import './index.css';` | Both documented paths render `rgb(0,156,224)`, 48px tall, 8px radius, zero console output. `v2/screenshots/s03-readme-js-entry-import.png`, `s03-readme-css-import.png` |
| **F-03** | Tree-shaking non-functional; one button cost 229 kB gzip | Per-component `dist/components/*` entries + `./*` subpath exports + `sideEffects` | Baseline 190.35 kB → `Button` 214.16 kB (+24 kB raw / +8 kB gzip). 0 occurrences of `lexical`, `sonner`, `date-fns`, `embla`, `carousel`, `daypicker` in the bundle |
| **F-04** | `Dialog` had no focus trap or focus management | Radix's default behaviour is no longer suppressed | Keyboard-opened dialog: focus lands inside; 8 Tab presses stay inside (`Cancel → Delete → Close` cycling); Escape closes and restores focus to the trigger |
| **F-05** | Documented `TableRow disabled` did nothing | Real disabling implemented | `aria-disabled="true"`, `data-disabled`, `pointer-events:none`; clicking the row left state unchanged (`selected=b clicks=0` before and after) while an enabled row responded |
| **F-06** | README's theming example was a silent no-op | README rewritten to name `--color-brand` / `--radius-lg` and explain why `--primary`/`--radius` do nothing; `TOKENS.md` `--primary` corrected to `#009ce0` | `.themed` scope → `oklch(0.55 0.2 260)` / 9999px. `TOKENS.md` line 90 now matches `dist/index.css` |
| **F-07** | `className` overrides silently unreliable | `tailwind-merge` applied | `rounded-lg` no longer appears in the final class list; computed radius follows `rounded-full`; `bg-*`, `px-*`, and `Card`'s `p-8 rounded-none` all win |
| **F-08** | 41 hardcoded Korean strings incl. `aria-label`s | Externalised to props with English defaults (`Spinner label='Loading'`, `Tag closeLabel='Remove'`, `InputDate invalidMessage`) | 0 Hangul in the production bundle; 0 in the rendered DOM; only 4 Hangul characters remain in `dist`, all inside source comments |
| **F-09** | Toasts required importing from the phantom dependency `sonner` | `toast` re-exported from the package and documented | `import { toast } from '@echoit/itui.css'` fires a toast into an `aria-live="polite"` region |
| **F-10** | `PopoverRoot` naming inconsistent; error named the wrong export | `Popover` is the root; `PopoverPanel` is the panel; `PopoverRoot` kept as a `@deprecated` alias | Orphan `PopoverContent` throws `` `PopoverPortal` must be used within `Popover` `` — and `Popover` is now the correct import |
| **F-11** | Missing a11y wiring on form and table primitives | Implemented per component | `aria-invalid`+`aria-describedby` on `InputText`; `aria-sort`; `scope="col"`; `<button>` inside sortable `<th>`; `role="menu"`/`menuitem` on `PopoverMenu`; `Button loading` fires 0 submits when activated |
| **F-12** | 98 MB footprint, dependency hygiene | `files:["dist"]`, no sourcemaps, no CJS copy, `@types/react`/`tailwindcss` demoted to peers, umbrella and duplicate icon libraries dropped, all deps caret-ranged, `./package.json` exported | 17.85 MB / 8,495 files; 0 `.map`; 0 `.cjs`; one copy of `@types/react`; `require.resolve('@echoit/itui.css/package.json')` succeeds |
| **F-13** | Docs site unreachable; ~70% of the API undocumented | Dead link removed and replaced with an honest statement; `API.md` generated from source and CI-checked | `API.md`: 56 module sections, 245 export entries — matching the 56 shipped component folders exactly |
| **F-14** | README steered to `Badge`, clipping `"Enterprise"` to `"erp"`; `Tag`/`Chip` undocumented | README opens its component guide with the warning and the correct alternative | `<Tag>` renders "Enterprise" at 74px wide, `clipped: false`. `v2/screenshots/s14-dashboard.png` |

**F-01 (Next.js RSC build failure) is the only 1.0.14 failure not fully closed** — see below.

### 18.4 Issues still present

| ID | Issue | State in 1.0.15 |
| --- | --- | --- |
| **F-01** | Next.js Server Component build failure | **Partially fixed.** The `createContext` crash is gone and 53 of 56 modules prerender. `Tag`, `Chip` and `Pagination` still fail, now with a different error (`Event handlers cannot be passed to Client Component props`). The `"use client"` requirement remains entirely undocumented. |
| F-13 (residual) | No hosted documentation site | `itui.echoit.co.kr` still fails DNS. The README no longer pretends otherwise, and `API.md` covers the gap, but there is still no searchable reference. |
| §9 (residual) | Duplicate component families | README documents all five pairs well; only 2 of 5 carry `@deprecated` in the types. |
| §9 (residual) | Token showcases exported as components | `colors`, `radius`, `shadow`, `spacing`, `typography`, `grid` are still on the main entry. |
| §10 (residual) | Provider requirements undocumented | `Tooltip` still requires `TooltipProvider` with no prose about it — mitigated by a clear runtime error. |

### 18.5 New issues — regression or new?

| ID | Issue | Classification | Reasoning |
| --- | --- | --- | --- |
| **F-15** | `Tag`, `Chip`, `Pagination` fail an RSC build | **Regression in kind, improvement in degree** | In `1.0.14` *every* component failed the RSC build, so these three are not newly broken — but the failure *mode* is new (`Event handlers cannot be passed to Client Component props`, not `createContext is not a function`) and it now looks like an oversight in an otherwise complete client-boundary pass. |
| **F-16** | `SelectTrigger` has no visible focus indicator | **Newly surfaced, not a proven regression** | `1.0.14`'s evaluation did not measure focus indicators on `Select`. The suppression is explicit in the class list (`focus-visible:ring-0`), so it may predate this release. Either way it is unfixed and severe. |
| **F-17** | `SelectTrigger` `label`/`error` not exposed to assistive tech | **New in effect** | The equivalent `InputText` defect (F-11) *was* fixed this release. `Select` was left behind, which turns a uniform gap into an inconsistency between siblings. |
| **F-18** | Breaking `Popover` rename in a patch release, documented as "2.0" | **New** | Introduced by `1.0.15`. Confirmed by comparing the shipped `.d.ts`: `1.0.14` declared `Popover` as a `ForwardRefExoticComponent<PopoverProps & RefAttributes<HTMLDivElement>>`; `1.0.15` declares it as the Radix root. |
| **F-19** | `Tab`'s composition error names `TabsTrigger`/`Tabs` | **New in visibility** | `Tab` is newly promoted as the recommended family this release, so its error message now misdirects toward the legacy `Tabs` the README warns against. |

No functional regression was found in any component that worked in `1.0.14`. Everything that
worked still works, and it works with better semantics.

### 18.6 Recommendations completed

| ID | Recommendation (1.0.14) | Status | Evidence |
| --- | --- | --- | --- |
| **R-01** | Emit `"use client"` and split into per-component entry points | **Done (95%)** | 35 files carry the banner; `./*` subpath exports ship; `Tag`/`Chip`/`Pagination` were missed |
| **R-02** | Fix the two README snippets that break first-run setup | **Done** | Tailwind v4 is now install step 1; both CSS paths documented and both work; the `@source` paragraph is replaced with an explanation of why none is needed |
| **R-03** | Publish the docs site, or inline the API reference | **Done, second option** | `API.md`, generated from source and CI-checked; dead link removed; `TOKENS.md`/`DEVELOPMENT.md` links are absolute |
| **R-04** | Restore Radix's focus management in `Dialog` | **Done** | Focus enters, traps, and restores |
| **R-05** | Make `TableRow disabled` actually disable | **Done** | Plus the leaked container classes on `<tr>` are gone |
| **R-06** | Apply `tailwind-merge` to incoming `className` | **Done** | Verified on `Button`, `Card`, `InputText` |
| **R-07** | Externalise the hardcoded Korean strings | **Done** | 41 → 0, with English defaults exposed as props |
| **R-08** | Add `files` to `package.json`, stop shipping sourcemaps | **Done** | `files:["dist"]`; 0 `.map` files; 98 MB → 17.85 MB |
| **R-09** | Fix dependency classification | **Done** | Peers corrected, umbrella and duplicate icon library dropped, exact pins replaced with ranges, `./package.json` exported, `toast` re-exported |
| **R-10** | Complete the a11y wiring on form and table primitives | **Done for `Input`/`Table`/`Button`/`Popover`; not done for `Select`** | See F-16/F-17 |
| **R-12** | Rename `PopoverRoot` → `Popover` | **Done** — but shipped in a patch release | See F-18 |
| **R-13** | Unify the form event model | **Done** | `onCheckedChange` across `Checkbox`/`Radio`/`Toggle`/`Rating`; `SelectTrigger placeholder` removes the double-placeholder wart |

### 18.7 Recommendations outstanding

| ID | Recommendation | Why it still matters |
| --- | --- | --- |
| R-01 (tail) | `"use client"` on `Tag`, `Chip`, `Pagination` — or gate their `onKeyDown`/`onClick` on `isInteractive` | The last remaining critical blocker |
| R-10 (tail) | Apply the `Input` a11y contract to `SelectTrigger`: associate `label`, wire `error` to `aria-invalid`/`aria-describedby`, restore a focus ring | WCAG 2.4.7 failure plus an unannounced label |
| R-11 | Resolve the duplicate families in the **types**, not only the README | `Tabs`, `Navigation` and the overlay/notification families carry no `@deprecated` signal |
| R-14 | Stop exporting token showcases (`colors`, `radius`, `shadow`, `spacing`, `typography`, `grid`) as components | Unchanged from `1.0.14` |
| — *(new)* | Document the App Router / `"use client"` story | The work is done in the build; it is nowhere in the docs |
| — *(new)* | Fix the version labelling ("2.0" on a 1.0.15 package) and respect semver for the `Popover` rename | Readers cannot tell which version the docs describe |
| — *(new)* | Move the 17.36 MB icon set to its own package or an optional peer | 97% of the install serves a minority of consumers |
| — *(new)* | Fill in the empty prop descriptions in `API.md` | Types and defaults are there; guidance often is not |

### 18.8 Verdict: does 1.0.15 genuinely improve developer experience?

**Yes, decisively, and the improvement is real rather than cosmetic.**

The evidence is that the *measurable* things all moved in the right direction by large margins:
a first component that costs 8 kB gzip instead of 229 kB, an install a fifth of the size, a
documented setup path that produces a styled component instead of a silent blank, an API
reference that covers 100% of exports instead of 30%, a modal that traps focus, a disabled row
that is disabled, and a `className` that wins. Fourteen of sixteen scenarios now score 8 or
above; last month one did.

Two qualifications keep this short of an unreserved recommendation. First, the accessibility
work — the most impressive part of this release — was applied component by component rather than
as a shared contract, and `Select` was missed badly enough to fail a WCAG success criterion.
Second, the release process did not keep pace with the engineering: a breaking rename went out in
a patch version, its documentation cites a "2.0" that does not exist, and the client-boundary
pass that fixed Server Components missed three components without any test catching it — even
though `package.json` advertises `check:client` and `check:rsc` scripts.

Both are process gaps rather than design gaps, which is the same conclusion the previous report
reached about the delivery layer — and that one was closed in a week.

See `FAILURES.md` for full reproductions and `RECOMMENDATIONS.md` for the prioritised fix list.
