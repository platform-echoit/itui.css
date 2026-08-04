# @echoit/itui.css

> A React component library built on Tailwind CSS v4 tokens, distributed as an npm package.

<!-- Badges (add when published) -->
<!--
[![npm version](https://img.shields.io/npm/v/@echoit/itui.css.svg)](https://www.npmjs.com/package/@echoit/itui.css)
[![license](https://img.shields.io/npm/l/@echoit/itui.css.svg)](./LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@echoit/itui.css)](https://bundlephobia.com/package/@echoit/itui.css)
-->

---

## Features

- 📦 **Drop-in npm package** — install once, import anywhere
- 🎨 **Token-driven theming** — fully customizable via CSS custom properties
- ⚡ **Tailwind CSS v4** — built on the latest `@theme` system
- 🌗 **Light / Dark mode** — first-class support out of the box
- 🦾 **Accessible by default** — powered by Radix primitives
- 🧱 **Tree-shakable** — import only what you use
- 📐 **TypeScript-first** — fully typed with generics where it matters

---

## Installation

```bash
npm install @echoit/itui.css
# yarn add @echoit/itui.css
# pnpm add @echoit/itui.css
```

### 1. Install Tailwind CSS v4

Tailwind v4 is **required**, not a nice-to-have. The published stylesheet _is_ a Tailwind v4
stylesheet — it opens with `@import "tailwindcss"` and declares its tokens in `@theme` — so a
project that does not run Tailwind v4 over its CSS fails at that import.

```bash
npm install tailwindcss @tailwindcss/vite      # Vite
# npm install tailwindcss @tailwindcss/postcss # Next.js / PostCSS
```

Register the plugin — for Vite:

**`vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

> **Tailwind v3 is not supported.** `@import "tailwindcss"` and `@theme` are v4-only syntax;
> a v3 PostCSS pipeline cannot process the shipped stylesheet. There is no `content` array to
> configure — see step 2 for why.

### 2. Load the styles

Pick **one** of these — both resolve to the same `dist/index.css`:

**From your CSS file**

```css
@import '@echoit/itui.css';
```

**Or from your app entry**

```tsx
// main.tsx · app/layout.tsx · _app.tsx
import '@echoit/itui.css';
```

You do **not** need to add an `@source` directive of your own. Tailwind v4 never scans
`node_modules/`, so the package's stylesheet ships its own `@source` — that is what generates
the utility classes the components are built from (`bg-brand`, `h-button-lg`, …). Without it
you would get the design tokens and no utilities at all: every component renders unstyled,
with no warning.

> ⚠️ **Subpath imports carry no CSS.** `import { Button } from '@echoit/itui.css/button'`
> keeps your dev-server module count small (~30 modules instead of ~15,000 through the
> barrel), but pulls in **no** stylesheet. If you only import by subpath, load the CSS once
> yourself:
>
> ```css
> @import '@echoit/itui.css/dist/index.css';
> ```

---

## Quick Start

```tsx
import { Button } from '@echoit/itui.css';

export default function App() {
  return (
    <Button variant="primary" size="lg">
      Click me
    </Button>
  );
}
```

Every prop, variant and default is in the [API reference][api], which is generated from the
source on each build — so it lists what the code accepts, not what a table was last updated to
say.

---

## Components

Prop tables live in the [API reference][api] — every export, read straight out of the source.
This section is the part a generator cannot write: which parts a compound component is made of,
and which name to reach for.

> Use `Tag` or `Chip` for a status or tier label. `Badge` is the notification counter and
> truncates arbitrary text, so `"Enterprise"` comes out as `"erp"`.

### Button

```tsx
import { Button } from '@echoit/itui.css';
```

[Props →][api-button]

---

### Avatar

```tsx
import { Avatar, AvatarGroup } from '@echoit/itui.css';
```

[Props →][api-avatar]

---

### Badge

```tsx
import { Badge } from '@echoit/itui.css';
```

[Props →][api-badge]

---

### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '@echoit/itui.css';
```

Compound component — no custom variants. All parts extend `<div>` props. `CardWithImage`,
`CardWithAction` and `PricingCard` are ready-made arrangements of the same parts.

[Props →][api-card]

---

### Checkbox

```tsx
import { Checkbox } from '@echoit/itui.css';
```

[Props →][api-checkbox]

---

### Dialog

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@echoit/itui.css';
```

Only `DialogContent` adds props of its own; every other part forwards to
`@radix-ui/react-dialog`. [Props →][api-dialog]

---

### Empty

```tsx
import { Empty } from '@echoit/itui.css';
```

[Props →][api-empty]

---

### FileType

```tsx
import { FileType, FileIcon } from '@echoit/itui.css';
```

`FileType` takes a `logo` naming the file kind; `FileIcon` picks that logo for you from a file
extension. [Props →][api-filetype]

---

### Icons

```tsx
import { MagnifyingGlassRegularIcon } from '@echoit/itui.css/icons';
```

The 6,615 ITUI icons ship from their own subpath — they are **not** on the main barrel, because a
dev server does not tree-shake and one `Button` import would otherwise load the whole set on every
page load. Production bundles are unaffected either way.

Each icon takes `width` / `height` plus any `svg` attribute. Their paths hardcode
`fill="#101010"`, so a text colour does not tint them:

```tsx
<MagnifyingGlassRegularIcon width={20} height={20} className="[&_path]:fill-current" />
```

---

### Input

```tsx
import { Input } from '@echoit/itui.css';
```

`Input` is the base field. The same module ships the composed ones — search, date, phone number,
file upload, dropdown, tag, textarea and rich text — each with props of its own.
[Props →][api-input]

---

### InputGroup

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
} from '@echoit/itui.css';
```

[Props →][api-inputgroup]

---

### Popover

```tsx
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverPanel,
  PopoverHeader,
  PopoverGroup,
  PopoverSeparator,
  PopoverItem,
} from '@echoit/itui.css';
```

`Popover` is the root, like `Dialog` / `Tabs` / `Tooltip`. `PopoverContent` is the floating
panel it opens — that is what holds the items. `PopoverPanel` is the same surface without
the popover machinery, for a panel something else already positions.

> ⚠️ **Renamed in `2.0`.** `Popover` used to be the standalone panel and the root was
> `PopoverRoot`. `PopoverRoot` still works as a `@deprecated` alias, but the panel moved to
> `PopoverPanel` — a `<Popover className="…">` left over from `1.x` no longer typechecks,
> deliberately, because the root has no element to put a `className` on.

Wrap the items in `PopoverMenu` when the popover is a menu — it adds `role="menu"` and
arrow-key navigation, which `PopoverItem` alone does not. [Props →][api-popover]

---

### ScrollArea

```tsx
import { ScrollArea } from '@echoit/itui.css';
```

`ScrollArea` is root, viewport and bar in one element — the common case. Compose
`ScrollAreaRoot` / `ScrollAreaViewport` / `ScrollAreaScrollbar` by hand when the content has to
sit between them. [Props →][api-scrollarea]

---

### Sidebar

```tsx
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarItem,
  SidebarFooter,
} from '@echoit/itui.css';
```

[Props →][api-sidebar]

---

### Spinner

```tsx
import { Spinner } from '@echoit/itui.css';
```

[Props →][api-spinner]

---

### Table

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@echoit/itui.css';
```

`TableRow` takes `selected` / `disabled`; `TableHead` takes `sortDirection` / `sortable`, which
also makes the header keyboard-operable and report `aria-sort`. [Props →][api-table]

---

### Toast (Toaster)

```tsx
import { Toaster } from '@echoit/itui.css';
```

Place `<Toaster />` once at the root of your app, then fire toasts with `toast`, re-exported
from this package:

```tsx
import { toast } from '@echoit/itui.css';

toast.success('Saved!');
toast.error('Something went wrong');
toast.info('New update available');
toast.warning('Disk space low');
```

`Snackbar` is the other notification surface — same idea, different design. [Props →][api-toast]

---

## Theming

@echoit/itui.css uses CSS custom properties for theming. Override tokens at `:root` or on any
scope — declare them **after** the library import so the cascade favours yours:

```css
@import '@echoit/itui.css';

:root {
  --color-brand: oklch(0.55 0.2 260); /* buttons, links, focus rings, active states */
  --radius-lg: 0.75rem; /* the radius 72 call sites use */
}
```

Two things to know before you pick a token name, because guessing wrong fails silently:

- **Override the token the components actually read.** Most components are styled with
  `bg-brand` / `text-brand` (22 modules) and `rounded-lg` (72 call sites), which read
  `--color-brand` and `--radius-lg`. `--primary` is real and reaches the 12 modules that use
  `bg-primary` / `text-primary`, but `Button` is not one of them — so overriding `--primary`
  alone looks like nothing happened. `--radius` is worse: it only feeds `--radius-base`, and
  **no component uses `rounded-base`**, so overriding it changes nothing anywhere.
- **Two layers exist.** Tokens declared in `@theme inline` (e.g. `--color-foreground`) forward
  to a plain variable (`--foreground`) — override the plain one. Tokens declared directly in
  `@theme` (e.g. `--color-brand`) are overridden under their own name.

See [`TOKENS.md`](https://github.com/platform-echoit/itui.css/blob/main/TOKENS.md) for the full
token reference.

Dark mode works automatically via the `.dark` class:

```tsx
<html className="dark">
```

---

## Documentation

There is no hosted docs site yet. Until there is, these are the sources of truth:

- **[API.md][api]** — every export with its props, defaults and JSDoc. Generated from the source
  on each build and checked in CI, so it is the one page that cannot be out of date.
- **[TOKENS.md](https://github.com/platform-echoit/itui.css/blob/main/TOKENS.md)** — full token reference.
- **This README** — setup, theming, and how the compound components fit together.
- **Types** — every component ships `.d.ts` with the same JSDoc, so your editor has all of the
  above without leaving the file.
- **Storybook** — `pnpm dev` in `apps/storybook` for a live component gallery.

> `API.md` and `TOKENS.md` are not inside the npm tarball — `files` ships `dist` only — so the
> links above point at GitHub.

---

## Browser Support

| Chrome | Edge   | Firefox | Safari |
| ------ | ------ | ------- | ------ |
| Last 2 | Last 2 | Last 2  | 15+    |

Requires support for CSS custom properties and `oklch()` color.

---

## Requirements

- **React 18 or 19** — declared as a peer dependency (`^18 || ^19`)
- **Tailwind CSS 4** — required, and declared as a peer dependency (`^4`), so your package manager
  will tell you when it is missing. See [step 1](#1-install-tailwind-css-v4). v3 is not supported.
  The bundler integration (`@tailwindcss/vite`, `@tailwindcss/postcss`, …) is **your** choice —
  this package does not depend on any of them
- **`@types/react`** — an *optional* peer dependency. It is only needed if you use TypeScript, and
  keeping it a peer means you get one copy of the React types, not a second one nested here
- **Node.js 18+**
- **An ESM-capable bundler.** The package is `"type": "module"` and ships **ESM only** — there
  is no CommonJS build, so `require('@echoit/itui.css')` does not work

---

## Contributing

Contributions are welcome. See [DEVELOPMENT.md](https://github.com/platform-echoit/itui.css/blob/main/DEVELOPMENT.md) for build and publishing guidelines.

```bash
git clone git@github.com:platform-echoit/itui.css.git
cd itui.css
pnpm install
pnpm dev
```

---

## License

ISC © echoit

<!--
  Absolute, because relative links break on the npm page and API.md is not in the
  tarball either way (`files` ships dist only). Anchors are the ones API.md's own
  index uses — regenerate it with `pnpm docs:api` if a heading moves.
-->

[api]: https://github.com/platform-echoit/itui.css/blob/main/API.md
[api-avatar]: https://github.com/platform-echoit/itui.css/blob/main/API.md#avatar
[api-badge]: https://github.com/platform-echoit/itui.css/blob/main/API.md#badge
[api-button]: https://github.com/platform-echoit/itui.css/blob/main/API.md#button
[api-card]: https://github.com/platform-echoit/itui.css/blob/main/API.md#card
[api-checkbox]: https://github.com/platform-echoit/itui.css/blob/main/API.md#checkbox
[api-dialog]: https://github.com/platform-echoit/itui.css/blob/main/API.md#echoitituicssdialog
[api-empty]: https://github.com/platform-echoit/itui.css/blob/main/API.md#empty
[api-filetype]: https://github.com/platform-echoit/itui.css/blob/main/API.md#filetype
[api-input]: https://github.com/platform-echoit/itui.css/blob/main/API.md#echoitituicssinput
[api-inputgroup]: https://github.com/platform-echoit/itui.css/blob/main/API.md#echoitituicssinput-group
[api-popover]: https://github.com/platform-echoit/itui.css/blob/main/API.md#echoitituicsspopover
[api-scrollarea]: https://github.com/platform-echoit/itui.css/blob/main/API.md#scrollarea
[api-sidebar]: https://github.com/platform-echoit/itui.css/blob/main/API.md#echoitituicsssidebar
[api-spinner]: https://github.com/platform-echoit/itui.css/blob/main/API.md#spinner
[api-table]: https://github.com/platform-echoit/itui.css/blob/main/API.md#echoitituicsstable
[api-toast]: https://github.com/platform-echoit/itui.css/blob/main/API.md#echoitituicsstoast
