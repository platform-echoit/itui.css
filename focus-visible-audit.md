# Focus Visible Audit

Static audit of keyboard focus, `:focus-visible`, focus-ring rendering and related accessibility
across `packages/ui` (56 component families, 85 `.tsx` files) plus the consuming CSS in `apps/web`.

No code was changed. Every finding carries a file path and, where determinable, a line number.

- Date: 2026-08-12
- Scope: `packages/ui/src/**`, `packages/ui/src/styles/global.css`, `apps/web/app/globals.css`,
  `apps/web/styles/blocknote.css`, `apps/storybook/.storybook/tailwind.css`
- Method: source reading + pattern search (`:focus`, `:focus-visible`, `outline*`, `ring-*`,
  `overflow-*`, `z-*`, `position`, `transform`, `clip-path`, `::before`, `::after`)

---

## 1. Executive Summary

| Metric                                       | Count |
| -------------------------------------------- | ----- |
| Component families audited                   | 56    |
| — with a keyboard-focusable surface          | 37    |
| — presentational only (no focusable surface) | 19    |
| Pass (focusable, indicator correct)          | 15    |
| Families with at least one issue             | 22    |
| — Critical                                   | 3     |
| — High                                       | 9     |
| — Medium                                     | 8     |
| — Low                                        | 2     |
| Global / system-level findings               | 5     |
| Components needing visual verification       | 15    |

### The headline

**The design system's focus indicator is completely suppressed inside `apps/web`.**
[apps/web/app/globals.css:443-445](apps/web/app/globals.css#L443-L445) declares
`*:focus { outline: none !important; }`. Because `:focus-visible` is a strict subset of `:focus`,
and an `!important` author declaration beats any normal author declaration regardless of
specificity, **every one of the ~30 components that paints `focus-visible:focus-ring` renders no
focus indicator at all in the web app** — and so does the browser's own UA fallback. This is a
product-wide WCAG 2.1 SC 2.4.7 failure, not a library bug. See [G1](#g1--focus-outline-is-globally-disabled-in-appsweb).

### Most common issue patterns, by frequency

1. **Focus ring clipped by an ancestor `overflow: hidden` / `auto`** — 8 families. The
   `focus-ring` utility uses `outline-offset: 2px`, so the indicator is painted _outside_ the
   element's border box; any ancestor scroll/clip container cuts it. (Accordion, Lnb, Calendar,
   DatePicker, Carousel, Scroll, Table, Dialog body, InputFieldShell.)
2. **A focusable element with no design-system indicator at all** — 7 families fall back to the UA
   outline, which is then killed by G1 in `apps/web`. (List, Sidebar, SidebarGroup, PopoverItem,
   Breadcrumb, InputSearch clear, InputDate calendar, InputDropdown row.)
3. **The only keyboard indicator is a background change under 1.2:1 contrast** — 3 families.
   (OverflowMenu 1.04:1, dropdown-menu 1.09:1, SelectItem 1.12:1; WCAG 1.4.11 asks 3:1.)
4. **The `error` state silently drops the focus indicator** — the whole `Input*` family and
   `Select`. The conditional that swaps in the error border has no focus branch.
5. **The shipped ring width is a 0.5px sub-pixel hairline** — already documented in
   `ACCESSIBILITY.md` as a deliberate, known gap, but it is what makes items 1–3 above go from
   "degraded" to "invisible".

---

## 2. Global Findings

### G1 — Focus outline is globally disabled in `apps/web`

**Severity: Critical.** `Code Verified`.

```
apps/web/app/globals.css:443
```

```css
*:focus {
  outline: none !important;
}
```

- The universal selector matches every element; `:focus-visible` always implies `:focus`.
- `!important` in the author origin outranks the non-important `outline` in
  `@utility focus-ring` ([packages/ui/src/styles/global.css:691-694](packages/ui/src/styles/global.css#L691-L694))
  **and** the UA stylesheet's `:focus-visible { outline: auto }`. Specificity is irrelevant once
  `!important` is in play.
- Net effect in `apps/web`: `Button`, `Checkbox`, `Radio`, `Toggle`, `Tab`, `Pagination`, `Lnb`,
  `Gnb`, `Accordion`, `Slider`, `Rating`, `Chip`, `Tag`, `Carousel`, `Table` sort headers,
  `FloatingButton`, `Popup` close, `DateHeader` arrows, calendar days — **all show nothing on
  keyboard focus**.
- The only indicators that survive are the non-outline ones: the field family's
  `focus-within:border-ring`, and the `data-[highlighted]:bg-*` / `focus:bg-*` background swaps
  (which are themselves below 1.2:1 — see G3).
- The rule sits in the middle of a run of BlockNote editor overrides, which suggests it was written
  to silence the editor's own outline and was never scoped down.

### G2 — The focus ring width is a sub-pixel hairline

**Severity: High.** `Needs Visual Verification`.

```
packages/ui/src/styles/global.css:66
```

```css
--itui-focus-ring-width: 0.5px;
```

This is already stated as a known, deliberate gap in
[ACCESSIBILITY.md](ACCESSIBILITY.md#focus-indicators), so it is recorded here for completeness
rather than as a new discovery. Consequences worth restating:

- At DPR 1 the browser rounds it — Chrome draws it faint, Firefox may snap to 1px, and rendering is
  not consistent across displays.
- WCAG 2.2 SC 2.4.11 (Focus Appearance) asks for the equivalent of a 2px perimeter. 0.5px does not
  meet it.
- It compounds every clipping finding in section 4: a hairline that loses 2 of its 4 sides to an
  `overflow: hidden` ancestor is effectively gone.

The **colour** is fine: `--color-brand` `#009ce0` against white is **3.07:1**, just clearing the 3:1
non-text contrast floor. Note however that against `--color-surface-neutral-subtle` `#f5f5f5` — the
fill used by hovered rows in `Lnb`, `List`, `PopoverItem` — it drops to **2.82:1**, under the floor.

### G3 — Menu families indicate keyboard focus with a background change of ~1.05:1

**Severity: Critical.** `Code Verified`.

Three menu families deliberately suppress the outline and substitute a background swap. The swap is
below the perceptual threshold:

| Component          | File                                                                                | Rule                          | Colours                | Contrast     |
| ------------------ | ----------------------------------------------------------------------------------- | ----------------------------- | ---------------------- | ------------ |
| `OverflowMenuItem` | [OverflowMenu.tsx:190-194](src/components/overflow-menu/OverflowMenu.tsx#L190-L194) | `data-[highlighted]:bg-muted` | `#f5f5f5` on `#fafafa` | **1.04 : 1** |
| `DropdownMenuItem` | [dropdown-menu.tsx:107](src/components/dropdown-menu/dropdown-menu.tsx#L107)        | `focus:bg-accent`             | `#f5f5f5` on `#ffffff` | **1.09 : 1** |
| `SelectItem`       | [Select.tsx:253](src/components/select/Select.tsx#L253)                             | `focus:bg-secondary`          | `#ededed` on `#fafafa` | **1.12 : 1** |

WCAG 2.2 SC 1.4.11 requires 3:1 for a focus indicator that is not a text change. All three also
carry `outline-none` / `outline-hidden`, so there is no second indicator behind them.

A secondary problem: in all three the keyboard highlight is **the same colour as the hover
highlight**, so a keyboard user who has also moved the mouse cannot tell which row is focused.

### G4 — Two focus idioms coexist, and only one honours the design token

**Severity: Medium.** `Code Verified`.

| Family                                           | Idiom                                                  | Reads `--itui-focus-ring-width`? | Fires on mouse click? |
| ------------------------------------------------ | ------------------------------------------------------ | -------------------------------- | --------------------- |
| Buttons, controls, nav, tabs (~30 files)         | `focus-visible:focus-ring` → `outline` + `offset: 2px` | Yes                              | No                    |
| Fields (`Input*`, `SelectTrigger`, `InputGroup`) | `focus-within:border-ring` → 1px border colour         | **No**                           | **Yes**               |

This split is documented and intentional. Two consequences are worth stating anyway:

- Raising `--itui-focus-ring-width` to satisfy SC 2.4.11 fixes ~30 components and **leaves the whole
  field family behind** at 1px. Whoever thickens the ring must also thicken the field border, or
  neighbouring controls in one form will indicate at different strengths.
- `focus-within` is not `focus-visible`: clicking a text field with the mouse lights it up, while
  clicking a `Button` does not. Inconsistent, though it matches common field convention.

### G5 — The `focus-ring` utility is centralised and correct

**Severity: Pass.** Recording the positive so the recommendations below do not re-invent it.

```
packages/ui/src/styles/global.css:691
```

```css
@utility focus-ring {
  outline: var(--itui-focus-ring-width, 0px) solid var(--color-brand);
  outline-offset: 2px;
}
```

This is the right shape: one token, `outline` rather than `box-shadow` (so it can be switched off
centrally and does not participate in the shadow stack), and it overrides the UA `outline: auto`.
Every fix below should route through it rather than adding a new idiom. `--color-brand` comes from a
plain `@theme` block, so the custom property is guaranteed to resolve at runtime.

**No focus-related override was found** in `apps/storybook/.storybook/tailwind.css`.
`apps/web/styles/blocknote.css` contains `outline: none !important` at lines 531 and 764, but both
are scoped to BlockNote internals (`.ProseMirror [contenteditable="false"]`,
`.bn-react-node-view-renderer …`) and do not reach design-system components.

---

## 3. Component Audit

`FV` = has an explicit `:focus-visible` rule · `Ring` = an indicator is actually painted ·
`Clip` = at risk of being clipped by an ancestor · `Ovl` = at risk of being overlapped ·
`Cons` = consistent with the library's dominant idiom.

### 3.1 Families with a keyboard-focusable surface

| Component                      | File                                                                                                                                                   | FV  | Ring                      | Clip    | Ovl     | Cons    | Severity     | Verification              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --- | ------------------------- | ------- | ------- | ------- | ------------ | ------------------------- |
| Dialog (Close)                 | [dialog/dialog.tsx:122](src/components/dialog/dialog.tsx#L122)                                                                                         | No  | **No**                    | Yes     | No      | No      | **Critical** | Code Verified             |
| OverflowMenu (Item)            | [overflow-menu/OverflowMenu.tsx:190](src/components/overflow-menu/OverflowMenu.tsx#L190)                                                               | No  | 1.04:1                    | No      | No      | No      | **Critical** | Code Verified             |
| Calendar · WheelPicker         | [calendar/WheelPicker.tsx:142-151](src/components/calendar/WheelPicker.tsx#L142-L151)                                                                  | No  | **No**                    | Yes     | No      | No      | **Critical** | Code Verified             |
| Accordion (Trigger)            | [accordion/Accordion.tsx:117](src/components/accordion/Accordion.tsx#L117), [:149](src/components/accordion/Accordion.tsx#L149)                        | Yes | Yes                       | **Yes** | No      | Yes     | High         | Needs Visual Verification |
| dropdown-menu (Item)           | [dropdown-menu/dropdown-menu.tsx:107](src/components/dropdown-menu/dropdown-menu.tsx#L107)                                                             | No  | 1.09:1                    | No      | No      | No      | High         | Code Verified             |
| Input family (error state)     | [input/InputFieldShell.tsx:126-128](src/components/input/InputFieldShell.tsx#L126-L128)                                                                | No  | **No**                    | —       | No      | No      | High         | Code Verified             |
| Input · InputSearch clear      | [input/InputSearch.tsx:99-103](src/components/input/InputSearch.tsx#L99-L103)                                                                          | No  | UA only                   | **Yes** | No      | No      | High         | Needs Visual Verification |
| Input · InputDate trigger      | [input/InputDate.tsx:192-196](src/components/input/InputDate.tsx#L192-L196)                                                                            | No  | UA only                   | **Yes** | No      | No      | High         | Needs Visual Verification |
| Input · InputDropdown row      | [input/InputDropdown.tsx:147-165](src/components/input/InputDropdown.tsx#L147-L165)                                                                    | No  | UA only                   | No      | No      | No      | High         | Code Verified             |
| List (ListItem)                | [list/List.tsx:137-145](src/components/list/List.tsx#L137-L145)                                                                                        | No  | UA only                   | No      | No      | No      | High         | Code Verified             |
| Lnb (rows)                     | [lnb/Lnb.tsx:173](src/components/lnb/Lnb.tsx#L173), [:480](src/components/lnb/Lnb.tsx#L480)                                                            | Yes | Yes                       | **Yes** | No      | Yes     | High         | Needs Visual Verification |
| Popover (PopoverItem)          | [popover/PopoverPanel.tsx:216-225](src/components/popover/PopoverPanel.tsx#L216-L225)                                                                  | No  | UA only                   | **Yes** | No      | No      | High         | Needs Visual Verification |
| Rating                         | [rating/Rating.tsx:172](src/components/rating/Rating.tsx#L172)                                                                                         | Yes | Wrong element             | No      | No      | Partial | High         | Needs Visual Verification |
| Select (Trigger)               | [select/Select.tsx:80-97](src/components/select/Select.tsx#L80-L97)                                                                                    | Yes | **Not in error/disabled** | No      | No      | Yes     | High         | Code Verified             |
| Sidebar (Item · Group)         | [sidebar/Sidebar.tsx:191-207](src/components/sidebar/Sidebar.tsx#L191-L207), [SidebarGroup.tsx:64-76](src/components/sidebar/SidebarGroup.tsx#L64-L76) | No  | UA only                   | No      | No      | No      | High         | Code Verified             |
| Breadcrumb (Item)              | [breadcrumb/Breadcrumb.tsx:154-164](src/components/breadcrumb/Breadcrumb.tsx#L154-L164)                                                                | No  | UA only                   | No      | No      | No      | Medium       | Code Verified             |
| Carousel (slides)              | [carousel/Carousel.tsx:226](src/components/carousel/Carousel.tsx#L226)                                                                                 | n/a | n/a                       | **Yes** | No      | —       | Medium       | Needs Visual Verification |
| Chip                           | [chip/Chip.tsx:180](src/components/chip/Chip.tsx#L180), [:231](src/components/chip/Chip.tsx#L231)                                                      | Yes | Yes                       | No      | Nested  | Yes     | Medium       | Needs Visual Verification |
| InputGroup                     | [input-group/InputGroup.tsx:124](src/components/input-group/InputGroup.tsx#L124)                                                                       | Yes | Delegated                 | No      | No      | Partial | Medium       | Needs Visual Verification |
| Scroll (ScrollAreaRoot)        | [scroll/Scroll.tsx:153](src/components/scroll/Scroll.tsx#L153)                                                                                         | n/a | n/a                       | **Yes** | No      | —       | Medium       | Needs Visual Verification |
| Slider (Thumb)                 | [slider/Slider.tsx:69-74](src/components/slider/Slider.tsx#L69-L74)                                                                                    | Yes | Yes                       | No      | **Yes** | Partial | Medium       | Needs Visual Verification |
| Table (sortable head)          | [table/Table.tsx:111](src/components/table/Table.tsx#L111), [:229](src/components/table/Table.tsx#L229)                                                | Yes | Yes                       | **Yes** | No      | Yes     | Medium       | Needs Visual Verification |
| Tag                            | [tag/Tag.tsx:137](src/components/tag/Tag.tsx#L137), [:165](src/components/tag/Tag.tsx#L165)                                                            | Yes | Yes                       | No      | Nested  | Yes     | Medium       | Needs Visual Verification |
| Calendar · Calendar/DatePicker | [calendar/Calendar.tsx:181](src/components/calendar/Calendar.tsx#L181), [DatePicker.tsx:256](src/components/calendar/DatePicker.tsx#L256)              | Yes | Yes                       | **Yes** | No      | Yes     | Medium       | Needs Visual Verification |
| tabs (legacy)                  | [tabs/tabs.tsx:60](src/components/tabs/tabs.tsx#L60)                                                                                                   | Yes | Yes                       | No      | No      | Partial | Low          | Code Verified             |
| Tooltip                        | [tooltip/tooltip.tsx:40](src/components/tooltip/tooltip.tsx#L40)                                                                                       | n/a | Delegated                 | No      | No      | —       | Low          | Code Verified             |
| BottomSheet                    | [bottom-sheet/BottomSheet.tsx:219](src/components/bottom-sheet/BottomSheet.tsx#L219)                                                                   | No  | Container                 | No      | No      | Yes     | Pass         | Code Verified             |
| Button                         | [button/Button.tsx:202](src/components/button/Button.tsx#L202)                                                                                         | Yes | Yes                       | No      | No      | Yes     | Pass         | Code Verified             |
| Checkbox                       | [checkbox/Checkbox.tsx:133](src/components/checkbox/Checkbox.tsx#L133)                                                                                 | Yes | Yes                       | No      | No      | Yes     | Pass         | Code Verified             |
| FloatingButton                 | [floating-button/FloatingButton.tsx:85](src/components/floating-button/FloatingButton.tsx#L85)                                                         | Yes | Yes                       | No      | No      | Yes     | Pass         | Code Verified             |
| Gnb (MenuItem)                 | [gnb/Gnb.tsx:165](src/components/gnb/Gnb.tsx#L165)                                                                                                     | Yes | Yes                       | No      | No      | Yes     | Pass         | Code Verified             |
| Modal                          | [modals/modal.tsx:78-86](src/components/modals/modal.tsx#L78-L86)                                                                                      | Yes | Via `Button`              | No      | No      | Yes     | Pass         | Code Verified             |
| Navigation                     | [navigation/Navigation.tsx:132](src/components/navigation/Navigation.tsx#L132)                                                                         | Yes | Yes                       | No      | No      | Yes     | Pass         | Code Verified             |
| NavigationV2                   | [navigation-v2/NavigationV2.tsx:194](src/components/navigation-v2/NavigationV2.tsx#L194)                                                               | Yes | Yes                       | No      | No      | Yes     | Pass         | Code Verified             |
| Pagination                     | [pagination/Pagination.tsx:122](src/components/pagination/Pagination.tsx#L122)                                                                         | Yes | Yes                       | No      | No      | Yes     | Pass         | Code Verified             |
| Popup                          | [popup/Popup.tsx:109](src/components/popup/Popup.tsx#L109)                                                                                             | Yes | Yes                       | No      | No      | Yes     | Pass         | Code Verified             |
| Radio                          | [radio/Radio.tsx:107](src/components/radio/Radio.tsx#L107)                                                                                             | Yes | Yes                       | No      | No      | Yes     | Pass         | Code Verified             |
| Snackbar                       | [snackbar/Snackbar.tsx:191-200](src/components/snackbar/Snackbar.tsx#L191-L200)                                                                        | Yes | Via `Button`              | No      | No      | Yes     | Pass         | Code Verified             |
| Tab · TabContent               | [tab/Tab.tsx:214](src/components/tab/Tab.tsx#L214), [:250](src/components/tab/Tab.tsx#L250)                                                            | Yes | Yes                       | No      | No      | Yes     | Pass         | Code Verified             |
| Toast                          | [toast/Toast.tsx](src/components/toast/Toast.tsx)                                                                                                      | n/a | Via `Button`              | No      | No      | Yes     | Pass         | Code Verified             |
| Toggle                         | [toggle/Toggle.tsx:78](src/components/toggle/Toggle.tsx#L78)                                                                                           | Yes | Yes                       | No      | No      | Yes     | Pass         | Code Verified             |
| Input · TextFormatting toolbar | [input/InputTextFormatting.tsx:291](src/components/input/InputTextFormatting.tsx#L291), [:329](src/components/input/InputTextFormatting.tsx#L329)      | Yes | Yes                       | No      | No      | Yes     | Pass         | Code Verified             |
| Input · FileUpload actions     | [input/InputFileUpload.tsx:97](src/components/input/InputFileUpload.tsx#L97)                                                                           | Yes | Yes                       | No      | No      | Yes     | Pass         | Code Verified             |
| Calendar · DateHeader          | [calendar/DateHeader.tsx:59](src/components/calendar/DateHeader.tsx#L59)                                                                               | Yes | Yes                       | No      | No      | Yes     | Pass         | Code Verified             |
| Calendar · BaseDateButton      | [calendar/BaseDate.tsx:199-215](src/components/calendar/BaseDate.tsx#L199-L215)                                                                        | Yes | Yes (inner circle)        | No      | No      | Yes     | Pass         | Code Verified             |

> Every `Pass` row above is a pass **of the library in isolation**. Inside `apps/web`, G1 reduces
> all of them to no indicator.

### 3.2 Presentational families — no focusable surface, nothing to audit

`Avatar`, `Backdrop`, `Badge`, `Bubble`, `Card` / `CardTemplates`, `Colors`, `Divider`, `Empty`,
`FileType` / `FileIcon`, `Grid`, `Label`, `Progress` / `SyncProgressBar`, `Radius`, `Shadow`,
`Skeleton`, `Spacing`, `Spinner`, `Stepper`, `Typography`.

`Stepper` was checked specifically because it uses `ring-1 ring-offset-1`
([Stepper.tsx:208](src/components/stepper/Stepper.tsx#L208)) — that is decorative geometry on an
`aria-hidden` span, not a focus indicator, and the component renders no focusable node.

---

## 4. Detailed Findings

### Dialog — the close button removes its focus indicator and puts nothing back

**File:**

```
packages/ui/src/components/dialog/dialog.tsx:122
```

**Issue:** The ✕ button is keyboard-reachable and is often the first tab stop in an open dialog, but
it paints no focus indicator.

**Current implementation:**

```tsx
className =
  'cursor-pointer absolute … focus:outline-hidden disabled:pointer-events-none …';
```

**Root cause:** Tailwind v4's `outline-hidden` emits `outline-style: none` (it only restores a
transparent outline under `forced-colors`). It is applied on `:focus`, so it fires for keyboard
focus too, and no `focus-visible:focus-ring` follows it. This is the one component in the library
that carries a bare outline-suppression with no replacement. Every sibling close button —
`Popup` ([Popup.tsx:109](src/components/popup/Popup.tsx#L109)), `Chip`
([Chip.tsx:231](src/components/chip/Chip.tsx#L231)), `Tag`
([Tag.tsx:165](src/components/tag/Tag.tsx#L165)) — does add `focus-visible:focus-ring`.

**Impact:** A keyboard or screen-magnifier user opening a dialog cannot see that focus has landed on
Close. WCAG 2.1 SC 2.4.7 failure. Aggravated by the button being absolutely positioned over the
header, where there is no other state change to read.

**Recommended fix:** Replace `focus:outline-hidden` with `focus-visible:focus-ring`, matching
`Popup`. Nothing else needs to move.

---

### OverflowMenu — the only keyboard indicator is a 1.04:1 background

**File:**

```
packages/ui/src/components/overflow-menu/OverflowMenu.tsx:190-194
```

**Issue:** `OverflowMenuItem` sets `outline-none` and relies solely on
`data-[highlighted]:bg-muted`.

**Current implementation:**

```tsx
'flex w-full cursor-pointer items-center gap-2 rounded-lg p-2 select-none outline-none',
// Radix sets data-highlighted on both pointer hover and keyboard focus.
'data-[highlighted]:bg-muted',
```

**Root cause:** `--muted` is `#f5f5f5`; the menu panel is `bg-inverse` = `#fafafa`
([OverflowMenu.tsx:156](src/components/overflow-menu/OverflowMenu.tsx#L156)). Contrast between the
two is **1.04:1**. The comment correctly notes Radix sets `data-highlighted` for both hover and
keyboard, but that also means the two states are visually identical.

**Impact:** Arrow-keying through the menu produces no perceptible change on most displays. WCAG 2.2
SC 1.4.11 (3:1) failure and, in practice, SC 2.4.7 too. `DropdownMenuItem` (1.09:1) and `SelectItem`
(1.12:1) have the same defect with different tokens.

**Recommended fix:** Keep the highlight fill for hover, and add a real focus indicator for the
keyboard path — `focus-visible:focus-ring` on the item, or a `data-[highlighted]:` inset ring at 3:1
against the panel. Deepening `--muted` alone would fix contrast but still leave hover and keyboard
indistinguishable.

---

### WheelPicker — a focusable listbox with `outline-none` and no replacement

**File:**

```
packages/ui/src/components/calendar/WheelPicker.tsx:137-151
```

**Issue:** The scroll column is `role="listbox"` with `tabIndex={0}` and an `onKeyDown` that moves
the selection with ↑/↓ — a fully operable control — but it explicitly removes the outline.

**Current implementation:**

```tsx
role="listbox"
tabIndex={0}
onKeyDown={handleKeyDown}
className={cn(
  'scrollbar-none relative h-50 flex-1 basis-0 overflow-y-auto py-20',
  'snap-y snap-mandatory',
  // A scroll container, not a DS control — it paints no focus ring, so all
  // it needs is the UA outline out of the way.
  'outline-none',
)}
```

**Root cause:** The inline comment's premise is wrong. It _is_ a DS control: `tabIndex={0}` +
`role="listbox"` + arrow-key handling. The option `<button>`s inside are all `tabIndex={-1}`, so the
container is the only tab stop in the wheel and the only thing that can carry an indicator.

**Impact:** A keyboard user tabbing into a `DateWheelPicker` has no way to know which of the three
columns (hour / minute / meridiem) their arrow keys will drive. WCAG 2.1 SC 2.4.7 failure.

**Recommended fix:** `focus-visible:focus-ring` on the container, or move focus management to the
options and paint the ring on the selected option. Note the container is itself `overflow-y-auto`,
so an outline on it is _not_ self-clipped — its own outline is drawn outside its padding box and is
unaffected by its own overflow.

---

### Accordion — the item's `overflow-hidden` clips the trigger's ring on three sides

**File:**

```
packages/ui/src/components/accordion/Accordion.tsx:117  (AccordionItem)
packages/ui/src/components/accordion/Accordion.tsx:149  (AccordionTrigger)
```

**Issue:** `AccordionItem` is `overflow-hidden`; `AccordionTrigger` is a `w-full h-12` child that
paints `focus-visible:focus-ring` at `outline-offset: 2px`.

**Current implementation:**

```tsx
// AccordionItem
className={cn('overflow-hidden', itemVariantMap[variant], className)}
// AccordionTrigger (inside AccordionHeader, which is a plain flex box, no padding)
'group flex h-12 w-full cursor-pointer items-center justify-between gap-2 px-5',
'focus-visible:focus-ring',
```

**Root cause:** An outline belongs to the element's paint, and an ancestor's overflow clip applies
to descendants' outlines. The trigger fills the item's content box exactly (`w-full`, no wrapper
padding), so the outline — which begins 2px _outside_ the trigger's border box — falls entirely
outside the clip region on the left and right, and on the top for the first item. Only the bottom
edge (the side facing `AccordionContent`) survives. `overflow-hidden` is load-bearing here: it is
what keeps the `filled` / `outline` variants' `rounded-lg` corners clipping their fill.

**Impact:** The already-hairline ring loses ~3 of its 4 sides. In practice the focused accordion
header is indistinguishable from an unfocused one.

**Recommended fix:** Do not remove the item's `overflow-hidden`. Either give the trigger inward
breathing room so the ring is painted inside the clip region (e.g. an inset ring via
`outline-offset: -2px` for this family), or move the ring to an inner span the way `BaseDateButton`
already does ([BaseDate.tsx:197-215](src/components/calendar/BaseDate.tsx#L197-L215)) — that is the
pattern in this codebase that already solves exactly this problem.

---

### Lnb — two ancestors clip the row rings

**File:**

```
packages/ui/src/components/lnb/Lnb.tsx:173  (LnbHeader — overflow-y-auto)
packages/ui/src/components/lnb/Lnb.tsx:480  (LnbGroupContent — overflow-hidden)
packages/ui/src/components/lnb/Lnb.tsx:98   (ROW_BASE — focus-visible:focus-ring)
```

**Issue:** Every LNB row is `w-full` with the standard offset ring, and both of its scroll/animation
ancestors clip.

**Root cause — two separate clips:**

1. `LnbHeader` sets `overflow-y-auto`. Per CSS Overflow, when one axis is not `visible`, a `visible`
   value on the other axis computes to `auto` — so the header clips **horizontally as well**. It has
   no padding of its own, and rows are `w-full`, so the rings' left and right edges land outside the
   clip region.
2. `LnbGroupContent` is `overflow-hidden` (required — the height keyframes need it to clip the
   sliding sub-items). Its `<ul>` is `p-0 pt-2`, so sub-item rings are clipped left and right, and
   the last sub-item's bottom edge is clipped too.

**Impact:** Focused LNB rows show a partial ring at best. `LnbToggle`
([Lnb.tsx:265-268](src/components/lnb/Lnb.tsx#L265-L268)) is inside `LnbLogo`, which does not clip,
so it is unaffected — meaning the rail indicates inconsistently within itself.

**Recommended fix:** Add 2px of horizontal padding to `LnbHeader` and to `LnbGroupContent`'s `<ul>`
(and compensate the rows' width), or switch this family to an inset ring. Raising `z-index` would
not help — clipping is not a stacking problem.

---

### Input family — focusing an errored field produces no visual change

**File:**

```
packages/ui/src/components/input/InputFieldShell.tsx:122-130
packages/ui/src/components/select/Select.tsx:80-97   (same defect)
```

**Issue:** The focus indicator is attached only to the non-error branch of the state ternary.

**Current implementation:**

```tsx
disabled
  ? 'bg-surface-neutral-subtle border-input pointer-events-none'
  : isError
    ? 'bg-inverse border-destructive'              // ← no focus rule
    : 'bg-inverse border-input focus-within:border-ring',
```

and in `Select`:

```tsx
disabled: 'bg-neutral-100 border-input pointer-events-none',
error: 'bg-white border-destructive',              // ← no focus rule
default: 'bg-white border-input focus-visible:border-ring …',
```

**Root cause:** For the field family the border colour _is_ the indicator (G4). Overriding the border
for the error state therefore removes the indicator along with it — there is no separate outline to
fall back on, because the field family opts out of `focus-ring` by design.

**Impact:** The single most likely moment for a keyboard user to need the indicator — tabbing back
into the field a validation error just flagged — is the one moment it does not exist. Affects
`InputText`, `InputTextarea`, `InputPhoneNumber`, `InputTag`, `InputDate`, `InputSearch`,
`InputDropdown`, `InputV2` and `SelectTrigger`. WCAG 2.1 SC 2.4.7 failure in the error state.

A related, smaller variant of the same bug: `SelectTrigger`'s `disabled` branch also has no focus
rule, and `ACCESSIBILITY.md` already records that `disabled` is not forwarded to the underlying
button — so a disabled select **stays focusable and indicates nothing**.

**Recommended fix:** Move the focus declaration out of the ternary so it applies in all enabled
states, e.g. keep `border-destructive` for error and add a focus rule that wins over it (a thicker
border, or `focus-within:focus-ring` layered on top of the red border so error and focus are both
readable at once).

---

### Field slot buttons — no indicator, and the shell clips what the UA would draw

**File:**

```
packages/ui/src/components/input/InputSearch.tsx:99-103   (clear ✕)
packages/ui/src/components/input/InputDate.tsx:192-196    (calendar trigger)
packages/ui/src/components/input/InputFieldShell.tsx:122  (the clipping ancestor)
```

**Issue:** Both slot buttons are real tab stops with no design-system focus class:

```tsx
className = 'flex size-5 cursor-pointer items-center justify-center';
```

**Root cause:** Two compounding problems. (a) They fall back to the UA outline, which is
inconsistent with every other icon button in the library and is erased entirely by G1 in `apps/web`.
(b) The shell box is `h-12 p-3 … overflow-hidden` — a 48px box with 12px padding leaves a **24px
content lane** for a 20px (`size-5`) button, i.e. 2px of clearance above and below. An outline at
`outline-offset: 2px` starts exactly at that boundary, so it is clipped top and bottom even if one
is added.

**Impact:** Tabbing from the text field to the clear button appears to move focus nowhere. This is
the pattern most likely to be copied into new field types.

**Recommended fix:** Add `focus-visible:focus-ring` to both, and give this family an inset ring
(`outline-offset: -2px` or a `-1px` variant) so the 24px lane can contain it — the horizontal
padding is generous (12px) but the vertical lane is not.

---

### Rating — the ring identifies the star, not the focused half-star

**File:**

```
packages/ui/src/components/rating/Rating.tsx:168-194
```

**Issue:** Each star holds **two** radio inputs (the half and the whole), but the ring is painted on
the star wrapper:

```tsx
<RatingStar className="rounded-sm has-[:focus-visible]:focus-ring">
  {[STEP, 1].map((offset) => (
    <label className={cn('absolute inset-y-0 w-1/2 …', offset === STEP ? 'left-0' : 'right-0')}>
      <input type="radio" className="sr-only" … />
```

**Root cause:** `has-[:focus-visible]` matches when _either_ nested input is focused, and the
selector is on the whole star, so both halves produce the identical ring.

**Impact:** In a 5-star rating there are 10 radios and only 5 distinguishable focus positions. Arrow
key presses move focus without the indicator moving on every second press, so a keyboard user cannot
tell whether they are on 2.5 or 3.0. The `aria-label` is correct, so screen-reader users are fine —
this affects sighted keyboard users specifically. WCAG 2.1 SC 2.4.7.

**Recommended fix:** Move the ring onto each `<label>` half — `has-[:focus-visible]:focus-ring` on
the label rather than the star — so the indicator covers the half actually focused.

---

### List · Sidebar · SidebarGroup · PopoverItem · InputDropdown — focusable buttons with no indicator

**Files:**

```
packages/ui/src/components/list/List.tsx:137-145
packages/ui/src/components/sidebar/Sidebar.tsx:191-207
packages/ui/src/components/sidebar/SidebarGroup.tsx:64-76
packages/ui/src/components/popover/PopoverPanel.tsx:216-225
packages/ui/src/components/input/InputDropdown.tsx:147-165
```

**Issue:** Five row-shaped `<button>` components that carry `hover:` and `active:` fills but no
`focus-visible:` rule at all.

**Root cause:** Not an outline suppression — nothing sets `outline-none` — so the UA default still
paints in isolation. But that means these five are the only components in the library indicating
with the browser's ring instead of the brand ring, and they are the components most likely to be
rendered inside `apps/web`, where G1 removes the UA ring too.

**Impact:** Two levels. In the library: visual inconsistency (a black/blue UA ring next to the brand
hairline). In `apps/web`: no indicator whatsoever on the primary navigation surfaces. `PopoverItem`
additionally sits inside `PopoverPanel`'s `overflow-hidden`
([PopoverPanel.tsx:112](src/components/popover/PopoverPanel.tsx#L112)) — with `PopoverGroup`'s 8px
padding a 2px-offset ring does fit, but the first and last rows in a group are the ones to verify.

`PopoverItem` deserves a second note: with `asMenuItem` it participates in `PopoverMenu`'s roving
tabindex ([PopoverMenu.tsx:45-47](src/components/popover/PopoverMenu.tsx#L45-L47)), where arrow keys
are the _only_ way to move between items. A roving-tabindex menu with no focus indicator is
unusable by keyboard.

**Recommended fix:** Add `focus-visible:focus-ring` to all five, matching `LnbItem`'s `ROW_BASE`
([Lnb.tsx:95-101](src/components/lnb/Lnb.tsx#L95-L101)) — which is the same row shape and already
does it.

---

### Sidebar — the collapsed-rail tooltip is hover-only

**File:**

```
packages/ui/src/styles/global.css:709-713
packages/ui/src/components/sidebar/Sidebar.tsx:223-229
```

**Issue:** On the collapsed rail the item label is `sr-only` and the visible name comes from a
tooltip revealed by:

```css
[data-sidebar][data-collapsed]
  [data-sidebar-item]:hover
  [data-sidebar-tooltip] {
  display: flex;
}
```

**Root cause:** `:hover` only. There is no `:focus-within` companion. `Lnb` solved the identical
problem for its logo/toggle crossfade by pairing `group-hover` with `group-focus-within`
([Lnb.tsx:232](src/components/lnb/Lnb.tsx#L232)); `Sidebar` did not.

**Impact:** A keyboard user tabbing along the collapsed sidebar sees icons with no labels. The
accessible name is still correct via `sr-only`, so this is a sighted-keyboard / low-vision issue,
not a screen-reader one.

**Recommended fix:** Add a `:focus-within` selector alongside the `:hover` one in the same rule.

---

### Slider — the hover ring and the focus ring occupy the same 2px band

**File:**

```
packages/ui/src/components/slider/Slider.tsx:69-74
```

**Current implementation:**

```tsx
'hover:border-brand hover:ring-2 hover:ring-brand-subtle',
'active:border-brand active:ring-2 active:ring-brand-subtle',
'focus-visible:border-brand focus-visible:focus-ring',
```

**Root cause:** `ring-2` is a `box-shadow` spreading 2px outward from the border box;
`focus-ring` is an outline whose inner edge sits 2px outside the border box. They are exactly
coincident. The hover ring is 2px of `#e6f5fc`, the focus ring is 0.5px of `#009ce0` at the same
radius.

**Impact:** `hover + focus-visible` — the normal state while dragging with the mouse after tabbing
in — draws a 0.5px hairline on the outer edge of a 4× thicker pale ring. Whether the hairline reads
at all is a rendering question, hence `Needs Visual Verification`. This is also an internal
inconsistency: the _hover_ affordance on this component is far more prominent than the _focus_ one,
which inverts the usual priority.

**Recommended fix:** Give the focus state its own offset (e.g. `outline-offset: 4px` for this
component) so the two indicators are concentric rather than coincident, or drop the hover ring while
focused.

---

### Chip / Tag — an interactive chip nests a real `<button>` inside `role="button"`

**File:**

```
packages/ui/src/components/chip/Chip.tsx:192-200, 231
packages/ui/src/components/tag/Tag.tsx:147-155, 165
```

**Issue:** When `onClick` is given, the root becomes `role="button" tabIndex={0}` with its own
`focus-visible:focus-ring`; when `onClose` is also given, a real `<button>` with its own ring is
rendered inside it.

**Root cause:** ARIA forbids interactive content inside a `button` role. Practically it produces two
tab stops where the outer stop's ring encircles the inner stop's ring, and the outer `aria-pressed`
element announces the close button's label as part of its own content.

**Impact:** Confusing tab order and two overlapping brand rings on the same visual object. Low
user-facing severity because both rings are hairlines; a correctness issue nonetheless.

Minor related note: `focus-visible:focus-ring` is applied to the chip root unconditionally
([Chip.tsx:180](src/components/chip/Chip.tsx#L180)), including when the chip is _not_ interactive —
a `<div>` with no `tabIndex` can never match `:focus-visible`, so the class is inert there. Harmless,
but it makes the component read as focusable when it is not.

**Recommended fix:** Keep the close button, and either drop `role="button"`/`tabIndex` from the root
in favour of an inner label button, or document that `onClick` and `onClose` should not be combined.

---

### Clipping containers with no indicator problem of their own

These clip descendants' rings but carry no focusable node themselves. Grouped because the fix is the
same shape (padding or an inset ring on whatever is focusable inside them):

| Container                       | File                                                                                                                             | Notes                                                                                                                                                                                                                                                                         |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CarouselContent` viewport      | [Carousel.tsx:226](src/components/carousel/Carousel.tsx#L226)                                                                    | `overflow-hidden` is required by Embla. Any focusable element inside a slide is clipped, and a slide that is partly scrolled out has its content's ring cut mid-shape. `CarouselIndicator` and the arrows are outside the viewport and are unaffected.                        |
| `ScrollAreaRoot`                | [Scroll.tsx:153](src/components/scroll/Scroll.tsx#L153)                                                                          | `relative overflow-hidden` on the Radix root. Focusable content at the viewport edges loses its ring.                                                                                                                                                                         |
| `Table` frame                   | [Table.tsx:111](src/components/table/Table.tsx#L111)                                                                             | `overflow-x-auto` computes `overflow-y` to `auto`, so the frame clips both axes. The sortable head button sits inside `px-3 py-2` and does fit; the risk is a `Button` or `Checkbox` placed in a `TableCell` at the frame's edge, and any content when horizontally scrolled. |
| `Calendar` / `DatePicker` cards | [Calendar.tsx:181](src/components/calendar/Calendar.tsx#L181), [DatePicker.tsx:256](src/components/calendar/DatePicker.tsx#L256) | `overflow-hidden` with `px-5 pt-5` and no bottom padding. Day cells clear the sides; the **bottom row of days** and the `DateFooter` controls are the ones to check.                                                                                                          |
| `DialogContent` / body          | [dialog.tsx:105](src/components/dialog/dialog.tsx#L105), [:140](src/components/dialog/dialog.tsx#L140)                           | `overflow-hidden` on the panel, `overflow-y-auto overflow-x-hidden` on the body. The body's `p-4` absorbs a 2px ring horizontally; the risk is at the scroll boundary, top and bottom.                                                                                        |
| `InputFieldShell` box           | [InputFieldShell.tsx:122](src/components/input/InputFieldShell.tsx#L122)                                                         | Covered above — 24px vertical lane vs a 2px-offset ring.                                                                                                                                                                                                                      |

`SelectContent` ([Select.tsx:188](src/components/select/Select.tsx#L188)) and `PopoverContent`
([Popover.tsx:231](src/components/popover/Popover.tsx#L231)) also scroll, but both portal out of the
tree, so they clip only their own items — which are the G3 background-swap items with no ring to
clip.

---

### Z-index and overlap

**No focus-ring overlap defect was found.** Documented for completeness, because the audit brief asks
for it explicitly:

- All `z-*` usage in the library is on overlay surfaces — `Backdrop` `z-50`
  ([Backdrop.tsx:94](src/components/backdrop/Backdrop.tsx#L94)), `BottomSheet` `z-70`
  ([BottomSheet.tsx:211](src/components/bottom-sheet/BottomSheet.tsx#L211)), dialog / modal / popup
  overlays `z-50`, portalled menu content `z-50`, `SyncProgressBar` `z-[9999]`
  ([SyncProgressBar.tsx:52](src/components/progress/SyncProgressBar.tsx#L52)). None of these sit as
  a sibling of a focusable control in a way that could paint over its ring — they are full-screen
  layers or portalled popovers, and while they are open the control beneath is not focusable.
- `Select` scroll buttons use `z-10` ([Select.tsx:299](src/components/select/Select.tsx#L299),
  [:320](src/components/select/Select.tsx#L320)) above the item list — but the items indicate with a
  background, not a ring, so nothing is occluded.
- No `clip-path`, `contain`, or `isolation` anywhere in the library. The only `transform` uses are
  overlay centring and icon rotation, neither of which intersects a focus ring.

**Conclusion: none of the clipping findings in this report should be fixed by raising `z-index`.**
They are all `overflow` clip-region problems; a stacking change cannot restore a clipped paint.

---

## 5. Cross-component Consistency

Measured across all 37 focusable families, focus behaviour falls into **five** idioms — three more
than the library documents:

| #   | Idiom                                                    | Colour · width · offset                | Used by                                                                                                                       | Reads the token? |
| --- | -------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| 1   | `focus-visible:focus-ring`                               | `#009ce0` · 0.5px · +2px               | 24 families                                                                                                                   | Yes              |
| 2   | `focus-within:border-ring` / `focus-visible:border-ring` | `#009ce0` · 1px border · 0             | Input family, `SelectTrigger`, `InputGroup`                                                                                   | No               |
| 3   | `data-[highlighted]` / `focus:` background swap          | `#f5f5f5`–`#ededed` fill · 1.04–1.12:1 | `OverflowMenu`, `dropdown-menu`, `SelectItem`                                                                                 | No               |
| 4   | UA default outline                                       | browser-defined                        | `List`, `Sidebar`, `SidebarGroup`, `PopoverItem`, `Breadcrumb`, `InputSearch` clear, `InputDate` trigger, `InputDropdown` row | No               |
| 5   | none                                                     | —                                      | `Dialog` close, `WheelPicker`, errored fields, disabled `SelectTrigger`                                                       | —                |

Idioms 1 and 2 are a documented, defensible split. **Idioms 3, 4 and 5 are unintended** — nothing in
the design specifies them, and they are what most of section 4 is about.

### Recommended standard

The existing `focus-ring` utility is the right foundation; it needs a width that meets SC 2.4.11 and
two variants for the containers that cannot fit an outer ring.

```css
:root {
  /* Existing token — the only knob today. */
  --itui-focus-ring-width: 2px; /* was 0.5px */

  /* Proposed additions, so offset and colour stop being hard-coded in the utility. */
  --itui-focus-ring-color: var(--color-brand); /* #009ce0 — 3.07:1 on white */
  --itui-focus-ring-offset: 2px;

  /* For controls inside a clipping ancestor: paint the ring inward instead. */
  --itui-focus-ring-offset-inset: -2px;
}
```

```css
@utility focus-ring {
  outline: var(--itui-focus-ring-width, 0px) solid var(--itui-focus-ring-color);
  outline-offset: var(--itui-focus-ring-offset);
}

/* Same indicator, painted inside the border box — for Accordion, Lnb rows,
   field slot buttons, ScrollArea and Carousel content. */
@utility focus-ring-inset {
  outline: var(--itui-focus-ring-width, 0px) solid var(--itui-focus-ring-color);
  outline-offset: var(--itui-focus-ring-offset-inset);
}
```

Two rules should accompany it:

- **The field family's border must move with the ring.** If `--itui-focus-ring-width` goes to 2px,
  the `border-ring` focus border must go to 2px as well, or an `InputText` and a `Button` in the
  same form will indicate at different strengths (G4).
- **A background swap is never a sufficient focus indicator on its own.** Where Radix drives the
  highlight (`data-[highlighted]`, `focus:bg-*`), pair it with `focus-visible:focus-ring` so hover
  and keyboard are distinguishable and the 3:1 floor is met by the ring rather than the fill.

Against `#f5f5f5` surfaces the brand ring is 2.82:1 — marginally under 3:1. If a strict SC 1.4.11
pass is required on hovered rows, either darken the focus colour one step
(`--color-brand-sky-600` `#008ecc` → 3.6:1 on `#f5f5f5`) or add a 1px light outer edge so the
indicator contrasts against both adjacent colours.

---

## 6. Issues by Severity

### Critical

| #   | Issue                                                                                 | Location                                                                                          |
| --- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| C1  | `*:focus { outline: none !important }` disables every DS focus ring app-wide          | [apps/web/app/globals.css:443](apps/web/app/globals.css#L443)                                     |
| C2  | `Dialog` close button: `focus:outline-hidden` with no replacement indicator           | [dialog/dialog.tsx:122](src/components/dialog/dialog.tsx#L122)                                    |
| C3  | `WheelPicker`: `tabIndex={0}` operable listbox with `outline-none` and no replacement | [calendar/WheelPicker.tsx:142-151](src/components/calendar/WheelPicker.tsx#L142-L151)             |
| C4  | `OverflowMenuItem`: sole keyboard indicator is a 1.04:1 fill                          | [overflow-menu/OverflowMenu.tsx:190-194](src/components/overflow-menu/OverflowMenu.tsx#L190-L194) |

### High

| #   | Issue                                                                                           | Location                                                                                                                               |
| --- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| H1  | Errored fields lose their focus indicator entirely (whole `Input*` family)                      | [input/InputFieldShell.tsx:126-128](src/components/input/InputFieldShell.tsx#L126-L128)                                                |
| H2  | `SelectTrigger`: no focus rule in the `error` or `disabled` variant; `disabled` stays focusable | [select/Select.tsx:80-97](src/components/select/Select.tsx#L80-L97)                                                                    |
| H3  | `AccordionItem`'s `overflow-hidden` clips the trigger ring on 3 sides                           | [accordion/Accordion.tsx:117](src/components/accordion/Accordion.tsx#L117)                                                             |
| H4  | `LnbHeader` (`overflow-y-auto` → both axes) clips row rings left/right                          | [lnb/Lnb.tsx:173](src/components/lnb/Lnb.tsx#L173)                                                                                     |
| H5  | `LnbGroupContent`'s `overflow-hidden` clips sub-item rings                                      | [lnb/Lnb.tsx:480](src/components/lnb/Lnb.tsx#L480)                                                                                     |
| H6  | `ListItem` — focusable `<button>`, no DS indicator                                              | [list/List.tsx:137-145](src/components/list/List.tsx#L137-L145)                                                                        |
| H7  | `SidebarItem` / `SidebarGroup` — focusable `<button>`, no DS indicator                          | [sidebar/Sidebar.tsx:195](src/components/sidebar/Sidebar.tsx#L195), [SidebarGroup.tsx:68](src/components/sidebar/SidebarGroup.tsx#L68) |
| H8  | `PopoverItem` — no indicator, and it drives a roving-tabindex menu                              | [popover/PopoverPanel.tsx:216](src/components/popover/PopoverPanel.tsx#L216)                                                           |
| H9  | `InputSearch` clear + `InputDate` trigger — no indicator, and the shell clips one if added      | [InputSearch.tsx:103](src/components/input/InputSearch.tsx#L103), [InputDate.tsx:196](src/components/input/InputDate.tsx#L196)         |
| H10 | `InputDropdown` row button — no indicator                                                       | [input/InputDropdown.tsx:158](src/components/input/InputDropdown.tsx#L158)                                                             |
| H11 | `Rating` paints the ring on the star, not the focused half-star                                 | [rating/Rating.tsx:172](src/components/rating/Rating.tsx#L172)                                                                         |
| H12 | `DropdownMenuItem` — 1.09:1 keyboard indicator, indistinguishable from hover                    | [dropdown-menu/dropdown-menu.tsx:107](src/components/dropdown-menu/dropdown-menu.tsx#L107)                                             |
| H13 | `--itui-focus-ring-width: 0.5px` is sub-pixel; under SC 2.4.11 (known, documented)              | [styles/global.css:66](src/styles/global.css#L66)                                                                                      |

### Medium

| #   | Issue                                                                                                                 | Location                                                                                                                         |
| --- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| M1  | `SelectItem` — 1.12:1 keyboard indicator                                                                              | [select/Select.tsx:253](src/components/select/Select.tsx#L253)                                                                   |
| M2  | `Sidebar` collapsed-rail tooltip is `:hover`-only; no `:focus-within`                                                 | [styles/global.css:709-713](src/styles/global.css#L709-L713)                                                                     |
| M3  | `Slider` hover ring and focus ring are coincident at the same 2px band                                                | [slider/Slider.tsx:71-73](src/components/slider/Slider.tsx#L71-L73)                                                              |
| M4  | `Chip` / `Tag` nest a `<button>` inside `role="button"` — two overlapping rings, two tab stops                        | [chip/Chip.tsx:192-231](src/components/chip/Chip.tsx#L192-L231), [tag/Tag.tsx:147-165](src/components/tag/Tag.tsx#L147-L165)     |
| M5  | `BreadcrumbItem` links rely on the UA outline                                                                         | [breadcrumb/Breadcrumb.tsx:158-163](src/components/breadcrumb/Breadcrumb.tsx#L158-L163)                                          |
| M6  | `CarouselContent` viewport clips rings of focusable slide content                                                     | [carousel/Carousel.tsx:226](src/components/carousel/Carousel.tsx#L226)                                                           |
| M7  | `ScrollAreaRoot` clips rings of focusable content at the viewport edges                                               | [scroll/Scroll.tsx:153](src/components/scroll/Scroll.tsx#L153)                                                                   |
| M8  | `Table` frame clips both axes (`overflow-x-auto`) — risk for cell content and when scrolled                           | [table/Table.tsx:111](src/components/table/Table.tsx#L111)                                                                       |
| M9  | `Calendar` / `DatePicker` cards clip the bottom day row and footer controls                                           | [Calendar.tsx:181](src/components/calendar/Calendar.tsx#L181), [DatePicker.tsx:256](src/components/calendar/DatePicker.tsx#L256) |
| M10 | Field focus (`focus-within`, 1px border) ignores `--itui-focus-ring-width` — thickening the ring leaves fields behind | [InputFieldShell.tsx:128](src/components/input/InputFieldShell.tsx#L128)                                                         |
| M11 | `InputGroupInput` zeroes its own ring (`focus-visible:ring-0`) and delegates to the group frame                       | [input-group/InputGroup.tsx:124](src/components/input-group/InputGroup.tsx#L124)                                                 |
| M12 | Brand ring is 2.82:1 against `#f5f5f5` hovered-row surfaces — under the 3:1 floor                                     | [styles/global.css:692](src/styles/global.css#L692)                                                                              |

### Low

| #   | Issue                                                                                                                                                                                                                                                      | Location                                                                                                                                                                             |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| L1  | `Chip` / `Tag` apply `focus-visible:focus-ring` to a non-focusable root when not interactive (inert class)                                                                                                                                                 | [chip/Chip.tsx:180](src/components/chip/Chip.tsx#L180), [tag/Tag.tsx:137](src/components/tag/Tag.tsx#L137)                                                                           |
| L2  | Legacy `tabs` family paints from the raw slate palette, so the focus surround ignores theming (known gap)                                                                                                                                                  | [tabs/tabs.tsx:60](src/components/tabs/tabs.tsx#L60)                                                                                                                                 |
| L3  | `Tooltip` content is `overflow-hidden` + `z-50` with hard-coded `#2a2a2a`; the trigger is `asChild`, so focus styling is entirely the consumer's                                                                                                           | [tooltip/tooltip.tsx:40](src/components/tooltip/tooltip.tsx#L40)                                                                                                                     |
| L4  | Overlay containers use `focus:outline-none` rather than `focus-visible:outline-none` (`Dialog`, `Modal`, `Popup`, `BottomSheet`, `Popover`, `OverflowMenu` content) — correct in practice for programmatically focused containers, but it is a sixth idiom | [modal.tsx:106](src/components/modals/modal.tsx#L106), [Popup.tsx:130](src/components/popup/Popup.tsx#L130), [BottomSheet.tsx:219](src/components/bottom-sheet/BottomSheet.tsx#L219) |
| L5  | `TableRow` accepts `onClick`/`onKeyDown` on a `<tr>`, which is not focusable — a clickable row is mouse-only unless the consumer adds `tabIndex`                                                                                                           | [table/Table.tsx:150-167](src/components/table/Table.tsx#L150-L167)                                                                                                                  |

---

## 7. Visual Verification List

| Component                                 | Reason                                                             | What to Verify                                                                                                                                                                                                              |
| ----------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accordion                                 | `overflow-hidden` on `AccordionItem` vs a `+2px` offset ring       | Tab to a trigger in all 4 variants. Confirm which sides of the ring survive; check the first and last item specifically.                                                                                                    |
| Lnb                                       | Two clipping ancestors (`overflow-y-auto`, `overflow-hidden`)      | Tab through top-level rows with the menu long enough to scroll, then expand a group and tab through sub-items. Check left/right edges and the last sub-item's bottom edge. Compare against `LnbToggle`, which is unclipped. |
| Calendar · DatePicker                     | Card `overflow-hidden` with `pt-5` and no bottom padding           | Tab to the bottom row of days and to `DateFooter` controls. Check both the 1-month and 2-month (`w-calendar-xl`) layouts.                                                                                                   |
| WheelPicker                               | No indicator today; container is itself a scroll box               | After adding a ring, confirm it is not clipped by the picker's own `overflow-y-auto` and that it identifies the active column.                                                                                              |
| Carousel                                  | Embla viewport `overflow-hidden`                                   | Put a `Button` inside a `CarouselItem`, tab to it, and check the ring at the viewport edge and while a slide is partly scrolled out.                                                                                        |
| Scroll (ScrollArea)                       | Root `relative overflow-hidden`                                    | Tab to focusable content at the top, bottom, left and right edges of the viewport.                                                                                                                                          |
| Table                                     | `overflow-x-auto` computes both axes to `auto`                     | Tab to a sortable header in the first and last column; scroll horizontally and re-check. Then place a `Checkbox` in an edge cell and repeat.                                                                                |
| Input family (slot buttons)               | 24px vertical lane inside an `overflow-hidden` box                 | `InputSearch` with text (clear ✕ visible) and `InputDate`: tab from the field to the slot button and check the ring's top/bottom edges.                                                                                     |
| Input family (error state)                | Focus indicator removed by the error branch                        | Render an errored `InputText` and an errored `Select`, tab in, confirm whether anything changes. Compare to the same field without `error`.                                                                                 |
| Dialog                                    | Panel `overflow-hidden` + body `overflow-y-auto overflow-x-hidden` | With a long body, tab to the first and last focusable child while scrolled to each end; check the ring at the scroll boundary.                                                                                              |
| PopoverPanel                              | `overflow-hidden` with 8px group padding                           | Tab to the first and last `PopoverItem` in a group, including one adjacent to a `PopoverSeparator`.                                                                                                                         |
| Slider                                    | Hover ring and focus ring occupy the same band                     | Hover the thumb while it is keyboard-focused; confirm whether the 0.5px hairline is discernible against the 2px `#e6f5fc` ring. Repeat at 2px ring width.                                                                   |
| Rating                                    | Ring granularity vs arrow-key granularity                          | Tab into the group and press → repeatedly; confirm whether the indicator moves on every press or every second press.                                                                                                        |
| OverflowMenu · dropdown-menu · SelectItem | Sub-1.2:1 background swap                                          | Arrow-key through each menu with the mouse parked off-screen. Confirm on a standard (non-calibrated) laptop display, not just a high-contrast one.                                                                          |
| Focus ring width                          | 0.5px is sub-pixel                                                 | Render any `Button` focused at DPR 1 and DPR 2, in Chrome and Firefox, and compare against `--itui-focus-ring-width: 2px`.                                                                                                  |

Storybook is the natural harness for all of the above — every component listed has stories in
`apps/storybook`. No automated a11y suite exists in this repo (`ACCESSIBILITY.md` records this), so
Playwright/Cypress coverage would have to be introduced rather than extended.

---

## 8. Recommended Implementation Plan

**Not implemented — plan only.**

### Phase 1 — Critical: restore keyboard visibility

1. **C1 — remove or scope `*:focus { outline: none !important }`** in
   [apps/web/app/globals.css:443](apps/web/app/globals.css#L443). This is the single highest-value
   change in the report: it re-enables the indicator on every component at once. If it was added for
   BlockNote, scope it to the editor the way lines 531 and 764 of `blocknote.css` already are. Verify
   nothing else was silently depending on it.
2. **C2** — `Dialog` close: `focus:outline-hidden` → `focus-visible:focus-ring`.
3. **C3** — `WheelPicker`: add an indicator to the focusable column (or move focus to the options).
4. **C4 / H12 / M1** — give the three menu families a real ring alongside their `data-[highlighted]`
   fill.
5. **H1 / H2** — move the focus declaration out of the error/disabled ternary in `InputFieldShell`
   and `SelectTrigger`. Decide separately whether `SelectTrigger` should forward `disabled`.

Exit criterion: every focusable node in the library paints something on `:focus-visible`, and
`apps/web` renders it.

### Phase 2 — High: rings that exist but are cut off or missing

1. **H3, H4, H5** — introduce `focus-ring-inset` (section 5) and apply it in `Accordion`, `Lnb`
   rows and `LnbGroupContent`, or add the 2px of container padding. Prefer the inset utility: it does
   not disturb layout and generalises to the other clipping containers.
2. **H6, H7, H8, H9, H10** — add `focus-visible:focus-ring` to `ListItem`, `SidebarItem`,
   `SidebarGroup` trigger, `PopoverItem`, the `InputSearch` clear button, the `InputDate` trigger and
   the `InputDropdown` row. Use the inset variant for the two field slot buttons.
3. **H11** — move `Rating`'s `has-[:focus-visible]:focus-ring` from the star to each half `<label>`.
4. **M2** — add `:focus-within` beside `:hover` in the sidebar tooltip rule.

Exit criterion: idioms 4 and 5 from section 5 are gone; only the outline and border idioms remain.

### Phase 3 — Consistency: one token set, one standard

1. **H13** — raise `--itui-focus-ring-width` to `2px`, **and simultaneously** raise the field
   family's focus border to 2px (**M10**) so the two idioms stay balanced.
2. Add `--itui-focus-ring-color` and `--itui-focus-ring-offset`, and ship `focus-ring-inset`
   (section 5). Update `TOKENS.md` and the focus-indicator table in `ACCESSIBILITY.md`.
3. **M12** — decide whether the ring colour needs to darken to `#008ecc` to clear 3:1 against
   `#f5f5f5` hovered surfaces.
4. **M11** — document `InputGroup`'s delegation to the group frame, or make it explicit rather than a
   `ring-0` reset.
5. Add a lint or `check:` script that fails on a focusable element with no `focus-visible:` class —
   this class of regression is invisible in review and there is no a11y test suite to catch it.

Exit criterion: one width token drives every indicator in the library; `ACCESSIBILITY.md`'s claim
that "if you find a control that ignores `--itui-focus-ring-width`, that is a bug" becomes true.

### Phase 4 — Visual polish

1. **M3** — separate `Slider`'s focus offset from its hover ring.
2. **M4 / L1** — resolve the nested-interactive shape in `Chip` / `Tag`; drop the inert class on
   non-interactive roots.
3. **M5** — bring `Breadcrumb` links onto the brand ring.
4. **M6, M7, M8, M9** — apply the inset ring (or container padding) to `Carousel`, `ScrollArea`,
   `Table` and the calendar cards once Phase 2 has proven the pattern.
5. **L2, L3, L4, L5** — legacy-palette `tabs`, `Tooltip` theming, the container `focus:outline-none`
   idiom, and `TableRow`'s non-focusable clickable row.
6. Work through the section 7 verification list in Storybook and record the results.
