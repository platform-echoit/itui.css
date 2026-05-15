import { forwardRef, type HTMLAttributes } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference
  ─────────────────────────────────────────────────────────────────────────────
  COLORS (from global.css @theme)
  surface/neutral/subtle/default   #f5f5f5 → bg-surface-hover         (--color-surface-hover)
  surface/neutral/subtle/pressed   #dadada → bg-secondary (--color-secondary)

  RADIUS
  radius/full  999px → rounded-full

  SPACING (Tailwind v4: 1 unit = 4px)
  exception/space/2   2px  → pr-0.5
  static/space/4      4px  → gap-1
  static/space/20     20px → h-5      (arrow area height)
  static/space/24     24px → py-6     (container top/bottom padding)
  static/space/40     40px → min-h-10 (minimum track height)

  SIZES
  Md  10px → w-2.5
  Sm   6px → w-1.5

  RSC STRATEGY
  Zero hooks. Hover color change driven by CSS hover: on the track element.
  Arrow areas are purely decorative spans — consumers layer interaction externally.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScrollbarSize = 'md' | 'sm';

export interface ScrollbarProps extends HTMLAttributes<HTMLDivElement> {
  size?: ScrollbarSize;
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const sizeMap: Record<ScrollbarSize, { container: string; icon: number }> = {
  md: { container: 'w-4', icon: 8 },
  sm: { container: 'w-3', icon: 6 },
};

// ─── Scrollbar ────────────────────────────────────────────────────────────────

export const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ size = 'md', className, ...rest }, ref) => {
    const { container, icon } = sizeMap[size];
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center h-full px-0.5 gap-6 bg-white rounded-none',
          container,
          className,
        )}
        {...rest}
      >
        <span
          className="shrink-0 h-5 flex items-center justify-center text-neutral-muted"
          aria-hidden="true"
        >
          <ChevronUp size={icon} strokeWidth={1.5} />
        </span>

        <div className="flex-1 w-full rounded-full min-h-10 bg-surface-hover hover:bg-secondary" />

        <span
          className="shrink-0 h-5 flex items-center justify-center text-neutral-muted"
          aria-hidden="true"
        >
          <ChevronDown size={icon} strokeWidth={1.5} />
        </span>
      </div>
    );
  },
);
Scrollbar.displayName = 'Scrollbar';
