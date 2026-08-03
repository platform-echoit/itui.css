# Failures — `@echoit/itui.css@1.0.14`

Every entry below was reproduced against the package installed from the public npm registry.
Environment: Windows 11, Node 24.14.1, npm 11.11.0, React 19.2.8, Vite 8.1.5, TypeScript 6.0.3,
Tailwind 4.3.3, Next.js 16.2.12.

Severity: **P0** blocks adoption · **P1** causes silent wrong behaviour · **P2** significant friction.

---

## F-01 — P0 — Next.js Server Component import fails the production build

**Scenario:** S15 · **Status:** FAIL

### Reproduce

```bash
npx create-next-app@latest next-app --ts --app --no-src-dir --use-npm
cd next-app && npm install @echoit/itui.css
```

`app/page.tsx` (a normal Server Component — no `"use client"`):

```tsx
import { Button, Card, Table } from '@echoit/itui.css'
export default function Page() {
  return <Button variant="primary" size="md">Primary</Button>
}
```

```bash
npx next build
```

### Actual

```
✓ Compiled successfully in 15.6s
  Collecting page data using 6 workers ...
Error: Failed to collect configuration for /
    [cause]: TypeError: (0 , y.createContext) is not a function
        at module evaluation (.next/server/chunks/ssr/next-app_0k9z2i5._.js:1:245585)
> Build error occurred
Error: Failed to collect page data for /
```

Exit code 1.

### Expected

The build succeeds, or the package documents that a `"use client"` boundary is required.

### Root cause

The published `dist` contains no `"use client"` directive. All 56 component modules are
re-exported from a single entry, so importing *any* component — including purely
presentational ones like `Button`, `Card` or `Table` — evaluates modules that call
`React.createContext`, which does not exist in the RSC environment.

### Workaround (undocumented)

Add `"use client"` to every file that imports the package. Verified working:

```
✓ Compiled successfully in 10.9s
✓ Generating static pages (5/5)
Route (app):  ○ /   ○ /_not-found   ○ /client
```

Hydration was clean with zero console errors. The cost is that no consumer page using this
library can be a Server Component.

---

## F-02 — P0 — The documented stylesheet import silently renders everything unstyled

**Scenario:** S03 · **Status:** FAIL

### Reproduce

Follow README §2 "Import Styles" exactly, in a fresh Vite React+TS app:

`src/main.tsx`
```tsx
import '@echoit/itui.css'   // README: "make sure to import the stylesheet in your app entry point"
```

`src/App.tsx` (README "Quick Start", verbatim)
```tsx
import { Button } from '@echoit/itui.css'
export default function App() {
  return <Button variant="primary" size="lg">Click me</Button>
}
```

### Actual

```
Emitted CSS:            1.78 kB   (the Vite template's own CSS — zero library rules)
Occurrences of "bg-brand"    in built CSS: 0
Occurrences of "h-button"    in built CSS: 0
Occurrences of "--color-brand" in built CSS: 0

Button computed style:
  backgroundColor  rgb(240, 240, 240)   <- browser default
  height           21px                 <- browser default
  borderRadius     0px
  padding          1px 6px

Console warnings: NONE
Build warnings:   NONE
```

The button renders carrying every correct class in its `className`
(`bg-brand h-button-lg px-6 py-3 rounded-lg …`) with none of them defined.

Screenshot: `screenshots/s03-readme-literal-unstyled.png`

### Root cause

The bare specifier `@echoit/itui.css` resolves through the `exports` map's `import` condition
to `dist/index.js` — the JavaScript entry — not to `dist/index.css`. The `style` condition is
not consulted by a JavaScript `import` in Vite, webpack or Node.

```
node resolve('@echoit/itui.css') -> .../dist/index.cjs      (not the stylesheet)
```

### Working path

Install Tailwind v4 and the Vite plugin (required, but listed only under "Requirements", not
in the install steps), then import from **CSS**, not JS:

```css
/* src/index.css */
@import 'tailwindcss';
@import '@echoit/itui.css';
```

Result: CSS grows to 135.29 kB and the button renders correctly
(`rgb(0,156,224)`, 48px tall, 8px radius). Screenshot:
`screenshots/s03-tailwind-css-import-styled.png`

### Additional documentation defect

The README's Tailwind v4 section states:

> Tailwind v4 does not scan `node_modules/` by default, so the `@source` directive is required
> for the library's utility classes (e.g. `bg-brand`, `h-button-lg`) to be generated.
> **Without this directive, components will render unstyled.**

…but the accompanying code block contains only the `@import` line — there is no `@source`
directive anywhere in the documentation. A following note then says "Adjust the relative path
in `@source`", referring to a line that does not exist.

Empirically the directive is **not required**. Builds with and without
`@source '../node_modules/@echoit/itui.css/dist'` produced byte-identical output (same content
hash `index-BWHHxPAO.css`, 135.29 kB). So the prose demands a step that is both missing from
the docs and unnecessary.

---

## F-03 — P0 — Tree-shaking does not work; one button costs 229 kB gzip

**Scenario:** S16 · **Status:** FAIL

### Reproduce

Three production Vite builds:

```tsx
// (a) baseline — no library
export default function App() { return <div>baseline</div> }

// (b) one component
import { Button } from '@echoit/itui.css'
export default function App() { return <Button variant="primary">Only</Button> }

// (c) ~25 components (full scenario app)
```

### Actual

| Build | JS | gzip | Δ vs baseline |
| --- | ---: | ---: | ---: |
| (a) baseline React | 190.45 kB | 59.97 kB | — |
| (b) `Button` only | **973.76 kB** | **288.67 kB** | **+783 kB / +229 kB gzip** |
| (c) ~25 components | 1,041.93 kB | 307.78 kB | +67 kB over (b) |

The first component costs 783 kB; the next twenty-four cost 67 kB combined.

Vite emits a size warning on every build:

```
(!) Some chunks are larger than 500 kB after minification.
```

### Proof that unrelated subsystems are included

Scanning the **`Button`-only** production bundle:

| Subsystem | Occurrences |
| --- | ---: |
| `lexical` (rich-text editor) | 113 |
| `sonner` (toasts) | 119 |
| `calendar` | 44 |
| `carousel` | 12 |
| `date-fns` / `daypicker` | 2 / 2 |

None of these are required to render a button.

### Expected

The README states: "🧱 **Tree-shakable** — import only what you use."

### Root cause

`dist/index.js` is a single 17.0 MB module re-exporting all 56 component modules
(`dist/index.cjs` is a second 17.7 MB copy). There are no per-component entry points and no
subpath exports, so a bundler cannot split the graph.

---

## F-04 — P0 — `Dialog` has no focus management and no focus trap

**Scenario:** S05, S12 · **Status:** FAIL (accessibility)

### Reproduce

Open a `Dialog` via keyboard (focus the trigger, press Enter), wait 1.5 s, then press Tab
repeatedly.

### Actual

```
dialog tabindex:              "-1"
aria-modal:                   null
focus inside dialog:          false        <- focus stayed on the trigger button
active element:               BUTTON: "Uncontrolled dialog"
focusable elements in dialog: 3            <- all unreachable

Tab sequence after opening:
  1. "Controlled dialog"  [OUT]
  2. "Popover menu"       [OUT]
  3. "Hover me"           [OUT]
  4. "Overview"           [OUT]
  5. "Overview panel"     [OUT]
  6. "Success toast"      [OUT]
  7. "Error toast"        [OUT]
  8. "Overridden"         [OUT]
```

Focus never enters the dialog and is never trapped. Meanwhile:

```
body { pointer-events: none }   <- mouse IS blocked
overlay present:  true
Escape closes:    true
```

Screenshot: `screenshots/s05-dialog-open.png`

### Impact

The modal is mouse-modal but keyboard-transparent. A keyboard or screen-reader user cannot
reach the dialog's own Cancel/Delete buttons, but *can* tab into the page content behind the
overlay — content that is visually obscured and that mouse users cannot touch. `aria-modal` is
also absent, so assistive technology is not told the rest of the page is inert.

### Expected

Radix Dialog moves focus to the content on open, traps Tab within it, restores focus on close,
and sets `aria-modal="true"`. The README advertises "🦾 Accessible by default — powered by
Radix primitives". This behaviour must be overridden somewhere in the wrapper.

---

## F-05 — P1 — The documented `TableRow disabled` prop has no effect

**Scenario:** S06 · **Status:** FAIL

### Reproduce

```tsx
<TableRow disabled onClick={() => toggleSelection(id)}>
  <TableCell>Initech</TableCell>
</TableRow>
```

The README documents `disabled?: boolean` on `TableRow` (default `false`).

### Actual

```
aria-disabled:    null
data-disabled:    null
attributes:       class            <- the ONLY attribute on the <tr>
pointer-events:   auto
opacity:          1

Click test: background rgb(158,158,158) -> oklch(0.97 0 none)
            row RESPONDED to click: true      <- onClick fired, row became selected
```

The prop's entire effect is applying `bg-neutral-subtle`. It disables nothing: the row remains
clickable, focusable and selectable, and nothing is communicated to assistive technology.

### Related defect

`TableRow` renders a `<tr>` carrying container classes that are meaningless on a table row and
appear to have leaked from the `Table` wrapper:

```
class="border-b border-neutral-subtle overflow-x-auto w-full min-w-0
       shadow-downwards-sm [&>div]:overflow-visible bg-neutral-subtle"
```

`overflow-x-auto`, `w-full`, `min-w-0`, `shadow-downwards-sm` and `[&>div]:overflow-visible`
have no meaningful effect on a `<tr>`.

---

## F-06 — P1 — The README's theming example is a silent no-op

**Scenario:** S09 · **Status:** FAIL

### Reproduce

Use the README's "Theming" snippet verbatim:

```css
:root {
  --primary: oklch(0.55 0.2 260);
  --radius: 0.75rem;
}
```

### Actual

| Scope | Button background | Radius |
| --- | --- | --- |
| Default | `rgb(0,156,224)` | 8px |
| README tokens (`--primary`, `--radius`) | `rgb(0,156,224)` | 8px — **unchanged** |
| TOKENS.md tokens (`--color-brand`, `--radius-lg`) | `oklch(0.55 0.2 260)` | 9999px — **works** |

The custom properties *are* set (`getPropertyValue('--primary')` returns `oklch(55% .2 260)`),
but nothing consumes them.

### Root cause

From the built CSS:

```css
.bg-brand   { background-color: var(--color-brand) }
.rounded-lg { border-radius: var(--radius-lg) }
```

Components read `--color-brand` and `--radius-lg`. The README's example uses `--primary` and
`--radius` — shadcn/ui token names this library does not consume. `TOKENS.md` line 154
documents the correct name.

### Related documentation defects

- `TOKENS.md` line 90 documents `--primary` light as `oklch(0.205 0 0)`; the shipped value is
  `#009ce0`.
- `TOKENS.md` still contains `TODO` placeholder values for `color.surface.hover` and
  `color.surface.pressed`.

---

## F-07 — P1 — `className` overrides are silently unreliable

**Scenario:** S10 · **Status:** PARTIAL

### Reproduce

```tsx
<Button variant="primary" size="md" className="bg-purple-600 rounded-full px-10">
  Overridden
</Button>
```

### Actual

```
final className: "... rounded-lg ... bg-brand ... bg-purple-600 rounded-full px-10"
                      ^^^^^^^^^^         ^^^^^^^^ both library and consumer classes survive

computed backgroundColor: oklch(0.558 0.288 302.321)   ✓ consumer won
computed padding:         12px 40px                    ✓ consumer won
computed borderRadius:    8px                          ✗ consumer LOST (rounded-lg won)
```

### Root cause

Incoming `className` is concatenated onto the library's classes rather than merged, so
conflicting utilities both reach the DOM and the winner is decided by rule order in the
generated stylesheet. `tailwind-merge` is already listed as a dependency of the package but is
evidently not applied to `Button`'s incoming `className`.

### Impact

The failure is silent and per-utility. Because `bg-*` and `px-*` do work, a developer
reasonably concludes overrides are supported and is then blindsided when `rounded-*` is
ignored with no warning.

---

## F-08 — P1 — 41 hardcoded Korean strings ship in the bundle, including a11y labels

**Scenario:** S12 · **Status:** FAIL

### Reproduce

Extract Hangul from the production build:

```bash
node -e "const s=require('fs').readFileSync('dist/assets/index-*.js','utf8');
         console.log([...new Set(s.match(/[가-힣]+/g))].length)"
# -> 41 unique Hangul substrings
```

### Sample

| String | Meaning | Where |
| --- | --- | --- |
| `로딩 중` | "Loading" | `Spinner` `aria-label` |
| `검색어 지우기` | "Clear search" | `InputSearch` |
| `올바른 휴대폰 번호를 입력해주세요` | "Please enter a valid phone number" | `InputPhoneNumber` validation |
| `날짜를 선택해주세요` | "Please select a date" | `InputDate` |
| `파일을 드래그하거나 클릭하여 업로드하세요` | "Drag or click to upload a file" | `InputFileUpload` |
| `지원하지 않는 파일 형식입니다` | "Unsupported file format" | file validation error |
| `굵게` / `기울임` / `밑줄` / `취소선` | Bold / Italic / Underline / Strikethrough | rich-text toolbar |

Confirmed in rendered DOM:

```html
<span role="status" aria-label="로딩 중" class="... animate-spin ..."></span>
```

### Impact

User-facing validation messages and screen-reader labels are hardcoded to Korean with no
documented override or i18n mechanism. For a non-Korean product, the affected components are
unusable in production. This is not mentioned anywhere in the documentation.

---

## F-09 — P2 — Toasts require importing from a phantom dependency

**Scenario:** S08 · **Status:** PARTIAL

The README instructs:

```tsx
import { toast } from 'sonner'
toast.success('Saved!')
```

`sonner` is **not** in the consumer's `package.json` and **not** a `peerDependency` of
`@echoit/itui.css` — it is a transitive dependency. The import resolves here only because npm
hoists it into the root `node_modules`.

Under pnpm's strict `node_modules` layout or Yarn PnP this import fails outright. The library
exports `Toaster` but not `toast`, so there is no supported way to fire a toast without
depending on an undeclared package.

**Fix:** either re-export `toast` from the library, or declare `sonner` a `peerDependency`.

Functionally the toast itself works correctly, including an `aria-live="polite"` region.
Screenshot: `screenshots/s08-toast.png`

---

## F-10 — P2 — Overlay root naming is inconsistent, and the error message points at the wrong export

**Scenario:** S07, S13 · **Status:** PARTIAL

Every overlay family uses the bare name for its root except Popover:

| Family | Root export |
| --- | --- |
| Dialog | `Dialog` |
| Tabs | `Tabs` |
| Tooltip | `Tooltip` |
| Popover | **`PopoverRoot`** — and a *different* component is exported as `Popover` |

Rendering `PopoverContent` outside its root throws:

```
`PopoverPortal` must be used within `Popover`
```

A developer following that message imports `Popover` — which is a different component — and
the error persists. The correct root is `PopoverRoot`.

Other overlay errors are accurate and helpful:

```
`SelectItem` must be used within `Select`
`TooltipPortal` must be used within `Tooltip`
```

Also undocumented: `Tooltip` requires a `TooltipProvider` ancestor, while `Popover` and
`Dialog` require none.

---

## F-11 — P2 — Missing accessibility wiring on form and table primitives

**Scenario:** S12 · **Status:** PARTIAL

| Component | Observed | Should be |
| --- | --- | --- |
| `Input` with `error` | error text visible; `aria-invalid` null, `aria-describedby` null | error announced and linked |
| `TableHead` with `sortDirection` | visual chevron only; `aria-sort` null | `aria-sort="ascending"/"descending"` |
| `<th>` | no `scope` attribute | `scope="col"` |
| Sortable headers | plain `<th>`, not focusable | wrap contents in a `<button>` |
| `Button` with `loading` | `aria-busy="true"` ✓, `pointer-events:none` ✓, but `disabled` false and `aria-disabled` null | also set `disabled` to prevent keyboard double-submit |
| `PopoverItem` | rendered inside `role="dialog"` | `role="menu"` / `role="menuitem"` |

What *is* correct: `Input` label association via `<label for>`, visible 2px brand focus rings,
logical tab order, `role="status"` on the spinner, `aria-live="polite"` on toasts, and
`aria-labelledby`/`aria-describedby` on `Dialog`.

---

## F-12 — P2 — Package footprint and dependency hygiene

**Scenario:** S02 · **Status:** PASS (install succeeds) with significant penalties

```
Installed size:  98 MB          Files: 16,129
dist/index.js    17.0 MB        dist/index.cjs   17.7 MB
index.js.map     20.0 MB        index.cjs.map    20.0 MB   (40 MB of sourcemaps shipped)
dist/icons       22 MB
```

Issues:

- No `files` field in `package.json` — the likely cause of the 98 MB payload.
- 40 MB of sourcemaps shipped to consumers.
- `@types/react@19.2.3` declared as a **runtime dependency**, installing a second copy of
  React's types beside the app's own (`19.2.17`). Should be a `peerDependency` at most.
- `tailwindcss` and `@tailwindcss/vite` declared as **runtime dependencies** — build tooling.
- Both the `radix-ui` umbrella package and seven individual `@radix-ui/react-*` packages.
- Two icon libraries (`lucide-react`, `@phosphor-icons/react`).
- All Radix/Lexical deps pinned to exact versions with no caret, guaranteeing duplicate
  instances for consumers who use Radix directly.
- `./package.json` missing from the `exports` map → `ERR_PACKAGE_PATH_NOT_EXPORTED` for tools
  that resolve it.
- The npm `description` field begins with a literal `> `, a leaked markdown blockquote.

---

## F-13 — P2 — Documentation site is unreachable; ~70% of the API is undocumented

**Scenario:** S01 · **Status:** PARTIAL

```
$ curl https://itui.echoit.co.kr
getaddrinfo ENOTFOUND itui.echoit.co.kr
```

The README presents this as the canonical source — "Full documentation — including component
API, examples, and theming guides" — and it is still annotated `<!-- TODO: update -->` in the
published package.

`dist/index.d.ts` exports **56** component modules; the README documents **17**. The `input`
module alone exports 13 components (`Input`, `InputV2`, `InputText`, `InputSearch`,
`InputPhoneNumber`, `InputWithButton`, `InputDate`, `InputDropdown`, `InputTag`,
`InputTextarea`, `InputTextFormatting`, `InputFileUpload`, …); one is documented.

Also broken from the npm page: `./TOKENS.md` and `./DEVELOPMENT.md` are relative links that
only resolve inside the GitHub repository.

Contradiction: README "Requirements" says **React 19+**, while `peerDependencies` declares
`^18 || ^19`.

**Mitigating factor:** the TypeScript surface is strong enough that undocumented components
are discoverable through autocomplete, and `TOKENS.md` (via GitHub) is genuinely high quality.
Per the evaluation rules this is scored as *weak documentation with acceptable API
discoverability* rather than as an outright failure.

---

## F-14 — P2 — The README steers you to the wrong component, and the right one is undocumented

**Scenario:** S14, S01 · **Status:** PARTIAL

### What happened

Building a dashboard, I needed a small label for a subscription plan ("Enterprise", "Pro",
"Starter"). The README documents exactly one component for this shape — `Badge` — so I used it.

Result (`screenshots/s14-dashboard.png`): the text is clipped inside a small circle.
"Enterprise" renders as **"erp"**, and "Starter" overflows its container.

This is correct behaviour for `Badge`: its variants are `'circle' | 'overflow' | 'dot'`, so it
is a *notification-count* component, not a text label. The mistake was mine.

### Why it is still a finding

The components actually intended for this — `Tag` and `Chip` — exist, are well designed, and
are **entirely absent from the README**:

```ts
export interface TagProps {
  variant?: 'outline' | 'filled'
  size?: 'lg' | 'md' | 'sm'
  selected?: boolean
  disabled?: boolean
  /** When provided, the tag behaves as a button. */
  onClick?: () => void
  /** When provided, renders a trailing close (X) button that calls this handler. */
  onClose?: () => void
  /** Accessible label for the close button. */
  closeLabel?: string
}
```

The JSDoc here is genuinely good — it even prompts the consumer to supply an accessible label
for the close button. But because the docs site is offline (F-13) and the README omits both
components, the only discovery path is scrolling autocomplete and guessing.

The net effect: the README's documented subset actively steers a new developer toward the
wrong component and produces visibly broken UI, while the correct component sits one
undocumented import away. This is the concrete cost of documenting 17 of 56 modules.

### Related

`Tag` and `Chip` have near-identical APIs — `Chip` only adds a `leading` slot. This is another
instance of the duplicate-family problem in DX-REPORT §9; neither is documented, so there is
no guidance on which to reach for.

---

## Excluded — failures caused by evaluator error

Recorded for transparency; **not** counted against the package.

| # | What happened | Resolution |
| --- | --- | --- |
| E-1 | An initial run reported that TypeScript caught *none* of five invalid props. | My fixture's header comment contained the literal string `@ts-nocheck`, which TypeScript honours as a directive and which suppressed all diagnostics for the file. After removing it, all five errors appeared correctly. TypeScript DX is in fact a strength (S11 = 8/10). |
| E-2 | An initial dark-mode test reported that `.dark` had no effect. | I used `bg-primary`/`text-primary`, guessing at token names. The documented page-background tokens are `bg-background`/`text-foreground`. With the correct tokens, dark mode works correctly. |
| E-3 | A Playwright click timed out on a checkbox. | An open Radix Select popper was intercepting pointer events — a test-harness sequencing issue, not a library defect. |
| E-4 | `npm audit` reported 12 high-severity vulnerabilities in the Next.js app. | All originate from `next` → `postcss`/`sharp`. The target package contributed none (`found 0 vulnerabilities` in the Vite app). |
