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
@import "@echoit/itui.css/src/styles/global.css";
```

#### For Tailwind CSS v3
Add the `@echoit/itui.css` distribution files to your `tailwind.config.js` `content` array:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@echoit/itui.css/dist/**/*.{js,mjs,cjs}", // Add this line
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 2. Import Styles

If you are not using the `@import` method above, make sure to import the stylesheet in your app entry point (e.g., `main.tsx` or `_app.tsx`):

```tsx
import "@echoit/itui.css/src/styles/global.css";
```

---

## Quick Start

```tsx
import { Button } from "@echoit/itui.css";

export default function App() {
  return (
    <Button variant="default" size="lg">
      Click me
    </Button>
  );
}
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

| Chrome | Edge | Firefox | Safari |
|---|---|---|---|
| Last 2 | Last 2 | Last 2 | 15+ |

Requires support for CSS custom properties and `oklch()` color.

---

## Requirements

- React 18+
- Tailwind CSS 4+
- Node.js 18+

---

## Contributing

Contributions are welcome. See [DEVELOPMENT.md](./DEVELOPMENT.md) for build and publishing guidelines.

```bash
git clone git@github.com:platform-echoit/@echoit/itui.css.git
cd @echoit/itui.css
pnpm install
pnpm dev
```

---

## License

[MIT](./LICENSE) © echoit
