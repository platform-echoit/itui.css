# itui.css

> A React component library built on Tailwind CSS v4 tokens, distributed as an npm package.

<!-- Badges (add when published) -->
<!--
[![npm version](https://img.shields.io/npm/v/itui.css.svg)](https://www.npmjs.com/package/itui.css)
[![license](https://img.shields.io/npm/l/itui.css.svg)](./LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/itui.css)](https://bundlephobia.com/package/itui.css)
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
npm install itui.css
# yarn add itui.css
# pnpm add itui.css
```

Import the stylesheet once in your app entry (e.g. `main.tsx` or `_app.tsx`):

```tsx
import "itui.css/styles.css";
```

---

## Quick Start

```tsx
import { Button } from "itui.css";

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

itui.css uses CSS custom properties for theming. Override tokens at `:root` or on any scope:

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

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

```bash
git clone git@github.com:platform-echoit/itui.css.git
cd itui.css
pnpm install
pnpm dev
```

---

## License

[MIT](./LICENSE) © echoit
