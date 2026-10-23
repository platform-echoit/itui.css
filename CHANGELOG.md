# Changelog

All notable changes to `@echoit/itui.css`. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the version numbers follow the semver
reading in the README's _Versioning_ section — a patch never renames or removes anything, a minor
may add exports, props and `@deprecated` marks, a major may remove.

Versions up to `1.1.3` were published without a version bump in git, so they carry no tag; the
dates are the npm publish dates and the entries were reconstructed from the commits that landed on
`main` before each publish. Tags start at `v1.1.4`.

## [Unreleased]

### Added

### Changed

### Fixed

- 86 icon sources (`FileIcon`/`FileType` logos, `*TextFlatLogo`/`*TextColorLogo`, `EmptyIcon`,
  `Telegram`, `Visa`) used kebab-case SVG attributes (`stop-color`, `stroke-opacity`,
  `fill-opacity`), so React printed `Invalid DOM property` for each of them. Rendered markup is
  byte-identical; only the warnings are gone. A new `check:icons` gate (static scan in `prebuild`,
  render smoke in CI) keeps it that way.

### Internal

## [1.1.3] - 2026-10-23

No git tag — `package.json` still said `1.1.0` when this was published.

### Changed

- `Avatar` gains its border treatment and `Pagination` its updated controls; `CardsThree` icon
  added to the ITUI set (#83).

## 1.1.2

Never published.

## [1.1.1] - 2026-10-22

No git tag — `package.json` still said `1.1.0` when this was published.

### Added

- `@echoit/itui.css/fonts.css`: the four Pretendard `@font-face` blocks, as an opt-in import. The
  package registers no font by itself, so `--font-sans` now starts at `var(--font-pretendard)` (what
  `next/font` writes) and falls back to `Pretendard`, then `system-ui`. The `.woff2` files are not in
  the package; `fonts.css` expects them under `/fonts/`.
- `TableHead` `onSortChange` — the sortable header's button had no click handler at all.
- New ITUI icons (`CardsThree`, folder variants and others).

### Fixed

- `Table` read `border-neutral-subtle` / `bg-neutral-subtle`, which resolve to the `#9e9e9e` icon
  grey; it now reads the `#ededed` border and surface tokens the design names, and no row rule cuts
  across the rounded corners any more.
- `Popover`: `PopoverContent` and `PopoverPanel` disagreed on background and border tokens; both now
  draw `bg-inverse` on `border-border-neutral-subtle`, 16px radius, 288px width. The anchored
  calendar no longer opens in the viewport's top-left corner (`PopoverAnchor` hands Radix a real
  node on the second render).
- Close icons on `Dialog`, `Popup`, `ResourceModal`, `Chip` and `Tag` use `XLightIcon` and tint
  with the surrounding text colour.
- Input family CSS, dropdown icon colour on hover, `Stepper` and `CardTemplates` spacing.
- `WheelPicker` options loop around instead of stopping at the ends.
- `Radio` disabled state matches Figma (group at 30% opacity, `enabled:` gate on the checked ring).
- Inverse white is `#ffffff` everywhere it used to be a near-white.
- `Sidebar` layout.

### Internal

- A single `focus-ring` utility replaced eight focus idioms across 35 files (`--itui-focus-ring-width`,
  default `0px`). Two days later its `@utility` block was commented out of `global.css`, so the
  `focus-visible:focus-ring` classes those files carry currently emit **no rule** — controls fall
  back to the browser's default outline. Tracked as ISS-23; not fixed in this changelog's range.

## [1.1.0] - 2026-08-06

No git tag. Re-release of the `1.0.15` rename under a minor number, plus the items below.

### Changed

- **`InputV2`: the discriminant prop `variant` is now `fieldType`**, same ten members. No alias was
  kept, so `1.0.15` code using `variant` stops compiling — a breaking change that should not have
  shipped in a minor. Restoring `variant` as a `@deprecated` alias is tracked as ISS-25.
- `require('@echoit/itui.css')` (any subpath) now throws a sentence naming the fix instead of
  `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- `TabList` / `TabTrigger` / `TabContent` used outside `Tab` throw an error that names the library's
  own parts, not Radix's.
- `PopoverProps` is the package's own type; `className?: never` on the root carries the migration
  hint (`PopoverPanel`) in its JSDoc.

### Deprecated

- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` → `Tab` family.
- `TopNavigation`, `BottomNavigation`, `BottomNavigationItem` → `TopNavigationV2`,
  `BottomNavigationV2`, `BottomNavigationItemV2`.

### Fixed

- `Tag`, `Chip` and `Pagination` no longer hand a function to a DOM prop unconditionally, so a
  Server Component can render them (`next build` used to fail with "Event handlers cannot be passed
  to Client Component props").
- Every field type shares one a11y wiring: `label` names the control, `error` sets `aria-invalid`
  and a `role="alert"` message that the control points at (`InputTextarea`, `InputTag`,
  `InputFileUpload`, `InputTextFormatting` each lost a part of it). `Toggle` takes `label`.
- Components draw their icons from the ITUI set they ship and settle on the Regular weight.

### Added

- README: _Versioning_ policy and the _Next.js / React Server Components_ section.
- `ACCESSIBILITY.md`; a JSDoc description on every prop, so `API.md` has one too.
- `aria-modal` recorded as a deliberate omission (Radix hides the rest of the page with
  `aria-hidden`, the better-supported equivalent).

### Internal

- `fixtures/next-app`, `fixtures/vite-app` and the `rsc-fixture` CI job were removed; the README's
  claim that `check:rsc` "runs in CI" stopped being true here.

## [1.0.15] - 2026-08-05

No git tag.

### Changed

- **ESM only.** The CommonJS entry is gone; `tailwindcss`, `react` and `react-dom` are peer
  dependencies, `@types/react` an optional peer. Per-file emit instead of one bundle, so bundlers
  tree-shake and each module keeps its own `"use client"`.
- **`Popover` renamed** (breaking, shipped in this patch by mistake — see README _Versioning_):
  `Popover` is now the Radix root, the standalone panel is `PopoverPanel`, and `PopoverRoot` stays as
  a `@deprecated` alias.
- `Input` is a thin deprecated alias over `InputText`, the field every other field type is built
  from.
- Avatar: Figma's "Default" placeholder and the token-based default backgrounds; `Chip` `avatar`;
  `Empty` `type`; `Toast` bar component (the sonner `Toaster` alone shipped before);
  `CardWithAction` `tone`, `CardWithImage` `imagePosition`; `BottomSheet` `full` is 90dvh so the
  scrim stays tappable.

### Added

- Subpath exports: `@echoit/itui.css/icons` (the 6,600+ ITUI icons left the root barrel) and
  `@echoit/itui.css/<component>`.
- `Checkbox` `onCheckedChange`, same shape as `Radio`, `Toggle`, `Select` and `Rating`; its class
  overrides now reach `cn()`.
- `PopoverMenu`.
- Guards: `check:client`, `check:barrels`, `check:classes`, `check:docs` (`API.md` generated from the
  type checker), `check:rsc`, `check:bundle`.

### Fixed

- Component barrels no longer spread client modules with `export *`, which handed a Next consumer's
  client bundle the whole library (+467 kB).

[Unreleased]: https://github.com/platform-echoit/itui.css/compare/v1.1.4...HEAD
