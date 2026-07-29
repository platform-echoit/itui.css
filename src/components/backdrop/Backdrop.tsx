import { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference (Figma "Background Blur" 27437:1149 ·
  Backdrop Shape=Dim 27883:585 / Shape=Blur 27883:586)
  ─────────────────────────────────────────────────────────────────────────────
  SCRIM — Shape=Dim
  dim/black                #1a1a1a66         → bg-dim-black
  SCRIM — Shape=Blur
  color/opacity/black/sm   #1a1a1a33         → bg-opacity-black-sm
  blur/default             BACKGROUND_BLUR 4 → backdrop-blur-dialog (blur(4px / 2))

  BOX
  position                 fills its target  → fixed|absolute inset-0 · z-50

  FILL DEVIATION — deliberate
  Both fills reuse the tokens every existing scrim already paints — `bg-dim-black`
  (bottom-sheet, popup, modals) and `bg-opacity-black-sm` (dialog) — so the system
  keeps ONE overlay colour. Those tokens sit on the #0f0f0f ink at a slightly lower
  alpha than Figma's #1a1a1a (0.32 vs 0.4 dim · 0.16 vs 0.2 blur); the `opacity/black`
  ramp cannot be rebased without moving its xs…xl siblings. See TOKENS.md → Backdrop.

  NOT PART OF THE COMPONENT
  The 256×256 box and radius/sm (8px) in the Figma frame are the showcase swatch
  (`size/container/gfh`) — a backdrop takes the shape of whatever it covers.

  MOTION
  Figma specs none, and the `animate-in` / `fade-in-0` utilities the older overlays
  carry compile to zero rules in this package (`tailwindcss-animate` is not a
  dependency), so no fade is declared here rather than shipping dead classes.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

export type BackdropVariant = 'dim' | 'blur';
export type BackdropPosition = 'fixed' | 'absolute';

export interface BackdropProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma `Shape` — `dim` is a flat scrim, `blur` tints and blurs what it covers. */
  variant?: BackdropVariant;
  /** `fixed` covers the viewport; `absolute` fills the nearest positioned ancestor. */
  position?: BackdropPosition;
  /**
   * Paint the scrim onto the child instead of a `div`, so an already-behaving
   * element keeps its own logic — e.g. a Radix `Dialog.Overlay`, or a `<button>`
   * that closes a panel on click.
   */
  asChild?: boolean;
}

// ─── Backdrop ─────────────────────────────────────────────────────────────────

const variantClass: Record<BackdropVariant, string> = {
  dim: 'bg-dim-black',
  blur: 'bg-opacity-black-sm backdrop-blur-dialog',
};

/* Spelled out rather than interpolated from the prop, so Tailwind's scanner
   still finds both utilities in this file. */
const positionClass: Record<BackdropPosition, string> = {
  fixed: 'fixed',
  absolute: 'absolute',
};

const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
  (
    { className, variant = 'dim', position = 'fixed', asChild = false, ...props },
    ref,
  ) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        ref={ref}
        data-slot="backdrop"
        data-variant={variant}
        className={cn(
          positionClass[position],
          'inset-0 z-50',
          variantClass[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
Backdrop.displayName = 'Backdrop';

export { Backdrop };
