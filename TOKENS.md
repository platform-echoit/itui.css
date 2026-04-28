# itui.css Design Tokens

> The canonical token definitions for `itui.css`.
> Sources: shadcn/ui CSS variables · Tailwind CSS v4 `@theme` · Figma design tokens.
> Convention: CSS vars → `kebab-case` (`--color-brand`) · token keys → dot notation (`color.brand`).

---

## 1. Color Tokens

### 1.1 Primitive Palette

All primitive colors live in Tailwind v4's built-in `@theme`.
CSS variable pattern: `--color-{hue}-{shade}` → Tailwind class: `bg-{hue}-{shade}`.

#### Gray Scales

| Token             | 50        | 100       | 200       | 300       | 400       | 500       | 600       | 700       | 800       | 900       | 950       |
| ----------------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| `color.slate.*`   | `#f8fafc` | `#f1f5f9` | `#e2e8f0` | `#cbd5e1` | `#94a3b8` | `#64748b` | `#475569` | `#334155` | `#1e293b` | `#0f172a` | `#020617` |
| `color.gray.*`    | `#f9fafb` | `#f3f4f6` | `#e5e7eb` | `#d1d5db` | `#9ca3af` | `#6b7280` | `#4b5563` | `#374151` | `#1f2937` | `#111827` | `#030712` |
| `color.zinc.*`    | `#fafafa` | `#f4f4f5` | `#e4e4e7` | `#d4d4d8` | `#a1a1aa` | `#71717a` | `#52525b` | `#3f3f46` | `#27272a` | `#18181b` | `#09090b` |
| `color.neutral.*` | `#fafafa` | `#f5f5f5` | `#e5e5e5` | `#d4d4d4` | `#a3a3a3` | `#737373` | `#525252` | `#404040` | `#262626` | `#171717` | `#0a0a0a` |
| `color.stone.*`   | `#fafaf9` | `#f5f5f4` | `#e7e5e4` | `#d6d3d1` | `#a8a29e` | `#78716c` | `#57534e` | `#44403c` | `#292524` | `#1c1917` | `#0c0a09` |

#### Hue Scales

| Token             | 50        | 100       | 200       | 300       | 400       | 500       | 600       | 700       | 800       | 900       | 950       |
| ----------------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| `color.red.*`     | `#fef2f2` | `#fee2e2` | `#fecaca` | `#fca5a5` | `#f87171` | `#ef4444` | `#dc2626` | `#b91c1c` | `#991b1b` | `#7f1d1d` | `#450a0a` |
| `color.orange.*`  | `#fff7ed` | `#ffedd5` | `#fed7aa` | `#fdba74` | `#fb923c` | `#f97316` | `#ea580c` | `#c2410c` | `#9a3412` | `#7c2d12` | `#431407` |
| `color.amber.*`   | `#fffbeb` | `#fef3c7` | `#fde68a` | `#fcd34d` | `#fbbf24` | `#f59e0b` | `#d97706` | `#b45309` | `#92400e` | `#78350f` | `#451a03` |
| `color.yellow.*`  | `#fefce8` | `#fef9c3` | `#fef08a` | `#fde047` | `#facc15` | `#eab308` | `#ca8a04` | `#a16207` | `#854d0e` | `#713f12` | `#422006` |
| `color.lime.*`    | `#f7fee7` | `#ecfccb` | `#d9f99d` | `#bef264` | `#a3e635` | `#84cc16` | `#65a30d` | `#4d7c0f` | `#3f6212` | `#365314` | `#1a2e05` |
| `color.green.*`   | `#f0fdf4` | `#dcfce7` | `#bbf7d0` | `#86efac` | `#4ade80` | `#22c55e` | `#16a34a` | `#15803d` | `#166534` | `#14532d` | `#052e16` |
| `color.emerald.*` | `#ecfdf5` | `#d1fae5` | `#a7f3d0` | `#6ee7b7` | `#34d399` | `#10b981` | `#059669` | `#047857` | `#065f46` | `#064e3b` | `#022c22` |
| `color.teal.*`    | `#f0fdfa` | `#ccfbf1` | `#99f6e4` | `#5eead4` | `#2dd4bf` | `#14b8a6` | `#0d9488` | `#0f766e` | `#115e59` | `#134e4a` | `#042f2e` |
| `color.cyan.*`    | `#ecfeff` | `#cffafe` | `#a5f3fc` | `#67e8f9` | `#22d3ee` | `#06b6d4` | `#0891b2` | `#0e7490` | `#155e75` | `#164e63` | `#083344` |
| `color.sky.*`     | `#f0f9ff` | `#e0f2fe` | `#bae6fd` | `#7dd3fc` | `#38bdf8` | `#0ea5e9` | `#0284c7` | `#0369a1` | `#075985` | `#0c4a6e` | `#082f49` |
| `color.blue.*`    | `#eff6ff` | `#dbeafe` | `#bfdbfe` | `#93c5fd` | `#60a5fa` | `#3b82f6` | `#2563eb` | `#1d4ed8` | `#1e40af` | `#1e3a8a` | `#172554` |
| `color.indigo.*`  | `#eef2ff` | `#e0e7ff` | `#c7d2fe` | `#a5b4fc` | `#818cf8` | `#6366f1` | `#4f46e5` | `#4338ca` | `#3730a3` | `#312e81` | `#1e1b4b` |
| `color.violet.*`  | `#f5f3ff` | `#ede9fe` | `#ddd6fe` | `#c4b5fd` | `#a78bfa` | `#8b5cf6` | `#7c3aed` | `#6d28d9` | `#5b21b6` | `#4c1d95` | `#2e1065` |
| `color.purple.*`  | `#faf5ff` | `#f3e8ff` | `#e9d5ff` | `#d8b4fe` | `#c084fc` | `#a855f7` | `#9333ea` | `#7e22ce` | `#6b21a8` | `#581c87` | `#3b0764` |
| `color.fuchsia.*` | `#fdf4ff` | `#fae8ff` | `#f5d0fe` | `#f0abfc` | `#e879f9` | `#d946ef` | `#c026d3` | `#a21caf` | `#86198f` | `#701a75` | `#4a044e` |
| `color.pink.*`    | `#fdf2f8` | `#fce7f3` | `#fbcfe8` | `#f9a8d4` | `#f472b6` | `#ec4899` | `#db2777` | `#be185d` | `#9d174d` | `#831843` | `#500724` |
| `color.rose.*`    | `#fff1f2` | `#ffe4e6` | `#fecdd3` | `#fda4af` | `#fb7185` | `#f43f5e` | `#e11d48` | `#be123c` | `#9f1239` | `#881337` | `#4c0519` |

#### Special Colors

| Token               | CSS Variable          | Value          | Tailwind Class   |
| ------------------- | --------------------- | -------------- | ---------------- |
| `color.black`       | `--color-black`       | `#000000`      | `bg-black`       |
| `color.white`       | `--color-white`       | `#ffffff`      | `bg-white`       |
| `color.transparent` | `--color-transparent` | `transparent`  | `bg-transparent` |
| `color.inherit`     | `--color-inherit`     | `inherit`      | —                |
| `color.current`     | `--color-current`     | `currentColor` | `text-current`   |

---

### 1.2 Semantic Tokens (UI Layer)

Declared as CSS custom properties in `:root` / `.dark`. Surfaced into Tailwind via `@theme inline`.
Every background token has a paired foreground token for contrast.

#### Background / Foreground

| Token              | CSS Variable   | Light              | Dark               | Tailwind Class    |
| ------------------ | -------------- | ------------------ | ------------------ | ----------------- |
| `color.background` | `--background` | `oklch(1 0 0)`     | `oklch(0.145 0 0)` | `bg-background`   |
| `color.foreground` | `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | `text-foreground` |

#### Card

| Token                   | CSS Variable        | Light              | Dark               | Tailwind Class         |
| ----------------------- | ------------------- | ------------------ | ------------------ | ---------------------- |
| `color.card`            | `--card`            | `oklch(1 0 0)`     | `oklch(0.205 0 0)` | `bg-card`              |
| `color.card-foreground` | `--card-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | `text-card-foreground` |

#### Popover

| Token                      | CSS Variable           | Light              | Dark               | Tailwind Class            |
| -------------------------- | ---------------------- | ------------------ | ------------------ | ------------------------- |
| `color.popover`            | `--popover`            | `oklch(1 0 0)`     | `oklch(0.205 0 0)` | `bg-popover`              |
| `color.popover-foreground` | `--popover-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | `text-popover-foreground` |

#### Primary / Secondary / Muted / Accent

| Token                        | CSS Variable             | Light              | Dark               | Tailwind Class              |
| ---------------------------- | ------------------------ | ------------------ | ------------------ | --------------------------- |
| `color.primary`              | `--primary`              | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` | `bg-primary`                |
| `color.primary-foreground`   | `--primary-foreground`   | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` | `text-primary-foreground`   |
| `color.secondary`            | `--secondary`            | `oklch(0.97 0 0)`  | `oklch(0.269 0 0)` | `bg-secondary`              |
| `color.secondary-foreground` | `--secondary-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` | `text-secondary-foreground` |
| `color.muted`                | `--muted`                | `oklch(0.97 0 0)`  | `oklch(0.269 0 0)` | `bg-muted`                  |
| `color.muted-foreground`     | `--muted-foreground`     | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | `text-muted-foreground`     |
| `color.accent`               | `--accent`               | `oklch(0.97 0 0)`  | `oklch(0.269 0 0)` | `bg-accent`                 |
| `color.accent-foreground`    | `--accent-foreground`    | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` | `text-accent-foreground`    |

#### Status / Semantic

| Token                          | CSS Variable               | Light                      | Dark                       | Note            | Tailwind Class                |
| ------------------------------ | -------------------------- | -------------------------- | -------------------------- | --------------- | ----------------------------- |
| `color.destructive`            | `--destructive`            | `oklch(0.577 0.245 27.3)`  | `oklch(0.704 0.191 22.2)`  | shadcn built-in | `bg-destructive`              |
| `color.destructive-foreground` | `--destructive-foreground` | `oklch(0.985 0 0)`         | `oklch(0.985 0 0)`         |                 | `text-destructive-foreground` |
| `color.success`                | `--success`                | `oklch(0.723 0.219 149.6)` | `oklch(0.696 0.17 162.5)`  | extended        | `bg-success`                  |
| `color.success-foreground`     | `--success-foreground`     | `oklch(0.985 0 0)`         | `oklch(0.985 0 0)`         |                 | `text-success-foreground`     |
| `color.warning`                | `--warning`                | `oklch(0.795 0.184 86.0)`  | `oklch(0.769 0.188 70.1)`  | extended        | `bg-warning`                  |
| `color.warning-foreground`     | `--warning-foreground`     | `oklch(0.985 0 0)`         | `oklch(0.985 0 0)`         |                 | `text-warning-foreground`     |
| `color.info`                   | `--info`                   | `oklch(0.623 0.214 259.1)` | `oklch(0.623 0.214 259.1)` | extended        | `bg-info`                     |
| `color.info-foreground`        | `--info-foreground`        | `oklch(0.985 0 0)`         | `oklch(0.985 0 0)`         |                 | `text-info-foreground`        |

#### Border / Input / Ring

| Token          | CSS Variable | Light              | Dark                 | Tailwind Class  |
| -------------- | ------------ | ------------------ | -------------------- | --------------- |
| `color.border` | `--border`   | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | `border-border` |
| `color.input`  | `--input`    | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` | `border-input`  |
| `color.ring`   | `--ring`     | `oklch(0.708 0 0)` | `oklch(0.556 0 0)`   | `ring-ring`     |

#### Chart

| Token           | CSS Variable | Light                     | Dark                       | Tailwind Class |
| --------------- | ------------ | ------------------------- | -------------------------- | -------------- |
| `color.chart-1` | `--chart-1`  | `oklch(0.646 0.222 41.1)` | `oklch(0.488 0.243 264.4)` | `bg-chart-1`   |
| `color.chart-2` | `--chart-2`  | `oklch(0.6 0.118 184.7)`  | `oklch(0.696 0.17 162.5)`  | `bg-chart-2`   |
| `color.chart-3` | `--chart-3`  | `oklch(0.398 0.07 227.4)` | `oklch(0.769 0.188 70.1)`  | `bg-chart-3`   |
| `color.chart-4` | `--chart-4`  | `oklch(0.828 0.189 84.4)` | `oklch(0.627 0.265 303.9)` | `bg-chart-4`   |
| `color.chart-5` | `--chart-5`  | `oklch(0.769 0.188 70.1)` | `oklch(0.645 0.246 16.4)`  | `bg-chart-5`   |

#### Sidebar

| Token                              | CSS Variable                   | Light              | Dark                       | Tailwind Class                    |
| ---------------------------------- | ------------------------------ | ------------------ | -------------------------- | --------------------------------- |
| `color.sidebar`                    | `--sidebar`                    | `oklch(0.985 0 0)` | `oklch(0.205 0 0)`         | `bg-sidebar`                      |
| `color.sidebar-foreground`         | `--sidebar-foreground`         | `oklch(0.145 0 0)` | `oklch(0.985 0 0)`         | `text-sidebar-foreground`         |
| `color.sidebar-primary`            | `--sidebar-primary`            | `oklch(0.205 0 0)` | `oklch(0.488 0.243 264.4)` | `bg-sidebar-primary`              |
| `color.sidebar-primary-foreground` | `--sidebar-primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)`         | `text-sidebar-primary-foreground` |
| `color.sidebar-accent`             | `--sidebar-accent`             | `oklch(0.97 0 0)`  | `oklch(0.269 0 0)`         | `bg-sidebar-accent`               |
| `color.sidebar-accent-foreground`  | `--sidebar-accent-foreground`  | `oklch(0.205 0 0)` | `oklch(0.985 0 0)`         | `text-sidebar-accent-foreground`  |
| `color.sidebar-border`             | `--sidebar-border`             | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)`       | `border-sidebar-border`           |
| `color.sidebar-ring`               | `--sidebar-ring`               | `oklch(0.708 0 0)` | `oklch(0.556 0 0)`         | `ring-sidebar-ring`               |

---

### 1.3 itui.css Brand Tokens

Custom tokens specific to the itui.css design system.
Defined in `@theme` as `--color-{name}`. Used directly as Tailwind utilities.

#### Brand

| Token                    | CSS Variable               | Value     | Tailwind Class                             |
| ------------------------ | -------------------------- | --------- | ------------------------------------------ |
| `color.brand.default`    | `--color-brand`            | `#009ce0` | `bg-brand` · `text-brand` · `border-brand` |
| `color.brand.hover`      | `--color-brand-hover`      | `#54bdea` | `bg-brand-hover`                           |
| `color.brand.pressed`    | `--color-brand-pressed`    | `#008ecc` | `bg-brand-pressed` · `text-brand-pressed`  |
| `color.brand.subtle`     | `--color-brand-subtle`     | `#e6f5fc` | `bg-brand-subtle`                          |
| `color.brand.link-hover` | `--color-brand-link-hover` | `#33b0e6` | `text-brand-link-hover`                    |

#### Surface

| Token                   | CSS Variable              | Value  | Tailwind Class       |
| ----------------------- | ------------------------- | ------ | -------------------- |
| `color.surface.hover`   | `--color-surface-hover`   | `TODO` | `bg-surface-hover`   |
| `color.surface.pressed` | `--color-surface-pressed` | `TODO` | `bg-surface-pressed` |

#### Neutral (itui.css)

| Token                    | CSS Variable               | Value     | Tailwind Class                                      |
| ------------------------ | -------------------------- | --------- | --------------------------------------------------- |
| `color.neutral.ink`      | `--color-ink`              | `#0f0f0f` | `text-ink`                                          |
| `color.neutral.muted`    | `--color-neutral-muted`    | `#595858` | `text-neutral-muted`                                |
| `color.neutral.disabled` | `--color-neutral-disabled` | `#c2c2c2` | `text-neutral-disabled` · `border-neutral-disabled` |
| `color.neutral.subtle`   | `--color-neutral-subtle`   | `#ededed` | `border-neutral-subtle`                             |

#### Figma Semantic Colors

Tokens sourced from the Figma design file (`get_variable_defs`).

| Figma Token              | CSS Variable               | Value     | Tailwind Equivalent              |
| ------------------------ | -------------------------- | --------- | -------------------------------- |
| `color/semantic/red/500` | `--color-semantic-red-500` | `#f44336` | `bg-semantic-red-500`            |
| `color/static/white`     | —                          | `#ffffff` | `bg-white` (Tailwind built-in)   |
| `text/neutral/default`   | `--color-ink`              | `#0f0f0f` | `text-ink`                       |
| `text/neutral/muted`     | `--color-neutral-muted`    | `#595858` | `text-neutral-muted`             |
| `text/sematic/inverse`   | —                          | `#ffffff` | `text-white` (Tailwind built-in) |

---

## 2. Spacing

CSS variable pattern: `--spacing-{key}` · Tailwind class: `p-{key}`, `m-{key}`, `gap-{key}`, `w-{key}`, `h-{key}`.

### 2.1 Base Scale

| Token         | CSS Variable    | rem        | px      | Tailwind Class |
| ------------- | --------------- | ---------- | ------- | -------------- |
| `spacing.px`  | `--spacing-px`  | —          | `1px`   | `p-px`         |
| `spacing.0`   | `--spacing-0`   | `0`        | `0`     | `p-0`          |
| `spacing.0.5` | `--spacing-0.5` | `0.125rem` | `2px`   | `p-0.5`        |
| `spacing.1`   | `--spacing-1`   | `0.25rem`  | `4px`   | `p-1`          |
| `spacing.1.5` | `--spacing-1.5` | `0.375rem` | `6px`   | `p-1.5`        |
| `spacing.2`   | `--spacing-2`   | `0.5rem`   | `8px`   | `p-2`          |
| `spacing.2.5` | `--spacing-2.5` | `0.625rem` | `10px`  | `p-2.5`        |
| `spacing.3`   | `--spacing-3`   | `0.75rem`  | `12px`  | `p-3`          |
| `spacing.3.5` | `--spacing-3.5` | `0.875rem` | `14px`  | `p-3.5`        |
| `spacing.4`   | `--spacing-4`   | `1rem`     | `16px`  | `p-4`          |
| `spacing.5`   | `--spacing-5`   | `1.25rem`  | `20px`  | `p-5`          |
| `spacing.6`   | `--spacing-6`   | `1.5rem`   | `24px`  | `p-6`          |
| `spacing.7`   | `--spacing-7`   | `1.75rem`  | `28px`  | `p-7`          |
| `spacing.8`   | `--spacing-8`   | `2rem`     | `32px`  | `p-8`          |
| `spacing.9`   | `--spacing-9`   | `2.25rem`  | `36px`  | `p-9`          |
| `spacing.10`  | `--spacing-10`  | `2.5rem`   | `40px`  | `p-10`         |
| `spacing.11`  | `--spacing-11`  | `2.75rem`  | `44px`  | `p-11`         |
| `spacing.12`  | `--spacing-12`  | `3rem`     | `48px`  | `p-12`         |
| `spacing.14`  | `--spacing-14`  | `3.5rem`   | `56px`  | `p-14`         |
| `spacing.16`  | `--spacing-16`  | `4rem`     | `64px`  | `p-16`         |
| `spacing.20`  | `--spacing-20`  | `5rem`     | `80px`  | `p-20`         |
| `spacing.24`  | `--spacing-24`  | `6rem`     | `96px`  | `p-24`         |
| `spacing.28`  | `--spacing-28`  | `7rem`     | `112px` | `p-28`         |
| `spacing.32`  | `--spacing-32`  | `8rem`     | `128px` | `p-32`         |
| `spacing.36`  | `--spacing-36`  | `9rem`     | `144px` | `p-36`         |
| `spacing.40`  | `--spacing-40`  | `10rem`    | `160px` | `p-40`         |
| `spacing.44`  | `--spacing-44`  | `11rem`    | `176px` | `p-44`         |
| `spacing.48`  | `--spacing-48`  | `12rem`    | `192px` | `p-48`         |
| `spacing.52`  | `--spacing-52`  | `13rem`    | `208px` | `p-52`         |
| `spacing.56`  | `--spacing-56`  | `14rem`    | `224px` | `p-56`         |
| `spacing.60`  | `--spacing-60`  | `15rem`    | `240px` | `p-60`         |
| `spacing.64`  | `--spacing-64`  | `16rem`    | `256px` | `p-64`         |
| `spacing.72`  | `--spacing-72`  | `18rem`    | `288px` | `p-72`         |
| `spacing.80`  | `--spacing-80`  | `20rem`    | `320px` | `p-80`         |
| `spacing.96`  | `--spacing-96`  | `24rem`    | `384px` | `p-96`         |

### 2.2 Figma Static Spacing

Exact pixel values from Figma `static/space/*` tokens, resolved to the base scale.

| Figma Token       | px     | Maps to Tailwind |
| ----------------- | ------ | ---------------- |
| `static/space/0`  | `0px`  | `p-0`            |
| `static/space/4`  | `4px`  | `p-1`            |
| `static/space/40` | `40px` | `p-10`           |

---

## 3. Radius

### 3.1 Tailwind v4 Scale

CSS variable pattern: `--radius-{key}` → Tailwind class: `rounded-{key}`.

| Token         | CSS Variable    | Value            | Tailwind Class |
| ------------- | --------------- | ---------------- | -------------- |
| `radius.none` | `--radius-none` | `0px`            | `rounded-none` |
| `radius.xs`   | `--radius-xs`   | `0.125rem` (2px) | `rounded-xs`   |
| `radius.sm`   | `--radius-sm`   | `0.25rem` (4px)  | `rounded-sm`   |
| `radius.md`   | `--radius-md`   | `0.375rem` (6px) | `rounded-md`   |
| `radius.lg`   | `--radius-lg`   | `0.5rem` (8px)   | `rounded-lg`   |
| `radius.xl`   | `--radius-xl`   | `0.75rem` (12px) | `rounded-xl`   |
| `radius.2xl`  | `--radius-2xl`  | `1rem` (16px)    | `rounded-2xl`  |
| `radius.3xl`  | `--radius-3xl`  | `1.5rem` (24px)  | `rounded-3xl`  |
| `radius.full` | `--radius-full` | `9999px`         | `rounded-full` |

### 3.2 shadcn/ui Base Token

| Token         | CSS Variable | Value             | Note                                                                      |
| ------------- | ------------ | ----------------- | ------------------------------------------------------------------------- |
| `radius.base` | `--radius`   | `0.625rem` (10px) | Design system base radius, surfaced as `rounded-base` via `@theme inline` |

### 3.3 Figma Radius Tokens

> ⚠ Figma uses a different radius scale. Map by pixel value, not by name.

| Figma Token   | px               | Maps to Tailwind                                        |
| ------------- | ---------------- | ------------------------------------------------------- |
| `radius/full` | `999px`          | `rounded-full`                                          |
| `radius/2xl`  | `28px` → 1.75rem | No built-in equivalent → `TODO: --radius-component-2xl` |
| `radius/lg`   | `16px` → 1rem    | `rounded-2xl` (Tailwind `--radius-2xl = 1rem`)          |

---

## 4. Typography

### 4.1 Font Family

| Token                              | CSS Variable        | Value                    | Tailwind Class                              |
| ---------------------------------- | ------------------- | ------------------------ | ------------------------------------------- |
| `typography.fontFamily.sans`       | `--font-sans`       | `Geist, system-ui`       | `font-sans`                                 |
| `typography.fontFamily.mono`       | `--font-mono`       | `Geist Mono`             | `font-mono`                                 |
| `typography.fontFamily.serif`      | `--font-serif`      | `Georgia, serif`         | `font-serif`                                |
| `typography.fontFamily.pretendard` | `--font-pretendard` | `Pretendard, sans-serif` | `font-pretendard` · **TODO: register font** |

> `Pretendard` is used in Figma designs (e.g. Badge, Button). Register via `@font-face` and add `--font-pretendard` to `@theme`.

### 4.2 Font Size

CSS variable: `--text-{key}` → Tailwind class: `text-{key}`.

| Token                      | CSS Variable  | rem        | px      | Tailwind Class |
| -------------------------- | ------------- | ---------- | ------- | -------------- |
| `typography.fontSize.xs`   | `--text-xs`   | `0.75rem`  | `12px`  | `text-xs`      |
| `typography.fontSize.sm`   | `--text-sm`   | `0.875rem` | `14px`  | `text-sm`      |
| `typography.fontSize.base` | `--text-base` | `1rem`     | `16px`  | `text-base`    |
| `typography.fontSize.lg`   | `--text-lg`   | `1.125rem` | `18px`  | `text-lg`      |
| `typography.fontSize.xl`   | `--text-xl`   | `1.25rem`  | `20px`  | `text-xl`      |
| `typography.fontSize.2xl`  | `--text-2xl`  | `1.5rem`   | `24px`  | `text-2xl`     |
| `typography.fontSize.3xl`  | `--text-3xl`  | `1.875rem` | `30px`  | `text-3xl`     |
| `typography.fontSize.4xl`  | `--text-4xl`  | `2.25rem`  | `36px`  | `text-4xl`     |
| `typography.fontSize.5xl`  | `--text-5xl`  | `3rem`     | `48px`  | `text-5xl`     |
| `typography.fontSize.6xl`  | `--text-6xl`  | `3.75rem`  | `60px`  | `text-6xl`     |
| `typography.fontSize.7xl`  | `--text-7xl`  | `4.5rem`   | `72px`  | `text-7xl`     |
| `typography.fontSize.8xl`  | `--text-8xl`  | `6rem`     | `96px`  | `text-8xl`     |
| `typography.fontSize.9xl`  | `--text-9xl`  | `8rem`     | `128px` | `text-9xl`     |

#### Figma Font Sizes

| Figma Token    | px     | Maps to Tailwind |
| -------------- | ------ | ---------------- |
| `font/size/12` | `12px` | `text-xs`        |
| `font/size/14` | `14px` | `text-sm`        |
| `font/size/18` | `18px` | `text-lg`        |

### 4.3 Font Weight

CSS variable: `--font-weight-{key}` → Tailwind class: `font-{key}`.

| Token                              | CSS Variable               | Value | Tailwind Class    |
| ---------------------------------- | -------------------------- | ----- | ----------------- |
| `typography.fontWeight.thin`       | `--font-weight-thin`       | `100` | `font-thin`       |
| `typography.fontWeight.extralight` | `--font-weight-extralight` | `200` | `font-extralight` |
| `typography.fontWeight.light`      | `--font-weight-light`      | `300` | `font-light`      |
| `typography.fontWeight.normal`     | `--font-weight-normal`     | `400` | `font-normal`     |
| `typography.fontWeight.medium`     | `--font-weight-medium`     | `500` | `font-medium`     |
| `typography.fontWeight.semibold`   | `--font-weight-semibold`   | `600` | `font-semibold`   |
| `typography.fontWeight.bold`       | `--font-weight-bold`       | `700` | `font-bold`       |
| `typography.fontWeight.extrabold`  | `--font-weight-extrabold`  | `800` | `font-extrabold`  |
| `typography.fontWeight.black`      | `--font-weight-black`      | `900` | `font-black`      |

#### Figma Font Weights

| Figma Token           | Value | Maps to Tailwind |
| --------------------- | ----- | ---------------- |
| `font/weight/regular` | `400` | `font-normal`    |
| `font/weight/medium`  | `500` | `font-medium`    |

### 4.4 Line Height

CSS variable: `--leading-{key}` → Tailwind class: `leading-{key}`.

| Token                           | CSS Variable        | Value   | Tailwind Class    |
| ------------------------------- | ------------------- | ------- | ----------------- |
| `typography.lineHeight.none`    | `--leading-none`    | `1`     | `leading-none`    |
| `typography.lineHeight.tight`   | `--leading-tight`   | `1.25`  | `leading-tight`   |
| `typography.lineHeight.snug`    | `--leading-snug`    | `1.375` | `leading-snug`    |
| `typography.lineHeight.normal`  | `--leading-normal`  | `1.5`   | `leading-normal`  |
| `typography.lineHeight.relaxed` | `--leading-relaxed` | `1.625` | `leading-relaxed` |
| `typography.lineHeight.loose`   | `--leading-loose`   | `2`     | `leading-loose`   |

#### Figma Line Heights (resolved via Tailwind spacing scale)

| Figma Token           | px     | Maps to Tailwind                             |
| --------------------- | ------ | -------------------------------------------- |
| `font/line-height/sm` | `16px` | `leading-4` (1rem)                           |
| `font/line-height/md` | `20px` | `leading-5` (1.25rem)                        |
| `font/line-height/xl` | `26px` | No built-in → `leading-[26px]` (last resort) |

### 4.5 Letter Spacing

CSS variable: `--tracking-{key}` → Tailwind class: `tracking-{key}`.

#### Tailwind Built-in Scale

| Token                              | CSS Variable         | Value      | Tailwind Class     |
| ---------------------------------- | -------------------- | ---------- | ------------------ |
| `typography.letterSpacing.tighter` | `--tracking-tighter` | `-0.05em`  | `tracking-tighter` |
| `typography.letterSpacing.tight`   | `--tracking-tight`   | `-0.025em` | `tracking-tight`   |
| `typography.letterSpacing.normal`  | `--tracking-normal`  | `0em`      | `tracking-normal`  |
| `typography.letterSpacing.wide`    | `--tracking-wide`    | `0.025em`  | `tracking-wide`    |
| `typography.letterSpacing.wider`   | `--tracking-wider`   | `0.05em`   | `tracking-wider`   |
| `typography.letterSpacing.widest`  | `--tracking-widest`  | `0.1em`    | `tracking-widest`  |

#### itui.css Custom Letter Spacing Tokens

Defined in `@theme` to match Figma absolute pixel values at their paired font sizes.

| Token                         | CSS Variable    | Value     | Paired Font Size   | Tailwind Class |
| ----------------------------- | --------------- | --------- | ------------------ | -------------- |
| `typography.letterSpacing.sm` | `--tracking-sm` | `0.3px`   | `12px (text-xs)`   | `tracking-sm`  |
| `typography.letterSpacing.md` | `--tracking-md` | `0.2px`   | `14px (text-sm)`   | `tracking-md`  |
| `typography.letterSpacing.lg` | `--tracking-lg` | `TODO`    | `16px (text-base)` | `tracking-lg`  |
| `typography.letterSpacing.xl` | `--tracking-xl` | `-0.04px` | `18px (text-lg)`   | `tracking-xl`  |

#### Figma Letter Spacing

| Figma Token              | Absolute px | Maps to Token |
| ------------------------ | ----------- | ------------- |
| `font/letter-spacing/sm` | `0.3px`     | `tracking-sm` |
| `font/letter-spacing/md` | `0.2px`     | `tracking-md` |
| `font/letter-spacing/xl` | `-0.04px`   | `tracking-xl` |

---

## 5. Shadow

CSS variable: `--shadow-{key}` → Tailwind class: `shadow-{key}`.

| Token          | CSS Variable     | Value                                                                 | Tailwind Class |
| -------------- | ---------------- | --------------------------------------------------------------------- | -------------- |
| `shadow.none`  | `--shadow-none`  | `0 0 #0000`                                                           | `shadow-none`  |
| `shadow.xs`    | `--shadow-xs`    | `0 1px 2px 0 rgb(0 0 0 / 0.05)`                                       | `shadow-xs`    |
| `shadow.sm`    | `--shadow-sm`    | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`       | `shadow-sm`    |
| `shadow.md`    | `--shadow-md`    | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`    | `shadow-md`    |
| `shadow.lg`    | `--shadow-lg`    | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`  | `shadow-lg`    |
| `shadow.xl`    | `--shadow-xl`    | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` | `shadow-xl`    |
| `shadow.2xl`   | `--shadow-2xl`   | `0 25px 50px -12px rgb(0 0 0 / 0.25)`                                 | `shadow-2xl`   |
| `shadow.inner` | `--shadow-inner` | `inset 0 2px 4px 0 rgb(0 0 0 / 0.05)`                                 | `shadow-inner` |

---

## 6. Z-Index

CSS variable: `--z-{key}` → Tailwind class: `z-{key}`.

| Token    | CSS Variable | Value  | Tailwind Class |
| -------- | ------------ | ------ | -------------- |
| `z.auto` | `--z-auto`   | `auto` | `z-auto`       |
| `z.0`    | `--z-0`      | `0`    | `z-0`          |
| `z.10`   | `--z-10`     | `10`   | `z-10`         |
| `z.20`   | `--z-20`     | `20`   | `z-20`         |
| `z.30`   | `--z-30`     | `30`   | `z-30`         |
| `z.40`   | `--z-40`     | `40`   | `z-40`         |
| `z.50`   | `--z-50`     | `50`   | `z-50`         |

---

## 7. Motion

### 7.1 Transition Easing

CSS variable: `--ease-{key}` → Tailwind class: `ease-{key}`.

| Token                | CSS Variable    | Value                          | Tailwind Class |
| -------------------- | --------------- | ------------------------------ | -------------- |
| `motion.ease.linear` | `--ease-linear` | `linear`                       | `ease-linear`  |
| `motion.ease.in`     | `--ease-in`     | `cubic-bezier(0.4, 0, 1, 1)`   | `ease-in`      |
| `motion.ease.out`    | `--ease-out`    | `cubic-bezier(0, 0, 0.2, 1)`   | `ease-out`     |
| `motion.ease.in-out` | `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | `ease-in-out`  |

### 7.2 Transition Duration

CSS variable: `--duration-{key}` → Tailwind class: `duration-{key}`.

| Token                  | CSS Variable      | Value    | Tailwind Class  |
| ---------------------- | ----------------- | -------- | --------------- |
| `motion.duration.75`   | `--duration-75`   | `75ms`   | `duration-75`   |
| `motion.duration.100`  | `--duration-100`  | `100ms`  | `duration-100`  |
| `motion.duration.150`  | `--duration-150`  | `150ms`  | `duration-150`  |
| `motion.duration.200`  | `--duration-200`  | `200ms`  | `duration-200`  |
| `motion.duration.300`  | `--duration-300`  | `300ms`  | `duration-300`  |
| `motion.duration.500`  | `--duration-500`  | `500ms`  | `duration-500`  |
| `motion.duration.700`  | `--duration-700`  | `700ms`  | `duration-700`  |
| `motion.duration.1000` | `--duration-1000` | `1000ms` | `duration-1000` |

### 7.3 Blur

CSS variable: `--blur-{key}` → Tailwind class: `blur-{key}`.

| Token              | CSS Variable  | Value  | Tailwind Class |
| ------------------ | ------------- | ------ | -------------- |
| `motion.blur.none` | `--blur-none` | `0`    | `blur-none`    |
| `motion.blur.xs`   | `--blur-xs`   | `4px`  | `blur-xs`      |
| `motion.blur.sm`   | `--blur-sm`   | `8px`  | `blur-sm`      |
| `motion.blur.md`   | `--blur-md`   | `12px` | `blur-md`      |
| `motion.blur.lg`   | `--blur-lg`   | `16px` | `blur-lg`      |
| `motion.blur.xl`   | `--blur-xl`   | `24px` | `blur-xl`      |
| `motion.blur.2xl`  | `--blur-2xl`  | `40px` | `blur-2xl`     |
| `motion.blur.3xl`  | `--blur-3xl`  | `64px` | `blur-3xl`     |

---

## 8. Breakpoints

CSS variable: `--breakpoint-{key}` → Tailwind responsive prefix: `{key}:`.

| Token            | CSS Variable       | rem     | px       | Tailwind Prefix |
| ---------------- | ------------------ | ------- | -------- | --------------- |
| `breakpoint.sm`  | `--breakpoint-sm`  | `40rem` | `640px`  | `sm:`           |
| `breakpoint.md`  | `--breakpoint-md`  | `48rem` | `768px`  | `md:`           |
| `breakpoint.lg`  | `--breakpoint-lg`  | `64rem` | `1024px` | `lg:`           |
| `breakpoint.xl`  | `--breakpoint-xl`  | `80rem` | `1280px` | `xl:`           |
| `breakpoint.2xl` | `--breakpoint-2xl` | `96rem` | `1536px` | `2xl:`          |

---

## 9. Component Tokens

Component-specific size tokens. Defined in `@theme` as `--{property}-{component}-{variant}`.
These are NOT Tailwind built-ins — they must be declared explicitly.

### Button

| Token                        | CSS Variable         | Value            | Tailwind Class |
| ---------------------------- | -------------------- | ---------------- | -------------- |
| `component.button.height.lg` | `--height-button-lg` | `3rem` (48px)    | `h-button-lg`  |
| `component.button.height.md` | `--height-button-md` | `2.5rem` (40px)  | `h-button-md`  |
| `component.button.height.sm` | `--height-button-sm` | `2rem` (32px)    | `h-button-sm`  |
| `component.button.width.lg`  | `--width-button-lg`  | `3rem` (48px)    | `w-button-lg`  |
| `component.button.width.md`  | `--width-button-md`  | `2.5rem` (40px)  | `w-button-md`  |
| `component.button.width.sm`  | `--width-button-sm`  | `2rem` (32px)    | `w-button-sm`  |
| `component.icon.height.lg`   | `--height-icon-lg`   | `1.25rem` (20px) | `h-icon-lg`    |
| `component.icon.width.lg`    | `--width-icon-lg`    | `1.25rem` (20px) | `w-icon-lg`    |

### Badge

| Token                         | CSS Variable      | Value            | Tailwind Class / Fallback     |
| ----------------------------- | ----------------- | ---------------- | ----------------------------- |
| `component.badge.height`      | `--height-badge`  | `1.25rem` (20px) | `h-badge` · fallback `h-5`    |
| `component.badge.height.dot`  | `--height-dot-xs` | `0.375rem` (6px) | `h-dot-xs` · fallback `h-1.5` |
| `component.badge.stroke.none` | `--stroke-none`   | `0px`            | `border-0`                    |
| `component.badge.stroke.xs`   | `--stroke-xs`     | `1px`            | `border`                      |

---

## Validation Report

### Missing Tokens

| Token                              | Reason                                                             | Resolution                                                  |
| ---------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| `color.surface.hover`              | Value not specified in Figma or source                             | Add hex to `@theme` and update here                         |
| `color.surface.pressed`            | Value not specified in Figma or source                             | Add hex to `@theme` and update here                         |
| `typography.letterSpacing.lg`      | Used in Button (`tracking-lg`) but pixel value not in Figma export | Measure in Figma for `font/size/16` pairing                 |
| `typography.fontFamily.pretendard` | Used in Figma designs but not in system `@theme`                   | Register `@font-face` + add `--font-pretendard` to `@theme` |
| `component.badge.color.bg`         | `color/semantic/red/500 = #f44336` not in Tailwind palette         | Add `--color-semantic-red-500: #f44336` to `@theme`         |

### Duplicates Removed

| Removed                           | Canonical                           | Reason                                            |
| --------------------------------- | ----------------------------------- | ------------------------------------------------- |
| `color/static/white` (Figma)      | `color.white` (`--color-white`)     | Same value `#ffffff`; Tailwind built-in covers it |
| `text/sematic/inverse` (Figma)    | `color.white`                       | Same value `#ffffff`; maps to `text-white`        |
| `text/neutral/default` (Figma)    | `color.neutral.ink` (`--color-ink`) | Same value `#0f0f0f`                              |
| `static/scale/500` (Figma, 20px)  | `spacing.5` (`--spacing-5`, 20px)   | Resolved via spacing scale                        |
| `static/scale/1000` (Figma, 40px) | `spacing.10` (`--spacing-10`, 40px) | Resolved via spacing scale                        |

### Renamed Tokens

| Before                                | After                                        | Reason                                                          |
| ------------------------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| `--radius` (bare)                     | `radius.base` / `--radius`                   | Disambiguates from size-scale tokens; exposed as `rounded-base` |
| `color/semantic/red/500`              | `color.semantic.red.500`                     | Normalized to dot notation                                      |
| Figma `/` paths (e.g. `font/size/12`) | dot notation (e.g. `typography.fontSize.xs`) | Consistency with token key convention                           |

### Value Conflicts

| Token                    | Figma Value | Tailwind Built-in    | Resolution                                                                  |
| ------------------------ | ----------- | -------------------- | --------------------------------------------------------------------------- |
| `radius/lg`              | `16px`      | `rounded-lg = 8px`   | Use `rounded-2xl` (1rem = 16px) in components; Figma scale ≠ Tailwind scale |
| `radius/2xl`             | `28px`      | `rounded-2xl = 16px` | No built-in → TODO `--radius-component-2xl: 1.75rem`                        |
| `color/semantic/red/500` | `#f44336`   | `red-500 = #ef4444`  | Add as custom `--color-semantic-red-500`; do not conflate with Tailwind red |
