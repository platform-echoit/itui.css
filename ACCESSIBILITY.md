# Accessibility

What this library handles for you, and what it cannot.

Every component ships a focus indicator, a keyboard model and the ARIA its own markup needs. What it
cannot supply is anything only you know: the name of an icon-only button, the alt text of a photo,
whether a dialog is the one that matters. Those are listed under
[What you have to supply](#what-you-have-to-supply) — the section worth reading first, because
everything there is silent when you skip it.

Anything not stated here is not a promise. Where a component only paints a state and leaves the
behaviour to you, this page says so.

- [Focus indicators](#focus-indicators)
- [Accessible names](#accessible-names)
- [Keyboard](#keyboard)
- [Announcements](#announcements)
- [What you have to supply](#what-you-have-to-supply)
- [`Checkbox.label` vs `Radio` children](#checkboxlabel-vs-radio-children)
- [Reduced motion](#reduced-motion)
- [Known gaps](#known-gaps)

---

## Focus indicators

> ⚠ **The focus indicator ships as a 0.5px hairline.** It satisfies **WCAG 2.1 SC 2.4.7 (Focus
> Visible)** — a keyboard user can see where they are — but it is well under the 2px that **WCAG 2.2
> SC 2.4.11 (Focus Appearance)** asks for, and being sub-pixel it renders unevenly across displays.
> Read the rest of this section before shipping to an audience that needs it — thickening it is one
> declaration.

> ⚠ **A global outline reset in your app switches every indicator below off.** A rule like
> `*:focus { outline: none !important }` in the consuming app removes the focus indicator of all ~30
> components at once, because `:focus-visible` is a subset of `:focus` and an author `!important`
> declaration beats a normal one regardless of specificity. Nothing this package can do reaches it —
> not even `!important`, which would only start an escalation war between the two stylesheets. If
> tabbing through your app shows no indicator anywhere, grep your global stylesheet for
> `outline: none` first, and scope the rule to the subtree that actually needed it (a rich-text
> editor, usually).

Every interactive component paints its indicator through a single utility, `focus-ring`, whose width
comes from one custom property. The shipped `0.5px` is sub-pixel, so a DPR-1 display rounds it (Chrome
draws it faint, Firefox may snap it to 1px) and only a 2× display renders it as exactly one device
pixel. Raise the width and the change lands in **all ~30 components at once**:

```css
:root {
  --itui-focus-ring-width: 2px; /* brand outline, 2px offset — the pre-1.1 look */
}
```

| Family                                                                                   | Indicator                                          | Utilities                                                 |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| **Fields** — `Input*`, `SelectTrigger`, `InputGroup`                                     | The box border turns brand blue — _not an outline_ | `focus-within:border-ring` · `focus-visible:border-ring`  |
| **Buttons** — `Button`, `FloatingButton`, `TableHead`, `GnbMenuItem`, nav items          | Brand outline, offset from the shape               | `focus-visible:focus-ring`                                |
| **Controls** — `Checkbox`, `Radio`, `Toggle`, `Rating`                                   | The same outline, on the box the input drives      | `peer-focus-visible:` / `has-[:focus-visible]:focus-ring` |
| **Inside a surface** — `Tab`, `Pagination`, list and menu rows                            | The same outline, offset outward from the shape    | `focus-visible:focus-ring`                                |
| **Inside a clipping ancestor** — `Accordion`, `Lnb`, the `InputSearch`/`InputDate` slots  | The same outline, painted inward instead           | `focus-visible:focus-ring-inset`                          |

`focus-ring` offsets the outline **outward**, which puts it in exactly the region an ancestor with
`overflow-hidden` — or any scroll container — cuts away. Being offset does not save it; only the
element's own overflow is harmless, since a box never clips its own outline. `focus-ring-inset` is
the same indicator with a negative offset for those places, and it needs the control to carry enough
padding to hold it (offset plus width, ~3px at the shipped values).

Give an element one variant or the other, **never both**: `tailwind-merge` knows neither utility, so
`cn('focus-ring', 'focus-ring-inset')` keeps the pair and the winner is whichever lands later in the
source.

Three components clip on purpose and cannot stop: `CarouselContent`'s viewport is `overflow-hidden`
because Embla measures it that way, `ScrollAreaRoot` is `overflow-hidden` because that is what makes
it a scroll area, and `Table` wraps its `<table>` in `overflow-x-auto` — which computes the vertical
axis to `auto` as well, so it clips both. The library cannot fix these from the inside: the clipping
is the feature, and the control at risk is **your** content, not ours. Anything focusable you put in
a slide, in a scroll viewport, or in a `TableCell` should carry `focus-visible:focus-ring-inset`, or
sit far enough from the edge — roughly 3px at the shipped values — that the outward ring clears it.
`TableCell`'s own `px-3 py-2` is already enough for a control that does not fill the cell.

The **field** indicator does not read from that property at all, because it is a border-colour change
rather than an outline — `Input`, `SelectTrigger` and `InputGroup` turn brand blue on focus whatever
the ring width is. That is a **1px border colour change**: enough for SC 2.4.7 on its own, weak
against WCAG 2.2 SC 2.4.11 (Focus Appearance), which asks for 2px. It is a property of the whole field
family — if you raise it, raise it for all of them at once, or two fields side by side will light up
differently.

Before 1.1 this was eight different idioms across ~30 files (four `outline` flavours, three `ring`
flavours, plus leftover shadcn `ring-slate-950`), with no single place to change them. A `ring` is a
`box-shadow`, so no `outline` rule could ever have switched those off; that is why `focus-ring` paints
an outline. If you find a control that ignores `--itui-focus-ring-width`, that is a bug worth
reporting — it means one of the old idioms was missed.

---

## Accessible names

### Components that name themselves

| Component                                                                                                  | Where the name comes from                                                                                   |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `InputText` and every `InputV2` field type                                                                 | the `label` prop, wired with `<label for>` (`aria-labelledby` where `for` cannot bind)                      |
| `SelectTrigger`                                                                                            | the `label` prop — via `aria-labelledby`, because a `role="combobox"` button takes no name from its content |
| `Checkbox`                                                                                                 | the `label` prop, through the `<label>` it already sits inside                                              |
| `Radio`                                                                                                    | its children, through the `<label>` it already sits inside                                                  |
| `Toggle`                                                                                                   | the `label` prop, when given — see below                                                                    |
| `Breadcrumb`, `GnbMenu`, `Pagination`                                                                      | a built-in `aria-label` on the landmark (`"breadcrumb"`, `"Main"`, `"Pagination"`)                          |
| `DateHeader` arrows, `Chip`/`Tag` close, `InputFileUploadItem` actions, `OverflowMenuTrigger`, `LnbToggle` | a `*Label` prop with a working English default you can translate                                            |

The field family shares one implementation, so all six field types wire `label`, `error` and
`helperText` the same way: the message is `aria-describedby` the control, an `error` sets
`aria-invalid` and gives the message `role="alert"`, and an `id` you pass is never overwritten.

### Components that cannot

`Dialog`, `Modal`, `Popup`, `BottomSheet`, `Tooltip`, `Avatar`, and any icon-only `Button` have no
text of their own to work from. They are covered in
[What you have to supply](#what-you-have-to-supply).

---

## Keyboard

Most keyboard behaviour comes from Radix UI, which implements the WAI-ARIA Authoring Practices —
`Accordion`, `Dialog`, `DropdownMenu`, `OverflowMenu`, `Popover`, `RadioGroup`, `ScrollArea`,
`Select`, `Slider`, `Tab`, `Toggle` and `Tooltip` all inherit it.

| Component                                    | Keys                                                                                                  |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `Dialog` · `Modal` · `Popup` · `BottomSheet` | Focus is trapped inside while open, `Esc` closes, and focus returns to the trigger on close           |
| `Select`                                     | `Enter`/`Space`/`↓` open · `↑` `↓` move · type-ahead jumps · `Enter` chooses · `Esc` closes           |
| `DropdownMenu` · `OverflowMenu`              | `↑` `↓` move · `→` `←` enter and leave a submenu · type-ahead · `Enter`/`Space` select · `Esc` closes |
| `PopoverMenu`                                | `↑` `↓` move · `Home`/`End` jump to the ends · one item is tabbable, the rest are reached by arrow    |
| `Tab`                                        | `←` `→` move between triggers · `Tab` moves on to the panel                                           |
| `RadioGroup`                                 | Arrow keys move **and** select · `Tab` moves past the whole group                                     |
| `Rating`                                     | Same — it is a real radio group of half-star inputs                                                   |
| `Slider`                                     | Arrow keys step · `Home`/`End` jump to the ends · `PageUp`/`PageDown` take a larger step              |
| `Accordion`                                  | `Enter`/`Space` toggle a section                                                                      |
| `Carousel`                                   | `←` `→` move slides (`↑` `↓` when vertical), while focus is inside it                                 |
| `Tag` · `Chip`                               | `Enter`/`Space` activate — **only** when you gave them `onClick` or `onClose`                         |
| `InputTag`                                   | `Enter` or `,` adds the typed tag · `Backspace` on an empty field removes the last one                |
| `InputSearch`                                | `Enter` fires `onSearch`                                                                              |
| `WheelPicker`                                | `↑` `↓` move the focused wheel                                                                        |
| `Calendar` · `DatePicker`                    | `Tab` moves day by day — see the note below                                                           |

The calendar is the exception to the rule above, and worth knowing before you ship a date field.
`@daypicker/react` implements no arrow-key navigation, so every day in the grid is an ordinary
tabbable `<button>`: reaching the 28th of a month means pressing `Tab` 28 times, and there is no
`PageUp`/`PageDown` month step. That is a working keyboard path, not a broken one — but it is not the
grid model the WAI-ARIA practices describe, and it is slow. Where the date can also be typed, say so:
`InputDate` accepts a typed date and only offers the calendar as an alternative.

`Table` deserves a note: a `TableHead` that is `sortable` wraps its content in a real `<button>`,
because a `<th>` cannot take focus. So an `onClick` you put on the cell starts firing on `Enter` and
`Space` too. A `TableRow` with `disabled` drops its `onClick` **and** its `onKeyDown`, so it cannot
be triggered by keyboard either — `pointer-events-none` alone would have stopped only the mouse.

---

## Announcements

These components are live regions and are read out when they appear, without any work from you:

| Component                 | Role / live                                         |
| ------------------------- | --------------------------------------------------- |
| `Toast`, `Snackbar`       | `role="status"`, `aria-live="polite"`               |
| `Spinner`, `Skeleton`     | `role="status"`                                     |
| A field's `error` message | `role="alert"`, and the control gets `aria-invalid` |
| `Badge` `variant="dot"`   | `role="status"` with a built-in label               |

`Button` with `loading` is deliberately **not** `disabled`: a native `disabled` would drop the button
out of the tab order the moment the user pressed Enter, so focus would fall to `<body>` and the
`aria-busy` change would never be announced. It stays focusable and swallows the click instead.

---

## What you have to supply

Each of these is silent when skipped — nothing throws, nothing renders wrong, and only an audit or a
screen reader will tell you.

**`TooltipProvider` is required.** A `Tooltip` without one as an ancestor throws at runtime. Mount
one near the root of the app. `Popover`, `Dialog` and `DropdownMenu` need no such wrapper — this is
the one exception, and the reason is that the provider shares open/close timing between neighbouring
tooltips.

```tsx
<TooltipProvider>
  <App />
</TooltipProvider>
```

**Every dialog needs a title.** `DialogTitle` is what names a `Dialog`; Radix warns in the console
when it is missing. If the design has no visible heading, render one and hide it with `sr-only`
rather than leaving it out. `Modal`, `Popup` and `BottomSheet` take a `title` prop instead — the same
requirement, spelled as a prop.

**Name your icon-only buttons.** A `Button` whose only child is an icon has no text: the icon slot is
`aria-hidden`, which is right for decoration and wrong for the whole label. Pass `aria-label`.

**Name a `Toggle`.** Pass `label` — it names the switch and doubles its hit target. Without it a
switch has no accessible name at all, so pass `aria-label` if the design allows no visible text.
The same applies to a `Checkbox` with no `label`.

**Name your nav landmarks.** `Lnb` and `Sidebar` render a `<nav>` with no `aria-label` of their own.
One unnamed nav on a page is fine; the moment a second landmark exists — a `Gnb`, a `Breadcrumb` —
a screen reader's landmark list reads "navigation" twice. Pass `aria-label` to distinguish them.

**Decide what an `Avatar` is.** `alt` defaults to `''`, which marks the photo decorative — correct
when the person's name is already beside it, wrong when the avatar stands alone. Set it in the second
case.

**Mount the toast viewports.** `toast()` and `snackbar()` render nothing without `<Toaster />` and
`<SnackbarToaster />`. They are scoped separately, so mount both — one is not a substitute for the
other.

**Give `CalendarEvent`s at size `md` another route.** At that size an event is drawn as a coloured
dot and its `label` is not rendered anywhere, so the information exists visually only. Use size `lg`,
or repeat the day's events in text.

**Own what the component only paints.** `TableRow.selected`, `Chip.selected` and `Tag.selected` paint
a state and nothing more — no `aria-selected`, no `aria-pressed`, because only you know what kind of
selection it is. Add the right attribute for your case.

---

## `Checkbox.label` vs `Radio` children

These two look like they should match, and they do not:

```tsx
<Checkbox label="Remember me" />
<Radio value="daily">Every day</Radio>
```

Both are correct. `Radio` is a Radix radio-group item, and taking its label from children is the
Radix idiom that every other Radix consumer already expects; `Checkbox` is a plain input this library
owns, where a `label` prop reads better and matches the `Input` family. Forcing one shape onto both
would be a breaking change on one of them in exchange for symmetry alone.

For accessibility they behave identically: both put the control inside a `<label>`, so the text names
it and clicking the text toggles it.

---

## Reduced motion

`Accordion`, `BottomSheet`, `Lnb`, `ScrollArea`, `Skeleton` and `Tab` shorten or drop their
animations under `prefers-reduced-motion: reduce`. Components that do not animate need no such
handling; the ones that animate purely through CSS transitions inherit whatever your own
`prefers-reduced-motion` rules set.

---

## Known gaps

Stated plainly, so you can decide whether they matter for your product:

- **The focus indicator is a 0.5px hairline.** Visible enough for WCAG 2.1 SC 2.4.7, but under the
  2px WCAG 2.2 SC 2.4.11 asks for, and sub-pixel widths render unevenly across displays. Every
  component reads one property, so `:root { --itui-focus-ring-width: 2px }` thickens it everywhere at
  once. See [Focus indicators](#focus-indicators).
- **Field focus is a 1px border.** Enough for WCAG 2.1 SC 2.4.7 on its own, weak against WCAG 2.2 SC
  2.4.11. Unaffected by the property above — a border is not an outline.
- **No dialog sets `aria-modal`, and this one is deliberate.** `Dialog`, `Modal`, `Popup` and
  `BottomSheet` all render Radix's dialog content, which calls `hideOthers()` to mark every
  sibling `aria-hidden` on mount. Radix's own source calls that the _"better supported equivalent
  to setting `aria-modal`"_, and we agree: adding the attribute on top would duplicate a mechanism
  that already has wider assistive-technology support. Expect an automated checklist to flag its
  absence anyway — the background really is hidden, just by the other method.
- **`SelectTrigger` accepts `disabled` without forwarding it.** A disabled trigger loses its
  pointer events but stays focusable and still opens by keyboard.
- **The `dropdown-menu` and `tabs` families paint themselves with raw palette classes.** Their
  keyboard behaviour is sound — it is Radix's — but their colours ignore your theme, including any
  high-contrast overrides. `OverflowMenu` and `Tab` are the token-based replacements.
- **`Calendar` has no arrow-key grid navigation.** Every day is a separate tab stop. See
  [Keyboard](#keyboard).
- **No automated a11y test suite.** Everything on this page was verified by reading the rendered
  markup and by hand, not by axe in CI.
