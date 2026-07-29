import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference
  (Figma "1440px website 12-columns grid" 26866:28879 · "1440px website with sidebar"
   26866:28999 · "Tablet Grid" 26866:29215 · "Mobile Grid" 26867:8173)
  ─────────────────────────────────────────────────────────────────────────────
  All four nodes are annotated layout-grid diagrams, not components — get_variable_defs
  returns no `grid/*` variable, so the geometry below is read off the diagrams and
  cross-checked against each frame's own `Measure` label. Every value lands on a token
  that already existed; no new CSS variable was added.

  GEOMETRY (verified against the Measure pills)
  mobile   390 − 2×16 = 358   ·  4 cols, 16px gutter
  tablet   744 − 2×24 = 696   ·  8 cols, 20px gutter
  desktop 1440 − 2×32 = 1376  · 12 cols, 24px gutter
  sidebar 1176 − 2×24 = 1128  · 12 cols, 24px gutter   (1440 frame − 264px LNB rail)

  MARGIN                                    GUTTER
  16px  --spacing-4  → px-4      (mobile)   16px  --spacing-4  → gap-4      (mobile)
  24px  --spacing-6  → md:px-6   (tablet)   20px  --spacing-5  → md:gap-5   (tablet)
  32px  --spacing-8  → xl:px-8   (desktop)  24px  --spacing-6  → xl:gap-6   (desktop)
  24px  --spacing-6  → xl:px-6   (beside-sidebar)

  TRACKS — deviation, decided deliberately
  12 columns at every width → grid-cols-12
  Figma specs three track counts (4 mobile / 8 tablet / 12 desktop), but this grid keeps
  12 everywhere, so `size={1}` is always 1/12 of the container and twelve items always
  land on one row. Product decision, taken knowing it overrides the Mobile Grid
  (26867:8173) and Tablet Grid (26866:29215) nodes: at 390px a single column is only
  ~14px, so anything meant to read on a phone must carry a wider `size` there — the
  idiomatic form is size={{ xs: 12, md: 6, xl: 4 }} rather than a bare size={4}.
  Figma labels every column `Auto` (the sidebar node pins 72px only because its
  container is fixed), so the tracks are repeat(12, minmax(0, 1fr)).

  BREAKPOINTS
  Gutter and margin still step at Tailwind's built-in md: (768px) and xl: (1280px)
  rather than at Figma's device widths (390 / 744 / 1440), so the package stays on one
  breakpoint scale. Only the track count was flattened; the spacing rhythm is unchanged.

  OVERLAY FILL — deviation
  Figma's measuring stripes are color/semantic/red/200 (#faa9a3), pure annotation ink
  with no token here. GridOverlay uses the existing translucent --color-surface-error-muted
  instead, so it stays red, lets content read through, and adds no new colour token.
  Same reuse call TOKENS.md already records for Backdrop's fills.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * The three bands the design specs. `xs` is the unprefixed base (mobile), `md` is
 * tablet, `xl` is desktop — MUI's key names and Tailwind's prefixes happen to be the
 * same, so a responsive object maps 1:1 onto the classes it generates.
 */
export type GridBreakpoint = 'xs' | 'md' | 'xl';

/** One value for every breakpoint, or a value per breakpoint — as in MUI's Grid. */
export type Responsive<T> = T | Partial<Record<GridBreakpoint, T>>;

/** Columns an item spans. `'full'` takes the whole row whatever the track count. */
export type GridSize =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  | 'full';

/** Columns left empty before an item. `0` places it wherever auto-flow lands. */
export type GridOffset = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type GridLayout = 'full-width' | 'beside-sidebar';

// ─── Shared class fragments ───────────────────────────────────────────────────

/** Track count + gutter. Identical on Grid and GridOverlay, so the ruler always lines up. */
const TRACKS = 'grid grid-cols-12 gap-4 md:gap-5 xl:gap-6';

/** Outer margin. Only the desktop step differs between the two layouts. */
const marginClass: Record<GridLayout, string> = {
  'full-width': 'px-4 md:px-6 xl:px-8',
  'beside-sidebar': 'px-4 md:px-6 xl:px-6',
};

/* Every span/offset class is spelled out rather than interpolated from the prop, so
   Tailwind's scanner still finds the literal utility in this file — the same reason
   Backdrop.tsx spells out its `positionClass` map. */
const sizeClass: Record<GridBreakpoint, Record<GridSize, string>> = {
  xs: {
    1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4',
    5: 'col-span-5', 6: 'col-span-6', 7: 'col-span-7', 8: 'col-span-8',
    9: 'col-span-9', 10: 'col-span-10', 11: 'col-span-11', 12: 'col-span-12',
    full: 'col-span-full',
  },
  md: {
    1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3', 4: 'md:col-span-4',
    5: 'md:col-span-5', 6: 'md:col-span-6', 7: 'md:col-span-7', 8: 'md:col-span-8',
    9: 'md:col-span-9', 10: 'md:col-span-10', 11: 'md:col-span-11', 12: 'md:col-span-12',
    full: 'md:col-span-full',
  },
  xl: {
    1: 'xl:col-span-1', 2: 'xl:col-span-2', 3: 'xl:col-span-3', 4: 'xl:col-span-4',
    5: 'xl:col-span-5', 6: 'xl:col-span-6', 7: 'xl:col-span-7', 8: 'xl:col-span-8',
    9: 'xl:col-span-9', 10: 'xl:col-span-10', 11: 'xl:col-span-11', 12: 'xl:col-span-12',
    full: 'xl:col-span-full',
  },
};

/* offset 0 emits nothing: pinning col-start-1 would opt the item out of auto-flow and
   drag every later sibling onto the same line. */
const offsetClass: Record<GridBreakpoint, Record<GridOffset, string>> = {
  xs: {
    0: '', 1: 'col-start-2', 2: 'col-start-3', 3: 'col-start-4',
    4: 'col-start-5', 5: 'col-start-6', 6: 'col-start-7', 7: 'col-start-8',
    8: 'col-start-9', 9: 'col-start-10', 10: 'col-start-11', 11: 'col-start-12',
  },
  md: {
    0: '', 1: 'md:col-start-2', 2: 'md:col-start-3', 3: 'md:col-start-4',
    4: 'md:col-start-5', 5: 'md:col-start-6', 6: 'md:col-start-7', 7: 'md:col-start-8',
    8: 'md:col-start-9', 9: 'md:col-start-10', 10: 'md:col-start-11', 11: 'md:col-start-12',
  },
  xl: {
    0: '', 1: 'xl:col-start-2', 2: 'xl:col-start-3', 3: 'xl:col-start-4',
    4: 'xl:col-start-5', 5: 'xl:col-start-6', 6: 'xl:col-start-7', 7: 'xl:col-start-8',
    8: 'xl:col-start-9', 9: 'xl:col-start-10', 10: 'xl:col-start-11', 11: 'xl:col-start-12',
  },
};

const BREAKPOINTS = ['xs', 'md', 'xl'] as const;

/**
 * Turn `6` or `{ xs: 4, xl: 6 }` into the matching classes.
 *
 * A bare value lands on `xs` alone — the base utility is unprefixed, so the cascade
 * already carries it up to every wider band, exactly like MUI's `size={6}`.
 */
function responsiveClasses<T extends string | number>(
  value: Responsive<T> | undefined,
  lookup: Record<GridBreakpoint, Record<T, string>>,
): string[] {
  if (value === undefined) return [];

  const perBreakpoint =
    typeof value === 'object'
      ? value
      : ({ xs: value } as Partial<Record<GridBreakpoint, T>>);

  return BREAKPOINTS.flatMap((breakpoint) => {
    const resolved = perBreakpoint[breakpoint];
    return resolved === undefined ? [] : [lookup[breakpoint][resolved]];
  });
}

// ─── Context ──────────────────────────────────────────────────────────────────

/* GridOverlay has to draw the same tracks and margin as the Grid it sits in. Passing
   them through context rather than repeating them as props means the ruler cannot
   silently drift out of sync with the grid it is measuring. */
interface GridContextValue {
  layout: GridLayout;
  withMargin: boolean;
}

const GridContext = createContext<GridContextValue>({
  layout: 'full-width',
  withMargin: true,
});

// ─── Grid ─────────────────────────────────────────────────────────────────────

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `beside-sidebar` is the 12-column grid that sits next to a 264px LNB rail
   * (Figma 26866:28999): same track count, 24px desktop margin instead of 32px.
   * Mobile and tablet are identical to `full-width` — the rail is collapsed there.
   */
  layout?: GridLayout;
  /** Outer margin (16 / 24 / 32px). Turn off to nest inside an already-padded shell. */
  withMargin?: boolean;
  asChild?: boolean;
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      layout = 'full-width',
      withMargin = true,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'div';

    return (
      /* Provider sits outside the element so `asChild` still hands Slot a single child. */
      <GridContext.Provider value={{ layout, withMargin }}>
        <Component
          ref={ref}
          data-slot="grid"
          data-layout={layout}
          className={cn(
            // `relative` gives GridOverlay something to position against.
            'relative',
            TRACKS,
            withMargin && marginClass[layout],
            className,
          )}
          {...props}
        />
      </GridContext.Provider>
    );
  },
);
Grid.displayName = 'Grid';

// ─── GridItem ─────────────────────────────────────────────────────────────────

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Columns to span — `6` for every band, or `{ xs: 4, md: 4, xl: 6 }` per band. */
  size?: Responsive<GridSize>;
  /**
   * Columns to leave empty before this item.
   *
   * Unlike MUI — which offsets with `margin-left` — this resolves to `col-start-*`, an
   * absolute grid line, because this is real CSS Grid rather than flexbox. For the first
   * item in a row (the case offsets are actually used for) the result is identical, and
   * it has the advantage of snapping to the real track instead of approximating it.
   */
  offset?: Responsive<GridOffset>;
  asChild?: boolean;
}

const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, size, offset, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        ref={ref}
        data-slot="grid-item"
        className={cn(
          responsiveClasses(size, sizeClass),
          responsiveClasses(offset, offsetClass),
          className,
        )}
        {...props}
      />
    );
  },
);
GridItem.displayName = 'GridItem';

// ─── GridOverlay ──────────────────────────────────────────────────────────────

/* One stripe per track. The grid is 12 columns at every width, so all twelve always show
   and always fill exactly one row. */
const STRIPE_COUNT = 12;

export type GridOverlayProps = HTMLAttributes<HTMLDivElement>;

/**
 * The striped column ruler from the Figma diagrams, for checking alignment while
 * building. Drop it anywhere inside a `Grid` — it reads the tracks and margin from
 * context, so it always measures the grid it is actually in.
 */
const GridOverlay = forwardRef<HTMLDivElement, GridOverlayProps>(
  ({ className, ...props }, ref) => {
    const { layout, withMargin } = useContext(GridContext);

    return (
      <div
        ref={ref}
        aria-hidden
        data-slot="grid-overlay"
        className={cn(
          'pointer-events-none absolute inset-0',
          TRACKS,
          withMargin && marginClass[layout],
          className,
        )}
        {...props}
      >
        {Array.from({ length: STRIPE_COUNT }, (_, index) => (
          <div key={index} className="bg-surface-error-muted" />
        ))}
      </div>
    );
  },
);
GridOverlay.displayName = 'GridOverlay';

export { Grid, GridItem, GridOverlay };
