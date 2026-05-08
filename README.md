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

### 1. Configure Tailwind CSS

To ensure Tailwind generates the necessary styles for the components, you need to tell it where to look for the classes used in `@echoit/itui.css`.

#### For Tailwind CSS v4 (Recommended)

In your main CSS file (e.g., `app.css` or `globals.css`), simply import the library's styles. Tailwind v4 will automatically discover the component styles.

```css
@import "@echoit/itui.css";
```

#### For Tailwind CSS v3

Add the `@echoit/itui.css` distribution files to your `tailwind.config.js` `content` array:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@echoit/itui.css/dist/**/*.{js,mjs,cjs}', // Add this line
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 2. Import Styles

If you are not using the `@import` method above, make sure to import the stylesheet in your app entry point (e.g., `main.tsx` or `_app.tsx`):

```tsx
import '@echoit/itui.css';
```

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

Available `variant` values: `primary` | `alternative` | `secondary` | `link` | `link-underline`
Available `size` values: `lg` | `md` | `sm`

---

## Components

### Button

```tsx
import { Button } from '@echoit/itui.css';
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'primary' \| 'alternative' \| 'secondary' \| 'link' \| 'link-underline'` | `'primary'` |
| `size` | `'lg' \| 'md' \| 'sm'` | `'md'` |
| `iconLeft` | `ReactNode` | — |
| `iconRight` | `ReactNode` | — |
| `loading` | `boolean` | `false` |
| `fullWidth` | `boolean` | `false` |

---

### Avatar

```tsx
import { Avatar } from '@echoit/itui.css';
```

**Avatar**

| Prop | Type | Default |
|------|------|---------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl'` | `'md'` |
| `src` | `string` | — |
| `alt` | `string` | — |
| `backgroundColor` | `string` | — |

---

### Badge

```tsx
import { Badge } from '@echoit/itui.css';
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'circle' \| 'overflow' \| 'dot'` | `'circle'` |

---

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@echoit/itui.css';
```

Compound component — no custom variants. All parts extend `<div>` props.

---

### Checkbox

```tsx
import { Checkbox } from '@echoit/itui.css';
```

| Prop | Type | Default |
|------|------|---------|
| `size` | `'sm' \| 'md'` | `'md'` |
| `label` | `ReactNode` | — |

---

### Dialog

```tsx
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter,
  DialogTitle, DialogDescription, DialogClose
} from '@echoit/itui.css';
```

**DialogContent**

| Prop | Type | Default |
|------|------|---------|
| `showCloseButton` | `boolean` | `true` |
| `hideHeaderBorder` | `boolean` | `false` |

---

### Empty

```tsx
import { Empty } from '@echoit/itui.css';
```

| Prop | Type | Default |
|------|------|---------|
| `icon` | `ReactNode` | — |
| `title` | `string` | — |
| `description` | `string` | — |

---

### FileType

```tsx
import { FileType } from '@echoit/itui.css';
```

| Prop | Type | Default |
|------|------|---------|
| `logo` | `'aep' \| 'ai' \| 'avi' \| 'blend' \| 'c4d' \| 'cdr' \| 'css' \| 'csv' \| 'dmg' \| 'doc' \| 'exe' \| 'fig' \| 'gif' \| 'html' \| 'ico' \| 'java' \| 'jpeg' \| 'jpg' \| 'js' \| 'json' \| 'mov' \| 'mp3' \| 'mp4' \| 'mpg' \| 'pdf' \| 'png' \| 'ppt' \| 'psd' \| 'rar' \| 'skt' \| 'svg' \| 'tiff' \| 'txt' \| 'wav' \| 'webp' \| 'xls' \| 'zip'` | — |
| `type` | `'line' \| 'flat' \| 'color'` | `'line'` |

---

### Input

```tsx
import { Input } from '@echoit/itui.css';
```

| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | — |
| `error` | `string` | — |
| `prefix` | `ReactNode` | — |
| `suffix` | `ReactNode` | — |
| `block` | `boolean` | `false` |

---

### InputGroup

```tsx
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput } from '@echoit/itui.css';
```

**InputGroupAddon**

| Prop | Type | Default |
|------|------|---------|
| `align` | `'inline-start' \| 'inline-end' \| 'block-start' \| 'block-end'` | `'inline-start'` |

---

### Popover

```tsx
import {
  PopoverRoot, PopoverTrigger, PopoverContent,
  Popover, PopoverHeader, PopoverGroup, PopoverSeparator, PopoverItem
} from '@echoit/itui.css';
```

**PopoverContent**

| Prop | Type | Default |
|------|------|---------|
| `placement` | `'top-start' \| 'top-center' \| 'top-end' \| 'bottom-start' \| 'bottom-center' \| 'bottom-end' \| 'left-start' \| 'left-center' \| 'left-end' \| 'right-start' \| 'right-center' \| 'right-end'` | `'bottom-start'` |

**PopoverItem**

| Prop | Type | Default |
|------|------|---------|
| `icon` | `ReactNode` | — |
| `description` | `ReactNode` | — |
| `trailing` | `ReactNode` | — |
| `isSubmenu` | `boolean` | `false` |

---

### Scrollbar

```tsx
import { Scrollbar } from '@echoit/itui.css';
```

| Prop | Type | Default |
|------|------|---------|
| `size` | `'sm' \| 'md'` | `'md'` |

---

### Sidebar

```tsx
import { Sidebar, SidebarHeader, SidebarMenu, SidebarItem, SidebarFooter } from '@echoit/itui.css';
```

**Sidebar**

| Prop | Type | Default |
|------|------|---------|
| `collapsed` | `boolean` | `false` |

**SidebarItem**

| Prop | Type | Default |
|------|------|---------|
| `active` | `boolean` | `false` |
| `icon` | `ReactNode` | — |
| `label` | `string` | — |
| `indented` | `boolean` | `false` |

---

### Spinner

```tsx
import { Spinner } from '@echoit/itui.css';
```

| Prop | Type | Default |
|------|------|---------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |

---

### Table

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@echoit/itui.css';
```

**TableRow**

| Prop | Type | Default |
|------|------|---------|
| `selected` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |

**TableHead**

| Prop | Type | Default |
|------|------|---------|
| `sortDirection` | `'asc' \| 'desc'` | — |

---

### Toast (Toaster)

```tsx
import { Toaster } from '@echoit/itui.css';
```

Place `<Toaster />` once at the root of your app. Trigger toasts via the `sonner` API:

```tsx
import { toast } from 'sonner';

toast.success('Saved!');
toast.error('Something went wrong');
toast.info('New update available');
toast.warning('Disk space low');
```

---

## Theming

@echoit/itui.css uses CSS custom properties for theming. Override tokens at `:root` or on any scope:

```css
:root {
  --primary: oklch(0.55 0.2 260);
  --radius: 0.75rem;
}
```

See [`TOKENS.md`](./TOKENS.md) for the full token reference.

Dark mode works automatically via the `.dark` class:

```tsx
<html className="dark">
```

---

## Documentation

Full documentation — including component API, examples, and theming guides — is available at:

**[https://itui.echoit.co.kr](https://itui.echoit.co.kr)** <!-- TODO: update -->

---

## Browser Support

| Chrome | Edge   | Firefox | Safari |
| ------ | ------ | ------- | ------ |
| Last 2 | Last 2 | Last 2  | 15+    |

Requires support for CSS custom properties and `oklch()` color.

---

## Requirements

- React 19+
- Tailwind CSS 4+
- Node.js 18+

---

## Contributing

Contributions are welcome. See [DEVELOPMENT.md](./DEVELOPMENT.md) for build and publishing guidelines.

```bash
git clone git@github.com:platform-echoit/itui.css.git
cd itui.css
pnpm install
pnpm dev
```

---

## License

ISC © echoit
