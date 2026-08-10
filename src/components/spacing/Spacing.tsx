import { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference (Figma foundation board "Spacing")
  ─────────────────────────────────────────────────────────────────────────────
  The ITUI spacing scale is 0 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 —
  a 4px progression that doubles its own step twice (+4 to 24, +8 to 48, +16 to
  64). Every step already exists on the Tailwind spacing scale, so this module
  adds no CSS variable; it only writes down which Tailwind key each ITUI step is.

  ITUI step   px    token            gap        padding
  none        0     --spacing-0      gap-0      p-0
  xs          4     --spacing-1      gap-1      p-1
  sm          8     --spacing-2      gap-2      p-2
  md          12    --spacing-3      gap-3      p-3
  lg          16    --spacing-4      gap-4      p-4
  xl          20    --spacing-5      gap-5      p-5
  2xl         24    --spacing-6      gap-6      p-6
  3xl         32    --spacing-8      gap-8      p-8
  4xl         40    --spacing-10     gap-10     p-10
  5xl         48    --spacing-12     gap-12     p-12
  6xl         64    --spacing-16     gap-16     p-16

  ⚠ THE NAME TRAP — the whole reason this module exists. ITUI and Tailwind do not
  share a naming axis here at all, and where the step names DO collide across this
  package they mean different pixels:

    spacing/md = 12px   spacing/lg = 16px   spacing/xl = 20px
    radius/md  = 12px   radius/lg  = 16px   radius/xl  = 20px
    --leading-md = 24   --leading-lg = 26   --leading-xl = 28

  So reading a layer bound to spacing/xl and reaching for anything named `xl`
  gives 28px. Reach for `spacingClass.gap.xl` — there is no `gap-xl`.

  2xl = 24px is DELIBERATE. It is the one step with no Figma variable: its bar is
  an unbound 24px and its layer is named `24` where every sibling is named `4px` /
  `8px` / `32px`. But its own px column reads 24px, and 24 is the exact 4px step
  between xl (20) and 3xl (32). A missing variable, not a missing step — the same
  call Radius.tsx makes for radius/md.

  NOT PART OF THE COMPONENT
  The Name/Pixels table, the sky-blue measuring bars and the 28px right corners on
  the Figma board are the showcase — spacing has no surface of its own. They live
  in Spacing.stories.tsx. See docs/spacing-plan.md.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

/** The eleven steps the foundation board specs, in Figma's own order. */
export type SpacingStep =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl';

/** Which way a spacer measures. */
export type SpacingAxis = 'vertical' | 'horizontal';

export interface SpacingProps extends HTMLAttributes<HTMLDivElement> {
  /** Which step of the ITUI scale to occupy. */
  size?: SpacingStep;
  /** `vertical` holds height (a gap between stacked rows), `horizontal` width. */
  axis?: SpacingAxis;
  /**
   * Size the child instead of a `div`, so an element that already carries meaning
   * — an `<hr>`, a real divider — keeps it instead of being wrapped in a box.
   */
  asChild?: boolean;
}

// ─── Scale ────────────────────────────────────────────────────────────────────

/**
 * ITUI step → its pixel value. Exported so callers that need to *measure* the
 * scale (a virtualised list's row gap, a canvas, an annotation) read the same
 * numbers the classes below paint, and the two can never drift apart.
 */
export const SPACING_PX: Record<SpacingStep, number> = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

/**
 * ITUI step → Tailwind class, per property. The one place the ITUI→Tailwind
 * translation is written down, so no caller has to redo it (see the name trap in
 * the header block).
 *
 * Four properties, not twelve: `gap` / `p` / `px` / `py` cover essentially every
 * real use of the scale. `m*`, `space-*` and the single-side paddings are left
 * out rather than shipping ~130 literal strings for cases nobody has — each is a
 * copy of an existing block when one is actually needed.
 *
 * Every class is spelled out rather than interpolated from the step, so
 * Tailwind's scanner still finds the literal utility in this file — the same
 * reason `Radius.tsx` spells out `radiusClass`.
 */
export const spacingClass: Record<
  'gap' | 'p' | 'px' | 'py',
  Record<SpacingStep, string>
> = {
  gap: {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-5',
    '2xl': 'gap-6',
    '3xl': 'gap-8',
    '4xl': 'gap-10',
    '5xl': 'gap-12',
    '6xl': 'gap-16',
  },
  p: {
    none: 'p-0',
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
    xl: 'p-5',
    '2xl': 'p-6',
    '3xl': 'p-8',
    '4xl': 'p-10',
    '5xl': 'p-12',
    '6xl': 'p-16',
  },
  px: {
    none: 'px-0',
    xs: 'px-1',
    sm: 'px-2',
    md: 'px-3',
    lg: 'px-4',
    xl: 'px-5',
    '2xl': 'px-6',
    '3xl': 'px-8',
    '4xl': 'px-10',
    '5xl': 'px-12',
    '6xl': 'px-16',
  },
  py: {
    none: 'py-0',
    xs: 'py-1',
    sm: 'py-2',
    md: 'py-3',
    lg: 'py-4',
    xl: 'py-5',
    '2xl': 'py-6',
    '3xl': 'py-8',
    '4xl': 'py-10',
    '5xl': 'py-12',
    '6xl': 'py-16',
  },
};

/** Step → the height a `vertical` spacer holds. */
const heightClass: Record<SpacingStep, string> = {
  none: 'h-0',
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
  xl: 'h-5',
  '2xl': 'h-6',
  '3xl': 'h-8',
  '4xl': 'h-10',
  '5xl': 'h-12',
  '6xl': 'h-16',
};

/** Step → the width a `horizontal` spacer holds. */
const widthClass: Record<SpacingStep, string> = {
  none: 'w-0',
  xs: 'w-1',
  sm: 'w-2',
  md: 'w-3',
  lg: 'w-4',
  xl: 'w-5',
  '2xl': 'w-6',
  '3xl': 'w-8',
  '4xl': 'w-10',
  '5xl': 'w-12',
  '6xl': 'w-16',
};

// ─── Spacing ──────────────────────────────────────────────────────────────────

/**
 * Holds one step of the ITUI spacing scale open. This is a token primitive, not
 * a layout: an `aria-hidden` box with a fixed height — or width, with
 * `axis="horizontal"` — and no content of its own. Reach for it where `gap` and
 * padding cannot, such as between siblings that share no flex parent;
 * `SPACING_PX` gives the same steps as numbers.
 *
 * Defaults to `lg` (16px) rather than the middle step Radius and Shadow default
 * to: `none` — Figma's first variant — renders nothing at all, and 12px is an
 * arbitrary pick for a spacer. 16px is the value the system itself leans on, from
 * the mobile grid margin to the standard card padding.
 *
 * `shrink-0` on both axes: a spacer that a flex parent is free to compress is not
 * measuring anything. aria-hidden because it carries no content.
 */
const Spacing = forwardRef<HTMLDivElement, SpacingProps>(
  (
    { className, size = 'lg', axis = 'vertical', asChild = false, ...props },
    ref,
  ) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        ref={ref}
        aria-hidden
        data-slot="spacing"
        data-size={size}
        data-axis={axis}
        className={cn(
          'shrink-0',
          axis === 'vertical' ? heightClass[size] : widthClass[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Spacing.displayName = 'Spacing';

export { Spacing };
