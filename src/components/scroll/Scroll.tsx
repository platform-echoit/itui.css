import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '../../lib/utils';
import { CaretUpFillIcon } from '../../icons/ITUI/caret-up';
import { CaretDownFillIcon } from '../../icons/ITUI/caret-down';
import { CaretLeftFillIcon } from '../../icons/ITUI/caret-left';
import { CaretRightFillIcon } from '../../icons/ITUI/caret-right';

/*
  Token → Tailwind map (Figma node 27288:877 "Scroll")
  ─────────────────────────────────────────────────────────────────────────────
  Figma draws the bar alone — track, thumb and a caret at each end — in
  Size=Md | Sm × State=Default | Hover. It specs no scrolling behaviour, so that
  comes from Radix's ScrollArea: this file only paints its parts.

  RAIL — Size=Md | Sm (vertical; horizontal mirrors it, see AXES below)
  rail width                        18px    → w-4.5 (Md) · w-3 (Sm)
  exception/spacing/2                2px    → pr-0.5   (outer edge inset)
  height/icon/md → caret box        16px    → size-4   (Md)
  caret box                         10px    → size-2.5 (Sm)
  spacing/xs → caret ↔ thumb         4px    → folded into py-5 (Md) · py-3.5 (Sm)

  THUMB
  height/scroll-bar/md              10px    → --size-scroll-bar-md
  height/scroll-bar/sm               6px    → --size-scroll-bar-sm
  radius/full                       999px   → rounded-full
  surface/neutral/secondary/pressed #ededed → bg-secondary               (State=Default)
  surface/neutral/subtle/pressed    #dadada → bg-surface-neutral-pressed (State=Hover)

  CARET (CaretUp/CaretDown 26864:12144 / 26864:12186)
  fill                              #ededed → text-secondary + [&_path]:fill-current
                                              (ITUI icons hardcode fill="#101010")
  Figma's exported vector is the Phosphor *Fill* caret — a solid 11×6 triangle in a
  16×16 box — which is exactly CaretUpFillIcon's path at half scale, so the ITUI icon
  components are used rather than the exported asset. Both states share one asset in
  Figma: only the thumb changes colour on hover, the carets never do.

  GEOMETRY STRATEGY
  Radix subtracts the rail's own paddingTop/Bottom (paddingLeft/Right when horizontal)
  from its thumb size and offset, so the caret zone is declared as real padding — the
  thumb can then never slide underneath a caret. The carets themselves are absolutely
  positioned inside that padding, inset by the same 2px as the content box so caret and
  thumb share one centre line.

  Radix pins the *cross-axis* thumb size with an inline
  `width: var(--radix-scroll-area-thumb-width)` that it only defines on the axis it
  measures — vertical defines …-height, horizontal defines …-width. The undefined one
  computes to `auto`, and being inline it would beat any w-* / h-* class, so the rail
  supplies the missing variable from the scroll-bar size token instead. That is also the
  only way to use --size-scroll-bar-*: the --size-* namespace generates the square
  size-* utility and never w-* / h-* (TOKENS.md §9).

  AXES
  Figma specs the vertical bar only. The horizontal one mirrors it on every value —
  rail height for width, pb-0.5 for pr-0.5, CaretLeft/CaretRight for CaretUp/CaretDown.

  ANIMATION
  thumb fill  transition-colors duration-150 ease-out, muted by motion-reduce.
  The tailwindcss-animate utilities are unavailable in this package (see lnb/Lnb.tsx),
  and Figma specs no enter/exit for the bar, so nothing else animates.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScrollbarSize = 'md' | 'sm';

/** A single scrollbar axis — what Radix's `orientation` accepts. */
export type ScrollbarAxis = 'vertical' | 'horizontal';

/** Which scrollbars the composed `ScrollArea` renders. */
export type ScrollAreaOrientation = ScrollbarAxis | 'both';

// ─── Rail geometry ────────────────────────────────────────────────────────────

const RAIL_AXIS: Record<ScrollbarAxis, string> = {
  vertical: 'justify-center',
  horizontal: 'flex-col justify-center',
};

const RAIL_SIZE: Record<ScrollbarAxis, Record<ScrollbarSize, string>> = {
  vertical: {
    md: 'w-4.5 py-5 pr-0.5 [--radix-scroll-area-thumb-width:var(--size-scroll-bar-md)]',
    sm: 'w-3 py-3.5 pr-0.5 [--radix-scroll-area-thumb-width:var(--size-scroll-bar-sm)]',
  },
  horizontal: {
    md: 'h-4.5 px-5 pb-0.5 [--radix-scroll-area-thumb-height:var(--size-scroll-bar-md)]',
    sm: 'h-3 px-3.5 pb-0.5 [--radix-scroll-area-thumb-height:var(--size-scroll-bar-sm)]',
  },
};

// ─── Caret ────────────────────────────────────────────────────────────────────

const CARETS = {
  vertical: {
    start: { Icon: CaretUpFillIcon, position: 'top-0 left-0 right-0.5' },
    end: { Icon: CaretDownFillIcon, position: 'bottom-0 left-0 right-0.5' },
  },
  horizontal: {
    start: { Icon: CaretLeftFillIcon, position: 'left-0 top-0 bottom-0.5' },
    end: { Icon: CaretRightFillIcon, position: 'right-0 top-0 bottom-0.5' },
  },
} as const;

const CARET_SIZE: Record<ScrollbarSize, string> = {
  md: 'size-4',
  sm: 'size-2.5',
};

interface ScrollCaretProps {
  orientation: ScrollbarAxis;
  edge: 'start' | 'end';
  size: ScrollbarSize;
}

/** Decorative end cap. Figma specs no interaction and Radix exposes no arrow API. */
function ScrollCaret({ orientation, edge, size }: ScrollCaretProps) {
  const { Icon, position } = CARETS[orientation][edge];
  return (
    <span
      aria-hidden="true"
      className={cn(
        'absolute flex items-center justify-center text-secondary',
        position,
      )}
    >
      <Icon className={cn(CARET_SIZE[size], '[&_path]:fill-current')} />
    </span>
  );
}

// ─── Parts ────────────────────────────────────────────────────────────────────

export type ScrollAreaRootProps = ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
>;

/**
 * The clipping container of a hand-composed scroll area. It owns the size and
 * the overflow; the actual scrolling happens in `ScrollAreaViewport`.
 */
export const ScrollAreaRoot = forwardRef<
  ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaRootProps
>(({ className, ...rest }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    // `overflow-hidden` here is what makes this a scroll area, so it stays, and
    // it clips the focus outline of focusable content in the viewport. That
    // content is the caller's: give it `focus-visible:focus-ring-inset`.
    // See ACCESSIBILITY.md.
    className={cn('relative overflow-hidden', className)}
    {...rest}
  />
));
ScrollAreaRoot.displayName = 'ScrollAreaRoot';

export type ScrollAreaViewportProps = ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Viewport
>;

/** The element that actually scrolls. Put the content inside it. */
export const ScrollAreaViewport = forwardRef<
  ElementRef<typeof ScrollAreaPrimitive.Viewport>,
  ScrollAreaViewportProps
>(({ className, ...rest }, ref) => (
  <ScrollAreaPrimitive.Viewport
    ref={ref}
    // `rounded-[inherit]` keeps the clipped content following the root's radius.
    className={cn('size-full rounded-[inherit]', className)}
    {...rest}
  />
));
ScrollAreaViewport.displayName = 'ScrollAreaViewport';

export type ScrollAreaThumbProps = ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Thumb
>;

/** The draggable handle. `ScrollAreaScrollbar` renders one already — replace it only to restyle. */
export const ScrollAreaThumb = forwardRef<
  ElementRef<typeof ScrollAreaPrimitive.Thumb>,
  ScrollAreaThumbProps
>(({ className, ...rest }, ref) => (
  <ScrollAreaPrimitive.Thumb
    ref={ref}
    className={cn(
      'rounded-full bg-secondary transition-colors duration-150 ease-out motion-reduce:transition-none',
      // Figma's State=Hover. Keyed off the whole rail, not the thumb, so the 18px
      // track is the hit area rather than the 10px thumb.
      'group-hover/scroll-rail:bg-surface-neutral-pressed',
      className,
    )}
    {...rest}
  />
));
ScrollAreaThumb.displayName = 'ScrollAreaThumb';

export interface ScrollAreaScrollbarProps
  extends ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar> {
  /** Rail width: the standard bar or the narrow one. @default 'md' */
  size?: ScrollbarSize;
  /** Replaces the default thumb. The carets are always drawn. */
  children?: ReactNode;
}

/** One rail, with its carets and thumb. One per axis you want a bar on. */
export const ScrollAreaScrollbar = forwardRef<
  ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  ScrollAreaScrollbarProps
>(
  (
    { className, size = 'md', orientation = 'vertical', children, ...rest },
    ref,
  ) => (
    <ScrollAreaPrimitive.Scrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        'group/scroll-rail flex touch-none select-none',
        RAIL_AXIS[orientation],
        RAIL_SIZE[orientation][size],
        className,
      )}
      {...rest}
    >
      <ScrollCaret orientation={orientation} edge="start" size={size} />
      {children ?? <ScrollAreaThumb />}
      <ScrollCaret orientation={orientation} edge="end" size={size} />
    </ScrollAreaPrimitive.Scrollbar>
  ),
);
ScrollAreaScrollbar.displayName = 'ScrollAreaScrollbar';

export type ScrollAreaCornerProps = ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Corner
>;

/** Fills the square where two rails meet. Only needed with both bars on. */
export const ScrollAreaCorner = forwardRef<
  ElementRef<typeof ScrollAreaPrimitive.Corner>,
  ScrollAreaCornerProps
>((props, ref) => <ScrollAreaPrimitive.Corner ref={ref} {...props} />);
ScrollAreaCorner.displayName = 'ScrollAreaCorner';

// ─── ScrollArea ───────────────────────────────────────────────────────────────

export interface ScrollAreaProps extends ScrollAreaRootProps {
  /** Rail width: the standard bar or the narrow one. @default 'md' */
  size?: ScrollbarSize;
  /** Which bars to render. Defaults to `vertical`, as Figma specs. */
  orientation?: ScrollAreaOrientation;
  /** Reaches the scrolling element, e.g. to pad the content away from the bar. */
  viewportClassName?: string;
  /** Reaches both rails. */
  scrollbarClassName?: string;
}

/**
 * Root + viewport + bar in one element — the common case.
 * Compose `ScrollAreaRoot` / `ScrollAreaViewport` / `ScrollAreaScrollbar` by hand
 * when the content needs to sit between them.
 */
export const ScrollArea = forwardRef<
  ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(
  (
    {
      size = 'md',
      orientation = 'vertical',
      viewportClassName,
      scrollbarClassName,
      children,
      // Figma draws the bar in its Default (un-hovered) state, so it stays visible;
      // Radix's own default would fade it in on hover only.
      type = 'always',
      ...rest
    },
    ref,
  ) => (
    <ScrollAreaRoot ref={ref} type={type} {...rest}>
      <ScrollAreaViewport className={viewportClassName}>
        {children}
      </ScrollAreaViewport>
      {orientation !== 'horizontal' && (
        <ScrollAreaScrollbar
          orientation="vertical"
          size={size}
          className={scrollbarClassName}
        />
      )}
      {orientation !== 'vertical' && (
        <ScrollAreaScrollbar
          orientation="horizontal"
          size={size}
          className={scrollbarClassName}
        />
      )}
      {orientation === 'both' && <ScrollAreaCorner />}
    </ScrollAreaRoot>
  ),
);
ScrollArea.displayName = 'ScrollArea';
