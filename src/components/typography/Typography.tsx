import { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference (Figma foundation board "Typography")
  ─────────────────────────────────────────────────────────────────────────────
  The ITUI type scale is ONE ten-step ramp, not four. Each step belongs to
  exactly one family, so the step name alone identifies the style — `2xl` is
  always heading, `md` is always body, there is no `body/2xl`:

  variant        size  line-height  letter-spacing   font-size class
  display-6xl    48    64           -1.68            text-5xl
  display-5xl    40    52           -1.13            text-display-5xl
  heading-4xl    32    44           -0.64            text-heading-4xl
  heading-3xl    24    36           -0.55            text-2xl
  heading-2xl    20    32           -0.24            text-xl
  heading-xl     18    28           -0.04            text-lg
  body-lg        16    26            0.09            text-base
  body-md        14    24            0.2             text-sm
  caption-sm     12    20            0.3             text-xs
  caption-xs     11    16            0.33            text-caption-xs

  Line height and letter spacing need no reconciliation: --leading-{xs…6xl} and
  --tracking-{xs…6xl} in global.css already ARE the ITUI ramp, 1:1 by step name.
  Only the font-size axis drifts — Tailwind's own scale has no 11px, its
  text-3xl is 30px and its text-4xl is 36px, none of which is an ITUI step. The
  three sizes with no built-in landed as --text-{caption-xs,heading-4xl,
  display-5xl}, named after the style that owns them so they cannot shadow a
  Tailwind utility.

  ⚠ THE NAME TRAP — the reason `typographyClass` exists. The step names collide
  across axes at different pixels, so composing a style by name gives the wrong
  one:

    heading-3xl is 24px, but text-3xl is 30px
    heading-4xl is 32px, but text-4xl is 36px
    body-lg     is 16px, but text-lg  is 18px  (that is heading-xl)

  Reach for `typographyClass['heading-3xl']` — never assemble `text-3xl
  leading-3xl tracking-3xl` by hand. Only `leading-*`/`tracking-*` may be read
  off the step name directly.

  COLOR IS INHERITED, DELIBERATELY
  The board binds text to `text/neutral/default` (#0f0f0f), which is exactly
  what `--foreground` already resolves to — so inheriting reproduces the design
  without the component seizing the colour axis. Pass `text-neutral-muted` (or
  any token) through `className` when a variant needs its own colour.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

/** The ten styles the foundation board specs, in Figma's own order. */
export type TypographyVariant =
  | 'display-6xl'
  | 'display-5xl'
  | 'heading-4xl'
  | 'heading-3xl'
  | 'heading-2xl'
  | 'heading-xl'
  | 'body-lg'
  | 'body-md'
  | 'caption-sm'
  | 'caption-xs';

/** The four weights every variant ships in. */
export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold';

/** The measurements behind one variant, in px. */
export interface TypographySpec {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface TypographyProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Which step of the ITUI type scale to render. */
  variant?: TypographyVariant;
  /** How much emphasis the text carries. */
  weight?: TypographyWeight;
  /**
   * Render the child instead of a `p`, so an element that already carries
   * meaning — a heading, a `<label>`, a link — keeps it instead of being
   * wrapped in a paragraph.
   */
  asChild?: boolean;
}

// ─── Scale ────────────────────────────────────────────────────────────────────

/**
 * Variant → its measurements. Exported so callers that need to *measure* the
 * scale (a canvas, a virtualised row height, an annotation) read the same
 * numbers the classes below paint, and the two can never drift apart.
 */
export const TYPOGRAPHY_SPEC: Record<TypographyVariant, TypographySpec> = {
  'display-6xl': { fontSize: 48, lineHeight: 64, letterSpacing: -1.68 },
  'display-5xl': { fontSize: 40, lineHeight: 52, letterSpacing: -1.13 },
  'heading-4xl': { fontSize: 32, lineHeight: 44, letterSpacing: -0.64 },
  'heading-3xl': { fontSize: 24, lineHeight: 36, letterSpacing: -0.55 },
  'heading-2xl': { fontSize: 20, lineHeight: 32, letterSpacing: -0.24 },
  'heading-xl': { fontSize: 18, lineHeight: 28, letterSpacing: -0.04 },
  'body-lg': { fontSize: 16, lineHeight: 26, letterSpacing: 0.09 },
  'body-md': { fontSize: 14, lineHeight: 24, letterSpacing: 0.2 },
  'caption-sm': { fontSize: 12, lineHeight: 20, letterSpacing: 0.3 },
  'caption-xs': { fontSize: 11, lineHeight: 16, letterSpacing: 0.33 },
};

/**
 * Variant → Tailwind classes. The one place the ITUI→Tailwind translation is
 * written down, so no caller has to redo it (see the name trap in the header
 * block) — reach for this from any component that needs a scale style rather
 * than retyping the triple.
 *
 * Every class is spelled out rather than interpolated from the variant, so
 * Tailwind's scanner still finds the literal utility in this file — the same
 * reason `Radius.tsx` and `Spacing.tsx` spell theirs out.
 */
export const typographyClass: Record<TypographyVariant, string> = {
  'display-6xl': 'text-5xl leading-6xl tracking-6xl',
  'display-5xl': 'text-display-5xl leading-5xl tracking-5xl',
  'heading-4xl': 'text-heading-4xl leading-4xl tracking-4xl',
  'heading-3xl': 'text-2xl leading-3xl tracking-3xl',
  'heading-2xl': 'text-xl leading-2xl tracking-2xl',
  'heading-xl': 'text-lg leading-xl tracking-xl',
  'body-lg': 'text-base leading-lg tracking-lg',
  'body-md': 'text-sm leading-md tracking-md',
  'caption-sm': 'text-xs leading-sm tracking-sm',
  'caption-xs': 'text-caption-xs leading-xs tracking-xs',
};

/** Weight → Tailwind class. Named for Figma's `font/weight/*`, not the number. */
export const typographyWeightClass: Record<TypographyWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

// ─── Typography ───────────────────────────────────────────────────────────────

/*
  Defaults to `body-md` / `regular` — the running-text style, i.e. the one a
  caller who did not think about it almost certainly wanted. A display step
  would silently blow up any unlabelled usage.

  `font-sans` is explicit rather than inherited: all four Figma families
  (display / heading / body / caption) resolve to the same Pretendard binding,
  which is what --font-sans holds, and stating it keeps a Typography correct
  inside a container that switched to font-mono.
*/
const Typography = forwardRef<HTMLParagraphElement, TypographyProps>(
  (
    {
      className,
      variant = 'body-md',
      weight = 'regular',
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'p';

    return (
      <Component
        ref={ref}
        data-slot="typography"
        data-variant={variant}
        data-weight={weight}
        className={cn(
          'font-sans',
          typographyClass[variant],
          typographyWeightClass[weight],
          className,
        )}
        {...props}
      />
    );
  },
);
Typography.displayName = 'Typography';

export { Typography };
