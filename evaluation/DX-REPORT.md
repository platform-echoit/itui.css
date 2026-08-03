# Developer Experience Report — `@echoit/itui.css`

**Final score: 4.4 / 10 — `NOT READY`**
Evaluated 2026-07-29 against version `1.0.14` installed from the public npm registry.

---

## 1. Executive summary

`@echoit/itui.css` has a genuinely good core: a large, coherent component set built on Radix
primitives, an excellent TypeScript surface, and a design-token system (`TOKENS.md`) that is
better documented than most libraries of this size. A full realistic dashboard — sidebar,
stat cards, sortable table, modal, toasts, dark mode — was assembled and rendered correctly,
and it typechecked clean on the first attempt.

It is nonetheless **not ready for external adoption**, for reasons that are mostly about
*delivery* rather than *design*:

- **The documented first-run path does not work.** Following the README literally produces a
  completely unstyled UI, silently, with no warning of any kind.
- **The documentation site is offline.** The README's only link to "full documentation"
  (`https://itui.echoit.co.kr`) does not resolve, and it is still marked `<!-- TODO: update -->`.
  With ~70% of the exported API undocumented in the README, that link is load-bearing.
- **Next.js App Router is a hard build failure.** Importing the package from a Server
  Component crashes `next build`. The workaround is undocumented.
- **Tree-shaking does not work.** One `Button` costs 229 kB gzip and drags in a rich-text
  editor. The README advertises the opposite.
- **Modal dialogs have no focus trap**, which is a serious accessibility regression against
  the Radix primitives the library is built on and advertises.

None of these are architectural dead-ends. They are packaging, build-config and documentation
defects, and a focused effort could plausibly move this package into the 7–8 range without
redesigning a single component API. The component design itself is largely sound.

**A new developer could not adopt this package today without help from the maintainers.**
The single blocking reason is that the documented setup instructions do not produce a working
result and fail silently, and the documentation site that would correct them is down.

---

## 2. Package / version tested

| Field | Value |
| --- | --- |
| Package | `@echoit/itui.css` |
| Version | `1.0.14` (published 2026-07-29) |
| Registry | public npm |
| Install command | `npm install @echoit/itui.css` |
| License | ISC |
| Repository | `github.com/platform-echoit/itui.css` (public) |
| Declared peers | `react ^18 \|\| ^19`, `react-dom ^18 \|\| ^19` |
| Unpacked size | 84.8 MB published / **98 MB on disk**, 16,129 files |
| Exports | 56 component modules from a single entry point |

---

## 3. Environment

| Tool | Version |
| --- | --- |
| OS | Windows 11 Pro 10.0.26200 |
| Node.js | v24.14.1 |
| npm | 11.11.0 |
| Vite | 8.1.5 |
| TypeScript | 6.0.3 |
| React / React DOM | 19.2.8 |
| Tailwind CSS | 4.3.3 |
| Next.js | 16.2.12 (App Router, Turbopack) |
| Playwright | 1.62.0 (Chromium) |

Two isolated applications were created: a Vite React+TS app (`app/`) and a Next.js App Router
app (`next-app/`). Both installed the package from npm. No local checkout, link or file
dependency was used at any point.

---

## 4. Installation experience

The install itself is clean:

```
$ npm install @echoit/itui.css
added 152 packages, and audited 180 packages in 46s
found 0 vulnerabilities
```

No peer warnings, no postinstall scripts, no manual remediation. That part is a genuine pass.

The problems are in what arrives:

| Measurement | Value | Comment |
| --- | --- | --- |
| On-disk size | **98 MB** | For comparison, MUI is roughly 30 MB; individual Radix packages are 1–5 MB |
| File count | **16,129** | 8,055 `.map` files, 8,053 `.d.ts` files |
| `dist/index.js` | 17.0 MB | The entire library as one module |
| `dist/index.cjs` | 17.7 MB | A second full copy |
| Sourcemaps shipped | **40 MB** | `index.js.map` + `index.cjs.map`, of no value to consumers |
| `dist/icons` | 22 MB | |

Dependency hygiene also needs attention. The following are declared as **runtime
`dependencies`**, so every consumer installs them:

- `@types/react@19.2.3` — a type-only package, and it installs a **second copy** of React's
  types alongside the app's own (`19.2.17` here). This is a well-known source of confusing
  JSX type errors.
- `tailwindcss@4.2.3` and `@tailwindcss/vite@4.2.3` — build tooling, not runtime code.
- Both the `radix-ui` umbrella package **and** seven individual `@radix-ui/react-*` packages.
- Two icon libraries: `lucide-react` and `@phosphor-icons/react`.

All Radix and Lexical dependencies are pinned to exact versions with no caret range, which
will cause duplicate-instance problems for consumers who also use Radix directly.

There is no `files` field in `package.json`, which is the most likely cause of the 98 MB
footprint. `./package.json` is also absent from the `exports` map, which breaks tools that
resolve it (`ERR_PACKAGE_PATH_NOT_EXPORTED`).

---

## 5. Scenario score table

| ID | Scenario | Status | Score |
| --- | --- | --- | ---: |
| S01 | Discover the API from public documentation | PARTIAL | 4 |
| S02 | Install from npm into a fresh project | PASS | 4 |
| S03 | Render the first component (time to first pixel) | **FAIL** | 3 |
| S04 | Build a realistic form | PASS | 7 |
| S05 | Modal / Dialog flow | PARTIAL | 3 |
| S06 | Data table | PARTIAL | 3 |
| S07 | Overlay composition (Popover / Tooltip / Tabs) | PASS | 5 |
| S08 | Toasts | PARTIAL | 5 |
| S09 | Theming via design tokens | PARTIAL | 6 |
| S10 | Per-instance customization / `className` override | PARTIAL | 4 |
| S11 | TypeScript DX | PASS | **8** |
| S12 | Accessibility defaults | **FAIL** | 3 |
| S13 | Error recovery / mistake tolerance | PASS | 6 |
| S14 | Realistic application screen | PASS | 7 |
| S15 | Next.js App Router / SSR | **FAIL** | 2 |
| S16 | Packaging, build output, tree-shaking | **FAIL** | 1 |

---

## 6. Category score table

| Category | Score | Weight | Contribution |
| --- | ---: | ---: | ---: |
| Documentation & Discovery | 4.0 | 15% | 0.60 |
| Installation & Setup | 3.5 | 15% | 0.53 |
| Core Component API | 4.5 | 15% | 0.68 |
| Composition & Realism | 6.0 | 10% | 0.60 |
| Customization & Theming | 5.0 | 10% | 0.50 |
| TypeScript DX | 8.0 | 10% | 0.80 |
| Accessibility | 3.0 | 8% | 0.24 |
| Error Recovery | 6.0 | 5% | 0.30 |
| SSR / Next.js | 2.0 | 7% | 0.14 |
| Packaging & Performance | 1.0 | 5% | 0.05 |
| **Weighted total** | | | **4.43** |

---

## 7. Top 10 DX problems

### 1. The documented stylesheet import silently produces an unstyled UI — *critical*

README step 2 says:

> If you are not using the `@import` method above, make sure to import the stylesheet in your
> app entry point (e.g., `main.tsx` or `_app.tsx`): `import '@echoit/itui.css';`

That specifier resolves through the `import` condition to `dist/index.js` — the JavaScript
entry — **not** to the stylesheet. Measured result of following the README exactly:

```
Button computed style: height 21px, border-radius 0px, background rgb(240,240,240)
Library CSS rules in output: 0     (emitted CSS was 1.78 kB — the Vite template's own)
Console warnings: none
```

The button renders with every Tailwind class present in `className` (`bg-brand`,
`h-button-lg`, `px-6`) and none of them defined. There is no error, no warning, and no hint.
This is the single worst DX defect found: the documented happy path fails silently.

### 2. Next.js App Router Server Components crash the build — *critical*

```
Error: Failed to collect page data for /
[cause]: TypeError: (0 , y.createContext) is not a function
```

The published `dist` contains no `"use client"` directive, and the single barrel entry pulls
context-using modules into any importing module. Because everything is exported from one
entry, even a purely presentational `Button` or `Card` is unusable in an RSC.

Adding `"use client"` to every consumer file fixes it — the build then succeeds, pages
prerender, and hydration is clean with zero console errors. But nothing in the documentation
mentions App Router, `"use client"`, or RSC; the README's only Next.js reference is the
Pages Router `_app.tsx`.

### 3. Tree-shaking does not work, contrary to the README — *critical*

The README advertises "🧱 **Tree-shakable** — import only what you use". Measured:

| Build | JS bundle | gzip | Delta |
| --- | ---: | ---: | ---: |
| Baseline React app, no library | 190 kB | 60 kB | — |
| `import { Button }` only | **974 kB** | **289 kB** | **+783 kB / +229 kB gzip** |
| ~25 components | 1,041 kB | 308 kB | +67 kB |

Adding twenty-four more components costs 67 kB, while the *first* component costs 783 kB —
the barrel drags in everything. A `Button`-only bundle verifiably contains the Lexical
rich-text editor, `sonner`, `date-fns`, calendar and carousel code.

### 4. Dialog has no focus management or focus trap — *critical accessibility defect*

Opening a modal via keyboard and waiting 1.5 s:

```
aria-modal:              null
focus inside dialog:     false     (focus stayed on the trigger)
focusable elements in dialog: 3    (all unreachable by keyboard)
tab sequence after open: Controlled dialog [OUT] → Popover menu [OUT] → Hover me [OUT]
                         → Overview [OUT] → Success toast [OUT] → ...
```

Focus never enters the dialog and never gets trapped. Meanwhile `body { pointer-events: none }`
blocks the mouse. The result is a modal that is mouse-modal but keyboard-transparent — the
worst combination, because keyboard and screen-reader users can interact with content they
cannot see is behind an overlay, while being unable to reach the dialog's own buttons.

Radix Dialog handles all of this correctly by default, so this behaviour must be overridden
somewhere in the wrapper. It directly contradicts "🦾 Accessible by default — powered by
Radix primitives".

### 5. Roughly 70% of the public API is undocumented

`dist/index.d.ts` exports **56 component modules**. The README documents **17**.

Undocumented modules include: `accordion`, `bottom-sheet`, `breadcrumb`, `bubble`, `calendar`,
`carousel`, `chip`, `colors`, `divider`, `dropdown-menu`, `floating-button`, `gnb`, `grid`,
`label`, `list`, `lnb`, `modals`, `navigation`, `navigation-v2`, `overflow-menu`, `pagination`,
`popup`, `progress`, `radio`, `radius`, `rating`, `select`, `shadow`, `skeleton`, `slider`,
`snackbar`, `spacing`, `stepper`, `tab`, `tabs`, `tag`, `toggle`, `tooltip`, `typography`.

The `input` module alone exports **13** components (`Input`, `InputV2`, `InputText`,
`InputSearch`, `InputPhoneNumber`, `InputWithButton`, `InputDate`, `InputDropdown`, `InputTag`,
`InputTextarea`, `InputTextFormatting`, `InputFileUpload`, …); the README documents one.

Because the documentation site is offline, TypeScript autocomplete is currently the *only*
way to discover these. Per the evaluation rules, that makes documentation weak but API
discoverability acceptable — and the types are good enough to carry it. But the burden is
entirely on the consumer.

The concrete cost showed up while building the dashboard (F-14). Needing a small plan label,
I used `Badge` — the only component of that shape in the README — and got clipped text
("Enterprise" rendered as "erp"), because `Badge` is a notification-count component. The
right components, `Tag` and `Chip`, are well designed with good JSDoc and are documented
nowhere. The documented subset actively steered toward the wrong choice.

### 6. The README's own theming example does not work

The README's theming section says to override `--primary` and `--radius`. Measured with
exactly that snippet:

| Scope | Background | Radius |
| --- | --- | --- |
| Default | `rgb(0,156,224)` | 8px |
| README's `--primary` / `--radius` override | `rgb(0,156,224)` | 8px — **no change** |
| `--color-brand` / `--radius-lg` (from TOKENS.md) | `oklch(0.55 0.2 260)` | 9999px — **works** |

The components consume `--color-brand` and `--radius-lg`; the README's example uses shadcn/ui
token names the library does not read. The theming *system* is good and `TOKENS.md` documents
the correct names — the README example appears to be copy-pasted from another project. A
developer following the headline feature ("🎨 Token-driven theming") gets a silent no-op.

`TOKENS.md` has its own smaller mismatch: it documents `--primary` as `oklch(0.205 0 0)` in
light mode, but the shipped value is `#009ce0`. It also still contains `TODO` placeholder
values for `color.surface.hover` and `color.surface.pressed`.

### 7. `className` overrides are unreliable — classes are concatenated, not merged

```
<Button variant="primary" className="bg-purple-600 rounded-full px-10" />

final class list: "... rounded-lg ... bg-brand ... bg-purple-600 rounded-full px-10"
computed:  background oklch(0.558 …) ✓ won
           padding    12px 40px      ✓ won
           radius     8px            ✗ LOST — rounded-lg beat rounded-full
```

Both `rounded-lg` and `rounded-full` survive into the class list, so which one wins is decided
by stylesheet order, not by the consumer. `tailwind-merge` is already a dependency but is
evidently not applied to `Button`'s incoming `className`. The failure is silent and
per-utility, which is worse than a consistent failure — `bg-*` works, so a developer
reasonably assumes `rounded-*` will too.

### 8. The documented `TableRow disabled` prop does nothing

The README documents `disabled` on `TableRow`. Measured on a row rendered with `disabled`:

```
aria-disabled:  null
data-disabled:  null
pointer-events: auto
opacity:        1
click test:     row still fires onClick and still becomes selected
```

The prop's entire effect is a grey background (`bg-neutral-subtle`, which renders
`rgb(158,158,158)`). It disables nothing. A documented API with no functional effect is worse
than a missing one, because it fails review rather than compilation.

Separately, `TableRow` renders a `<tr>` carrying `overflow-x-auto w-full min-w-0
shadow-downwards-sm [&>div]:overflow-visible` — container classes that are meaningless on a
table row and look like they leaked from the `Table` wrapper.

### 9. 41 hardcoded Korean strings ship in the bundle, including accessibility labels

Extracted from the production build:

```
로딩 중                              (Spinner aria-label — "Loading")
검색어 지우기                         (InputSearch — "Clear search")
올바른 휴대폰 번호를 입력해주세요        (InputPhoneNumber validation message)
날짜를 선택해주세요                    (InputDate — "Please select a date")
파일을 드래그하거나 클릭하여 업로드하세요  (InputFileUpload)
지원하지 않는 파일 형식입니다           (file-type validation error)
굵게 / 기울임 / 밑줄 / 취소선           (rich-text editor toolbar labels)
```

These are user-facing validation messages and screen-reader labels with no documented
override or i18n mechanism. For any non-Korean consumer this makes the affected components
unusable in production, and it is not mentioned anywhere in the documentation.

### 10. Phantom dependency: toasts require importing from `sonner`

The README instructs consumers to `import { toast } from 'sonner'`. `sonner` is a transitive
dependency of the library — it is neither in the consumer's `package.json` nor a
`peerDependency`. It resolves here only because npm hoists it to the root `node_modules`. Under
pnpm's strict layout or Yarn PnP this import fails outright. The library exports `Toaster` but
not `toast`, so there is no supported way to fire a toast.

---

## 8. Top 10 strengths

1. **TypeScript quality is genuinely excellent.** Named, exported union types (`ButtonVariant`,
   `ButtonSize`, `PopoverPlacement`, `SortDirection`, `CheckboxSize`), JSDoc on non-obvious
   props, and precise diagnostics — including a spelling suggestion:
   `Property 'labell' does not exist … Did you mean 'label'?`
2. **A 7-file app using ~25 components typechecked clean on the first attempt**, with no
   `any`, no casts and no `@ts-expect-error`. That is rare and worth protecting.
3. **`TOKENS.md` is a real asset** — 1,651 lines mapping every token to its CSS variable,
   light/dark values and the Tailwind class that consumes it. Better than most libraries of
   this size ship.
4. **The theming system works well** once the correct token names are used. Scoped overrides
   apply correctly to nested subtrees, not just `:root`.
5. **Dark mode works correctly and scopes properly.** Applying `.dark` to a nested container
   flipped `bg-background` white → `#0f0f0f` and `text-foreground` correctly.
6. **Runtime composition errors are clear and actionable**, inherited from Radix:
   `` `SelectItem` must be used within `Select` ``.
7. **The install is clean** — 47 s, no peer warnings, no postinstall scripts, no vulnerabilities.
8. **Hydration is clean in Next.js.** Once `"use client"` is applied, both pages prerendered
   statically with zero hydration warnings or console errors.
9. **Good escape hatches on `Input`** — `fieldClassName` and `boxClassName` are documented in
   JSDoc with an explanation of when to reach for each. More libraries should do this.
10. **The component set is broad and composes naturally.** A realistic dashboard came together
    without fighting the library, and the `Card`/`Sidebar`/`Table` compound APIs feel idiomatic.

---

## 9. Most confusing APIs

| API | Problem |
| --- | --- |
| `PopoverRoot` vs `Popover` | Every other overlay family uses the bare name for its root (`Dialog`, `Tabs`, `Tooltip`). Popover's root is `PopoverRoot`, and a **different** component is exported as `Popover`. The runtime error compounds this: `` `PopoverPortal` must be used within `Popover` `` names the wrong export. |
| `Input` vs `InputV2` | Both are exported with no documented difference or migration guidance. |
| `navigation` vs `navigation-v2` | Same problem, same lack of guidance. |
| `tab` vs `tabs` | Two separate modules, both exported. |
| `dialog` / `modals` / `popup` / `bottom-sheet` | Four overlapping overlay families with no documented decision criteria. |
| `toast` vs `snackbar` | Two notification systems. |
| Checkbox vs Select event model | `Checkbox` uses native `onChange(e.target.checked)`; `Select` uses Radix's `onValueChange(value)`. Two paradigms in one form. |
| `Select` placeholder | Must be passed twice — once to `SelectTrigger`, once to `SelectValue`. |
| Provider requirements | `Tooltip` requires `TooltipProvider`; `Popover` and `Dialog` require none. Undocumented. |
| `colors` / `radius` / `shadow` / `spacing` / `typography` / `grid` | Exported as *components* from the main entry, alongside real UI components. |

---

## 10. Documentation gaps

- **The documentation site is down.** `https://itui.echoit.co.kr` → `getaddrinfo ENOTFOUND`.
  It is still marked `<!-- TODO: update -->` in the published README.
- **The `@source` instructions are self-contradictory.** The prose insists the directive is
  required — *"Without this directive, components will render unstyled"* — the code block
  omits it entirely, and a follow-up note tells you to "adjust the relative path in `@source`"
  in a snippet that has no `@source`. Empirically the directive is **not** needed: builds with
  and without it produced byte-identical CSS (same content hash).
- **No Next.js App Router documentation at all**, despite it being the default Next.js
  architecture. No mention of `"use client"`.
- **Tailwind v4 is a hard requirement but is not in the install steps.** It appears only under
  "Requirements" at the bottom. Without it the components render unstyled.
- **Relative doc links break on npm.** `./TOKENS.md` and `./DEVELOPMENT.md` resolve only inside
  the GitHub repo.
- **Contradictory React requirement.** "Requirements: React 19+" vs `peerDependencies: ^18 || ^19`.
- **No accessibility documentation** — no keyboard interaction tables, no ARIA notes.
- **No i18n documentation**, despite hardcoded Korean strings.
- **No bundle-size or tree-shaking guidance**, despite the tree-shaking claim.
- **No migration guidance** for any of the `V2`/versioned component pairs.
- The npm `description` field begins with a literal `> ` — a leaked markdown blockquote.

---

## 11. TypeScript findings

This is the package's strongest dimension and the reason the overall score is not lower.

**What works.** Deliberate mistakes produced precise, actionable diagnostics:

```
error TS2322: Type '"danger"' is not assignable to type 'ButtonVariant | undefined'.
error TS2322: Type '"xl"' is not assignable to type 'ButtonSize | undefined'.
error TS2322: Type 'string' is not assignable to type 'boolean | undefined'.
error TS2322: Property 'labell' does not exist on type '… & InputProps & …'.
              Did you mean 'label'?
error TS2322: Type '"middle-center"' is not assignable to type 'PopoverPlacement | undefined'.
```

Types are exported alongside components (`InputProps`, `ButtonVariant`, `SortDirection`), props
extend the correct native element attributes, and `Omit` is used correctly where a prop
collides with a native one (`Omit<InputHTMLAttributes, 'prefix'>`).

**Risks.**

- Shipping `@types/react` as a **runtime dependency** installs a second copy of React's types
  (`19.2.3` nested vs `19.2.17` at the app root). It did not break this evaluation, but it is a
  well-known cause of intractable JSX type errors and should be a `peerDependency` at most.
- Mixed ref patterns: `Button`/`Input` use `forwardRef`; `Table` uses the React 19 `ref`-as-prop
  style. Harmless but inconsistent.
- Composition errors (an overlay part outside its root) are not caught at the type level. This
  matches Radix's own behaviour and is not counted against the package.

> **Evaluator correction.** An initial run reported that *no* invalid props were caught. That
> was my own bug: a comment in the fixture file contained the literal string `@ts-nocheck`,
> which TypeScript honours as a directive, suppressing all diagnostics for the file. Once
> removed, every expected error appeared. This is excluded from scoring.

---

## 12. Customization findings

| Mechanism | Result |
| --- | --- |
| Design tokens via CSS custom properties | **Works** — with `TOKENS.md` names, not the README's |
| Scoped token overrides (non-`:root`) | **Works** |
| Dark mode via `.dark` | **Works**, including on nested containers |
| `className` on `Button` | **Unreliable** — `bg-*` and `px-*` win, `rounded-*` silently loses |
| `fieldClassName` / `boxClassName` on `Input` | **Works**, and is well documented in JSDoc |
| `asChild` polymorphism | **Works** on `DialogTrigger`, `PopoverTrigger`, `TooltipTrigger` |

The headline problem is the missing class merge. Because `tailwind-merge` is already a
dependency, this looks like a one-line fix in the component's class composition rather than a
design flaw — but until it lands, per-instance customization cannot be trusted, and the
failure mode is silent.

---

## 13. Accessibility findings

**Correct by default:**

- `Input` associates its label properly (`<label for>` ↔ `input id`), auto-generating the id.
- Focus rings are visible and use a brand-coloured 2px outline.
- Tab order through a realistic form was logical.
- Toasts render into an `aria-live="polite"` region.
- `Dialog` sets `role="dialog"`, `aria-labelledby` and `aria-describedby`.
- The loading spinner uses `role="status"`.
- `Button loading` sets `aria-busy="true"` and `pointer-events: none`.

**Defects:**

| Issue | Impact |
| --- | --- |
| **`Dialog` has no focus trap and never moves focus into itself** | Critical. Keyboard users cannot reach the dialog's buttons and can tab through the page behind it. `aria-modal` is also absent. |
| `Input error` sets no `aria-invalid` and no `aria-describedby` | The error text is visible but invisible to screen readers. |
| `TableHead sortDirection` sets no `aria-sort` | Sort state is conveyed only by a visual chevron. |
| Sortable headers are not buttons and `<th>` has no `scope` | Sorting is mouse-only and unreachable by keyboard. |
| `TableRow disabled` is purely cosmetic | No `aria-disabled`; the row remains fully interactive. |
| `Button loading` does not set `disabled` or `aria-disabled` | Only the mouse is blocked; the button stays keyboard-activatable during submission, allowing double-submit. |
| Hardcoded Korean `aria-label`s | Screen readers announce Korean to all users regardless of locale. |
| `PopoverItem`s render inside `role="dialog"` rather than a menu role | Menu semantics are lost. |

The gap between "powered by Radix primitives" and the delivered accessibility is the most
disappointing finding in this evaluation, because the underlying primitives already implement
most of this correctly.

---

## 14. Next.js / SSR findings

**Server Components: hard failure.**

```
✓ Compiled successfully in 15.6s
  Collecting page data ...
Error: Failed to collect configuration for /
  [cause]: TypeError: (0 , y.createContext) is not a function
Build error occurred
```

`next build` exits 1. The published bundle carries no `"use client"` directive, so React's
client-only APIs are evaluated in the RSC environment. Because all 56 modules are exported
from a single entry, this affects *every* component — including presentational ones like
`Button`, `Card` and `Table` that have no client-side behaviour at all.

**With `"use client"`: works well.**

```
✓ Compiled successfully in 10.9s
✓ Generating static pages (5/5)
Route (app):  ○ /   ○ /_not-found   ○ /client      (all static)
```

Both pages prerendered, components rendered fully styled, and there were **zero hydration
warnings or console errors** — genuinely clean once past the boundary problem. The CSS path
(`@import '@echoit/itui.css'` in `globals.css` with `@tailwindcss/postcss`) worked without
modification.

**Cost and documentation.** The client page transferred 961 kB of JavaScript. And because the
requirement is undocumented, a developer's first Next.js experience is a build failure with a
minified stack trace and no obvious cause.

---

## 15. Comparison against MUI / Radix

Enough evidence was gathered for a fair comparison on packaging, SSR and accessibility. No
visual comparison was made, per the evaluation rules.

| Dimension | `@echoit/itui.css` | Radix UI | MUI |
| --- | --- | --- | --- |
| Cost of one button (gzip) | **~229 kB** | ~5–10 kB | ~30–40 kB |
| Tree-shaking | Non-functional | Per-package, effective | Effective with named imports |
| Install footprint | 98 MB | 1–5 MB per primitive | ~30 MB |
| RSC / Server Components | **Build failure** | `"use client"` in dist; works | `"use client"` in dist; works |
| Dialog focus trap | **Absent** | Correct by default | Correct by default |
| TypeScript quality | **Strong** | Strong | Strong |
| Design tokens | **Strong** (`TOKENS.md`) | None (unstyled) | Theme object |
| API documentation coverage | ~30% | ~100% | ~100% |
| Styling model | Tailwind v4 tokens | Bring your own | Emotion / `sx` |

The instructive comparison is with Radix, since this library wraps it. Radix ships each
primitive as its own package with a `"use client"` banner, which is exactly why it
tree-shakes and works in RSC. `@echoit/itui.css` re-bundles those primitives into a single
17 MB entry point and loses both properties in the process — along with the focus management
Radix provided for free. The component design inherits Radix's strengths; the build pipeline
discards them.

Against MUI, the token system is arguably cleaner and the TypeScript surface is comparable,
but MUI's documentation coverage and bundle behaviour are in a different league.

---

## 16. Final score

```
Documentation & Discovery   4.0 × 15%  = 0.60
Installation & Setup        3.5 × 15%  = 0.53
Core Component API          4.5 × 15%  = 0.68
Composition & Realism       6.0 × 10%  = 0.60
Customization & Theming     5.0 × 10%  = 0.50
TypeScript DX               8.0 × 10%  = 0.80
Accessibility               3.0 ×  8%  = 0.24
Error Recovery              6.0 ×  5%  = 0.30
SSR / Next.js               2.0 ×  7%  = 0.14
Packaging & Performance     1.0 ×  5%  = 0.05
                                       ──────
FINAL                                    4.43
```

**Final score: 4.4 / 10**

---

## 17. Release recommendation

# `NOT READY`

*(< 5.0 on the CLAUDE.md scale)*

### Critical blockers — flagged independently of the score

1. **Next.js App Router Server Component import is a hard build failure**, with no documented
   workaround. This blocks the most common React architecture in use today.
2. **The documentation site is unreachable** (`itui.echoit.co.kr`, DNS failure), and ~70% of
   the exported API is documented nowhere else.
3. **The documented stylesheet import silently produces an unstyled application.** Silent
   failure on the primary setup path is the highest-severity documentation defect possible.
4. **`Dialog` has no focus trap and never moves focus into itself**, locking keyboard and
   screen-reader users out of modal content.
5. **The documented `TableRow disabled` prop has no functional effect.**
6. **Tree-shaking is non-functional** — 229 kB gzip for a single button — while the README
   advertises the opposite.

### The path forward is short

Every blocker above is a build-configuration, packaging or documentation defect. None require
redesigning a component API. Specifically: adding `"use client"` banners and per-component
entry points to the build would resolve blockers 1 and 6; publishing the docs site and fixing
two README snippets would resolve 2 and 3; and 4 and 5 are bugs in two components.

The underlying component design, the TypeScript surface and the token system are good enough
that this package could credibly reach `GOOD DX` (8.0+). It is a delivery problem, not a
design problem — which is the most fixable kind.

See `RECOMMENDATIONS.md` for the prioritised fix list and `FAILURES.md` for full reproductions.
