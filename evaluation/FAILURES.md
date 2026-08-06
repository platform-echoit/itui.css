# Failures — `@echoit/itui.css@1.0.15`

Re-evaluation of 2026-08-05. Every entry was reproduced against the package installed from the
public npm registry into applications created from scratch for this run
(`ui-package-dx-evaluation/v2/`). Nothing here is inferred from a changelog or a README.

Environment: Windows 11, Node 24.14.1, npm 11.11.0, React 19.2.8, Vite 8.2.0, TypeScript 6.0.2,
Tailwind 4.3.3, Next.js 16.3.0 (Turbopack), Playwright 1.62.0.

Severity: **P0** blocks adoption · **P1** causes silent wrong behaviour · **P2** significant friction.

**Status of the 14 failures recorded against `1.0.14`: 13 closed, 1 partially closed.**
The closures are itemised with their verification evidence in
[§ Closed since 1.0.14](#closed-since-1014).

---

## F-15 — P0 — `Tag`, `Chip` and `Pagination` fail a Next.js Server Component build

**Scenario:** S15 · **Status:** FAIL · **Classification:** regression in kind, improvement in
degree (in `1.0.14` *every* component failed; the error is now different and narrower)

### Reproduce

```bash
npx create-next-app@latest next-app --ts --app --no-src-dir --use-npm --tailwind --eslint --import-alias "@/*"
cd next-app && npm install @echoit/itui.css
```

`app/globals.css`
```css
@import '@echoit/itui.css';
```

`app/page.tsx` — an ordinary Server Component, no `"use client"`:
```tsx
import { Tag } from '@echoit/itui.css';
export default function Page() {
  return <Tag>Enterprise</Tag>;
}
```

```bash
npx next build
```

### Actual

```
✓ Compiled successfully in 7.6s
  Running TypeScript ... Finished TypeScript in 3.3s
  Collecting page data using 6 workers ...
  Generating static pages using 6 workers (1/5)
Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error
Error: Event handlers cannot be passed to Client Component props.
  {ref: undefined, className: ..., role: ..., tabIndex: ..., aria-pressed: ...,
   aria-disabled: ..., onClick: ..., onKeyDown: function onKeyDown, children: ...}
                                                ^^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
Export encountered an error on /page: /, exiting the build.
```

Exit code 1.

### Scope — bisected one component at a time against `next build`

| Result | Components |
| --- | --- |
| PASS in an RSC | `Button`, `Card`, `Table` (plain, with `sortDirection`, and with `disabled`), `Spinner`, `Avatar`, `Badge`, `Divider`, `Skeleton`, `Empty`, `Label`, `Progress` |
| **FAIL in an RSC** | **`Tag`**, **`Chip`**, **`Pagination`** |

Log: `v2/logs/17-rsc-bisect.log`, `v2/logs/19-rsc-bisect2.log`.

### Root cause

A static scan of the published `dist` (`v2/logs/18-rsc-scan.log`) finds exactly three files that
carry **no** `"use client"` banner *and* hand a function to a DOM prop unconditionally — the same
three that fail:

```
chip/Chip.js              -> onKeyDown: handleKeyDown, onClick: handleClose
pagination/Pagination.js  -> onClick: () =>
tag/Tag.js                -> onKeyDown: handleKeyDown, onClick: handleClose
```

35 other files in `dist` do carry the banner, so the client-boundary pass was deliberate and
nearly complete. In `Tag.js` the guard exists but is not applied to every handler:

```js
const isInteractive = !!onClick && !disabled;
...
role:          isInteractive ? "button" : void 0,
tabIndex:      isInteractive ? 0 : void 0,
"aria-pressed":isInteractive ? selected : void 0,
onClick:       isInteractive ? () => onClick?.() : void 0,
onKeyDown:     handleKeyDown,          // <- ungated
```

So a purely decorative `<Tag>Enterprise</Tag>` still hands a function across the boundary.

### Impact

The README's component guide opens with:

> Use `Tag` or `Chip` for a status or tier label. `Badge` is the notification counter and
> truncates arbitrary text, so `"Enterprise"` comes out as `"erp"`.

That is correct advice, and it points App Router users at two of the three components they cannot
render on a server page. Nothing in the documentation mentions Server Components, `"use client"`,
or which components are client-only, so the failure arrives as a build error about "Client
Component props" with no route to a cause.

### Workaround (undocumented)

Add `"use client"` to the consumer file that renders `Tag`/`Chip`/`Pagination`. Verified working:
the same page under a `"use client"` boundary builds, prerenders statically and hydrates with zero
console warnings.

### Fix

Either gate `onKeyDown` (and `Pagination`'s `onClick`) on `isInteractive`, or add a `"use client"`
banner to those three files. Both are one-line changes. The repository already ships `check:client`
and `check:rsc` scripts in `package.json`; whatever they assert did not catch this.

---

## F-16 — P0 — `SelectTrigger` has no visible focus indicator

**Scenario:** S12 · **Status:** FAIL (accessibility) · **Classification:** newly surfaced —
`1.0.14`'s run did not measure focus indicators on `Select`, so this may predate `1.0.15`

### Reproduce

```tsx
<Select>
  <SelectTrigger label="Plain" placeholder="no error" data-testid="s12-select-plain" />
  <SelectContent><SelectItem value="a">A</SelectItem></SelectContent>
</Select>
```

Focus it with the keyboard (Tab), then read the computed style.

### Actual

```
unfocused:  outline "none"   border rgb(237,237,237)   box-shadow none
focused:    outline "none"   border rgb(237,237,237)
            :focus-visible matches = true
            box-shadow = rgba(0,0,0,0) 0 0 0 0, … rgb(15,15,15) 0px 0px 0px 0px
                          ^ transparent, and zero spread on the one opaque layer
```

Nothing about the element changes when it receives keyboard focus. Screenshot with the trigger
focused: `v2/screenshots/s12-select-focused.png` — pixel-identical to the unfocused state.

For contrast, `Button` under the same test:

```
focused:    outline "solid 2px rgb(0, 156, 224)"
```

Screenshot: `v2/screenshots/s12-button-focused.png`.

### Root cause

The trigger's own class list suppresses both mechanisms explicitly:

```
group flex items-center justify-between gap-2 h-12 px-3 rounded-lg border overflow-hidden
outline-none cursor-pointer bg-white border-input
focus-visible:ring-0 focus-visible:outline-none            <- here
data-[state=open]:border-brand data-[state=open]:bg-accent
```

The only focus-adjacent styling is `data-[state=open]:border-brand`, which applies when the menu
is **open**, not when the trigger is focused and closed.

### Impact

WCAG 2.1 Success Criterion 2.4.7 (Focus Visible) failure on one of the most common form controls,
in a library whose README advertises "🦾 **Accessible by default**". A keyboard user tabbing
through a form loses their position entirely at every select.

### Expected

A focus ring consistent with `Button`'s (`outline 2px` in `--color-brand`), or the `ring-2` +
`ring-offset` treatment already used on `Checkbox` (`peer-focus-visible:ring-2
peer-focus-visible:ring-brand`).

---

## F-17 — P1 — `SelectTrigger`'s `label` and `error` are invisible to assistive technology

**Scenario:** S04, S12 · **Status:** FAIL · **Classification:** new in effect — the identical
defect on `InputText` (F-11 in the previous report) **was** fixed this release; `Select` was not

### Reproduce

```tsx
<SelectTrigger label="With error" error="Pick something" placeholder="has error" />
```

### Actual — rendered DOM

```html
<div class="flex flex-col gap-2">
  <label class="shrink-0 text-sm font-medium …">With error</label>
  <button type="button" role="combobox" aria-expanded="false" aria-autocomplete="none"
          data-slot="select-trigger" data-size="default" class="…">
```

Measured:

```
label[for]         : null        (the <label> has no `for`)
trigger id         : null        (nothing to point `for` at)
aria-labelledby    : null
aria-invalid       : null
aria-describedby   : null
computed accessible name -> "has error"     <- the PLACEHOLDER, not the label
```

The red border and the "Pick something" message render correctly and are announced to nobody.

### Contrast — `InputText`, same page, same release

```
tag                : INPUT
id                 : "_r_0_"
label[for="_r_0_"] : "Email"                       ✓
aria-invalid       : "true"                        ✓
aria-describedby   : "_r_0_-message"
                     -> "Enter a valid email address"   ✓
```

### Impact

A screen reader announces the select as "has error, combobox" instead of "With error, combobox,
invalid". Since `InputText` and `SelectTrigger` expose the same-looking `label` and `error` props
and sit next to each other in a form, a developer has no reason to suspect one is wired and the
other is not.

### Fix

Generate an id on the trigger, point the `<label>`'s `for` at it (or set `aria-labelledby`), and
when `error` is set emit `aria-invalid="true"` plus `aria-describedby` pointing at the message —
the same contract `InputText` already implements.

---

## F-18 — P1 — A breaking rename shipped in a patch release, documented as "2.0"

**Scenario:** S01, S07, S11 · **Status:** FAIL (release hygiene) · **Classification:** new

### What changed

`1.0.14`, `dist/components/popover/Popover.d.ts`:

```ts
export declare const Popover: import("react").ForwardRefExoticComponent<
  PopoverProps & import("react").RefAttributes<HTMLDivElement>
>;
```

`1.0.15`, same path:

```ts
export declare function Popover(
  props: ComponentProps<typeof PopoverPrimitive.Root>
): JSX.Element;
export declare const PopoverRoot: typeof Popover;
```

`Popover` changed from a DOM panel to the Radix root between two patch versions. Any `1.x` code
containing `<Popover className="…">` stops compiling on `npm update`:

```
error TS2322: Type '{ children: Element[]; className: string; }' is not assignable
              to type 'IntrinsicAttributes & PopoverProps'.
```

### The rename itself is correct

It resolves the top naming complaint from the previous report: the root is now spelled like
`Dialog`, `Tabs` and `Tooltip`, the old name lives on as `PopoverPanel`, and `PopoverRoot` remains
as a `@deprecated` alias. The runtime error that used to point at the wrong export is now accurate.

### The problem is how it shipped

Both the README and `API.md` announce it as a `2.0` change on a package published as `1.0.15`:

> ⚠️ **Renamed in `2.0`.** `Popover` used to be the standalone panel and the root was
> `PopoverRoot`. `PopoverRoot` still works as a `@deprecated` alias, but the panel moved to
> `PopoverPanel` — a `<Popover className="…">` left over from `1.x` no longer typechecks,
> deliberately …

and in `API.md`:

> ⚠️ **Deprecated** — Renamed to `Popover` in 2.0 … This alias is removed in the next minor.

A reader cannot tell whether they are looking at documentation for a version that exists. And a
patch upgrade is the one kind of upgrade a consumer expects never to break compilation.

### Secondary defect

The TypeScript error above does not name the fix. A migrating developer learns `className` is not
allowed, but not that the element they wanted is now `PopoverPanel`. The README explains it; the
compiler does not.

---

## F-19 — P2 — `Tab`'s composition error names the wrong exports

**Scenario:** S07, S13 · **Status:** PARTIAL · **Classification:** new in visibility

### Reproduce

Render a `Tab` part outside its root:

```tsx
<TabTrigger value="a">orphan tab</TabTrigger>
```

### Actual

```
`TabsTrigger` must be used within `Tabs`
```

### Why it is a finding

Neither name is what the developer wrote or what the documentation told them to use. The README's
"Picking between similar names" table is explicit:

> `Tab` · `Tabs` → use **`Tab`** (with `TabList` / `TabTrigger` / `TabContent`). … `Tabs` predates
> it and still paints itself with raw `slate-*` palette classes, so it ignores your theme and your
> dark mode.

`Tabs` is a real export of this library — the legacy one — so the error message reads as an
instruction to migrate *to* the deprecated family. This is the same class of defect as `1.0.14`'s
`` `PopoverPortal` must be used within `Popover` `` problem, which has been fixed; the sibling
messages are all correct now:

```
`SelectItem` must be used within `Select`            ✓ correct
`PopoverPortal` must be used within `Popover`        ✓ correct after the rename
`TooltipPortal` must be used within `Tooltip`        ✓ correct
`Tooltip` must be used within `TooltipProvider`      ✓ correct and genuinely helpful
`TabsTrigger` must be used within `Tabs`             ✗ names Radix internals
```

---

## F-20 — P2 — 17.36 MB of icons are installed for every consumer

**Scenario:** S02, S16 · **Status:** PASS with penalty

```
package total       17.85 MB   8,495 files
dist/icons          17.36 MB   8,208 files   (97.2% of the package)
dist/components        973 kB     56 module folders
dist/index.js        2,652 B
dist/index.css          20 kB
```

The design is right: the 6,615 icons live on their own `./icons` subpath, are deliberately kept
off the main barrel, and appear nowhere in a `Button`-only production bundle. The README explains
the reasoning.

The cost is install and cache footprint. A project that never imports an icon still downloads
17.36 MB and stores 8,208 files, and every CI cache carries them. Splitting them into
`@echoit/itui.icons` (or making that package an optional peer) would take a typical install from
17.85 MB to roughly 500 kB.

This is a large improvement on `1.0.14`'s 98 MB / 16,129 files, so it is recorded as a penalty
rather than a failure.

---

## F-21 — P2 — Silent unstyled rendering remains reachable through the subpath import

**Scenario:** S03, S13 · **Status:** PARTIAL (documented)

### Reproduce

An entry that imports a component by subpath and loads no CSS anywhere:

```tsx
import { Button } from '@echoit/itui.css/button';
createRoot(el).render(<Button variant="primary" size="lg">Subpath import</Button>);
```

### Actual

```
background     rgb(240, 240, 240)   <- browser default
height         21px
borderRadius   0px
classes on the element: 28          <- all present, none defined
document.styleSheets.length: 0
console output: NONE
```

Screenshot: `v2/screenshots/s13-no-stylesheet.png`.

### Why this is only a P2

This was `1.0.14`'s worst defect (F-02), on the *documented* path. It is now impossible to hit
that way: `dist/index.js` begins with `import './index.css';`, so any barrel import loads the
stylesheet as a side effect. The remaining exposure is the subpath route, and the README documents
it precisely, with the fix:

> ⚠️ **Subpath imports carry no CSS.** `import { Button } from '@echoit/itui.css/button'` keeps
> your dev-server module count small (~30 modules instead of ~15,000 through the barrel), but
> pulls in **no** stylesheet. If you only import by subpath, load the CSS once yourself:
> `@import '@echoit/itui.css/dist/index.css';`

A documented trade-off, not a trap — but still the one path whose failure mode is silence.

---

## F-22 — P2 — Residual documentation and typing gaps

**Scenario:** S01, S11 · **Status:** PARTIAL

| Gap | Detail |
| --- | --- |
| No hosted docs site | `https://itui.echoit.co.kr` → `getaddrinfo ENOTFOUND`. The README no longer links to it and says plainly "There is no hosted docs site yet", which is the honest fix, but the reference is a 2,743-line Markdown file on GitHub with no search. |
| `API.md`/`TOKENS.md` not in the tarball | `files` ships `dist` only. Offline consumers get types and nothing else. Stated in the README. |
| Empty prop descriptions | A large share of `API.md` rows read `—`, including `Button.variant`, `Button.size`, `TableRow.selected`. Types and defaults are present; guidance often is not. |
| Only 2 of 5 duplicate families `@deprecated` | Shipped `.d.ts` carries `@deprecated` on `PopoverRoot` and `Input` only. `Tabs`, `Navigation`, and the `Dialog`/`Modal`/`Popup`/`BottomSheet` and `Toast`/`Snackbar` families carry no signal, so autocomplete gives no warning. |
| No accessibility documentation | No keyboard interaction tables, no ARIA notes, no statement of which components manage focus. |
| No Next.js documentation | No mention of the App Router, `"use client"`, or client-only components — despite the client-boundary work being done in the build (see F-15). |
| `require()` error is misleading | `require('@echoit/itui.css')` → `ERR_PACKAGE_PATH_NOT_EXPORTED: No "exports" main defined`. The package *does* define `.`, but only under the `import` condition. The README documents ESM-only; the error does not say so. |
| `Dialog` omits `aria-modal` | Background siblings are `aria-hidden` instead, which achieves the practical result, so this is a nit rather than a defect. |
| `Toggle` has no `label` prop | Labelling requires a manual `aria-label`, unlike `Checkbox` (`label`) and `Radio` (children). |

---

## Closed since 1.0.14

All thirteen entries below were re-verified against `1.0.15` by installing from npm, writing code
against the public documentation, and running it. **No entry is marked closed on the basis of a
changelog, a README claim, or inference.**

| ID | Failure in 1.0.14 | Verification in 1.0.15 |
| --- | --- | --- |
| **F-02** | Documented stylesheet import silently rendered everything unstyled | Both documented paths tested in separate builds. App-entry JS import (`import '@echoit/itui.css'` in `main.tsx`): CSS 100.07 kB emitted, button `rgb(0,156,224)` / 48px / 8px radius, **0 console messages**. CSS-file import (`@import '@echoit/itui.css'`): CSS 109.56 kB, identical computed style. Root cause of the fix: `dist/index.js` is now a 2,652-byte barrel whose first line is `import './index.css';` — in `1.0.14` it was a 17,836,171-byte bundle with no CSS import. |
| **F-03** | Tree-shaking non-functional; one button cost 229 kB gzip | Three production builds. Baseline (no library) 190.35 kB / 59.94 kB gzip → `Button` only 214.16 kB / 67.83 kB gzip = **+23.8 kB raw, +7.9 kB gzip**. Scanning the `Button` bundle: `lexical` 0, `sonner` 0, `carousel` 0, `daypicker` 0, `date-fns` 0, `embla` 0 (was 113/119/12/2/2 respectively). Barrel and subpath builds produced byte-identical output. No Vite chunk-size warning on any build. |
| **F-04** | `Dialog` had no focus management or focus trap | Keyboard open (focus trigger, press Enter), wait 900 ms: `focusInsideDialog: true`, active element `BUTTON: Close`. Eight Tab presses: `IN Cancel → IN Delete → IN Close → IN Cancel …` — never leaves. Escape: dialog removed, `focusRestoredToTrigger: true`, `body pointer-events` back to `auto`. Background siblings are `aria-hidden`. |
| **F-05** | Documented `TableRow disabled` prop had no effect | Disabled row now reports `aria-disabled="true"`, `data-disabled=""`, `pointer-events: none`. Clicking it (forced) left state at `selected=b clicks=0`; clicking an enabled row moved it to `selected=b,a clicks=1`. The leaked container classes are gone — the `<tr>` class list is now `border-b border-neutral-subtle bg-neutral-subtle pointer-events-none text-neutral-disabled`. |
| **F-06** | README's theming example was a silent no-op | Three scopes measured on one page: default `rgb(0,156,224)` / 8px; `--color-brand` + `--radius-lg` → `oklch(0.55 0.2 260)` / 9999px; `--primary` + `--radius` → unchanged. The README now names the first pair and explains why the second does nothing. `TOKENS.md` line 90 documents `--primary` as `#009ce0`, matching `dist/index.css`. |
| **F-07** | `className` overrides silently unreliable | `<Button className="bg-purple-600 rounded-full px-10">` → final class list no longer contains `rounded-lg` or the base `bg-brand` at all; computed background `oklch(0.558 0.288 302.321)`, radius `rounded-full`, padding `12px 40px`. Also verified `<Card className="p-8 rounded-none">` → `padding 32px`, `border-radius 0px`, and `InputText`'s `fieldClassName`/`boxClassName`. |
| **F-08** | 41 hardcoded Korean strings incl. `aria-label`s | Production bundle: **0** unique Hangul substrings. Rendered DOM sweep across every element attribute and all visible text: **0** hits. `Spinner` inside a loading button reports `aria-label="Loading"`. Only 4 Hangul characters remain anywhere in `dist`, all inside source comments in `calendar/Calendar.js` and `calendar/BaseDate.d.ts`. Overrides are now props with English defaults (`Spinner label`, `Tag/Chip closeLabel='Remove'`, `InputDate invalidMessage`, `calendarLabel='Choose date'`). |
| **F-09** | Toasts required importing from the phantom dependency `sonner` | `import { toast } from '@echoit/itui.css'` compiles and fires; `API.md` lists `toast` under "Re-exported from dependencies"; the README documents it. Rendered: `aria-live="polite"` region containing "Saved!". |
| **F-10** | `PopoverRoot` naming inconsistent; error named the wrong export | `Popover` is now the root, `PopoverPanel` the panel, `PopoverRoot` a `@deprecated` alias. Orphan `PopoverContent` throws `` `PopoverPortal` must be used within `Popover` `` — the named export is now the correct one. (The rename's release hygiene is a separate finding, F-18.) |
| **F-11** | Missing a11y wiring on form and table primitives | `InputText` with `error`: `aria-invalid="true"`, `aria-describedby="_r_0_-message"` → "Enter a valid email address". `TableHead sortDirection` → `aria-sort="ascending"`; `sortable` → `aria-sort="none"`; `<th scope="col">`; header content wrapped in `<button type="button">` and Enter toggled the sort. `Button loading` → `aria-busy="true"`, `aria-disabled="true"`, still focusable, and activating it fired **0** submits. `PopoverMenu` → `role="menu"` with 3 `role="menuitem"` children and working ArrowDown navigation. (`Select` was not fixed — F-17.) |
| **F-12** | 98 MB footprint and dependency hygiene | 17.85 MB / 8,495 files. `.map` files: 0 (was 8,055). `.cjs`: none (was a full 17.7 MB second copy). `files: ["dist"]` present. `@types/react` is an optional peer — one copy in the tree, no nested duplicate. `tailwindcss`/`@tailwindcss/vite` no longer runtime deps; `radix-ui` umbrella and the second icon library dropped; 28 deps, **0** exact pins. `require.resolve('@echoit/itui.css/package.json')` resolves. npm `description` no longer starts with `> `. |
| **F-13** | Docs site unreachable; ~70% of the API undocumented | `API.md`: 56 module sections and 245 export entries, matching the 56 shipped `dist/components/*` folders exactly. Generated from source and CI-checked (`docs:api`, `check:docs`). The dead site link is removed; the README states there is no hosted site and links `TOKENS.md`/`DEVELOPMENT.md` by absolute URL. The site itself is still down — recorded as residual in F-22. |
| **F-14** | README steered to `Badge`; `Tag`/`Chip` undocumented | The README's component section now opens with the warning ("`Badge` … truncates arbitrary text, so `\"Enterprise\"` comes out as `\"erp\"`") and both `Tag` and `Chip` have full `API.md` entries. Rebuilt the same dashboard using `Tag`: "Enterprise" renders at 74px, `clipped: false`. |

**F-01 (Next.js Server Component build failure) is the one entry not fully closed** — the
`TypeError: (0, y.createContext) is not a function` crash is gone and 53 of 56 modules prerender,
but three components still fail. It is carried forward as F-15.

---

## Excluded — failures caused by evaluator error

Recorded for transparency; **not** counted against the package.

| # | What happened | Resolution |
| --- | --- | --- |
| E-1 | The first S13 run reported that orphan overlay parts rendered "without complaint", implying error messages had regressed. | My error boundary rendered its status message but never rendered `this.props.children`, so nothing was ever mounted to throw. After fixing it, four of five cases produced accurate messages. |
| E-2 | `<Radio name="r" value="one" label="Radio one" />` failed to typecheck and threw at runtime. | `Radio` is a Radix radio-group item: it takes its label as `children` and must sit inside `RadioGroup`. My usage was wrong on both counts. The runtime error pointed at `useRadioGroupContext`, which was accurate. |
| E-3 | An initial `Breadcrumb` RSC test failed. | I passed an `items` prop that does not exist. `Breadcrumb.js` carries a `"use client"` banner and is not among the RSC-unsafe components. |
| E-4 | A `tsc` run under a standalone `tsconfig` failed with `TS5101: Option 'baseUrl' is deprecated`. | TypeScript 6 harness issue on my side, not the package. Re-run with a config extending the app's own. |
