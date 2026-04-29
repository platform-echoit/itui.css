import { forwardRef, type HTMLAttributes } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
}

// ─── Token → class map ───────────────────────────────────────────────────────

/*
  Size tokens (Figma: height/spinner/*):
    height/spinner/lg = 48px → h-12 w-12  (Tailwind scale 12 × 4px)
    height/spinner/md = 32px → h-8  w-8   (Tailwind scale  8 × 4px)
    height/spinner/sm = 20px → h-5  w-5   (Tailwind scale  5 × 4px)

  Stroke tokens:
    stroke/md = 4px → border-4  (Lg, Md)
    FALLBACK Sm → border-2 (2px via Tailwind scale):
      stroke/xs = 1px (too thin) and stroke/md = 4px (20% of 20px, too thick)

  Color tokens:
    border/neutral/subtle   #ededed → border-neutral-subtle   (track — full ring)
    surface/primary/default #009ce0 → border-t-brand          (arc — top side)
    radius/full             999     → rounded-full
*/
const sizeClasses: Record<SpinnerSize, string> = {
  lg: 'h-12 w-12 border-4',
  md: 'h-8 w-8 border-4',
  sm: 'h-5 w-5 border-2',
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = 'md', className = '', ...rest }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label="로딩 중"
      className={[
        'block shrink-0 rounded-full border-neutral-subtle border-t-brand animate-spin',
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  ),
);

Spinner.displayName = 'Spinner';
