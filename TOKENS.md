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

| Token                        | CSS Variable             | Light     | Dark      | Tailwind Class              |
| ---------------------------- | ------------------------ | --------- | --------- | --------------------------- |
| `color.primary`              | `--primary`              | `#009ce0` | `#009ce0` | `bg-primary`                |
| `color.primary-foreground`   | `--primary-foreground`   | `#ffffff` | `#ffffff` | `text-primary-foreground`   |
| `color.secondary`            | `--secondary`            | `#ededed` | `#2a2a2a` | `bg-secondary`              |
| `color.secondary-foreground` | `--secondary-foreground` | `#0f0f0f` | `#ededed` | `text-secondary-foreground` |
| `color.muted`                | `--muted`                | `#f5f5f5` | `#2a2a2a` | `bg-muted`                  |
| `color.muted-foreground`     | `--muted-foreground`     | `#595858` | `#c2c2c2` | `text-muted-foreground`     |
| `color.accent`               | `--accent`               | `#f5f5f5` | `#2a2a2a` | `bg-accent`                 |
| `color.accent-foreground`    | `--accent-foreground`    | `#0f0f0f` | `#ededed` | `text-accent-foreground`    |

> These are the shadcn-inherited compatibility tokens. They are live — `bg-primary` /
> `text-primary` reach 12 modules — but they are **not** what most components use. The brand
> surface the majority of components render is `--color-brand` (`bg-brand`, 22 modules). If you
> are theming, start there; see [Brand](#brand).

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

| Token                         | CSS Variable                    | Value       | Tailwind Class             |
| ----------------------------- | ------------------------------- | ----------- | -------------------------- |
| `color.surface.hover`         | `--color-surface-hover`         | `#f5f5f5`   | `bg-surface-hover`         |
| `color.surface.pressed`       | `--color-surface-pressed`       | `#ededed`   | `bg-surface-pressed`       |
| `color.surface.success.muted` | `--color-surface-success-muted` | `#459f494d` | `bg-surface-success-muted` |
| `color.surface.error.muted`   | `--color-surface-error-muted`   | `#de3d314d` | `bg-surface-error-muted`   |
| `color.surface.error.subtle`  | `--color-surface-error-subtle`  | `#feeceb`   | `bg-surface-error-subtle`  |

> ⚠️ **These two were undefined until I-23** (2026-07-30). `Button` (ghost variant) and `Avatar`
> referenced them anyway, and Tailwind emits no rule for an undefined token — so the ghost
> button gave no hover or pressed feedback at all, silently. Both are defined now; the fix is a
> **visual change** for those two components.
>
> Mind the off-by-one against the neutral ramp: `--color-surface-neutral-subtle` is `#f5f5f5`,
> `-neutral-hover` is `#ededed`, `-neutral-pressed` is `#dadada`. So `surface-hover` shares a
> value with `neutral-subtle`, not with `neutral-hover`. The names describe the **state**, the
> ramp describes the **step** — they are one apart on purpose.
>
> These are flat `@theme` hex values, so they **do not follow dark mode**. `Popover` and
> `Sidebar` were listed here as users but never actually were: they use the `@theme inline`
> pair (`bg-muted` / `bg-secondary` / `bg-sidebar-accent`), identical in light mode and
> dark-mode aware. Prefer that pair for any surface that must theme.

> `surface.success.muted` / `surface.error.muted` are the Figma `color/semantic/{green,red}/600@30`
> tints, added for the Calendar event badges. They pair with `text-success` / `text-destructive`.

#### Neutral (itui.css)

| Token                    | CSS Variable               | Value     | Tailwind Class                                      |
| ------------------------ | -------------------------- | --------- | --------------------------------------------------- |
| `color.neutral.ink`      | `--color-ink`              | `#0f0f0f` | `text-ink`                                          |
| `color.neutral.muted`    | `--color-neutral-muted`    | `#595858` | `text-neutral-muted`                                |
| `color.neutral.disabled` | `--color-neutral-disabled` | `#c2c2c2` | `text-neutral-disabled` · `border-neutral-disabled` |
| `color.neutral.subtle`   | `--color-neutral-subtle`   | `#ededed` | `border-neutral-subtle`                             |

#### Figma Ramps

The full ITUI colour ramps — 129 variables across four namespaces, each mirroring its Figma
path 1:1. See the `### Colors` section under _Component Tokens_ for the values, the
duplication list and the ⚠ Tailwind-collision warning.

| Figma namespace          | CSS Variable pattern       | Steps              | Example class          |
| ------------------------ | -------------------------- | ------------------ | ---------------------- |
| `color/brand/sky/*`      | `--color-brand-sky-*`      | 50…900             | `bg-brand-sky-500`     |
| `color/brand/neutral/*`  | `--color-brand-neutral-*`  | 50…900, 950        | `bg-brand-neutral-950` |
| `color/semantic/{hue}/*` | `--color-semantic-{hue}-*` | 50, 500 (red +700) | `bg-semantic-red-500`  |
| `color/scheme/{hue}/*`   | `--color-scheme-{hue}-*`   | 50…900 × 10 hues   | `bg-scheme-teal-500`   |

> ⚠ Never write `bg-teal-500` / `text-yellow-400` for an ITUI hue — those are Tailwind's own
> built-ins at different values, and `apps/web` depends on them. Use the `scheme-` prefix.

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

### 2.3 The ITUI spacing scale — the Spacing foundation board

Figma node `29919:311`. Eleven named steps, a 4px progression that doubles its own step twice
(`+4` up to 24, `+8` to 48, `+16` to 64). **Every step already exists on the base scale above —
no new CSS variable was added.**

| ITUI step | px  | CSS Variable   | gap class | padding class |
| --------- | --- | -------------- | --------- | ------------- |
| `none`    | 0   | `--spacing-0`  | `gap-0`   | `p-0`         |
| `xs`      | 4   | `--spacing-1`  | `gap-1`   | `p-1`         |
| `sm`      | 8   | `--spacing-2`  | `gap-2`   | `p-2`         |
| `md`      | 12  | `--spacing-3`  | `gap-3`   | `p-3`         |
| `lg`      | 16  | `--spacing-4`  | `gap-4`   | `p-4`         |
| `xl`      | 20  | `--spacing-5`  | `gap-5`   | `p-5`         |
| `2xl`     | 24  | `--spacing-6`  | `gap-6`   | `p-6`         |
| `3xl`     | 32  | `--spacing-8`  | `gap-8`   | `p-8`         |
| `4xl`     | 40  | `--spacing-10` | `gap-10`  | `p-10`        |
| `5xl`     | 48  | `--spacing-12` | `gap-12`  | `p-12`        |
| `6xl`     | 64  | `--spacing-16` | `gap-16`  | `p-16`        |

> ⚠ **The name trap.** ITUI and Tailwind share no naming axis here, and where the step names
> collide across this package they mean different pixels:
>
> ```
> spacing/md = 12px   spacing/lg = 16px   spacing/xl = 20px
> radius/md  = 12px   radius/lg  = 16px   radius/xl  = 20px
> --leading-md = 24   --leading-lg = 26   --leading-xl = 28
> ```
>
> A layer bound to `spacing/xl` is 20px, but anything else named `xl` is 28px. There is no
> `gap-xl` — reach for `spacingClass.gap.xl` in `components/spacing`, the single reconciliation
> point, exactly as `radiusClass` is for radius.

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

### 3.3 Figma Radius Tokens — the ITUI scale

> ⚠ Figma and Tailwind share the step **names** but not their **values**. Map by pixel
> value, not by name: Figma `radius/sm` is 8px while `rounded-sm` is 4px.
> `radiusClass` in `components/radius/Radius.tsx` is the single reconciliation point —
> reach for `radiusClass.md` rather than `rounded-md` (6px, a different scale).

| ITUI step     | px      | CSS Variable             | Tailwind Class          |
| ------------- | ------- | ------------------------ | ----------------------- |
| `radius/xs`   | `4px`   | `--radius-sm`            | `rounded-sm`            |
| `radius/sm`   | `8px`   | `--radius-lg`            | `rounded-lg`            |
| `radius/md`   | `12px`  | `--radius-xl`            | `rounded-xl`            |
| `radius/lg`   | `16px`  | `--radius-2xl`           | `rounded-2xl`           |
| `radius/xl`   | `20px`  | `--radius-component-xl`  | `rounded-component-xl`  |
| `radius/2xl`  | `28px`  | `--radius-component-2xl` | `rounded-component-2xl` |
| `radius/full` | `999px` | `--radius-full`          | `rounded-full`          |

See the `### Radius` section under _Component Tokens_ for the full derivation, including
why `md` is 12px despite its Figma layer binding.

#### Nesting tokens (declared, currently unused)

`--radius-{xs…xl}-nest-{4,8}` encode the outer = inner + padding rule (`--radius-md-nest-8`
= 12 + 8 = 20px). No component references them yet, and the Radius board does not spec the
rule — but each one is `base + padding` of the scale above, which is what pins `md` to 12px.
`--radius-3xl` is likewise declared (overridden to `32px`, vs Tailwind's built-in 24px) and
unused.

---

## 4. Typography

### 4.1 Font Family

| Token                         | CSS Variable   | Value                                                                                                                                                 | Tailwind Class |
| ----------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `typography.fontFamily.sans`  | `--font-sans`  | `var(--font-pretendard, 'Pretendard Variable'), Pretendard, system-ui, -apple-system, 'Segoe UI', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif` | `font-sans`    |
| `typography.fontFamily.mono`  | `--font-mono`  | `Geist Mono`                                                                                                                                          | `font-mono`    |
| `typography.fontFamily.serif` | `--font-serif` | `Georgia, serif`                                                                                                                                      | `font-serif`   |

> Pretendard is the family every Figma text style names, and it is what `font-sans`
> resolves to. There is no separate `--font-pretendard` token in `@theme`: the name is
> reserved for the variable **your app** may already define — `next/font/localFont`
> writes one, and the chain above lets it win.
>
> The package ships the `@font-face` blocks in a **separate, opt-in** sheet so it never
> forces `/fonts/*` on an app that loads the font its own way:
>
> ```css
> @import '@echoit/itui.css/fonts.css'; /* needs 4 .woff2 files at /fonts */
> ```
>
> Copy `Pretendard-{Regular,Medium,SemiBold,Bold}.woff2` into your web root's `/fonts`
> (see `apps/storybook/public/fonts`). Skip the import if you register the family
> yourself — the fallback chain finds it either way.

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

#### Figma Font Sizes — the ITUI ramp

Ten sizes. Seven already exist on the Tailwind scale; three have no built-in at the
right value (Tailwind's `text-3xl` is 30px and `text-4xl` is 36px, neither an ITUI
step, and there is no 11px key at all) and were added as `--text-{style}`, named
after the style that owns them so they cannot shadow a Tailwind utility.

| Figma Token          | px     | CSS Variable         | Tailwind Class     |
| -------------------- | ------ | -------------------- | ------------------ |
| `typography/size/11` | `11px` | `--text-caption-xs`  | `text-caption-xs`  |
| `typography/size/12` | `12px` | `--text-xs`          | `text-xs`          |
| `typography/size/14` | `14px` | `--text-sm`          | `text-sm`          |
| `typography/size/16` | `16px` | `--text-base`        | `text-base`        |
| `typography/size/18` | `18px` | `--text-lg`          | `text-lg`          |
| `typography/size/20` | `20px` | `--text-xl`          | `text-xl`          |
| `typography/size/24` | `24px` | `--text-2xl`         | `text-2xl`         |
| `typography/size/32` | `32px` | `--text-heading-4xl` | `text-heading-4xl` |
| `typography/size/40` | `40px` | `--text-display-5xl` | `text-display-5xl` |
| `typography/size/48` | `48px` | `--text-5xl`         | `text-5xl`         |

> ⚠ The step names collide across axes at different pixels — `heading-3xl` is 24px
> but `text-3xl` is 30px, `body-lg` is 16px but `text-lg` is 18px. Reach for
> `typographyClass` in `components/typography`; see the `### Typography` section
> under _Component Tokens_.

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

#### Figma Line Heights — the ITUI ramp

Declared in `@theme` as absolute px, one key per ITUI step, mirroring Figma 1:1.
Additive to Tailwind's own `--leading-{tight…loose}`, which stay untouched.

| Figma Token                  | CSS Variable    | Value  | Tailwind Class |
| ---------------------------- | --------------- | ------ | -------------- |
| `typography/line-height/xs`  | `--leading-xs`  | `16px` | `leading-xs`   |
| `typography/line-height/sm`  | `--leading-sm`  | `20px` | `leading-sm`   |
| `typography/line-height/md`  | `--leading-md`  | `24px` | `leading-md`   |
| `typography/line-height/lg`  | `--leading-lg`  | `26px` | `leading-lg`   |
| `typography/line-height/xl`  | `--leading-xl`  | `28px` | `leading-xl`   |
| `typography/line-height/2xl` | `--leading-2xl` | `32px` | `leading-2xl`  |
| `typography/line-height/3xl` | `--leading-3xl` | `36px` | `leading-3xl`  |
| `typography/line-height/4xl` | `--leading-4xl` | `44px` | `leading-4xl`  |
| `typography/line-height/5xl` | `--leading-5xl` | `52px` | `leading-5xl`  |
| `typography/line-height/6xl` | `--leading-6xl` | `64px` | `leading-6xl`  |

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

#### itui.css Custom Letter Spacing Tokens — the ITUI ramp

Defined in `@theme` as Figma's absolute pixel values at their paired font sizes,
one key per ITUI step. Additive to Tailwind's own `--tracking-{tighter…widest}`,
which stay untouched. The ramp crosses zero between `lg` and `xl`: the small
steps are tracked out, the display steps tightened in.

| Figma Token                     | CSS Variable     | Value     | Paired Font Size          | Tailwind Class |
| ------------------------------- | ---------------- | --------- | ------------------------- | -------------- |
| `typography/letter-spacing/xs`  | `--tracking-xs`  | `0.33px`  | `11px (text-caption-xs)`  | `tracking-xs`  |
| `typography/letter-spacing/sm`  | `--tracking-sm`  | `0.3px`   | `12px (text-xs)`          | `tracking-sm`  |
| `typography/letter-spacing/md`  | `--tracking-md`  | `0.2px`   | `14px (text-sm)`          | `tracking-md`  |
| `typography/letter-spacing/lg`  | `--tracking-lg`  | `0.09px`  | `16px (text-base)`        | `tracking-lg`  |
| `typography/letter-spacing/xl`  | `--tracking-xl`  | `-0.04px` | `18px (text-lg)`          | `tracking-xl`  |
| `typography/letter-spacing/2xl` | `--tracking-2xl` | `-0.24px` | `20px (text-xl)`          | `tracking-2xl` |
| `typography/letter-spacing/3xl` | `--tracking-3xl` | `-0.55px` | `24px (text-2xl)`         | `tracking-3xl` |
| `typography/letter-spacing/4xl` | `--tracking-4xl` | `-0.64px` | `32px (text-heading-4xl)` | `tracking-4xl` |
| `typography/letter-spacing/5xl` | `--tracking-5xl` | `-1.13px` | `40px (text-display-5xl)` | `tracking-5xl` |
| `typography/letter-spacing/6xl` | `--tracking-6xl` | `-1.68px` | `48px (text-5xl)`         | `tracking-6xl` |

---

## 5. Shadow

CSS variable: `--shadow-{key}` → Tailwind class: `shadow-{key}`.

> ⚠ **This package ships two shadow ramps.** They share the `shadow-*` prefix but come from
> different sources and are not interchangeable — see §5.3 and the Value Conflicts table.

### 5.1 The named ramp — `xs…xl` (ITUI, overrides Tailwind)

`global.css` re-points Tailwind's own `--shadow-{xs…xl}` onto an older ITUI ramp based on
`#0f0f0f` at 8%. `2xl`, `inner` and `none` keep Tailwind's stock values.

| Token          | CSS Variable     | Value                                                  | Tailwind Class |
| -------------- | ---------------- | ------------------------------------------------------ | -------------- |
| `shadow.none`  | `--shadow-none`  | `0 0 #0000`                                            | `shadow-none`  |
| `shadow.xs`    | `--shadow-xs`    | `0 4px 4px 0 rgba(15,15,15,0.08)`                      | `shadow-xs`    |
| `shadow.sm`    | `--shadow-sm`    | `0 8px 16px 0 rgba(15,15,15,0.08)`                     | `shadow-sm`    |
| `shadow.md`    | `--shadow-md`    | `0 12px 24px 0 rgba(15,15,15,0.08)`                    | `shadow-md`    |
| `shadow.lg`    | `--shadow-lg`    | `0 16px 48px 0 rgba(15,15,15,0.08)`                    | `shadow-lg`    |
| `shadow.xl`    | `--shadow-xl`    | `0 20px 64px 0 rgba(15,15,15,0.08)`                    | `shadow-xl`    |
| `shadow.2xl`   | `--shadow-2xl`   | `0 25px 50px -12px rgb(0 0 0 / 0.25)` (Tailwind stock) | `shadow-2xl`   |
| `shadow.inner` | `--shadow-inner` | `inset 0 2px 4px 0 rgb(0 0 0 / 0.05)` (Tailwind stock) | `shadow-inner` |

### 5.2 The directional ramp — the Shadow foundation board

Twelve tokens, `--shadow-{downwards,upwards,leftwards,rightwards}-{sm,md,lg}`, all on
`rgba(26,26,26,0.08)`. One 3-step ramp (`sm` 4/16 · `md` 12/24 · `lg` 20/48) mirrored onto four
axes. See the `### Shadow` section under _Component Tokens_ for values and derivation.

Reach for `shadowClass` in `components/shadow` rather than typing these by hand.

### 5.3 ⚠ The two ramps overlap but do not match

| Class       | §5.1 named ramp                  | §5.2 nearest directional         | Difference          |
| ----------- | -------------------------------- | -------------------------------- | ------------------- |
| `shadow-sm` | `0 8px 16px rgba(15,15,15,.08)`  | `0 4px 16px rgba(26,26,26,.08)`  | offset **and** grey |
| `shadow-md` | `0 12px 24px rgba(15,15,15,.08)` | `0 12px 24px rgba(26,26,26,.08)` | grey only           |
| `shadow-lg` | `0 16px 48px rgba(15,15,15,.08)` | `0 20px 48px rgba(26,26,26,.08)` | offset **and** grey |

`shadow-md` is the trap: it matches `shadow-downwards-md` on geometry and differs only in base
grey, so the two are indistinguishable by eye but are different tokens. **`shadow-md` is not
`shadow-downwards-md`.** Reconciling the ramps is a re-point of five variables plus a sweep of
every `shadow-*` in `packages/ui` — deliberately out of scope; `shadowClass` is the interim
answer.

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

### Calendar

> ⚠ The `--size-*` namespace only generates the square `size-*` utility — it does **not** produce
> `w-*` / `h-*`. Container widths therefore live in `--width-*`, which does generate `w-*`.

| Token                            | CSS Variable             | Value   | Figma Token                         | Tailwind Class     |
| -------------------------------- | ------------------------ | ------- | ----------------------------------- | ------------------ |
| `component.calendar.width.md`    | `--width-calendar-md`    | `358px` | `size/container/md`                 | `w-calendar-md`    |
| `component.calendar.width.lg`    | `--width-calendar-lg`    | `480px` | `size/container/lg`                 | `w-calendar-lg`    |
| `component.calendar.width.xl`    | `--width-calendar-xl`    | `624px` | RangePicker frame (27729:706)       | `w-calendar-xl`    |
| `component.calendar.width.panel` | `--width-calendar-panel` | `312px` | RangePicker month panel (27729:708) | `w-calendar-panel` |
| `component.dateHeader.width`     | `--width-date-header`    | `280px` | Date Header (27193:2381)            | `w-date-header`    |

### Typography

> ⚠ Same shape as Radius and Spacing: ITUI and Tailwind share the step **names** but
> not their **values**. `typographyClass` in `components/typography/Typography.tsx` is
> the single reconciliation point — reach for `typographyClass['heading-3xl']` rather
> than assembling `text-3xl leading-3xl tracking-3xl` (30px, a different scale).

The ITUI type scale is **one ten-step ramp**, not four. Each step belongs to exactly
one family, so the step name alone identifies the style — `2xl` is always heading,
`md` is always body, there is no `body/2xl`.

| Variant       | size | line-height | letter-spacing | Tailwind classes                            |
| ------------- | ---- | ----------- | -------------- | ------------------------------------------- |
| `display-6xl` | 48   | 64          | -1.68          | `text-5xl leading-6xl tracking-6xl`         |
| `display-5xl` | 40   | 52          | -1.13          | `text-display-5xl leading-5xl tracking-5xl` |
| `heading-4xl` | 32   | 44          | -0.64          | `text-heading-4xl leading-4xl tracking-4xl` |
| `heading-3xl` | 24   | 36          | -0.55          | `text-2xl leading-3xl tracking-3xl`         |
| `heading-2xl` | 20   | 32          | -0.24          | `text-xl leading-2xl tracking-2xl`          |
| `heading-xl`  | 18   | 28          | -0.04          | `text-lg leading-xl tracking-xl`            |
| `body-lg`     | 16   | 26          | 0.09           | `text-base leading-lg tracking-lg`          |
| `body-md`     | 14   | 24          | 0.2            | `text-sm leading-md tracking-md`            |
| `caption-sm`  | 12   | 20          | 0.3            | `text-xs leading-sm tracking-sm`            |
| `caption-xs`  | 11   | 16          | 0.33           | `text-caption-xs leading-xs tracking-xs`    |

**Only the font-size axis needed new tokens.** `--leading-{xs…6xl}` and
`--tracking-{xs…6xl}` already _are_ the ITUI ramp, 1:1 by step name, so they may be
read off the step directly — the name trap applies to `text-*` alone.

Weights are Tailwind's own: `regular` → `font-normal` (400), `medium` →
`font-medium` (500), `semibold` → `font-semibold` (600), `bold` → `font-bold` (700).

Colour is **not** part of the component. The board binds text to
`text/neutral/default` (#0f0f0f), which is what `--foreground` already resolves to,
so `Typography` inherits rather than seizing the colour axis.

All four Figma families (`typography/family/{display,heading,body,caption}`) resolve
to the same Pretendard binding — `--font-sans`, i.e. `font-sans`. No family token was
added. The `@font-face` blocks ship in `@echoit/itui.css/fonts.css`; see _Font Family_.

### Stepper

| Token                       | CSS Variable        | Value  | Figma Token         | Tailwind Class    |
| --------------------------- | ------------------- | ------ | ------------------- | ----------------- |
| `component.stepper.size.sm` | `--size-stepper-sm` | `24px` | `height/stepper/sm` | `size-stepper-sm` |
| `component.stepper.size.md` | `--size-stepper-md` | `28px` | `height/stepper/md` | `size-stepper-md` |
| `component.dot.size.sm`     | `--size-dot-sm`     | `10px` | `height/dot/sm`     | `size-dot-sm`     |

### List

> ⚠ Same `--size-*` caveat as Calendar: the namespace only generates the square `size-*`
> utility, so these two cannot be used as row heights. Rows use the spacing scale instead —
> the pixel values are identical.

| Token                    | CSS Variable     | Value  | Figma Token       | Used as                           |
| ------------------------ | ---------------- | ------ | ----------------- | --------------------------------- |
| `component.list.size.sm` | `--size-list-sm` | `40px` | `height/list/sm`  | `min-h-10` (label-only row)       |
| `component.list.size.md` | `--size-list-md` | `56px` | List `27901:1785` | `min-h-14` (row with description) |

### Snackbar

| Token                         | CSS Variable                    | Value                | Figma Token              | Tailwind Class             |
| ----------------------------- | ------------------------------- | -------------------- | ------------------------ | -------------------------- |
| `component.snackbar.width`    | `--width-snackbar`              | `358px`              | `size/container/md`      | `w-snackbar`               |
| `color.surface.snackbar.dark` | `--color-surface-snackbar-dark` | `rgba(26,26,26,0.6)` | `color/opacity/black/lg` | `bg-surface-snackbar-dark` |

> The Light tone needs no new token: `color/opacity/white/xl` (`#ffffffcc`) is already
> `--color-opacity-white-xl`, and `blur/default` (a `BACKGROUND_BLUR` of `shadow/blur/xs` = 4)
> is the same `blur(4px / 2)` the existing `@utility backdrop-blur-dialog` computes, so
> Snackbar reuses that utility rather than declaring a second one.

### Skeleton

| Token                     | CSS Variable              | Value                                | Figma Source                        | Tailwind Class          |
| ------------------------- | ------------------------- | ------------------------------------ | ----------------------------------- | ----------------------- |
| `motion.animate.skeleton` | `--animate-skeleton-wave` | `skeleton-wave 1.6s linear infinite` | Skeleton `Animation=Wave` Start/End | `animate-skeleton-wave` |

> The `Wave` overlay is a band half the skeleton's width. Figma models the loop as two
> sibling frames — Start at `left:-50%`, End at `left:100%` of the box — which for that
> band is `translateX(-100%)` → `translateX(200%)` of its own width. Figma pins no
> duration variable, so the `1.6s linear` lives in the `--animate-*` token itself
> (the Tailwind v4 pattern, same as the built-in `--animate-spin`).
>
> `Animation=Pulse` needs no token: its End fill `rgba(0,0,0,0.04)` is exactly half the
> Start alpha `color/opacity/black/xs`, which the built-in `animate-pulse` already draws.

### Floating Button

Figma node `28386:3249` ("Float"). Every value resolved to a token that already existed —
no new CSS variable was added.

| Figma Token               | Value                   | CSS Variable                      | Tailwind Class                           |
| ------------------------- | ----------------------- | --------------------------------- | ---------------------------------------- |
| `height/float/md`         | `56px`                  | `--size-float-md`                 | `size-float-md`                          |
| `height/float/sm`         | `40px`                  | `--size-float-sm`                 | `size-float-sm`                          |
| `surface/primary/default` | `#009ce0`               | `--color-surface-primary`         | `bg-surface-primary`                     |
| `surface/primary/hover`   | `#54bdea`               | `--color-surface-primary-hover`   | `hover:bg-surface-primary-hover`         |
| `surface/primary/pressed` | `#008ecc`               | `--color-surface-primary-pressed` | `active:bg-surface-primary-pressed`      |
| `icon/primary/inverse`    | `#fafafa`               | `--color-inverse`                 | `text-inverse` + `[&_path]:fill-current` |
| `shadow/downwards/md`     | `0 12px 24px #1a1a1a14` | `--shadow-downwards-md`           | `shadow-downwards-md`                    |
| `spacing/sm`              | `8px`                   | `--spacing-2`                     | `p-2`                                    |
| `radius/full`             | `999px`                 | `--radius-full`                   | `rounded-full`                           |
| `height/icon/lg`          | `20px`                  | spacing scale                     | `[&_svg]:size-5` (size `sm`)             |
| `exception/icon/28`       | `28px`                  | spacing scale                     | `[&_svg]:size-7` (size `md`)             |

> `exception/icon/28` gets no dedicated variable: 28px is already `spacing.7` (1.75rem),
> so it resolves through the scale the same way `static/scale/*` does. Adding
> `--size-icon-28` would only duplicate `size-7`, and the `--size-*` namespace generates
> the square `size-*` utility anyway — see the Calendar/List caveats above.
>
> The Figma effect is a `DROP_SHADOW` whose blur radius is `shadow/blur/md` (24) at
> offset-y `shadow/positioning-down/md` (12), colour `shadow/color/black` (`#1a1a1a14`
> ≈ `rgba(26,26,26,0.08)`). As a `box-shadow` that is exactly `--shadow-downwards-md`,
> so the button reuses that token instead of a `drop-shadow-[…]` filter.
>
> Figma specs no `disabled` state for this component. The implementation borrows
> Button `variant="primary"`'s (`disabled:bg-secondary` + `disabled:text-neutral-disabled`)
> so both brand-filled controls grey out the same way.

### GNB

Figma node `28390:4906` ("GNB"). Only `--width-container-md` was added — every other
value resolved to a token that already existed.

| Figma Token                 | Value                  | CSS Variable                     | Tailwind Class                                 |
| --------------------------- | ---------------------- | -------------------------------- | ---------------------------------------------- |
| `height/gnb/sm`             | `72px`                 | spacing scale                    | `h-18` (see caveat below)                      |
| `padding`                   | `48px`                 | `--spacing-12`                   | `px-12`                                        |
| `spacing/5xl`               | `48px`                 | `--spacing-12`                   | `gap-12` (between menu items)                  |
| `spacing/3xl`               | `32px`                 | `--spacing-8`                    | `gap-8` (logo ↔ menu, Default)                |
| `spacing/2xl`               | `24px`                 | `--spacing-6`                    | `gap-6` (logo ↔ menu, Search)                 |
| `spacing/xl`                | `20px`                 | `--spacing-5`                    | `gap-5` (Login action cluster)                 |
| `spacing/lg`                | `16px`                 | `--spacing-4`                    | `gap-4` (search ↔ actions)                    |
| `spacing/md`                | `12px`                 | `--spacing-3`                    | `gap-3` (between actions)                      |
| `color/static/white`        | `#fafafa`              | `--color-inverse`                | `bg-inverse`                                   |
| `border/neutral/subtle`     | `#ededed`              | `--color-border-neutral-subtle`  | `border-b border-border-neutral-subtle`        |
| `stroke/xs`                 | `1px`                  | —                                | `border-b`                                     |
| `shadow/downwards/sm`       | `0 4px 16px #1a1a1a14` | `--shadow-downwards-sm`          | `shadow-downwards-sm`                          |
| `typography/body/lg/medium` | `16 / 26 / 0.09`       | `--leading-lg` · `--tracking-lg` | `text-base leading-lg tracking-lg font-medium` |
| `text/neutral/default`      | `#0f0f0f`              | `--color-neutral`                | `text-foreground`                              |
| `text/primary/default`      | `#009ce0`              | `--color-primary`                | `text-primary` (active / hover)                |
| `height/profile/lg`         | `40px`                 | `--size-profile-lg`              | `Avatar size="lg"`                             |
| `size/container/md`         | `358px`                | `--width-container-md`           | `w-container-md` (search field)                |

> `--size-gnb` (72px) already existed but the `--size-*` namespace only generates the
> square `size-*` utility — it cannot produce `h-*`. The bar therefore uses `h-18`
> (4.5rem = 72px) off the spacing scale, the same resolution Calendar/List/Navigation
> reached for their own height tokens.
>
> The Figma frame is 72px tall while its inner `Header` measures 88px at `y = -8`, so
> the content overflows ±8px and is clipped. The implementation reproduces the visible
> result: a 72px bar with vertically centered content, no vertical padding.
>
> Buttons and the search field are the existing `Button` / `Input` components — Figma's
> 로그인 is `variant="alternative" size="lg"`, 회원가입 is `variant="primary" size="lg"`,
> and the Login-state icon buttons are `variant="secondary" size="md"` (40×40), all of
> which already match the specced fills, borders and heights exactly.
>
> Figma specs no hover or active state for the menu items. `GnbMenuItem`'s `active`
> and `hover:` both paint `text-primary`, mirroring `BottomNavigationItem` in
> `navigation/Navigation.tsx` so the two nav families stay consistent.

### Navigation V2 (mobile)

Figma node `28390:4665` ("Navigation"). Only `--shadow-upwards-sm` was added — every
other value resolved to a token that already existed.

| Figma Token                 | Value                   | CSS Variable                     | Tailwind Class                                 |
| --------------------------- | ----------------------- | -------------------------------- | ---------------------------------------------- |
| `height/navigation/md`      | `56px`                  | `--size-navigation-md`           | `h-14` (see caveat below)                      |
| `surface/neutral/secondary` | `#fafafa`               | `--color-inverse`                | `bg-inverse`                                   |
| `shadow/downwards/sm`       | `0 4px 16px #1a1a1a14`  | `--shadow-downwards-sm`          | `shadow-downwards-sm` (top bar)                |
| `shadow/upwards/sm`         | `0 -4px 16px #1a1a1a14` | `--shadow-upwards-sm`            | `shadow-upwards-sm` (bottom bar)               |
| `spacing/lg`                | `16px`                  | `--spacing-4`                    | `px-4` · `gap-4` (BackIcon cluster)            |
| `spacing/md`                | `12px`                  | `--spacing-3`                    | `gap-3` (left/right cluster, default)          |
| `spacing/sm`                | `8px`                   | `--spacing-2`                    | `py-2` (bottom bar) · `p-2` (item)             |
| `spacing/xs`                | `4px`                   | `--spacing-1`                    | `gap-1` (item icon ↔ label)                   |
| `height/icon/lg`            | `20px`                  | spacing scale                    | `size-5` (item glyph)                          |
| `typography/body/lg/medium` | `16 / 26 / 0.09`        | `--leading-lg` · `--tracking-lg` | `text-base leading-lg tracking-lg font-medium` |
| `typography/body/md/medium` | `14 / 24 / 0.2`         | `--leading-md` · `--tracking-md` | `text-sm leading-md tracking-md font-medium`   |
| `text/neutral/default`      | `#0f0f0f`               | `--color-neutral`                | `text-foreground` (item `State=Default`)       |
| `text/primary/default`      | `#009ce0`               | `--color-primary`                | `text-primary` (item `State=Select`)           |
| `height/profile/md`         | `32px`                  | `--size-profile-md`              | `Avatar size="md"` (MenuAvatar cell)           |
| `height/button/sm`          | `32px`                  | `--height-button-sm`             | `Button size="sm"` (all icon buttons)          |

> `--size-navigation-md` (56px) already existed but the `--size-*` namespace only
> generates the square `size-*` utility — it cannot produce `h-*`. Both bars therefore
> use `h-14` (3.5rem = 56px) off the spacing scale, the same resolution Calendar /
> List / GNB reached for their own height tokens.
>
> Figma's top-bar frame is 56px tall with 16px vertical padding around a 32px inner
> row (16+32+16 = 64), so the padding overflows and is clipped. The implementation
> reproduces the visible result: `h-14` with a centered `h-8` row and no vertical
> padding — same as GNB.
>
> Figma's five top-bar types (BackIcon · BackButton · MenuAvatar · Logo · LogoBack)
> are the same three slots with different content, so `TopNavigationV2` exposes
> `left` / `title` / `right` props instead of a `type` variant. The only measurable
> difference between the cells is the cluster gap — 16px on BackIcon, 12px elsewhere —
> which is the `actionGap` prop.
>
> The icon buttons ("General / Button", 32×32, `#fafafa` on a 1px `#ededed` border,
> `radius/sm` 8px) are the existing `Button variant="secondary" size="sm"`, which
> already matches that fill, border and height exactly. Figma draws the back caret as
> a bare 18px glyph; the story wraps it in `Button variant="ghost" size="sm"` so it
> gets a real 32px hit target and a focus ring.
>
> Figma pins 56px items on a 390px bottom bar with `justify-between`. The items are
> `flex-1` with a 56px floor instead, so they stay evenly spread at any width and tab
> count — matching `BottomNavigationItem` in V1.
>
> V1 (`navigation/Navigation.tsx`) is untouched and still carries this shadow as the
> arbitrary value `shadow-[0_-4px_16px_0_rgba(26,26,26,0.08)]`; fold it into
> `shadow-upwards-sm` when that file is next edited.

### Overflow Menu

Figma node `28392:283` ("Overflow Menu"). Only `--width-container-xs` was added — every
other value resolved to a token that already existed.

| Figma Token                         | Value                   | CSS Variable                     | Tailwind Class                          |
| ----------------------------------- | ----------------------- | -------------------------------- | --------------------------------------- |
| `size/container/xs`                 | `160px`                 | `--width-container-xs`           | `w-container-xs` (panel)                |
| `surface/neutral/secondary/default` | `#fafafa`               | `--color-inverse`                | `bg-inverse`                            |
| `surface/neutral/secondary/hover`   | `#f5f5f5`               | `--muted`                        | `data-[highlighted]:bg-muted`           |
| `border/neutral/subtle`             | `#ededed`               | `--color-border-neutral-subtle`  | `border border-border-neutral-subtle`   |
| `stroke/xs`                         | `1px`                   | —                                | `border`                                |
| `radius/sm`                         | `8px`                   | `--radius-lg`                    | `rounded-lg`                            |
| `shadow/downwards/md`               | `0 12px 24px #1a1a1a14` | `--shadow-downwards-md`          | `shadow-downwards-md`                   |
| `spacing/sm`                        | `8px`                   | `--spacing-2`                    | `p-2` · `gap-2` (icon ↔ label)         |
| `spacing/none`                      | `0px`                   | `--spacing-0`                    | `gap-0` (rows sit flush)                |
| `height/icon/md`                    | `16px`                  | spacing scale                    | `size-4`                                |
| `typography/body/md/regular`        | `14 / 24 / 0.2`         | `--leading-md` · `--tracking-md` | `text-sm leading-md tracking-md`        |
| `text` · `icon/neutral/default`     | `#0f0f0f`               | `--color-neutral`                | `text-foreground` (`State=Enabled`)     |
| `text` · `icon/neutral/disabled`    | `#c2c2c2`               | `--color-neutral-disabled`       | `data-[disabled]:text-neutral-disabled` |
| `height/button/sm`                  | `32px`                  | `--height-button-sm`             | `Button variant="secondary" size="sm"`  |

> `--size-overflow` (36px, Figma `height/overFlow`) already existed but is **not** used:
> the standalone Base Overflow Menu symbol pins 36px, while every instance composed
> into the panel measures 40px (`p-2` + 24px line) — `get_metadata` reports the panel
> as 176px = 8 + 4×40 + 8. The row is therefore auto-height, matching real usage.
> The `--size-*` namespace could not have produced an `h-*` utility anyway — see the
> Calendar / List caveats above.
>
> The trigger is Figma's "General / Button" (32×32, `#fafafa` on a 1px `#ededed`
> border, `radius/sm` 8px), which is exactly the existing
> `Button variant="secondary" size="sm"` — same resolution GNB and Navigation V2 reached.
>
> Figma's `State=Hover` maps to Radix's `data-highlighted`, which is also set by
> keyboard focus, so pointer and arrow-key navigation paint the same row.

### LNB

Figma node `28392:397` ("LNB"). Only `--shadow-rightwards-sm` was added — every other
value resolved to a token that already existed.

| Figma Token                         | Value                  | CSS Variable                     | Tailwind Class                                |
| ----------------------------------- | ---------------------- | -------------------------------- | --------------------------------------------- |
| rail width, `Type=Collapse`         | `52px`                 | spacing scale                    | `w-13` (3.25rem)                              |
| rail width, `Type=Expand`           | `264px`                | spacing scale                    | `w-66` (16.5rem)                              |
| `height/lnb/sm`                     | `36px`                 | `--size-lnb-sm`                  | `h-9` · `size-9` (see caveat below)           |
| `height/lnb/md`                     | `48px`                 | `--size-lnb-md`                  | `h-12` (Avatar row)                           |
| `surface/neutral/secondary/default` | `#fafafa`              | `--color-inverse`                | `bg-inverse` (rail · `State=Default`)         |
| `surface/neutral/secondary/hover`   | `#f5f5f5`              | `--muted`                        | `hover:bg-muted` (`State=Hover`)              |
| `surface/neutral/secondary/pressed` | `#ededed`              | `--secondary`                    | `bg-secondary` (`State=Select`)               |
| `border/neutral/subtle`             | `#ededed`              | `--color-border-neutral-subtle`  | `border-r border-border-neutral-subtle`       |
| `stroke/xs`                         | `1px`                  | —                                | `border-r`                                    |
| `shadow/rightwards/sm`              | `4px 0 16px #1a1a1a14` | `--shadow-rightwards-sm`         | `shadow-rightwards-sm`                        |
| `radius/sm`                         | `8px`                  | `--radius-lg`                    | `rounded-lg`                                  |
| `spacing/3xl`                       | `32px`                 | `--spacing-8`                    | `gap-8` (logo ↔ menu)                        |
| `spacing/md`                        | `12px`                 | `--spacing-3`                    | `gap-3` (collapsed avatar cell)               |
| `spacing/sm`                        | `8px`                  | `--spacing-2`                    | `p-2` · `gap-2`                               |
| sub-item indent                     | `36px`                 | `--spacing-9`                    | `px-9`                                        |
| `height/icon/lg`                    | `20px`                 | spacing scale                    | `size-5` (leading glyph)                      |
| `height/icon/md`                    | `16px`                 | spacing scale                    | `size-4` (caret)                              |
| `height/profile/sm`                 | `24px`                 | `--size-profile-sm`              | `Avatar size="sm"`                            |
| `typography/body/md/medium`         | `14 / 24 / 0.2`        | `--leading-md` · `--tracking-md` | `text-sm leading-md tracking-md font-medium`  |
| `typography/caption/sm/regular`     | `12 / 20 / 0.3`        | `--leading-sm` · `--tracking-sm` | `text-xs leading-sm tracking-sm` (email line) |
| `text` · `icon/neutral/default`     | `#0f0f0f`              | `--color-neutral`                | `text-foreground`                             |
| `text/neutral/muted`                | `#595858`              | `--color-neutral-muted`          | `text-neutral-muted` (sub-items · email)      |
| — (motion, not in Figma)            | `200ms` `ease-out`     | `--animate-collapsible-down`     | `data-[state=open]:animate-collapsible-down`  |
| — (motion, not in Figma)            | `200ms` `ease-out`     | `--animate-collapsible-up`       | `data-[state=closed]:animate-collapsible-up`  |

> `--size-lnb-sm` / `--size-lnb-md` already existed but the `--size-*` namespace only
> generates the square `size-*` utility — it cannot produce `h-*`. Rows therefore use
> `h-9` / `h-12` off the spacing scale, the same resolution Calendar / List / GNB /
> Navigation V2 reached for their own height tokens. The collapsed 36×36 cell does use
> `size-9` rather than `size-lnb-sm`, so both axes come from one scale.
>
> `shadow/rightwards/sm` is the x-axis mirror of the existing `--shadow-downwards-sm`
> (`shadow/blur/sm` 16 at `shadow/positioning-down/xs` 4, `shadow/color/black` > `#1a1a1a14`). `sidebar/Sidebar.tsx` still carries an approximation of it as the
> arbitrary value `shadow-[4px_0_16px_0_rgba(137,137,137,0.10)]`; fold it into
> `shadow-rightwards-sm` when that file is next edited.
>
> `sidebar/Sidebar.tsx` is untouched. LNB is a separate component because Figma specs
> three things the sidebar has no notion of: the folding sub-menu (`Base LNB` with
> `CaretDown` ⇄ `CaretUp`), the `SidebarSimple` collapse toggle, and the `Type=Avatar`
> user footer.
>
> The folding group wraps `radix-ui`'s `Collapsible`, so open/close state, ARIA and
> keyboard handling come from Radix and the caret keys off its `data-[state]`.
>
> **Motion.** Figma specs no transitions, so the values below are implementation
> choices drawn from the existing motion tokens (`duration-150/200`, `ease-out`) —
> nothing arbitrary. The rail animates `width` (52 ⇄ 264px), the caret rotates 180°,
> and the logo ⇄ toggle swap crossfades `opacity`. The folding group needs real
> `@keyframes` rather than a `transition`, because `height: auto` has no interpolatable
> value for a transition to start from; `--animate-collapsible-down` / `-up` read
> Radix's measured `--radix-collapsible-content-height`. They are named for the
> primitive, not for LNB, so `accordion/Accordion.tsx` uses them unchanged for its own
> content open/close (Radix's Accordion is built on Collapsible, so it sets the same
> CSS variable).
>
> Every one is disabled under `prefers-reduced-motion` (`motion-reduce:transition-none`
> on the transitions, an `animation-duration: 1ms` guard in `global.css` for the two
> keyframe tokens), matching what `bottom-sheet/BottomSheet.tsx` already does.
>
> ⚠ The `tailwindcss-animate` utilities (`animate-in`, `fade-in-0`, `zoom-in-95`,
> `slide-in-from-*`) that `dialog`, `dropdown-menu`, `select`, `tooltip`, `popover`,
> `overflow-menu` and `progress` all use are **no-ops** — the plugin is not a
> dependency of this package, so those classes compile to zero rules (verified by
> building `global.css`; `BottomSheet.tsx:37` records the same finding and works around
> it with a runtime-injected `<style>`). LNB therefore uses only plain transitions and
> `@theme` `--animate-*` keyframes, both of which do compile. Either add the plugin or
> stop documenting that pattern in `CLAUDE.md`.
>
> Figma's three rail types are the same rail with two switches, so they are props, not
> variants: `Collapse` is `collapsed`, and `Expand (With Folding)` vs `(Without
Folding)` is whether `LnbLogo` gets an `action`.
>
> Figma's `Collapse / Hover` state (28500:2806) swaps the logo for the toggle. The swap
> is keyed off hovering the logo cell, not the whole rail: one element cannot be both
> the `data-collapsed` ancestor and the `:hover` ancestor of the same target, and
> pointing at the cell that changes is the clearer affordance. `focus-within` mirrors
> it for keyboard users.
>
> Every glyph resolves to the matching ITUI icon component — `Circle_phos` →
> `CircleRegularIcon`, `CaretDown`/`CaretUp` → `CaretDown`/`CaretUpRegularIcon`,
> `SidebarSimple` → `SidebarSimpleRegularIcon` — at Figma's 20px / 16px boxes. The
> brand mark is a consumer slot (`LnbLogo` children), rendered in the story by
> `DiamondsFourFillIcon`, the same stand-in `Gnb.stories.tsx` uses.

### Scroll Area

Figma node `27288:877` ("Scroll", `Size=Md | Sm` × `State=Default | Hover`). No new CSS
variable was added — and the two `--size-scroll-bar-*` tokens, previously declared but
unused, finally carry the thumb.

| Figma Token                         | Value     | CSS Variable                      | Tailwind Class                                       |
| ----------------------------------- | --------- | --------------------------------- | ---------------------------------------------------- |
| rail width, `Size=Md`               | `18px`    | spacing scale                     | `w-4.5` (1.125rem) · `h-4.5` horizontal              |
| rail width, `Size=Sm`               | `12px`    | spacing scale                     | `w-3` · `h-3` horizontal                             |
| `height/scroll-bar/md`              | `10px`    | `--size-scroll-bar-md`            | `[--radix-scroll-area-thumb-width:…]` (see below)    |
| `height/scroll-bar/sm`              | `6px`     | `--size-scroll-bar-sm`            | `[--radix-scroll-area-thumb-width:…]` (see below)    |
| caret box, `Size=Md`                | `16px`    | spacing scale                     | `size-4`                                             |
| caret box, `Size=Sm`                | `10px`    | spacing scale                     | `size-2.5`                                           |
| `spacing/xs` (caret ↔ thumb)       | `4px`     | `--spacing-1`                     | folded into `py-5` / `py-3.5` (see below)            |
| `exception/spacing/2`               | `2px`     | `--spacing-0.5`                   | `pr-0.5` · `pb-0.5` horizontal                       |
| `radius/full`                       | `999px`   | `--radius-full`                   | `rounded-full`                                       |
| `surface/neutral/secondary/pressed` | `#ededed` | `--secondary`                     | `bg-secondary` (thumb) · `text-secondary` (caret)    |
| `surface/neutral/subtle/pressed`    | `#dadada` | `--color-surface-neutral-pressed` | `group-hover/scroll-rail:bg-surface-neutral-pressed` |
| — (motion, not in Figma)            | `150ms`   | `--duration-150` · `--ease-out`   | `transition-colors duration-150 ease-out`            |

> `--size-scroll-bar-md` / `-sm` cannot produce a `w-*` utility — the `--size-*`
> namespace only generates the square `size-*`, the same caveat Calendar / List / GNB /
> Navigation V2 / LNB all hit. They are usable here because Radix pins the thumb's
> cross-axis size through its own custom property: the thumb carries an inline
> `width: var(--radix-scroll-area-thumb-width)`, and Radix only defines the variable for
> the axis it measures (vertical defines `…-thumb-height`, horizontal `…-thumb-width`).
> The undefined one is invalid at computed-value time, so it computes to `auto` and,
> being inline, would beat any `w-*` / `h-*` class. The rail therefore supplies the
> missing variable from the token —
> `[--radix-scroll-area-thumb-width:var(--size-scroll-bar-md)]` — which is a token
> reference, not an arbitrary value.
>
> The caret zone is declared as rail **padding** (`py-5` = 16 + 4 for `md`, `py-3.5` =
> 10 + 4 for `sm`) rather than as flow siblings, because Radix subtracts the rail's
> `paddingTop`/`paddingBottom` (`paddingLeft`/`paddingRight` when horizontal) from both
> the thumb size and its scroll offset. The thumb can therefore never slide underneath a
> caret. The carets themselves are absolutely positioned inside that padding, inset by
> the same 2px as the content box (`left-0 right-0.5`) so caret and thumb share one
> centre line.
>
> Figma exports the carets as vectors filled `#EDEDED`. That glyph is the Phosphor
> **Fill** caret — a solid 11×6 triangle in a 16×16 box — which is exactly
> `CaretUpFillIcon`'s path at half scale (both 68.75% × 37.5% of their box), so the ITUI
> icon components are used instead of the exported asset. Both `State` variants share one
> caret asset in Figma: only the thumb changes colour on hover, never the carets. As
> everywhere else, the glyphs need `[&_path]:fill-current` to escape the hardcoded
> `fill="#101010"`.
>
> `type="always"` is the composed `ScrollArea`'s default because Figma draws the bar in
> its un-hovered `State=Default`; Radix's own default (`hover`) would fade it in only on
> pointer entry. Radix still hides the thumb when the content does not overflow.
>
> Figma's `State=Hover` is keyed off the **rail**, not the thumb, so the full 18px track
> is the hit area rather than the 10px thumb. Tailwind compiles it under
> `@media (hover: hover)`, so it never sticks on touch.
>
> Figma specs the vertical bar only. `orientation="horizontal"` mirrors every value onto
> the other axis (`h-4.5` for `w-4.5`, `pb-0.5` for `pr-0.5`, `CaretLeft`/`CaretRight`
> Fill for `CaretUp`/`CaretDown`), and `"both"` adds Radix's `Corner`.
>
> This **replaces** the previous decorative `Scrollbar` in the same folder, which never
> scrolled anything and had drifted from this node on every value: a 16px rail, a
> full-width thumb, `#f5f5f5` at rest, and 8px lucide `ChevronUp`/`ChevronDown` strokes.

### Tab

Figma node `27754:55` ("Tab" — `Base Tab` 27752:285 × the list frame 27754:222). Every
value resolved to a token that already existed — no new CSS variable was added.

| Figma Token                 | Value           | CSS Variable                     | Tailwind Class                                      |
| --------------------------- | --------------- | -------------------------------- | --------------------------------------------------- |
| `height/tab`                | `32px`          | `--size-tab`                     | `h-8` (see caveat below)                            |
| `spacing/md`                | `12px`          | `--spacing-3`                    | `px-3` (trigger)                                    |
| `spacing/sm`                | `8px`           | `--spacing-2`                    | `gap-2` (icon ↔ label · between triggers)          |
| `spacing/sm` (vertical)     | `8px`           | —                                | dropped — overflows the 32px row (see below)        |
| `height/icon/md`            | `16px`          | spacing scale                    | `size-4` (`iconLeft` / `iconRight`)                 |
| `radius/sm`                 | `8px`           | `--radius-lg`                    | `rounded-lg` (`segment` · list)                     |
| `radius/full`               | `999px`         | `--radius-full`                  | `rounded-full` (`pill`)                             |
| `stroke/sm`                 | `2px`           | —                                | `border-b-2` (`line`)                               |
| `border/primary/default`    | `#009ce0`       | `--color-border-primary`         | `data-[state=active]:border-border-primary`         |
| `surface/primary/default`   | `#009ce0`       | `--color-surface-primary`        | `data-[state=active]:bg-surface-primary`            |
| `text/neutral/default`      | `#0f0f0f`       | `--color-neutral`                | `text-foreground` (`State=Unselected`)              |
| `text/neutral/subtle`       | `#9e9e9e`       | `--color-neutral-subtle`         | `data-[state=inactive]:hover:text-neutral-subtle`   |
| `text/primary/default`      | `#009ce0`       | `--color-primary`                | `data-[state=active]:text-primary` (default · line) |
| `text/primary/inverse`      | `#fafafa`       | `--color-inverse`                | `data-[state=active]:text-inverse` (segment · pill) |
| `typography/body/md/medium` | `14 / 24 / 0.2` | `--leading-md` · `--tracking-md` | `text-sm leading-md tracking-md font-medium`        |
| `size/container/md`         | `358px`         | `--width-container-md`           | `w-container-md` (not the default — see below)      |
| — (motion, not in Figma)    | `150ms`         | `--duration-150` · `--ease-out`  | `transition-colors duration-150 ease-out`           |

> `--size-tab` (32px) already existed but the `--size-*` namespace only generates the
> square `size-*` utility — it cannot produce `h-*`. The row therefore uses `h-8`
> (2rem = 32px) off the spacing scale, the same resolution Calendar / List / GNB /
> Navigation V2 / LNB reached for their own height tokens.
>
> Figma pins `spacing/sm` (8px) as _vertical_ padding inside the 32px frame around a
> 24px line — 8 + 24 + 8 = 40, so it overflows and is clipped. The implementation
> reproduces the visible result: `h-8` with vertically centered content and no vertical
> padding, the same reading GNB and Navigation V2 already record above.
>
> `Type=Line` gives **every** trigger `border-b-2 border-transparent`, not just the
> selected one. Figma draws the 2px stroke on the boundary, where it costs no layout;
> as a CSS border on a `border-box` element it would shrink the content box and move the
> label 1px between states.
>
> Figma models `Hover` as a `State` alongside `Unselected` / `Selected`, i.e. it belongs
> to the unselected tab. It is therefore `data-[state=inactive]:hover:` — pointing at the
> selected trigger keeps its own colour rather than fading it to `#9e9e9e`.
>
> `Style=Label` + `Type=Default` + `State=Hover` is the only one of the 24 variants drawn
> in Pretendard **Regular**; the other 23 are Medium. Treated as a slip in the design
> file — every state is `font-medium`.
>
> The radius is applied on all states, not only on `Selected` where Figma's fill makes it
> visible, so the `focus-visible` ring follows the trigger's shape.
>
> `TabList` defaults to `w-full` rather than Figma's fixed `w-container-md` (358px), so it
> fits real layouts; pass `className="w-container-md"` for the exact frame. Figma's
> `justify-center` is kept — `className="justify-start"` or `[&>*]:flex-1` covers the
> other two arrangements.
>
> `Style=Label` vs `Style=LabelIcon` is not a variant: the only difference between them is
> whether a leading glyph is present, so it is the `iconLeft` / `iconRight` props — the
> same resolution Navigation V2 reached for its five top-bar types.
>
> Figma specs no `disabled` state. The implementation borrows Accordion's
> (`disabled:text-neutral-disabled` + `disabled:cursor-not-allowed`) so both keyboard-
> navigable Radix families grey out the same way.
>
> This is a **new** `tab/` folder, not a rewrite of `tabs/tabs.tsx` — that file is the
> stock shadcn Tabs on the slate palette and is still imported by `apps/web`
> (`settings-dialog.tsx`, `shortcut-help-modal.tsx`). The parts are named `Tab` /
> `TabList` / `TabTrigger` / `TabContent`, so neither barrel export collides.

### Backdrop

Figma node `27437:1149` ("Background Blur" — Backdrop `Shape=Dim` 27883:585 / `Shape=Blur`
27883:586). No new CSS variable was added: both fills reuse the tokens the existing scrims
already paint.

| Figma Token              | Value                 | CSS Variable                    | Tailwind Class                           |
| ------------------------ | --------------------- | ------------------------------- | ---------------------------------------- |
| `dim/black`              | `#1a1a1a66`           | `--color-dim-black`             | `bg-dim-black` (`variant="dim"`)         |
| `color/opacity/black/sm` | `#1a1a1a33`           | `--color-opacity-black-sm`      | `bg-opacity-black-sm`                    |
| `blur/default`           | `BACKGROUND_BLUR` `4` | `--shadow-downwards-blur-small` | `backdrop-blur-dialog` (`blur(4px / 2)`) |
| `radius/sm`              | `8px`                 | —                               | dropped — showcase swatch (see below)    |
| `size/container/gfh`     | `256px`               | —                               | dropped — showcase swatch (see below)    |

> **Fill deviation, accepted deliberately.** Figma's two fills sit on the `#1a1a1a` ink,
> while both repo tokens sit on `#0f0f0f` at a slightly lower alpha — `--color-dim-black`
> is `rgba(15,15,15,0.32)` against Figma's `0.4`, and `--color-opacity-black-sm` is
> `rgba(15,15,15,0.16)` against Figma's `0.2`. They are reused anyway so the system keeps
> **one** overlay colour: `bg-dim-black` is what `bottom-sheet`, `popup` and `modals`
> already draw, and `bg-opacity-black-sm` is what `dialog` draws. Rebasing
> `--color-opacity-black-sm` is not an option either — the `opacity/black` ramp shares the
> `#0f0f0f` base across `xs…xl`, the same constraint that pushed Snackbar's
> `color/opacity/black/lg` into its own `--color-surface-snackbar-dark`. `Skeleton` records
> the same reuse call for `color/opacity/black/xs`. Reconcile the whole ramp against Figma
> before splitting these apart.
>
> The 256×256 box and `radius/sm` in the Figma frame belong to the **showcase swatch**
> (`size/container/gfh`), not to the component: a backdrop takes the shape of whatever it
> covers, so it ships as `inset-0` on a `fixed` (viewport) or `absolute` (nearest
> positioned ancestor) box with no radius of its own.
>
> Figma specs no motion, and the `animate-in` / `fade-in-0` utilities the older overlays
> carry compile to zero rules in this package — see the ⚠ note under LNB — so no fade is
> declared rather than shipping dead classes.
>
> Figma's `Shape` prop is exposed as `variant` to match `Button` / `Badge` / `Skeleton` /
> `Snackbar`. `asChild` (Radix `Slot`) lets the scrim paint an element that already
> behaves — a `Dialog.Overlay`, or a `<button>` that closes a panel — instead of stacking
> a second layer over it.

### Grid

Figma nodes `26866:28879` ("1440px website 12-columns grid"), `26866:28999` ("1440px website
with sidebar"), `26866:29215` ("Tablet Grid") and `26867:8173` ("Mobile Grid"). No new CSS
variable was added — every margin and gutter lands on the spacing scale.

All four nodes are annotated layout-grid **diagrams**, not components: `get_variable_defs`
returns no `grid/*` variable, so the geometry is read off the diagrams and cross-checked
against each frame's own `Measure` pill.

| Preset            | Frame  | Figma columns | Shipped columns | Margin | Gutter | Content width |
| ----------------- | ------ | ------------- | --------------- | ------ | ------ | ------------- |
| Mobile            | 390px  | 4             | **12**          | 16px   | 16px   | `358px` ✓     |
| Tablet            | 744px  | 8             | **12**          | 24px   | 20px   | `696px` ✓     |
| Desktop           | 1440px | 12            | 12              | 32px   | 24px   | `1376px` ✓    |
| Desktop + sidebar | 1176px | 12            | 12              | 24px   | 24px   | `1128px` ✓    |

| Figma value             | Value     | CSS Variable                  | Tailwind Class                            |
| ----------------------- | --------- | ----------------------------- | ----------------------------------------- |
| margin, mobile          | `16px`    | `--spacing-4`                 | `px-4`                                    |
| margin, tablet          | `24px`    | `--spacing-6`                 | `md:px-6`                                 |
| margin, desktop         | `32px`    | `--spacing-8`                 | `xl:px-8` (`layout="full-width"`)         |
| margin, beside sidebar  | `24px`    | `--spacing-6`                 | `xl:px-6` (`layout="beside-sidebar"`)     |
| gutter, mobile          | `16px`    | `--spacing-4`                 | `gap-4`                                   |
| gutter, tablet          | `20px`    | `--spacing-5`                 | `md:gap-5`                                |
| gutter, desktop         | `24px`    | `--spacing-6`                 | `xl:gap-6`                                |
| track count             | —         | —                             | `grid-cols-12` at every width (see below) |
| LNB rail (sidebar node) | `264px`   | spacing scale                 | `w-66` — story stand-in, same as LNB      |
| overlay stripe fill     | `#faa9a3` | `--color-surface-error-muted` | `bg-surface-error-muted` (see below)      |

> Each preset reconciles exactly against its `Measure` label:
> `390 − 2×16 = 358` · `744 − 2×24 = 696` · `1440 − 2×32 = 1376` · `1176 − 2×24 = 1128`,
> and `12×72 + 11×24 = 1128` for the sidebar node whose columns are pinned rather than `Auto`.
> Every other node labels its columns `Auto`, so all four presets are
> `repeat(N, minmax(0, 1fr))` — only the count, margin and gutter change.
>
> **Track-count deviation, decided deliberately.** Figma specs three track counts —
> 4 (Mobile Grid `26867:8173`), 8 (Tablet Grid `26866:29215`), 12 (desktop) — but the
> shipped grid is **12 columns at every width**, so `size={1}` is always 1/12 of the
> container and twelve items always land on one row. This overrides the two smaller
> nodes and was taken with the cost understood: at 390px a single column is only ~14px,
> so anything meant to read on a phone must carry a wider `size` there. The idiomatic
> form is `size={{ xs: 12, md: 6, xl: 4 }}`, not a bare `size={4}`. Only the track count
> was flattened — gutter and margin still step through all three bands.
>
> **Breakpoint deviation, accepted deliberately.** Figma gives _device widths_
> (390 / 744 / 1440), not CSS breakpoints. The gutter/margin steps reuse Tailwind's
> built-in `md:` (768px) and `xl:` (1280px) rather than registering
> `--breakpoint-tablet: 744px` / `--breakpoint-desktop: 1440px`, so the package stays on
> one breakpoint scale — every other responsive class in `packages/ui` already uses the
> built-ins. A **744px** tablet (Figma's exact frame) therefore takes the mobile gutter
> and margin, and **1280–1439px** laptops take the desktop pair before Figma's 1440px
> frame. Switching later is a two-line `@theme` addition plus a `md:`→`tablet:` /
> `xl:`→`desktop:` rename.
>
> **Overlay fill deviation.** Figma's measuring stripes are `color/semantic/red/200`
> (`#faa9a3`) — annotation ink with no token in this package, alongside the `red/400`
> arrows, `blue/*` gutter marks and `green/*` margin marks, none of which describe the
> component. `GridOverlay` reuses the existing translucent `--color-surface-error-muted`
> (`#de3d314d`) instead: still red, lets content read through, and adds no colour token.
> Same reuse call recorded for Backdrop's fills above.
>
> The 264px rail, the `1376`/`696`/`358` measure pills, the dashed stripe borders and the
> GNB / Navigation bars drawn in each frame all belong to the **measuring overlay**, not to
> the grid — the same reading Backdrop's "showcase swatch" note records.
>
> No Radix primitive applies: a layout grid has no interaction, focus management or ARIA
> surface. Only `@radix-ui/react-slot` is used, to back `asChild` on `Grid` and `GridItem`.
>
> `GridItem`'s API follows **MUI Grid v2** (`size` / `offset`, taking one value or a
> `{ xs, md, xl }` object). Those keys are MUI's own names _and_ Tailwind's prefixes, so the
> object maps 1:1 onto the classes it generates. Three divergences: the container/item split
> stays two named components rather than MUI's `container` boolean; `offset` resolves to
> `col-start-*` (an absolute grid line) rather than MUI's `margin-left`, since this is real
> CSS Grid — identical for the first item in a row, and it snaps to the true track; and
> `spacing` / `columns` are not exposed, because the gutter and track count _are_ the Figma
> preset.

### Radius

Figma node `26871:5998` ("Radius" foundation board). Two new CSS variables were added —
the only two steps of the ITUI scale with no equivalent anywhere in the package.

The board is seven annotated swatch tiles, not an interactive component, so no Radix
primitive applies; only `@radix-ui/react-slot` is used, to back `asChild`. Same reading
recorded for Grid and Backdrop below/above.

| Figma Token / value                      | Value                   | CSS Variable                       | Tailwind Class                               |
| ---------------------------------------- | ----------------------- | ---------------------------------- | -------------------------------------------- |
| `Radius old/Size/xxxs` (`radius/xs`)     | `4px`                   | `--radius-sm`                      | `rounded-sm`                                 |
| `Radius old/Size/xxs` (`radius/sm`)      | `8px`                   | `--radius-lg`                      | `rounded-lg`                                 |
| `radius/md`                              | `12px`                  | `--radius-xl`                      | `rounded-xl` (see derivation below)          |
| `Radius old/Size/Small` (`radius/lg`)    | `16px`                  | `--radius-2xl`                     | `rounded-2xl`                                |
| `Radius old/Size/Medium` (`radius/xl`)   | `20px`                  | `--radius-component-xl` **(new)**  | `rounded-component-xl`                       |
| `radius/2xl`                             | `28px`                  | `--radius-component-2xl` **(new)** | `rounded-component-2xl`                      |
| `Radius old/Size/Full`                   | `512px`                 | `--radius-full`                    | `rounded-full` (9999px — see below)          |
| tile field, `surface/primary/subtle`     | `#e6f5fc`               | `--color-surface-primary-subtle`   | `bg-surface-primary-subtle` (story only)     |
| tile card, `color/static/white`          | `#fafafa`               | `--color-inverse`                  | `bg-inverse` (story only)                    |
| tile card shadow                         | `16px 0 24px #8989891a` | `--shadow-md`                      | `shadow-md` — reuse, see below (story only)  |
| annotation, `text/primary/default`       | `#009ce0`               | `--color-primary`                  | `text-primary` · `border-primary`            |
| `typography/caption/sm/regular`          | `12 / 20 / 0.3`         | `--leading-sm` · `--tracking-sm`   | `text-xs leading-sm tracking-sm`             |
| `typography/heading/xl/medium`           | `18 / 28 / -0.04`       | `--leading-xl` · `--tracking-xl`   | `text-lg leading-xl tracking-xl font-medium` |
| `typography/body/md/regular`             | `14 / 24 / 0.2`         | `--leading-md` · `--tracking-md`   | `text-sm leading-md tracking-md`             |
| tile field 320px · card 160px            | `320px` · `160px`       | spacing scale                      | `size-80` · `size-40` (story only)           |
| `scale/40` · `scale/20`                  | `40px` · `20px`         | `--spacing-10` · `--spacing-5`     | `gap-10` (tiles) · `gap-5` (label ↔ tile)   |
| `Border Width/10` · `Border Radius/none` | `0`                     | —                                  | dropped — 0-width borders on the tile cards  |

> **`md` is 12px, and the Figma layer binding is wrong.** The Md tile is bound to
> `Radius old/Size/Small` (**16px**), the same variable as Lg, while its own annotation
> reads **12px**. The label wins: the `--radius-*-nest-*` tokens are each `base + padding`,
> and `md-nest-4` = 16 with `md-nest-8` = 20 both resolve `md` to 12. That also makes the
> scale a clean 4px progression — **4 · 8 · 12 · 16 · 20 · 28 · full**. Worth asking the
> designer to rebind the layer.
>
> **`full` ships as 9999px, not Figma's 512px.** The intent is "fully round whatever the
> box is", which 512px only happens to satisfy for the 160px swatch.
>
> **New token names.** 20px and 28px have no equivalent in the package, and both ITUI names
> that would fit them (`xl`, `2xl`) are already taken by a different Tailwind value —
> `rounded-xl` is 12px, `rounded-2xl` is 16px. Hence `--radius-component-{xl,2xl}`, the name
> this file already carried as a TODO. Rebasing `--radius-xs…2xl` onto the ITUI values so
> `rounded-md` _is_ Figma `radius/md` remains the clean end state, but it is a breaking sweep
> of every `rounded-*` in the package; deliberately **not** done here. `radiusClass` holds
> the name→pixel mapping in the meantime.
>
> **The swatch tile is story-only.** A radius has no surface of its own, so the 320px blue
> field, the 160px card, its shadow and the blue px annotation live in `Radius.stories.tsx`
> rather than shipping as a component. This diverges from Grid, which does ship
> `GridOverlay` — a grid ruler has a dev-facing use a radius swatch does not.
>
> **The corner guide is CSS, not the exported PNG.** Figma exports a blue bracket per tile,
> but every tile uses the same ~15px box whatever its radius, so it is a fixed-size leader
> annotation rather than a scaled tracing. It is rebuilt as a `size-4` box with
> `border-t border-l border-primary` plus the tile's own top-left radius, keeping six
> near-identical PNGs on 7-day URLs out of the repo — the same call recorded for Grid's
> measuring overlay and Backdrop's showcase swatch. ⚠ CSS clamps a corner to half the box,
> so `xl` (20px) and `2xl` (28px) render their curve at 8px on the 16px bracket.
>
> **The card shadow reuses `--shadow-md`.** Figma's is `16px 0 24px 0 #8989891a`
> (`shadow/rightwards/positioning/xl` 16 at `shadow/blur/md` 24 in
> `shadow/downwards/color/neutral`); `--shadow-md` has the same 24px blur and alpha on a
> different axis and grey. No eighth shadow variable for documentation ink — and it sits on
> a different colour ramp (`#898989`) from `--shadow-rightwards-sm` (`#1a1a1a`), so it could
> not have been that token's `md` sibling.
>
> `Radius` defaults to `md` rather than Figma's first variant (`XS`, 4px), which is too
> subtle to read as a deliberate corner on anything but a small control — the same kind of
> call `TabList` makes with its `w-full` default.

### Colors

Figma nodes `28652:1601` ("Color Brand"), `28652:1507` ("Color Semantic") and `28652:1778`
("Color Palette"). **129 new CSS variables** — the four ITUI colour ramps, each mirroring its
Figma path 1:1. Purely additive: no existing variable was renamed, re-pointed or removed.

The boards are annotated swatch grids, not interactive components, so no Radix primitive
applies; only `@radix-ui/react-slot`, to back `asChild`. Same reading recorded for Radius
and Grid.

| Figma namespace          | CSS Variable               | Steps               | Tailwind Class         |
| ------------------------ | -------------------------- | ------------------- | ---------------------- |
| `color/brand/sky/*`      | `--color-brand-sky-*`      | 50…900 (10)         | `bg-brand-sky-500`     |
| `color/brand/neutral/*`  | `--color-brand-neutral-*`  | 50…900, 950 (11)    | `bg-brand-neutral-500` |
| `color/semantic/{hue}/*` | `--color-semantic-{hue}-*` | 50, 500 (+ red 700) | `bg-semantic-red-500`  |
| `color/scheme/{hue}/*`   | `--color-scheme-{hue}-*`   | 50…900 × 10 hues    | `bg-scheme-teal-500`   |

Hues: semantic = `green` · `blue` · `red` · `orange`; scheme = `blue-grey` · `indigo` ·
`deep-purple` · `teal` · `cyan` · `light-green` · `lime` · `yellow` · `orange` · `pink`.

`components/colors/Colors.tsx` is the single reconciliation point: `COLOR_HEX`,
`colorBgClass`, `COLOR_RAMPS` and `colorName()`, the same role `radiusClass` plays for the
radius scale.

> **⚠ The `brand-` / `semantic-` / `scheme-` prefixes are load-bearing.** Tailwind already
> ships `--color-{teal,cyan,lime,yellow,pink,indigo}-*` at _different_ values, and product
> code depends on them — `apps/web/components/health-status.tsx` paints `text-yellow-400`
> (`oklch(85.2% .199 91.936)`). Declaring ITUI's hues under the bare names would silently
> repaint it. Reach for `colorBgClass['scheme-teal-500']`, never `bg-teal-500`
> (Tailwind's `#14b8a6` vs ITUI's `#009688`). Verified: the built-in ramps are still
> unshadowed in the compiled bundle.
>
> **⚠ 17 hexes now carry two names — deliberately.** The ramps were added without
> re-pointing anything, so `--color-brand-sky-500` and the older `--color-brand` /
> `--color-primary` / `--color-surface-primary` / `--color-border-primary` /
> `--color-icon-primary` all hold `#009ce0`. Full list:
>
> | New ramp token                | Existing token(s) with the identical value                                                  |
> | ----------------------------- | ------------------------------------------------------------------------------------------- |
> | `--color-brand-sky-50`        | `--color-brand-subtle` · `--color-surface-primary-subtle` · `--color-border-primary-subtle` |
> | `--color-brand-sky-100`       | `--color-surface-primary-muted` · `--color-border-primary-muted`                            |
> | `--color-brand-sky-300`       | `--color-brand-hover` · `--color-surface-primary-hover`                                     |
> | `--color-brand-sky-400`       | `--color-primary-hover` · `--color-brand-link-hover` · `--color-icon-primary-hover`         |
> | `--color-brand-sky-500`       | `--color-brand` · `--color-primary` · `--color-surface-primary` · `--color-border-primary`  |
> | `--color-brand-sky-600`       | `--color-brand-pressed` · `--color-primary-pressed` · `--color-surface-primary-pressed`     |
> | `--color-brand-neutral-50`    | `--color-surface-neutral-subtle`                                                            |
> | `--color-brand-neutral-200`   | `--color-border-neutral` · `--color-surface-neutral-pressed`                                |
> | `--color-brand-neutral-300`   | `--color-neutral-disabled` · `--color-icon-neutral-disabled`                                |
> | `--color-brand-neutral-400`   | `--color-neutral-subtle` · `--color-icon-neutral-subtle`                                    |
> | `--color-brand-neutral-500`   | `--color-neutral-muted` · `--color-icon-neutral-muted`                                      |
> | `--color-brand-neutral-800`   | `--color-surface-neutral-strong`                                                            |
> | `--color-brand-neutral-900`   | `--color-neutral-strong` · `--color-border-neutral-strong` · `--color-brand-secondary-900`  |
> | `--color-brand-neutral-950`   | `--color-neutral` · `--color-ink` · `--color-icon-neutral`                                  |
> | `--color-semantic-red-50`     | `--color-surface-error-subtle`                                                              |
> | `--color-scheme-{9 hues}-500` | the nine bare `--color-teal` / `--color-cyan` / `--color-pink` / … tokens                   |
>
> Keep the semantic alias when you mean **intent** ("the primary surface"); reach for the
> ramp when you mean the **step** ("sky/500"). The clean end state is the aliases becoming
> `var(--color-brand-sky-500)` references — a re-point of ~30 variables, deliberately out of
> scope here. `--color-brand-neutral-100` was the one name that already existed at the
> identical value and was left untouched.
>
> **⚠ The semantic ramp is not the shadcn status ramp.** `--success` / `--info` /
> `--warning` / `--destructive` keep their oklch values and are visibly different colours
> from Figma's `#4caf50` / `#1677ff` / `#ffad33` / `#f44336`. The system currently has two
> status ramps; reconciling them is a re-point, not an addition.
>
> **The Palette board binds its orange 50/500 to the _semantic_ orange**, not to a scheme
> variable of its own, so `--color-scheme-orange-50` / `-500` are declared as
> `var(--color-semantic-orange-*)` references — mirroring Figma rather than copying the hex.
>
> **`--color-semantic-red-700` (`#ad3026`) is not on any board.** It was added alongside
> because `Avatar`'s src-less fallback has always painted `bg-semantic-red-700`, which had no
> `@theme` entry and so compiled to nothing — a src-less `Avatar` rendered white on
> transparent. `COLOR_RAMPS` therefore lists 50 and 500 only for `semantic-red`, so the
> board story still matches Figma exactly.
>
> **Only `bg-*` is enumerated in `colorBgClass`.** That is what the boards draw; `text-*` and
> `border-*` are written literally by callers, as everywhere else in this package. Every
> class is spelled out rather than interpolated so Tailwind's scanner finds the literal —
> same reason `Radius.tsx` spells out `radiusClass`.
>
> **Story-only ink.** The swatch card, the info card, the blue section band and the three
> boards live in `Colors.stories.tsx`; a colour has no surface of its own to ship. Figma's
> swatch border is `rgba(0,0,0,0.03)` — all but invisible — replaced by the real
> `border-neutral-subtle` token so a near-white step still reads as a box. The board's 40px
> title and 19px strapline resolve to `text-4xl` (36px) and `text-base` (16px); no
> `--text-40` / `--text-19` is registered for type that never leaves the story.
>
> **Two slips in the design file**, both worth telling the designer: every Primary swatch
> caption reads `Primary Echo/50` regardless of its step, and the Primary and Neutral info
> cards both read `R88 / G169 / B220` (correct for neither `#009CE0` nor `#595858`). The
> story derives both strings from the hex instead.
>
> **⚠ `dist/index.css` must be rebuilt for token changes to show up.** `CLAUDE.md` says
> Storybook aliases `@echoit/itui.css` straight to `src` so no build is needed — that is true
> for JS/TS only. The `@import '@echoit/itui.css'` in `.storybook/tailwind.css` resolves
> through the package `exports` `style` condition to **`dist/index.css`**, so a new `@theme`
> variable stays invisible until `pnpm build:js` runs in `packages/ui`. This cost one full
> debug cycle here.

### Shadow

Figma node `26871:6078` — named "Dropshadow" on the canvas, titled "Shadow" in its own header.
**Six new CSS variables**, filling the gaps in a ramp that was already half-registered: the
other six arrived one at a time, pulled in by whichever component needed them (Floating Button
/ GNB / OverflowMenu, Navigation V2, LNB, drawer). Their names and values already matched the
board exactly, so nothing was renamed or re-pointed.

The board is an annotated swatch grid, not an interactive component, so no Radix primitive
applies; only `@radix-ui/react-slot`, to back `asChild`. Same reading recorded for Radius,
Grid and Colors.

All twelve effects are the same `DROP_SHADOW` in `shadow/color/black` (`#1a1a1a14` ≈
`rgba(26,26,26,0.08)`) at `spread: 0`. Only offset and blur vary, and they move together — so
the board is **one 3-step ramp mirrored onto four axes**:

| Size | Offset | Blur | Figma variables                              |
| ---- | ------ | ---- | -------------------------------------------- |
| `sm` | `4`    | `16` | `shadow/positioning-*/xs` · `shadow/blur/sm` |
| `md` | `12`   | `24` | `shadow/positioning-*/md` · `shadow/blur/md` |
| `lg` | `20`   | `48` | `shadow/positioning-*/xl` · `shadow/blur/lg` |

Direction picks the axis and the sign: `downwards` = +y, `upwards` = −y, `rightwards` = +x,
`leftwards` = −x.

| Direction    | Size | box-shadow                          | CSS Variable             | Tailwind Class         | Status  |
| ------------ | ---- | ----------------------------------- | ------------------------ | ---------------------- | ------- |
| `downwards`  | `sm` | `0 4px 16px 0 rgba(26,26,26,.08)`   | `--shadow-downwards-sm`  | `shadow-downwards-sm`  | existed |
| `downwards`  | `md` | `0 12px 24px 0 rgba(26,26,26,.08)`  | `--shadow-downwards-md`  | `shadow-downwards-md`  | existed |
| `downwards`  | `lg` | `0 20px 48px 0 rgba(26,26,26,.08)`  | `--shadow-downwards-lg`  | `shadow-downwards-lg`  | existed |
| `upwards`    | `sm` | `0 -4px 16px 0 rgba(26,26,26,.08)`  | `--shadow-upwards-sm`    | `shadow-upwards-sm`    | existed |
| `upwards`    | `md` | `0 -12px 24px 0 rgba(26,26,26,.08)` | `--shadow-upwards-md`    | `shadow-upwards-md`    | **new** |
| `upwards`    | `lg` | `0 -20px 48px 0 rgba(26,26,26,.08)` | `--shadow-upwards-lg`    | `shadow-upwards-lg`    | **new** |
| `leftwards`  | `sm` | `-4px 0 16px 0 rgba(26,26,26,.08)`  | `--shadow-leftwards-sm`  | `shadow-leftwards-sm`  | **new** |
| `leftwards`  | `md` | `-12px 0 24px 0 rgba(26,26,26,.08)` | `--shadow-leftwards-md`  | `shadow-leftwards-md`  | **new** |
| `leftwards`  | `lg` | `-20px 0 48px 0 rgba(26,26,26,.08)` | `--shadow-leftwards-lg`  | `shadow-leftwards-lg`  | existed |
| `rightwards` | `sm` | `4px 0 16px 0 rgba(26,26,26,.08)`   | `--shadow-rightwards-sm` | `shadow-rightwards-sm` | existed |
| `rightwards` | `md` | `12px 0 24px 0 rgba(26,26,26,.08)`  | `--shadow-rightwards-md` | `shadow-rightwards-md` | **new** |
| `rightwards` | `lg` | `20px 0 48px 0 rgba(26,26,26,.08)`  | `--shadow-rightwards-lg` | `shadow-rightwards-lg` | **new** |

`components/shadow/Shadow.tsx` is the single reconciliation point: `shadowClass`,
`SHADOW_OFFSET` and `SHADOW_BLUR`, the same role `radiusClass` plays for the radius scale and
`colorBgClass` for the ramps.

> **⚠ These are not `shadow-sm` / `shadow-md` / `shadow-lg`.** See the Value Conflicts entry —
> this package ships two shadow ramps, and `shadowClass.downwards.md` is the only spelling that
> cannot pick the wrong one.
>
> **`shadow/positioning-up/*` is a sign, not an axis.** Figma has only two positioning ramps —
> `positioning-down` (`0 · 4 · 12 · 20`) and `positioning-up` (`0 · −4 · −12 · −20`) — and both
> horizontal directions borrow from them: `shadow/leftwards/md` is
> `offset: (positioning-up/md, positioning-up/none)`, i.e. `−12` on **x**. `shadow/rightwards/lg`
> even mixes the two for its zero. Harmless, but the variable names cannot be read as axis
> names; the direction table above is the actual mapping.
>
> **`--shadow-leftwards-sm` is derived, not read.** It is the only one of the twelve with no
> Figma variable, so its tile (`26871:6275`) is bound to `shadow/leftwards/lg` and paints an
> identical `−20/48` — visible on the board as a first tile with a wider halo than the second.
> The eleven others follow the ramp without exception and its mirror `--shadow-rightwards-sm`
> was already shipped, so the ramp wins over the slipped binding. Same call the Radius board's
> `Md` tile got. Worth telling the designer: the variable should be created and the layer
> rebound.
>
> **`tailwind.extend.ts` gained twelve `boxShadow` keys, not six.** None of the six existing
> directional shadows had ever been mirrored into that file, so the v3/hybrid reference was
> already incomplete. Purely additive — v4 reads `@theme` in `global.css`, not this file.
>
> **Story-only ink.** The 320px `surface/primary/subtle` field, the white card and the
> offset/blur annotation live in `Shadow.stories.tsx`; a shadow has no surface of its own to
> ship. Figma's card measures `218.88px` — a scaled-symbol artifact, not reachable from the
> spacing scale — and ships centred at `size-55` (220px); `size-[218.88px]` would be an
> arbitrary value buying a 1.1px difference on documentation ink. The card's `radius/md` corner
> reuses `radiusClass.md` from the Radius module rather than re-deriving that 12px ≠
> `rounded-md` mapping a second time.
>
> **No elevation semantics.** The board names directions, not roles; nothing in it says which
> step a menu or a sheet should use. `Shadow` stays a literal scale rather than inventing
> design intent, and defaults to `downwards`/`md` — the direction three of the six pre-existing
> tokens use, at the middle step.

### Spacing

Figma node `29919:311` ("Spacing" foundation board). **Zero new CSS variables** — all eleven
steps already existed on the Tailwind spacing scale. See §2.3 for the scale table and the
`md`/`lg`/`xl` name trap; `components/spacing` exports `SPACING_PX` and `spacingClass`.

| Figma Token    | Value  | CSS Variable   | Tailwind Class    |
| -------------- | ------ | -------------- | ----------------- |
| `spacing/none` | `0`    | `--spacing-0`  | `gap-0` · `p-0`   |
| `spacing/xs`   | `4px`  | `--spacing-1`  | `gap-1` · `p-1`   |
| `spacing/sm`   | `8px`  | `--spacing-2`  | `gap-2` · `p-2`   |
| `spacing/md`   | `12px` | `--spacing-3`  | `gap-3` · `p-3`   |
| `spacing/lg`   | `16px` | `--spacing-4`  | `gap-4` · `p-4`   |
| `spacing/xl`   | `20px` | `--spacing-5`  | `gap-5` · `p-5`   |
| — (see below)  | `24px` | `--spacing-6`  | `gap-6` · `p-6`   |
| `spacing/3xl`  | `32px` | `--spacing-8`  | `gap-8` · `p-8`   |
| `spacing/4xl`  | `40px` | `--spacing-10` | `gap-10` · `p-10` |
| `spacing/5xl`  | `48px` | `--spacing-12` | `gap-12` · `p-12` |
| `spacing/6xl`  | `64px` | `--spacing-16` | `gap-16` · `p-16` |

> **`2xl` = 24px is the one unbound step.** `get_variable_defs` returns no `spacing/2xl`; the
> row's bar is a raw 24px and its layer is named `24` where every sibling is named `4px` /
> `8px` / `32px`. But its own px column reads `24px`, and 24 is the exact 4px step between
> `xl` (20) and `3xl` (32) — a missing variable, not a missing step. Same call `radius/md`
> gets in the Radius section.
>
> **`spacingClass` covers four properties, not twelve.** `gap` / `p` / `px` / `py` cover
> essentially every real use; `m*`, `space-*` and the single-side paddings are left out rather
> than shipping ~130 literal strings for cases nobody has. Classes are spelled out, never
> interpolated, so Tailwind's scanner finds them — the same reason `radiusClass` is.
>
> **Story-only ink.** The Name/Pixels table, the `brand-sky-100` measuring bars on their
> `brand-sky-500` dashed rules, and the board's 28px right corners live in
> `Spacing.stories.tsx`; spacing has no surface of its own to ship. The board's bars are drawn
> with the real `Spacing` component so the documentation cannot drift from the scale. Two
> deviations there: Figma's `0.5px` bar rules render as `border-y` (1px — Tailwind's smallest,
> and sub-pixel borders are unreliable across DPRs), and the 43px / 42px label columns are
> auto-layout hug widths, not tokens, so they round to `w-11` / `w-10`.
>
> **Two `TOKENS.md` inaccuracies this board surfaced, left uncorrected on request** (both are
> pre-existing rows in §1.3, not introduced here): `color/static/white` resolves to `#fafafa`
> in this file, not the `#ffffff`/`bg-white` recorded there — `--color-inverse` is the accurate
> token. And `color.neutral.ink` / `--color-ink` / `text-ink` is documented but **does not
> exist** in `global.css`; `text-ink` compiles to nothing. `#0f0f0f` is `--foreground`, so
> `text-foreground` is what the story uses.

### Focus ring

Cross-cutting rather than component-specific: every interactive component paints its focus indicator
through one utility, and these four properties are what it reads. They are plain `:root` custom
properties, **not** `@theme` entries — they generate no Tailwind class of their own. They feed the two
`@utility` blocks in `src/styles/global.css`, so a consumer redefines the indicator by overriding a
property, never by restyling components.

| Token                     | CSS Variable                     | Value                            | Read by                           |
| ------------------------- | -------------------------------- | -------------------------------- | --------------------------------- |
| `focus.ring.width`        | `--itui-focus-ring-width`        | `0.5px`                          | `focus-ring` · `focus-ring-inset` |
| `focus.ring.color`        | `--itui-focus-ring-color`        | `var(--color-brand)` — `#009ce0` | `focus-ring` · `focus-ring-inset` |
| `focus.ring.offset`       | `--itui-focus-ring-offset`       | `2px`                            | `focus-ring`                      |
| `focus.ring.offset.inset` | `--itui-focus-ring-offset-inset` | `-2px`                           | `focus-ring-inset`                |

> **Two utilities, one indicator.** `focus-ring` offsets the outline outward; `focus-ring-inset` uses
> the negative offset so an ancestor with `overflow-hidden` — or any scroll container — cannot clip
> it. Give an element one or the other, **never both**: `tailwind-merge` knows neither utility, so
> `cn()` keeps the pair and source order decides the winner.
>
> **`0.5px` is sub-pixel and deliberate.** A DPR-1 display rounds it (Chrome draws it faint, Firefox
> may snap it to 1px); only a 2× display renders exactly one device pixel. It clears WCAG 2.1 SC
> 2.4.7 but sits under the 2px WCAG 2.2 SC 2.4.11 asks for — see `ACCESSIBILITY.md`. A consumer that
> needs the thicker bar sets `:root { --itui-focus-ring-width: 2px }` and every component follows.
>
> **The colour goes through `--color-brand`, not `--color-ring`.** `--color-brand` comes from a plain
> `@theme` block, so the custom property is guaranteed to exist at runtime the way an `@theme inline`
> one is not.

---

## Validation Report

### Missing Tokens

| Token                            | Reason                                                                                                                    | Resolution                                                                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `color.status.reconciliation`    | Two status ramps coexist: shadcn `--success`/`--info`/`--warning`/`--destructive` (oklch) vs Figma `color/semantic/*`     | Decide which wins, then re-point the loser. A re-point, not an addition — see the ⚠ note under _Colors_                                            |
| `component.progress.ring.stroke` | Only `lg` has a Figma variable (`Border Width/200 = 8`); `md` (5px) and `sm` (~3.6px) were measured off the rendered node | Kept as an SVG `strokeWidth` constant in `progress/Progress.tsx` — SVG stroke is an attribute, not a Tailwind utility, so no `@theme` entry applies |

### Resolved (previously missing)

| Token                              | Figma Source                        | Added As                          | Used By                                 |
| ---------------------------------- | ----------------------------------- | --------------------------------- | --------------------------------------- |
| `color.surface.hover`              | `surface/neutral/secondary/hover`   | `--color-surface-hover`           | Button (ghost) · Avatar                 |
| `color.surface.pressed`            | `surface/neutral/secondary/pressed` | `--color-surface-pressed`         | Button (ghost) · Avatar                 |
| `color.surface.snackbar.dark`      | `color/opacity/black/lg`            | `--color-surface-snackbar-dark`   | Snackbar                                |
| `component.snackbar.width`         | `size/container/md`                 | `--width-snackbar`                | Snackbar                                |
| `color.surface.success.muted`      | `color/semantic/green/600@30`       | `--color-surface-success-muted`   | Calendar                                |
| `color.surface.error.muted`        | `color/semantic/red/600@30`         | `--color-surface-error-muted`     | Calendar                                |
| `color.surface.error.subtle`       | `surface/semantic/error`            | `--color-surface-error-subtle`    | Input Field (FileUploadInput error row) |
| `component.calendar.width.md`      | `size/container/md`                 | `--width-calendar-md`             | Calendar                                |
| `component.calendar.width.lg`      | `size/container/lg`                 | `--width-calendar-lg`             | Calendar                                |
| `component.calendar.width.xl`      | RangePicker frame `27729:706`       | `--width-calendar-xl`             | DatePicker                              |
| `component.calendar.width.panel`   | RangePicker panel `27729:708`       | `--width-calendar-panel`          | DatePicker                              |
| `size.container.md`                | `size/container/md`                 | `--width-container-md`            | GNB                                     |
| `shadow.upwards.sm`                | `shadow/upwards/sm`                 | `--shadow-upwards-sm`             | Navigation V2                           |
| `size.container.xs`                | `size/container/xs`                 | `--width-container-xs`            | OverflowMenu                            |
| `shadow.rightwards.sm`             | `shadow/rightwards/sm`              | `--shadow-rightwards-sm`          | LNB                                     |
| `motion.animate.collapsible`       | — (Radix Collapsible)               | `--animate-collapsible-down/-up`  | LNB                                     |
| `radius.component.xl`              | `radius/xl` (20px)                  | `--radius-component-xl`           | Radius                                  |
| `radius.component.2xl`             | `radius/2xl` (28px)                 | `--radius-component-2xl`          | Radius                                  |
| `component.badge.color.bg`         | `color/semantic/red/500`            | `--color-semantic-red-500`        | Colors · Badge                          |
| `color.brand.sky.*`                | `color/brand/sky/*` (10)            | `--color-brand-sky-{50…900}`      | Colors                                  |
| `color.brand.neutral.*`            | `color/brand/neutral/*` (10)        | `--color-brand-neutral-{50…950}`  | Colors                                  |
| `color.semantic.*`                 | `color/semantic/{hue}/{50,500}`     | `--color-semantic-{hue}-{50,500}` | Colors                                  |
| `color.semantic.red.700`           | — (Avatar fallback, unspecced)      | `--color-semantic-red-700`        | Colors · Avatar                         |
| `typography.fontFamily.pretendard` | `typography/family/*`               | `@echoit/itui.css/fonts.css`      | every component (via `font-sans`)       |
| `color.scheme.*`                   | `color/scheme/{hue}/*` (100)        | `--color-scheme-{hue}-{50…900}`   | Colors                                  |
| `shadow.upwards.md`                | `shadow/upwards/md`                 | `--shadow-upwards-md`             | Shadow                                  |
| `shadow.upwards.lg`                | `shadow/upwards/lg`                 | `--shadow-upwards-lg`             | Shadow                                  |
| `shadow.leftwards.sm`              | — (derived; no Figma variable)      | `--shadow-leftwards-sm`           | Shadow                                  |
| `shadow.leftwards.md`              | `shadow/leftwards/md`               | `--shadow-leftwards-md`           | Shadow                                  |
| `shadow.rightwards.md`             | `shadow/rightwards/md`              | `--shadow-rightwards-md`          | Shadow                                  |
| `shadow.rightwards.lg`             | `shadow/rightwards/lg`              | `--shadow-rightwards-lg`          | Shadow                                  |
| `typography.fontSize.caption-xs`   | `typography/size/11`                | `--text-caption-xs`               | Typography · Avatar                     |
| `typography.fontSize.heading-4xl`  | `typography/size/32`                | `--text-heading-4xl`              | Typography                              |
| `typography.fontSize.display-5xl`  | `typography/size/40`                | `--text-display-5xl`              | Typography                              |
| `typography.letterSpacing.lg`      | `typography/letter-spacing/lg`      | `--tracking-lg` = `0.09px`        | Typography · Button                     |

> `--width-container-md` is the canonical `size/container/md` (358px).
> `--width-calendar-md` and `--width-snackbar` are older component-scoped aliases of
> the same Figma variable — prefer `--width-container-md` for new components, and fold
> the aliases into it when those two components are next touched.

### Duplicates Removed

| Removed                                               | Canonical                                                         | Reason                                                                                                                                                                   |
| ----------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `color/static/white` (Figma)                          | `color.white` (`--color-white`)                                   | Same value `#ffffff`; Tailwind built-in covers it                                                                                                                        |
| `text/sematic/inverse` (Figma)                        | `color.white`                                                     | Same value `#ffffff`; maps to `text-white`                                                                                                                               |
| `text/neutral/default` (Figma)                        | `color.neutral.ink` (`--color-ink`)                               | Same value `#0f0f0f`                                                                                                                                                     |
| `static/scale/500` (Figma, 20px)                      | `spacing.5` (`--spacing-5`, 20px)                                 | Resolved via spacing scale                                                                                                                                               |
| `static/scale/1000` (Figma, 40px)                     | `spacing.10` (`--spacing-10`, 40px)                               | Resolved via spacing scale                                                                                                                                               |
| `surface/neutral/disabled/default` (Figma, `#f5f5f5`) | `color.surface.neutral.subtle` (`--color-surface-neutral-subtle`) | Same value `#f5f5f5`. Note `--color-surface-neutral-disabled` is `#ededed` — it maps to Figma's `surface/neutral/disabled/**inverse**`, not `/default`. Used by Stepper. |

### Renamed Tokens

| Before                                | After                                        | Reason                                                          |
| ------------------------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| `--radius` (bare)                     | `radius.base` / `--radius`                   | Disambiguates from size-scale tokens; exposed as `rounded-base` |
| `color/semantic/red/500`              | `color.semantic.red.500`                     | Normalized to dot notation                                      |
| Figma `/` paths (e.g. `font/size/12`) | dot notation (e.g. `typography.fontSize.xs`) | Consistency with token key convention                           |

### Value Conflicts

| Token                    | Figma Value | Tailwind Built-in    | Resolution                                                                      |
| ------------------------ | ----------- | -------------------- | ------------------------------------------------------------------------------- |
| `radius/xs`              | `4px`       | `rounded-xs = 2px`   | Use `rounded-sm` (0.25rem = 4px); §3.3 has the whole scale                      |
| `radius/sm`              | `8px`       | `rounded-sm = 4px`   | Use `rounded-lg` (0.5rem = 8px)                                                 |
| `radius/md`              | `12px`      | `rounded-md = 6px`   | Use `rounded-xl` (0.75rem = 12px) — never `rounded-md`                          |
| `radius/lg`              | `16px`      | `rounded-lg = 8px`   | Use `rounded-2xl` (1rem = 16px) in components; Figma scale ≠ Tailwind scale     |
| `typography/size/11`     | `11px`      | none                 | No built-in at all → added as `--text-caption-xs`                               |
| `typography/size/32`     | `32px`      | `text-4xl = 36px`    | No built-in → added as `--text-heading-4xl`; never `text-4xl`                   |
| `typography/size/40`     | `40px`      | `text-5xl = 48px`    | No built-in → added as `--text-display-5xl`; `text-5xl` is 48px = `display-6xl` |
| `radius/xl`              | `20px`      | `rounded-xl = 12px`  | No built-in → added as `--radius-component-xl`                                  |
| `radius/2xl`             | `28px`      | `rounded-2xl = 16px` | No built-in → added as `--radius-component-2xl`                                 |
| `color/semantic/red/500` | `#f44336`   | `red-500 = #ef4444`  | Add as custom `--color-semantic-red-500`; do not conflate with Tailwind red     |

| Token                         | Figma Value                                  | itui.css Value                                                       | Resolution                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------- | -------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `color/opacity/black/lg`      | `#1a1a1a99` (26,26,26 @ 0.6)                 | `--color-opacity-black-lg` = `rgba(15,15,15,0.5)`                    | Same Figma name, different base and alpha. Rewriting the existing var would break its `xs…xl` siblings, which all share the `#0f0f0f` base — so the Snackbar value landed as its own `--color-surface-snackbar-dark`. Reconcile the whole `opacity/black` ramp against Figma before merging the two.                                                                                                           |
| `shadow/downwards/{sm,md,lg}` | `rgba(26,26,26,.08)` at 4/16 · 12/24 · 20/48 | `--shadow-{sm,md,lg}` = `rgba(15,15,15,.08)` at 8/16 · 12/24 · 16/48 | **Two shadow ramps coexist** — §5.3. `md` matches on geometry and differs only in base grey; `sm`/`lg` differ in offset too. The board landed as its own `--shadow-{direction}-{size}` namespace because re-pointing `--shadow-{xs…xl}` would repaint every `shadow-sm`/`shadow-md` already shipped in this package. Use `shadowClass` from `components/shadow`; `shadow-md` is **not** `shadow-downwards-md`. |
