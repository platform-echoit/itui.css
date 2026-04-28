# Design Tokens Reference

> A complete reference of token names from **shadcn/ui** and **Tailwind CSS v4**

---

## 1. shadcn/ui Tokens

Declared in `:root` and `.dark` as CSS custom properties. Every background color token has a corresponding foreground token to ensure contrast.

### Background / Foreground

| Token          | Value (light)      |
| -------------- | ------------------ |
| `--background` | `oklch(1 0 0)`     |
| `--foreground` | `oklch(0.145 0 0)` |

### Card

| Token               | Value (light)      |
| ------------------- | ------------------ |
| `--card`            | `oklch(1 0 0)`     |
| `--card-foreground` | `oklch(0.145 0 0)` |

### Popover

| Token                  | Value (light)      |
| ---------------------- | ------------------ |
| `--popover`            | `oklch(1 0 0)`     |
| `--popover-foreground` | `oklch(0.145 0 0)` |

### Brand

| Token                    | Value (light)      |
| ------------------------ | ------------------ |
| `--primary`              | `oklch(0.205 0 0)` |
| `--primary-foreground`   | `oklch(0.985 0 0)` |
| `--secondary`            | `oklch(0.97 0 0)`  |
| `--secondary-foreground` | `oklch(0.205 0 0)` |
| `--muted`                | `oklch(0.97 0 0)`  |
| `--muted-foreground`     | `oklch(0.556 0 0)` |
| `--accent`               | `oklch(0.97 0 0)`  |
| `--accent-foreground`    | `oklch(0.205 0 0)` |

### Semantic

| Token                      | Value                      | Note            |
| -------------------------- | -------------------------- | --------------- |
| `--destructive`            | `oklch(0.577 0.245 27.3)`  | shadcn built-in |
| `--destructive-foreground` | `oklch(0.985 0 0)`         | shadcn built-in |
| `--success`                | `oklch(0.723 0.219 149.6)` | extended        |
| `--success-foreground`     | `oklch(0.985 0 0)`         | extended        |
| `--warning`                | `oklch(0.795 0.184 86.0)`  | extended        |
| `--warning-foreground`     | `oklch(0.985 0 0)`         | extended        |
| `--info`                   | `oklch(0.623 0.214 259.1)` | extended        |
| `--info-foreground`        | `oklch(0.985 0 0)`         | extended        |

### Border / Input / Ring

| Token      | Value              |
| ---------- | ------------------ |
| `--border` | `oklch(0.922 0 0)` |
| `--input`  | `oklch(0.922 0 0)` |
| `--ring`   | `oklch(0.708 0 0)` |

### Chart

| Token       | Value                     |
| ----------- | ------------------------- |
| `--chart-1` | `oklch(0.646 0.222 41.1)` |
| `--chart-2` | `oklch(0.6 0.118 184.7)`  |
| `--chart-3` | `oklch(0.398 0.07 227.4)` |
| `--chart-4` | `oklch(0.828 0.189 84.4)` |
| `--chart-5` | `oklch(0.769 0.188 70.1)` |

### Sidebar

| Token                          | Value              |
| ------------------------------ | ------------------ |
| `--sidebar`                    | `oklch(0.985 0 0)` |
| `--sidebar-foreground`         | `oklch(0.145 0 0)` |
| `--sidebar-primary`            | `oklch(0.205 0 0)` |
| `--sidebar-primary-foreground` | `oklch(0.985 0 0)` |
| `--sidebar-accent`             | `oklch(0.97 0 0)`  |
| `--sidebar-accent-foreground`  | `oklch(0.205 0 0)` |
| `--sidebar-border`             | `oklch(0.922 0 0)` |
| `--sidebar-ring`               | `oklch(0.708 0 0)` |

### Typography / Shape

| Token          | Value              |
| -------------- | ------------------ |
| `--radius`     | `0.625rem`         |
| `--font-sans`  | `Geist, system-ui` |
| `--font-mono`  | `Geist Mono`       |
| `--font-serif` | `Georgia, serif`   |

---

## 2. Tailwind CSS v4 Tokens

Tailwind v4 uses an `@theme` block — CSS variables are automatically mapped to utility classes.  
Example: `--color-red-500` → `bg-red-500`, `text-red-500`, `border-red-500`, etc.

### Color Palette — Gray Scales

| Token               | 50        | 100       | 200       | 300       | 400       | 500       | 600       | 700       | 800       | 900       | 950       |
| ------------------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| `--color-slate-*`   | `#f8fafc` | `#f1f5f9` | `#e2e8f0` | `#cbd5e1` | `#94a3b8` | `#64748b` | `#475569` | `#334155` | `#1e293b` | `#0f172a` | `#020617` |
| `--color-gray-*`    | `#f9fafb` | `#f3f4f6` | `#e5e7eb` | `#d1d5db` | `#9ca3af` | `#6b7280` | `#4b5563` | `#374151` | `#1f2937` | `#111827` | `#030712` |
| `--color-zinc-*`    | `#fafafa` | `#f4f4f5` | `#e4e4e7` | `#d4d4d8` | `#a1a1aa` | `#71717a` | `#52525b` | `#3f3f46` | `#27272a` | `#18181b` | `#09090b` |
| `--color-neutral-*` | `#fafafa` | `#f5f5f5` | `#e5e5e5` | `#d4d4d4` | `#a3a3a3` | `#737373` | `#525252` | `#404040` | `#262626` | `#171717` | `#0a0a0a` |
| `--color-stone-*`   | `#fafaf9` | `#f5f5f4` | `#e7e5e4` | `#d6d3d1` | `#a8a29e` | `#78716c` | `#57534e` | `#44403c` | `#292524` | `#1c1917` | `#0c0a09` |

### Color Palette — Hues

| Token               | 50        | 100       | 200       | 300       | 400       | 500       | 600       | 700       | 800       | 900       | 950       |
| ------------------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| `--color-red-*`     | `#fef2f2` | `#fee2e2` | `#fecaca` | `#fca5a5` | `#f87171` | `#ef4444` | `#dc2626` | `#b91c1c` | `#991b1b` | `#7f1d1d` | `#450a0a` |
| `--color-orange-*`  | `#fff7ed` | `#ffedd5` | `#fed7aa` | `#fdba74` | `#fb923c` | `#f97316` | `#ea580c` | `#c2410c` | `#9a3412` | `#7c2d12` | `#431407` |
| `--color-amber-*`   | `#fffbeb` | `#fef3c7` | `#fde68a` | `#fcd34d` | `#fbbf24` | `#f59e0b` | `#d97706` | `#b45309` | `#92400e` | `#78350f` | `#451a03` |
| `--color-yellow-*`  | `#fefce8` | `#fef9c3` | `#fef08a` | `#fde047` | `#facc15` | `#eab308` | `#ca8a04` | `#a16207` | `#854d0e` | `#713f12` | `#422006` |
| `--color-lime-*`    | `#f7fee7` | `#ecfccb` | `#d9f99d` | `#bef264` | `#a3e635` | `#84cc16` | `#65a30d` | `#4d7c0f` | `#3f6212` | `#365314` | `#1a2e05` |
| `--color-green-*`   | `#f0fdf4` | `#dcfce7` | `#bbf7d0` | `#86efac` | `#4ade80` | `#22c55e` | `#16a34a` | `#15803d` | `#166534` | `#14532d` | `#052e16` |
| `--color-emerald-*` | `#ecfdf5` | `#d1fae5` | `#a7f3d0` | `#6ee7b7` | `#34d399` | `#10b981` | `#059669` | `#047857` | `#065f46` | `#064e3b` | `#022c22` |
| `--color-teal-*`    | `#f0fdfa` | `#ccfbf1` | `#99f6e4` | `#5eead4` | `#2dd4bf` | `#14b8a6` | `#0d9488` | `#0f766e` | `#115e59` | `#134e4a` | `#042f2e` |
| `--color-cyan-*`    | `#ecfeff` | `#cffafe` | `#a5f3fc` | `#67e8f9` | `#22d3ee` | `#06b6d4` | `#0891b2` | `#0e7490` | `#155e75` | `#164e63` | `#083344` |
| `--color-sky-*`     | `#f0f9ff` | `#e0f2fe` | `#bae6fd` | `#7dd3fc` | `#38bdf8` | `#0ea5e9` | `#0284c7` | `#0369a1` | `#075985` | `#0c4a6e` | `#082f49` |
| `--color-blue-*`    | `#eff6ff` | `#dbeafe` | `#bfdbfe` | `#93c5fd` | `#60a5fa` | `#3b82f6` | `#2563eb` | `#1d4ed8` | `#1e40af` | `#1e3a8a` | `#172554` |
| `--color-indigo-*`  | `#eef2ff` | `#e0e7ff` | `#c7d2fe` | `#a5b4fc` | `#818cf8` | `#6366f1` | `#4f46e5` | `#4338ca` | `#3730a3` | `#312e81` | `#1e1b4b` |
| `--color-violet-*`  | `#f5f3ff` | `#ede9fe` | `#ddd6fe` | `#c4b5fd` | `#a78bfa` | `#8b5cf6` | `#7c3aed` | `#6d28d9` | `#5b21b6` | `#4c1d95` | `#2e1065` |
| `--color-purple-*`  | `#faf5ff` | `#f3e8ff` | `#e9d5ff` | `#d8b4fe` | `#c084fc` | `#a855f7` | `#9333ea` | `#7e22ce` | `#6b21a8` | `#581c87` | `#3b0764` |
| `--color-fuchsia-*` | `#fdf4ff` | `#fae8ff` | `#f5d0fe` | `#f0abfc` | `#e879f9` | `#d946ef` | `#c026d3` | `#a21caf` | `#86198f` | `#701a75` | `#4a044e` |
| `--color-pink-*`    | `#fdf2f8` | `#fce7f3` | `#fbcfe8` | `#f9a8d4` | `#f472b6` | `#ec4899` | `#db2777` | `#be185d` | `#9d174d` | `#831843` | `#500724` |
| `--color-rose-*`    | `#fff1f2` | `#ffe4e6` | `#fecdd3` | `#fda4af` | `#fb7185` | `#f43f5e` | `#e11d48` | `#be123c` | `#9f1239` | `#881337` | `#4c0519` |

### Special Colors

| Token                 | Value          |
| --------------------- | -------------- |
| `--color-black`       | `#000000`      |
| `--color-white`       | `#ffffff`      |
| `--color-transparent` | `transparent`  |
| `--color-inherit`     | `inherit`      |
| `--color-current`     | `currentColor` |

### Spacing — `--spacing-*`

| Token           | rem        | px      |
| --------------- | ---------- | ------- |
| `--spacing-px`  | —          | `1px`   |
| `--spacing-0`   | `0`        | `0px`   |
| `--spacing-0.5` | `0.125rem` | `2px`   |
| `--spacing-1`   | `0.25rem`  | `4px`   |
| `--spacing-1.5` | `0.375rem` | `6px`   |
| `--spacing-2`   | `0.5rem`   | `8px`   |
| `--spacing-2.5` | `0.625rem` | `10px`  |
| `--spacing-3`   | `0.75rem`  | `12px`  |
| `--spacing-3.5` | `0.875rem` | `14px`  |
| `--spacing-4`   | `1rem`     | `16px`  |
| `--spacing-5`   | `1.25rem`  | `20px`  |
| `--spacing-6`   | `1.5rem`   | `24px`  |
| `--spacing-7`   | `1.75rem`  | `28px`  |
| `--spacing-8`   | `2rem`     | `32px`  |
| `--spacing-9`   | `2.25rem`  | `36px`  |
| `--spacing-10`  | `2.5rem`   | `40px`  |
| `--spacing-11`  | `2.75rem`  | `44px`  |
| `--spacing-12`  | `3rem`     | `48px`  |
| `--spacing-14`  | `3.5rem`   | `56px`  |
| `--spacing-16`  | `4rem`     | `64px`  |
| `--spacing-20`  | `5rem`     | `80px`  |
| `--spacing-24`  | `6rem`     | `96px`  |
| `--spacing-28`  | `7rem`     | `112px` |
| `--spacing-32`  | `8rem`     | `128px` |
| `--spacing-36`  | `9rem`     | `144px` |
| `--spacing-40`  | `10rem`    | `160px` |
| `--spacing-44`  | `11rem`    | `176px` |
| `--spacing-48`  | `12rem`    | `192px` |
| `--spacing-52`  | `13rem`    | `208px` |
| `--spacing-56`  | `14rem`    | `224px` |
| `--spacing-60`  | `15rem`    | `240px` |
| `--spacing-64`  | `16rem`    | `256px` |
| `--spacing-72`  | `18rem`    | `288px` |
| `--spacing-80`  | `20rem`    | `320px` |
| `--spacing-96`  | `24rem`    | `384px` |

### Font Size — `--text-*`

| Token         | rem        | px      |
| ------------- | ---------- | ------- |
| `--text-xs`   | `0.75rem`  | `12px`  |
| `--text-sm`   | `0.875rem` | `14px`  |
| `--text-base` | `1rem`     | `16px`  |
| `--text-lg`   | `1.125rem` | `18px`  |
| `--text-xl`   | `1.25rem`  | `20px`  |
| `--text-2xl`  | `1.5rem`   | `24px`  |
| `--text-3xl`  | `1.875rem` | `30px`  |
| `--text-4xl`  | `2.25rem`  | `36px`  |
| `--text-5xl`  | `3rem`     | `48px`  |
| `--text-6xl`  | `3.75rem`  | `60px`  |
| `--text-7xl`  | `4.5rem`   | `72px`  |
| `--text-8xl`  | `6rem`     | `96px`  |
| `--text-9xl`  | `8rem`     | `128px` |

### Font Weight — `--font-weight-*`

| Token                      | Value |
| -------------------------- | ----- |
| `--font-weight-thin`       | `100` |
| `--font-weight-extralight` | `200` |
| `--font-weight-light`      | `300` |
| `--font-weight-normal`     | `400` |
| `--font-weight-medium`     | `500` |
| `--font-weight-semibold`   | `600` |
| `--font-weight-bold`       | `700` |
| `--font-weight-extrabold`  | `800` |
| `--font-weight-black`      | `900` |

### Line Height — `--leading-*`

| Token               | Value   |
| ------------------- | ------- |
| `--leading-none`    | `1`     |
| `--leading-tight`   | `1.25`  |
| `--leading-snug`    | `1.375` |
| `--leading-normal`  | `1.5`   |
| `--leading-relaxed` | `1.625` |
| `--leading-loose`   | `2`     |

### Letter Spacing — `--tracking-*`

| Token                | Value      |
| -------------------- | ---------- |
| `--tracking-tighter` | `-0.05em`  |
| `--tracking-tight`   | `-0.025em` |
| `--tracking-normal`  | `0em`      |
| `--tracking-wide`    | `0.025em`  |
| `--tracking-wider`   | `0.05em`   |
| `--tracking-widest`  | `0.1em`    |

### Border Radius — `--radius-*`

| Token           | Value      |
| --------------- | ---------- |
| `--radius-none` | `0px`      |
| `--radius-xs`   | `0.125rem` |
| `--radius-sm`   | `0.25rem`  |
| `--radius-md`   | `0.375rem` |
| `--radius-lg`   | `0.5rem`   |
| `--radius-xl`   | `0.75rem`  |
| `--radius-2xl`  | `1rem`     |
| `--radius-3xl`  | `1.5rem`   |
| `--radius-full` | `9999px`   |

### Box Shadow — `--shadow-*`

| Token            | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| `--shadow-xs`    | `0 1px 2px 0 rgb(0 0 0 / 0.05)`                                       |
| `--shadow-sm`    | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`       |
| `--shadow-md`    | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`    |
| `--shadow-lg`    | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`  |
| `--shadow-xl`    | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` |
| `--shadow-2xl`   | `0 25px 50px -12px rgb(0 0 0 / 0.25)`                                 |
| `--shadow-inner` | `inset 0 2px 4px 0 rgb(0 0 0 / 0.05)`                                 |
| `--shadow-none`  | `0 0 #0000`                                                           |

### Breakpoints — `--breakpoint-*`

| Token              | rem     | px       |
| ------------------ | ------- | -------- |
| `--breakpoint-sm`  | `40rem` | `640px`  |
| `--breakpoint-md`  | `48rem` | `768px`  |
| `--breakpoint-lg`  | `64rem` | `1024px` |
| `--breakpoint-xl`  | `80rem` | `1280px` |
| `--breakpoint-2xl` | `96rem` | `1536px` |

### Z-Index — `--z-*`

| Token      | Value  |
| ---------- | ------ |
| `--z-auto` | `auto` |
| `--z-0`    | `0`    |
| `--z-10`   | `10`   |
| `--z-20`   | `20`   |
| `--z-30`   | `30`   |
| `--z-40`   | `40`   |
| `--z-50`   | `50`   |

### Transition Easing — `--ease-*`

| Token           | Value                          |
| --------------- | ------------------------------ |
| `--ease-linear` | `linear`                       |
| `--ease-in`     | `cubic-bezier(0.4, 0, 1, 1)`   |
| `--ease-out`    | `cubic-bezier(0, 0, 0.2, 1)`   |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |

### Transition Duration — `--duration-*`

| Token             | Value    |
| ----------------- | -------- |
| `--duration-75`   | `75ms`   |
| `--duration-100`  | `100ms`  |
| `--duration-150`  | `150ms`  |
| `--duration-200`  | `200ms`  |
| `--duration-300`  | `300ms`  |
| `--duration-500`  | `500ms`  |
| `--duration-700`  | `700ms`  |
| `--duration-1000` | `1000ms` |

### Blur — `--blur-*`

| Token         | Value  |
| ------------- | ------ |
| `--blur-none` | `0`    |
| `--blur-xs`   | `4px`  |
| `--blur-sm`   | `8px`  |
| `--blur-md`   | `12px` |
| `--blur-lg`   | `16px` |
| `--blur-xl`   | `24px` |
| `--blur-2xl`  | `40px` |
| `--blur-3xl`  | `64px` |
