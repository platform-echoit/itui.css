'use client';

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';
import { CaretLeftRegularIcon } from '../../icons/ITUI/caret-left';
import { CaretRightRegularIcon } from '../../icons/ITUI/caret-right';
import { cn } from '../../lib/utils';
import { Button, type ButtonProps } from '../button/Button';

/*
  Token → Tailwind map (Figma node 27190:1254)
  ─────────────────────────────────────────────────────────────────────────────
  Figma only specs the pagination INDICATOR. Slide movement is Embla
  (embla-carousel-react); the arrows compose <Button> so they inherit its tokens.

  INDICATOR — CarouselIndicator
    height/dot/sm            10px    → h-2.5 · w-2.5
    pill active width        16px    → w-4
    radius/full              999px   → rounded-full
    active   surface/primary/default #009ce0 → bg-brand
    inactive icon/neutral/disabled   #c2c2c2 → bg-neutral-disabled + opacity-50

  INDICATOR CONTAINER (background=Yes)
    surface/neutral/subtle/default   #f5f5f5 → bg-surface-neutral-subtle
    spacing/sm  8px → gap-2 · px-2 · spacing/md 12px → py-3
    radius/full     → rounded-full

  SLIDE GUTTER (not in Figma) spacing/lg 16px → -ml-4 on the track + pl-4 per item
  ARROW ICON  (not in Figma) ITUI CaretLeft/RightRegularIcon at height/icon/md 16px
  MOTION      (not in Figma) motion.duration.200 → duration-200 · motion.ease.out → ease-out
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

export type CarouselApi = UseEmblaCarouselType[1];
export type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];
export type CarouselPlugin = Parameters<typeof useEmblaCarousel>[1];
export type CarouselOrientation = 'horizontal' | 'vertical';
/** Indicator shape — `pill` widens the active indicator, `dot` keeps it round. */
export type CarouselType = 'pill' | 'dot';

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  /** Embla options, e.g. `{ loop: true, align: 'start' }`. */
  opts?: CarouselOptions;
  /** Embla plugins, e.g. autoplay. */
  plugins?: CarouselPlugin;
  /**
   * Which way the slides move, and which arrow keys drive them.
   * @default 'horizontal' — vertical needs an explicit height on the viewport.
   */
  orientation?: CarouselOrientation;
  /** Receives the Embla api once ready, for imperative control from outside. */
  setApi?: (api: CarouselApi) => void;
}

interface CarouselContextValue {
  carouselRef: UseEmblaCarouselType[0];
  api: CarouselApi;
  orientation: CarouselOrientation;
  selectedIndex: number;
  scrollSnaps: number[];
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

/**
 * The parent `Carousel`'s state and controls — the Embla api, the selected
 * index, whether either direction can still scroll, and the scroll functions.
 * Use it to build a control the library does not ship. Throws outside a
 * `Carousel`.
 */
export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }
  return context;
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

/**
 * A slider built on Embla. This is the root: it owns the engine and the
 * keyboard handling, and shares both through context, so `CarouselContent`,
 * `CarouselItem`, `CarouselIndicator` and the two arrow buttons all have to sit
 * inside it. Reach for `opts` to configure Embla itself (`loop`, `align`).
 */
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      opts,
      plugins,
      orientation = 'horizontal',
      setApi,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      { ...opts, axis: orientation === 'horizontal' ? 'x' : 'y' },
      plugins,
    );
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = useCallback(() => api?.scrollNext(), [api]);
    const scrollTo = useCallback(
      (index: number) => api?.scrollTo(index),
      [api],
    );

    useEffect(() => {
      if (api) setApi?.(api);
    }, [api, setApi]);

    useEffect(() => {
      if (!api) return;

      const sync = () => {
        setSelectedIndex(api.selectedScrollSnap());
        // scrollSnapList() changes when slides or the viewport resize, so it is
        // re-read on every sync rather than only on mount.
        setScrollSnaps(api.scrollSnapList());
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
      };

      sync();
      api.on('select', sync).on('reInit', sync);
      return () => {
        api.off('select', sync).off('reInit', sync);
      };
    }, [api]);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        // Arrow keys must keep moving the caret inside editable slide content.
        const target = event.target as HTMLElement;
        if (
          target.closest('input, textarea, select, [contenteditable="true"]')
        ) {
          return;
        }

        const isHorizontal = orientation === 'horizontal';
        if (event.key === (isHorizontal ? 'ArrowLeft' : 'ArrowUp')) {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === (isHorizontal ? 'ArrowRight' : 'ArrowDown')) {
          event.preventDefault();
          scrollNext();
        }
      },
      [orientation, scrollPrev, scrollNext],
    );

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          orientation,
          selectedIndex,
          scrollSnaps,
          canScrollPrev,
          canScrollNext,
          scrollPrev,
          scrollNext,
          scrollTo,
        }}
      >
        <div
          ref={ref}
          role="region"
          aria-roledescription="carousel"
          onKeyDown={handleKeyDown}
          className={cn('relative', className)}
          {...rest}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);

Carousel.displayName = 'Carousel';

// ─── CarouselContent ──────────────────────────────────────────────────────────

export interface CarouselContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Class for the overflow viewport Embla measures — use it for outer padding. */
  viewportClassName?: string;
}

/** `className` and `ref` target the slide track, not the viewport. */
export const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, viewportClassName, ...rest }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
      <div
        ref={carouselRef}
        className={cn('overflow-hidden', viewportClassName)}
      >
        <div
          ref={ref}
          className={cn(
            'flex',
            orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
            className,
          )}
          {...rest}
        />
      </div>
    );
  },
);

CarouselContent.displayName = 'CarouselContent';

// ─── CarouselItem ─────────────────────────────────────────────────────────────

/**
 * One slide. It is full-width by default — override the `basis-*` class to show
 * more than one slide at a time.
 */
export const CarouselItem = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...rest }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className,
      )}
      {...rest}
    />
  );
});

CarouselItem.displayName = 'CarouselItem';

// ─── CarouselIndicator ────────────────────────────────────────────────────────

export interface CarouselIndicatorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Indicator shape — `pill` widens the active one, `dot` keeps it round. @default 'pill' */
  type?: CarouselType;
  /** Render the pill-shaped surface behind the indicators. @default false */
  background?: boolean;
  /** Indicator count. Defaults to the parent `<Carousel>`'s snap count. */
  count?: number;
  /** Active index. Defaults to the parent `<Carousel>`'s selected snap. */
  activeIndex?: number;
  /** Click handler. Defaults to scrolling the parent `<Carousel>` to that slide. */
  onSelect?: (index: number) => void;
}

/**
 * Pagination indicator. Inside a `<Carousel>` it binds to Embla automatically;
 * `count` / `activeIndex` / `onSelect` also let it work standalone.
 */
export const CarouselIndicator = forwardRef<
  HTMLDivElement,
  CarouselIndicatorProps
>(
  (
    {
      type = 'pill',
      background = false,
      count,
      activeIndex,
      onSelect,
      className,
      ...rest
    },
    ref,
  ) => {
    // Read the context directly instead of useCarousel() so the indicator can
    // also render on its own, outside a <Carousel>.
    const carousel = useContext(CarouselContext);
    const total = count ?? carousel?.scrollSnaps.length ?? 0;
    const active = activeIndex ?? carousel?.selectedIndex ?? 0;
    const select = onSelect ?? carousel?.scrollTo;

    if (total === 0) return null;

    return (
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
        {Array.from({ length: total }, (_, index) => {
          const isActive = index === active;
          const indicatorClass = cn(
            'h-2.5 rounded-full transition-all duration-200 ease-out',
            type === 'pill' && isActive ? 'w-4' : 'w-2.5',
            isActive ? 'bg-brand' : 'bg-neutral-disabled opacity-50',
          );

          return select ? (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive || undefined}
              onClick={() => select(index)}
              className={cn(
                'cursor-pointer focus-visible:focus-ring',
                indicatorClass,
              )}
            />
          ) : (
            <span key={index} aria-hidden="true" className={indicatorClass} />
          );
        })}
      </div>
    );
  },
);

CarouselIndicator.displayName = 'CarouselIndicator';

// ─── CarouselPrevious / CarouselNext ──────────────────────────────────────────

/*
  Figma has no arrow spec, so these compose <Button variant="secondary"
  size="icon"> and only add positioning: centred on the cross axis, just outside
  the viewport edge. Give the <Carousel> horizontal padding (or override
  className) when the arrows should sit on top of the slides instead.
*/
const ARROW_POSITION: Record<
  CarouselOrientation,
  Record<'prev' | 'next', string>
> = {
  horizontal: {
    prev: 'top-1/2 -left-12 -translate-y-1/2',
    next: 'top-1/2 -right-12 -translate-y-1/2',
  },
  vertical: {
    prev: '-top-12 left-1/2 -translate-x-1/2 rotate-90',
    next: '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
  },
};

/*
  Button's icon slot is a bare 20px box (height/icon/lg) that does not centre its
  child, so the 16px height/icon/md glyph needs its own centring box to land on
  the button's centre — same fix as OverflowMenuTrigger.
*/
function ArrowIcon({ direction }: { direction: 'prev' | 'next' }) {
  const Caret =
    direction === 'prev' ? CaretLeftRegularIcon : CaretRightRegularIcon;
  return (
    <span className="flex size-5 items-center justify-center">
      <Caret width={16} height={16} />
    </span>
  );
}

// ITUI caret paths ship a hard-coded fill, so fill-current is what lets them
// follow Button's text colour — including disabled:text-neutral-disabled.
const ARROW_CLASS = 'absolute rounded-full [&_path]:fill-current';

/**
 * The "go back" arrow, positioned against the carousel and disabled at the first
 * slide. It is a `Button`, so every `Button` prop still applies — but its
 * `onClick` is owned by the carousel.
 */
export const CarouselPrevious = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'icon', ...rest }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        aria-label="Previous slide"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        iconLeft={<ArrowIcon direction="prev" />}
        className={cn(ARROW_CLASS, ARROW_POSITION[orientation].prev, className)}
        {...rest}
      />
    );
  },
);

CarouselPrevious.displayName = 'CarouselPrevious';

/**
 * The "go forward" arrow, positioned against the carousel and disabled at the
 * last slide. It is a `Button`, so every `Button` prop still applies — but its
 * `onClick` is owned by the carousel.
 */
export const CarouselNext = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'icon', ...rest }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        aria-label="Next slide"
        disabled={!canScrollNext}
        onClick={scrollNext}
        iconLeft={<ArrowIcon direction="next" />}
        className={cn(ARROW_CLASS, ARROW_POSITION[orientation].next, className)}
        {...rest}
      />
    );
  },
);

CarouselNext.displayName = 'CarouselNext';
