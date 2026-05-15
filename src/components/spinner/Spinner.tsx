import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'icon';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize | number;
  description?: string;
}

// ─── Token → class map ───────────────────────────────────────────────────────

/*
  Size tokens (Figma: height/spinner/*):
    height/spinner/lg = 48px → h-12 w-12  (Tailwind scale 12 × 4px)
    height/spinner/md = 32px → h-8  w-8   (Tailwind scale  8 × 4px)
    height/spinner/sm = 20px → h-5  w-5   (Tailwind scale  5 × 4px)

  Stroke tokens:
    stroke/md = 4px → border-4  (Lg, Md)
    FALLBACK Sm/Icon → border-2 (2px via Tailwind scale):
      stroke/xs = 1px (too thin) and stroke/md = 4px (20% of 20px, too thick)

  Color tokens:
    border/neutral/subtle #ededed → border-border-neutral-subtle  (track — full ring)
    surface/primary/default #009ce0 → border-t-brand              (arc — top side)
    radius/full             999     → rounded-full

  Description layout tokens (Figma: Spinner type="Description"):
    spacing/lg 16px → gap-4           (column gap between spinner and text)
    typography/size/14 → text-sm      (14px)
    typography/line-height/md 24px → leading-md
    typography/letter-spacing/md 0.2px → tracking-md
    text/neutral/default #0f0f0f → text-neutral
*/
const sizeClasses: Record<SpinnerSize, string> = {
  lg: 'h-12 w-12 border-4',
  md: 'h-8 w-8 border-4',
  sm: 'h-5 w-5 border-2',
  icon: 'h-4 w-4 border-2',
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = 'md', description, className = '', style, ...rest }, ref) => {
    const isNumeric = typeof size === 'number';
    const numericStyle = isNumeric
      ? { width: size, height: size, ...style }
      : style;
    const borderClass = isNumeric
      ? (size as number) >= 40
        ? 'border-4'
        : 'border-2'
      : '';

    const spinnerEl = (
      <span
        ref={ref}
        role="status"
        aria-label="로딩 중"
        style={numericStyle}
        className={[
          'block shrink-0 rounded-full border-border-neutral-subtle border-t-brand animate-spin',
          isNumeric ? borderClass : sizeClasses[size as SpinnerSize],
          !description ? className : '',
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
    );

    if (!description) return spinnerEl;

    return (
      <div className={cn('flex flex-col items-center gap-4', className)}>
        {spinnerEl}
        <p className="text-sm leading-md tracking-md text-neutral text-center">
          {description}
        </p>
      </div>
    );
  },
);

Spinner.displayName = 'Spinner';
