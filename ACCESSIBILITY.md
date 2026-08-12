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

> ⚠ **The focus indicator ships at 1px.** It satisfies **WCAG 2.1 SC 2.4.7 (Focus Visible)** — a
> keyboard user can see where they are — but it is under the 2px that **WCAG 2.2 SC 2.4.11 (Focus
> Appearance)** asks for. Read the rest of this section before shipping to an audience that needs
> it; thickening it is one declaration.

> ⚠ **A global outline reset in your app switches every indicator below off.** A rule like
> `*:focus { outline: none !important }` in the consuming app removes the focus indicator of all ~30
> components at once, because `:focus-visible` is a subset of `:focus` and an author `!important`
> declaration beats a normal one regardless of specificity. Nothing this package can do reaches it —
> not even `!important`, which would only start an escalation war between the two stylesheets. If
> tabbing through your app shows no indicator anywhere, grep your global stylesheet for
> `outline: none` first, and scope the rule to the subtree that actually needed it (a rich-text
> editor, usually).

Every interactive component paints its indicator through a single utility — `focus-ring`, or
`focus-ring-inset` where an ancestor clips — and both read their width from one custom property.
`1px` is the only width in the library: nothing hard-codes a thicker one, and a component that
appears to want one is a bug rather than a special case. Raise the property and the change lands in
**all ~30 components at once**:

```css
:root {
  --itui-focus-ring-width: 2px; /* the width WCAG 2.2 SC 2.4.11 asks for */
}
```

| Family                                                                                   | Indicator                                       | Utilities                                                      |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| **Fields** — `Input*`, `SelectTrigger`                                                   | The same outline, plus a brand-blue border tint | `has-[:focus-visible]:focus-ring` · `focus-visible:focus-ring` |
| **Buttons** — `Button`, `FloatingButton`, `TableHead`, `GnbMenuItem`, nav items          | Brand outline, offset from the shape            | `focus-visible:focus-ring`                                     |
| **Controls** — `Checkbox`, `Radio`, `Toggle`, `Rating`                                   | The same outline, on the box the input drives   | `peer-focus-visible:` / `has-[:focus-visible]:focus-ring`      |
| **Inside a surface** — `Tab`, `Pagination`, list and menu rows                           | The same outline, offset outward from the shape | `focus-visible:focus-ring`                                     |
| **Inside a clipping ancestor** — `Accordion`, `Lnb`, the `InputSearch`/`InputDate` slots | The same outline, painted inward instead        | `focus-visible:focus-ring-inset`                               |

`focus-ring` offsets the outline **outward**, which puts it in exactly the region an ancestor with
`overflow-hidden` — or any scroll container — cuts away. Being offset does not save it; only the
element's own overflow is harmless, since a box never clips its own outline. `focus-ring-inset` is
the same indicator with a negative offset for those places, and it needs the control to carry enough
padding to hold it — offset plus width, so 3px at the shipped values.

Give an element one variant or the other, **never both**: `tailwind-merge` knows neither utility, so
`cn('focus-ring', 'focus-ring-inset')` keeps the pair and the winner is whichever lands later in the
source.

Three components clip on purpose and cannot stop: `CarouselContent`'s viewport is `overflow-hidden`
because Embla measures it that way, `ScrollAreaRoot` is `overflow-hidden` because that is what makes
it a scroll area, and `Table` wraps its `<table>` in `overflow-x-auto` — which computes the vertical
axis to `auto` as well, so it clips both. The library cannot fix these from the inside: the clipping
is the feature, and the control at risk is **your** content, not ours. Anything focusable you put in
a slide, in a scroll viewport, or in a `TableCell` should carry `focus-visible:focus-ring-inset`, or
sit far enough from the edge — 3px at the shipped values — that the outward ring clears it.
`TableCell`'s own `px-3 py-2` is already enough for a control that does not fill the cell.

The **field** family used to be the exception. It signalled focus by turning its border brand blue
and painted no outline at all, which meant it ignored the width property, and an errored field —
already red-bordered — changed nothing whatsoever when it took focus. Fields paint the same outline
as everything else now, in all three states, and the border tint rides on top of it as the "this
field is active" cue. The border itself stays **1px** and deliberately does not follow
`--itui-focus-ring-width`: an `h-12` field is `border-box`, so thickening its border would move the
content inside it every time you tabbed in.

Expect one difference from the rest of the library: a field shows its ring on a **mouse click** too,
where a `Button` does not. That is `:focus-visible` behaving as specified — a browser always
indicates focus on a control that takes text input, whatever moved focus there — and no CSS can
separate the two cases, since `:focus-visible` is the mechanism rather than something layered on top
of it. `SelectTrigger` is the exception inside the family: it is a `<button role="combobox">`, not a
text field, so clicking it opens the list without painting a ring.

One field-shaped component is still outside all of this: `InputGroup` is an unadapted shadcn
container that draws its own `3px` `box-shadow` ring and never reads the width property. It has no
consumer, no story and no docs entry — treat it as not-yet-adopted rather than as a second idiom to
copy.

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

- **The focus indicator is 1px.** Visible enough for WCAG 2.1 SC 2.4.7, but under the 2px WCAG 2.2
  SC 2.4.11 asks for. Every component reads one property, so
  `:root { --itui-focus-ring-width: 2px }` thickens it everywhere at once. See
  [Focus indicators](#focus-indicators).
- **The ring's brand blue is short of 3:1 on grey surfaces.** `#009ce0` measures 3.07:1 against
  white, which clears WCAG 2.2 SC 1.4.11, but 2.82:1 against `#f5f5f5` and 2.63:1 against `#ededed`
  — so a ring drawn on a subtle surface (`Lnb` rows, `Accordion` headers, `Tab` strips) is just
  under the bar. Kept as-is on purpose: the indicator being _the brand colour_ is what makes it read
  as one system. `:root { --itui-focus-ring-color: #008ecc }` takes the grey case to 3.36:1 without
  visibly changing the hue.
- **No dialog sets `aria-modal`, and this one is deliberate.** `Dialog`, `Modal`, `Popup` and
  `BottomSheet` all render Radix's dialog content, which calls `hideOthers()` to mark every
  sibling `aria-hidden` on mount. Radix's own source calls that the _"better supported equivalent
  to setting `aria-modal`"_, and we agree: adding the attribute on top would duplicate a mechanism
  that already has wider assistive-technology support. Expect an automated checklist to flag its
  absence anyway — the background really is hidden, just by the other method.
- **The `dropdown-menu` and `tabs` families paint themselves with raw palette classes.** Their
  keyboard behaviour is sound — it is Radix's — but their colours ignore your theme, including any
  high-contrast overrides. `OverflowMenu` and `Tab` are the token-based replacements.
- **`Calendar` has no arrow-key grid navigation.** Every day is a separate tab stop. See
  [Keyboard](#keyboard).
- **No automated a11y test suite.** Everything on this page was verified by reading the rendered
  markup and by hand, not by axe in CI.
