import { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference (Figma foundation board "Shadow")
  ─────────────────────────────────────────────────────────────────────────────
  All twelve shadows are the same DROP_SHADOW — shadow/color/black (#1a1a1a14 ≈
  rgba(26,26,26,0.08)) at spread 0 — so the board is really ONE 3-step ramp
  mirrored onto four axes:

    size   offset  blur      direction     axis  sign
    sm     4       16        downwards     y     +
    md     12      24        upwards       y     −
    lg     20      48        rightwards    x     +
                             leftwards     x     −

  direction    size   token                      class
  downwards    sm     --shadow-downwards-sm      shadow-downwards-sm
  downwards    md     --shadow-downwards-md      shadow-downwards-md
  downwards    lg     --shadow-downwards-lg      shadow-downwards-lg
  upwards      sm     --shadow-upwards-sm        shadow-upwards-sm
  upwards      md     --shadow-upwards-md        shadow-upwards-md
  upwards      lg     --shadow-upwards-lg        shadow-upwards-lg
  leftwards    sm     --shadow-leftwards-sm      shadow-leftwards-sm
  leftwards    md     --shadow-leftwards-md      shadow-leftwards-md
  leftwards    lg     --shadow-leftwards-lg      shadow-leftwards-lg
  rightwards   sm     --shadow-rightwards-sm     shadow-rightwards-sm
  rightwards   md     --shadow-rightwards-md     shadow-rightwards-md
  rightwards   lg     --shadow-rightwards-lg     shadow-rightwards-lg

  ⚠ THESE ARE NOT `shadow-sm` / `shadow-md` / `shadow-lg`. This package overrides
  Tailwind's --shadow-{xs…xl} with an older ITUI ramp on a #0f0f0f base:

    shadow-sm  0 8px  16px rgba(15,15,15,.08)  vs  downwards-sm  0 4px  16px rgba(26,26,26,.08)
    shadow-md  0 12px 24px rgba(15,15,15,.08)  vs  downwards-md  0 12px 24px rgba(26,26,26,.08)
    shadow-lg  0 16px 48px rgba(15,15,15,.08)  vs  downwards-lg  0 20px 48px rgba(26,26,26,.08)

  md matches on geometry and differs only in grey; sm and lg differ in offset too.
  Both ramps ship — a dozen components already use the old one — so keeping them
  apart is the job of `shadowClass` below. Reach for it rather than typing
  `shadow-md`, which is the other ramp.

  leftwards/sm = -4px 0 16px is DERIVED, not read off the board. It is the only
  one of the twelve with no Figma variable, so its layer is bound to
  leftwards/lg and paints an identical -20/48. The eleven others follow the ramp
  above without exception, and its x-axis mirror (rightwards/sm, 4px 0 16px) is
  already shipped by the LNB — so the ramp wins over the slipped binding.

  NOT PART OF THE COMPONENT
  The 320px blue field, the white card and the offset/blur annotation on the
  Figma board are the showcase tile — a shadow has no surface of its own. They
  live in Shadow.stories.tsx. See docs/shadow-plan.md.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

/** Which way the shadow falls — the board's four sections. */
export type ShadowDirection =
  | 'downwards'
  | 'upwards'
  | 'leftwards'
  | 'rightwards';

/** How far it falls and how soft it is. The same 3 steps on every direction. */
export type ShadowSize = 'sm' | 'md' | 'lg';

export interface ShadowProps extends HTMLAttributes<HTMLDivElement> {
  /** Which way the shadow falls. */
  direction?: ShadowDirection;
  /** Which step of the ramp to cast. */
  size?: ShadowSize;
  /**
   * Cast the shadow from the child instead of a `div`, so an element that
   * already behaves — a card, a `<button>`, another component's root — keeps
   * its own logic.
   */
  asChild?: boolean;
}

// ─── Ramp ─────────────────────────────────────────────────────────────────────

/**
 * Step → its offset in px. Exported so callers that need to *measure* the ramp
 * (an annotation, a scroll shadow, a canvas) read the same numbers the classes
 * below paint, and the two can never drift apart.
 */
export const SHADOW_OFFSET: Record<ShadowSize, number> = {
  sm: 4,
  md: 12,
  lg: 20,
};

/** Step → its blur radius in px. Pairs with {@link SHADOW_OFFSET}. */
export const SHADOW_BLUR: Record<ShadowSize, number> = {
  sm: 16,
  md: 24,
  lg: 48,
};

/**
 * Direction → size → Tailwind class. The one place the 4×3 grid is written
 * down, and the only spelling that cannot be confused with the legacy
 * `shadow-sm`/`shadow-md` ramp (see the header block).
 *
 * Every class is spelled out rather than interpolated from the props, so
 * Tailwind's scanner still finds all twelve literal utilities in this file —
 * the same reason `Radius.tsx` spells out `radiusClass`.
 */
export const shadowClass: Record<
  ShadowDirection,
  Record<ShadowSize, string>
> = {
  downwards: {
    sm: 'shadow-downwards-sm',
    md: 'shadow-downwards-md',
    lg: 'shadow-downwards-lg',
  },
  upwards: {
    sm: 'shadow-upwards-sm',
    md: 'shadow-upwards-md',
    lg: 'shadow-upwards-lg',
  },
  leftwards: {
    sm: 'shadow-leftwards-sm',
    md: 'shadow-leftwards-md',
    lg: 'shadow-leftwards-lg',
  },
  rightwards: {
    sm: 'shadow-rightwards-sm',
    md: 'shadow-rightwards-md',
    lg: 'shadow-rightwards-lg',
  },
};

// ─── Shadow ───────────────────────────────────────────────────────────────────

/*
  Defaults to downwards/md rather than Figma's first variant (Downwards/Sm):
  downwards is the direction three of the six already-shipped tokens use, and md
  is the middle step. Same kind of call Radius makes defaulting to `md`.
*/
const Shadow = forwardRef<HTMLDivElement, ShadowProps>(
  (
    { className, direction = 'downwards', size = 'md', asChild = false, ...props },
    ref,
  ) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        ref={ref}
        data-slot="shadow"
        data-direction={direction}
        data-size={size}
        className={cn(shadowClass[direction][size], className)}
        {...props}
      />
    );
  },
);
Shadow.displayName = 'Shadow';

export { Shadow };
