import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind map (Figma node 27190:1254)
  ─────────────────────────────────────────────────────────────────────────────
  This is the carousel pagination indicator (dots / pills), not the slide area.

  INDICATOR (height/dot/sm 10px → h-2.5 · radius/full → rounded-full)
    active            surface/primary/default #009ce0 → bg-brand
    inactive          icon/neutral/disabled   #c2c2c2 → bg-neutral-disabled opacity-50
    pill active width 16px → w-4 · all others 10px → w-2.5

  CONTAINER (background=Yes)
    surface/neutral/subtle/default #f5f5f5 → bg-surface-neutral-subtle
    gap spacing/sm 8px → gap-2 · px spacing/sm 8px → px-2 · py spacing/md 12px → py-3
    radius/full → rounded-full
  ─────────────────────────────────────────────────────────────────────────────
*/

export type CarouselType = 'pill' | 'dot';

export interface CarouselProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Indicator shape — `pill` widens the active indicator, `dot` keeps it round. */
  type?: CarouselType;
  /** Total number of slides / indicators. */
  count: number;
  /** Index of the active slide. */
  activeIndex?: number;
  /** Render a pill-shaped surface behind the indicators. */
  background?: boolean;
  /** When provided, indicators become clickable buttons that call this with the index. */
  onSelect?: (index: number) => void;
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      type = 'pill',
      count,
      activeIndex = 0,
      background = false,
      onSelect,
      className,
      ...rest
    },
    ref,
  ) => (
    <div
      ref={ref}
      role="group"
      aria-label="Carousel pagination"
      className={cn(
        'inline-flex items-center gap-2',
        background && 'rounded-full bg-surface-neutral-subtle px-2 py-3',
        className,
      )}
      {...rest}
    >
      {Array.from({ length: count }, (_, index) => {
        const active = index === activeIndex;
        const indicatorClass = cn(
          'h-2.5 rounded-full transition-all',
          type === 'pill' && active ? 'w-4' : 'w-2.5',
          active ? 'bg-brand' : 'bg-neutral-disabled opacity-50',
        );

        return onSelect ? (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={active || undefined}
            onClick={() => onSelect(index)}
            className={cn('cursor-pointer', indicatorClass)}
          />
        ) : (
          <span key={index} aria-hidden="true" className={indicatorClass} />
        );
      })}
    </div>
  ),
);

Carousel.displayName = 'Carousel';
