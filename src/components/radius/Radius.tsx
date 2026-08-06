import { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference (Figma foundation board "Radius")
  ─────────────────────────────────────────────────────────────────────────────
  The ITUI radius scale is 4 · 8 · 12 · 16 · 20 · 28 · full — a 4px progression.

  ⚠ Figma and Tailwind share the step NAMES but not their values: Figma's
  radius/sm is 8px while `rounded-sm` is 4px, and radius/lg is 16px while
  `rounded-lg` is 8px. Every step below is therefore matched by PIXEL value, the
  convention TOKENS.md sets and the other components already follow. Reconciling
  the two here is the point of this file — no caller should have to redo it.

  ITUI step   px     token                     class
  xs          4      --radius-sm               rounded-sm
  sm          8      --radius-lg               rounded-lg
  md          12     --radius-xl               rounded-xl
  lg          16     --radius-2xl              rounded-2xl
  xl          20     --radius-component-xl     rounded-component-xl
  2xl         28     --radius-component-2xl    rounded-component-2xl
  full        9999   --radius-full             rounded-full

  md = 12px — DELIBERATE. Figma's Md tile is bound to `Radius old/Size/Small`
  (16px), the same variable as Lg, while its own annotation reads 12px. The
  binding is the slip, not the label: the pre-existing --radius-*-nest-* tokens
  are each `base + padding`, and md-nest-4 = 16 with md-nest-8 = 20 both resolve
  md to 12. That also makes the scale a clean 4px progression.

  full = 9999px, not Figma's literal 512px. The design intent is "fully round
  whatever the box is", which 512px only approximates for a 160px swatch.

  NOT PART OF THE COMPONENT
  The 320px blue field, the 160px white card, its shadow and the blue px
  annotation on the Figma board are the showcase tile — a radius has no surface
  of its own. They live in Radius.stories.tsx. See docs/radius-plan.md.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

/** The seven steps the foundation board specs, in Figma's own order. */
export type RadiusScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface RadiusProps extends HTMLAttributes<HTMLDivElement> {
  /** Which step of the ITUI scale to round to. */
  radius?: RadiusScale;
  /**
   * Round the child instead of a `div`, so an element that already behaves —
   * a `<button>`, an `<img>`, another component's root — keeps its own logic.
   */
  asChild?: boolean;
}

// ─── Scale ────────────────────────────────────────────────────────────────────

/**
 * ITUI radius step → its pixel value. Exported so callers that need to *measure*
 * a corner (an annotation, an SVG clip path, a canvas) read the same numbers the
 * classes below paint, and the two can never drift apart.
 */
export const RADIUS_PX: Record<RadiusScale, number> = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  full: 9999,
};

/**
 * ITUI radius step → Tailwind class. Reach for `radiusClass.md` rather than
 * typing `rounded-md`, which is 6px — a different value on a different scale.
 *
 * Every class is spelled out rather than interpolated from the step, so
 * Tailwind's scanner still finds the literal utility in this file — the same
 * reason `Backdrop.tsx` spells out its `positionClass` map.
 */
export const radiusClass: Record<RadiusScale, string> = {
  xs: 'rounded-sm',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-component-xl',
  '2xl': 'rounded-component-2xl',
  full: 'rounded-full',
};

// ─── Radius ───────────────────────────────────────────────────────────────────

/**
 * Applies one step of the ITUI corner scale. This is a token primitive, not a
 * surface: it paints a `rounded-*` class and nothing else, so give it a
 * background of its own — or pass `asChild` to round an element that already
 * has one. Use it when a corner has to come from the scale rather than from a
 * literal `rounded-[10px]`; `RADIUS_PX` gives the same steps as numbers.
 *
 * Defaults to `md` rather than Figma's first variant (`XS`, 4px), which is too
 * subtle to read as a deliberate corner on anything but a small control. Same
 * kind of call TabList makes with its `w-full` default.
 */
const Radius = forwardRef<HTMLDivElement, RadiusProps>(
  ({ className, radius = 'md', asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        ref={ref}
        data-slot="radius"
        data-radius={radius}
        className={cn(radiusClass[radius], className)}
        {...props}
      />
    );
  },
);
Radius.displayName = 'Radius';

export { Radius };
