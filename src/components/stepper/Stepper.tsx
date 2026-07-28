import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type OlHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/utils';
import { CheckRegularIcon } from '../../icons/ITUI';

/*
  Token → Tailwind map (Figma node 26973:412 "Stepper")
  ─────────────────────────────────────────────────────────────────────────────
  INDICATOR ("Base Stepper" 26973:469)
    Filled  height/stepper/sm 24px → size-stepper-sm  (completed · upcoming)
            height/stepper/md 28px → size-stepper-md  (current: 1px ring + 24px core)
    Dot     height/dot/sm     10px → size-dot-sm
    radius/full → rounded-full · exception/spacing/2 2px → p-0.5
    stroke/xs 1px → ring-1 + ring-offset-1 on the `current` core (not a border — see below)

    surface/primary/muted            #b0e0f5 → bg-surface-primary-muted  (completed)
    surface/primary/default          #009ce0 → bg-surface-primary        (current core · current dot)
    text/primary/inverse             #fafafa → bg-inverse · text-inverse (current ring bg · number)
    surface/neutral/disabled/default #f5f5f5 → bg-surface-neutral-subtle (upcoming — same value under
                                               the canonical name, see TOKENS.md "Duplicates Removed")
    border/primary/default           #009ce0 → border-border-primary     (current ring)
    icon/primary/default             #009ce0 → text-icon-primary         (check glyph)
    height/icon/sm                   12px    → h-icon-sm w-icon-sm

  TEXT
    typography/body/md/medium     14/24/0.2/500 → text-sm font-medium leading-md tracking-md
    typography/caption/sm/regular 12/20/0.3/400 → text-xs leading-sm tracking-sm
    text/neutral/default  #0f0f0f → text-neutral          (current title)
    text/neutral/muted    #595858 → text-neutral-muted    (current description)
    text/neutral/disabled #c2c2c2 → text-neutral-disabled (completed · upcoming)
      NOTE — Figma draws the completed title in #595858 for HorizontalDot but #c2c2c2 for
      HorizontalFilled and VerticalDot. Normalised to #c2c2c2 so status → colour is one table.

  CONNECTOR ("Layout / Divider")
    follows a completed step → border-border-primary        #009ce0
    otherwise                → border-border-neutral-subtle #ededed
    vertical run 48px → min-h-12, then grows with the step content

  LAYOUT
    spacing/sm 8px → gap-2 · spacing/xs 4px → gap-1/pt-1 · Gap/Size/Large 12px → gap-3
    Gap/Size/Small 4px → gap-1 (vertical row gap) · title row height 24px → h-6
    Root width stays w-full (Figma pins 863px) — the consumer owns the width.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

/** `filled` shows a numbered/checked circle, `dot` a bare 10px dot. */
export type StepperVariant = 'filled' | 'dot';
export type StepperOrientation = 'horizontal' | 'vertical';
export type StepStatus = 'completed' | 'current' | 'upcoming';

// ─── Context ──────────────────────────────────────────────────────────────────

interface StepperContextValue {
  variant: StepperVariant;
  orientation: StepperOrientation;
  current: number;
}

const StepperContext = createContext<StepperContextValue>({
  variant: 'filled',
  orientation: 'horizontal',
  current: 0,
});

/** Position of an item in the list — injected by `Stepper`, never by the consumer. */
const StepIndexContext = createContext<number>(0);

/**
 * The trailing connector is hidden on the last step via `:last-child` rather than an
 * index check, so it stays correct even when items come from a wrapper component.
 */
const CONNECTOR_BASE = 'group-last/step:hidden';

// ─── Style tables ─────────────────────────────────────────────────────────────

const dotSurface: Record<StepStatus, string> = {
  completed: 'bg-surface-primary-muted',
  current: 'bg-surface-primary',
  upcoming: 'bg-surface-neutral-subtle',
};

const stepText: Record<StepStatus, { title: string; description: string }> = {
  completed: {
    title: 'text-neutral-disabled',
    description: 'text-neutral-disabled',
  },
  current: { title: 'text-neutral', description: 'text-neutral-muted' },
  upcoming: {
    title: 'text-neutral-disabled',
    description: 'text-neutral-disabled',
  },
};

const TITLE_TYPE = 'text-sm font-medium leading-md tracking-md';
const DESCRIPTION_TYPE = 'text-xs leading-sm tracking-sm';
const FILLED_BASE =
  'inline-flex shrink-0 items-center justify-center rounded-full';
/**
 * Figma's `exception/spacing/2`. Only `completed` and `upcoming` carry it; the `current`
 * circle paints its inset from a ring instead, so padding there would shrink the core.
 */
const FILLED_PADDING = 'p-0.5';

function resolveStatus(index: number, current: number): StepStatus {
  if (index < current) return 'completed';
  if (index === current) return 'current';
  return 'upcoming';
}

// ─── StepperIndicator ─────────────────────────────────────────────────────────

export interface StepperIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  /** Defaults to `'filled'`. */
  variant?: StepperVariant;
  /** Defaults to `'upcoming'`. */
  status?: StepStatus;
  /** 1-based number rendered by the `filled` variant. */
  step?: number;
  /** Replaces the default check glyph / number. */
  children?: ReactNode;
}

/**
 * Figma's "Base Stepper" — the circle on its own. Decorative: the readable step
 * text and `aria-current` live on `StepperItem`.
 */
export const StepperIndicator = forwardRef<
  HTMLSpanElement,
  StepperIndicatorProps
>(
  (
    {
      variant = 'filled',
      status = 'upcoming',
      step,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    if (variant === 'dot') {
      return (
        <span
          ref={ref}
          aria-hidden="true"
          className={cn(
            'size-dot-sm shrink-0 rounded-full',
            dotSurface[status],
            className,
          )}
          {...rest}
        />
      );
    }

    if (status === 'current') {
      return (
        <span
          ref={ref}
          aria-hidden="true"
          // Layout box only — Figma's 28px frame. The core below paints every ring.
          className={cn(FILLED_BASE, 'size-stepper-md', className)}
          {...rest}
        >
          {/*
            Core, 1px gap and 1px stroke all come out of one box-shadow stack, so they are
            concentric by construction: 24 + 2×(1 + 1) = Figma's 28px. Painting the stroke
            as a `border` on the parent instead leaves two circles rasterised 1px apart, and
            anti-aliasing swallows that gap unevenly at fractional device pixel ratios.
          */}
          <span
            className={cn(
              'flex size-stepper-sm shrink-0 items-center justify-center rounded-full bg-surface-primary text-inverse',
              'ring-1 ring-border-primary ring-offset-1 ring-offset-inverse',
              TITLE_TYPE,
            )}
          >
            {children ?? step}
          </span>
        </span>
      );
    }

    if (status === 'completed') {
      return (
        <span
          ref={ref}
          aria-hidden="true"
          className={cn(
            FILLED_BASE,
            FILLED_PADDING,
            'size-stepper-sm bg-surface-primary-muted',
            className,
          )}
          {...rest}
        >
          {children ?? (
            // ITUI icons hardcode fill="#101010", so `fill-current` is the only way to recolour them.
            <CheckRegularIcon className="h-icon-sm w-icon-sm text-icon-primary [&_path]:fill-current" />
          )}
        </span>
      );
    }

    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cn(
          FILLED_BASE,
          FILLED_PADDING,
          'size-stepper-sm bg-surface-neutral-subtle text-neutral-disabled',
          TITLE_TYPE,
          className,
        )}
        {...rest}
      >
        {children ?? step}
      </span>
    );
  },
);

StepperIndicator.displayName = 'StepperIndicator';

// ─── StepperItem ──────────────────────────────────────────────────────────────

export interface StepperItemProps
  extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  /** Overrides the status derived from the parent's `current`. */
  status?: StepStatus;
  /** Extra content rendered under the description. */
  children?: ReactNode;
}

export const StepperItem = forwardRef<HTMLLIElement, StepperItemProps>(
  ({ title, description, status, className, children, ...rest }, ref) => {
    const { variant, orientation, current } = useContext(StepperContext);
    const index = useContext(StepIndexContext);

    const resolvedStatus = status ?? resolveStatus(index, current);
    const text = stepText[resolvedStatus];

    const indicator = (
      <StepperIndicator
        variant={variant}
        status={resolvedStatus}
        step={index + 1}
      />
    );

    // The line leaving a step is brand-coloured only once that step is behind us.
    const connectorColor =
      resolvedStatus === 'completed'
        ? 'border-border-primary'
        : 'border-border-neutral-subtle';

    const renderTitle = (extra?: string) =>
      title != null && (
        <span className={cn(TITLE_TYPE, text.title, extra)}>{title}</span>
      );

    const renderDescription = () =>
      description != null && (
        <p className={cn(DESCRIPTION_TYPE, 'w-full', text.description)}>
          {description}
        </p>
      );

    const ariaCurrent = resolvedStatus === 'current' ? 'step' : undefined;

    if (orientation === 'vertical') {
      return (
        <li
          ref={ref}
          aria-current={ariaCurrent}
          className={cn('group/step flex w-full gap-3', className)}
          {...rest}
        >
          <span className="flex flex-col items-center gap-2 pt-1">
            {indicator}
            <span
              aria-hidden="true"
              className={cn(
                'w-0 min-h-12 flex-1 border-l',
                connectorColor,
                CONNECTOR_BASE,
              )}
            />
          </span>
          <span className="flex min-w-px flex-1 flex-col gap-1">
            {renderTitle('w-full')}
            {renderDescription()}
            {children}
          </span>
        </li>
      );
    }

    if (variant === 'dot') {
      return (
        <li
          ref={ref}
          aria-current={ariaCurrent}
          className={cn(
            'group/step flex min-w-px flex-1 flex-col gap-2',
            className,
          )}
          {...rest}
        >
          <span className="flex w-full items-center gap-2">
            {indicator}
            <span
              aria-hidden="true"
              className={cn(
                'h-0 min-w-px flex-1 border-t',
                connectorColor,
                CONNECTOR_BASE,
              )}
            />
          </span>
          <span className="flex w-full flex-col gap-1">
            {renderTitle('w-full')}
            {renderDescription()}
            {children}
          </span>
        </li>
      );
    }

    return (
      <li
        ref={ref}
        aria-current={ariaCurrent}
        className={cn(
          'group/step flex min-w-px flex-1 items-start gap-2',
          className,
        )}
        {...rest}
      >
        {indicator}
        <span className="flex min-w-px flex-1 flex-col gap-1">
          {/* Fixed 24px row so the connector stays centred on the title, empty title or not. */}
          <span className="flex h-6 w-full items-center gap-2">
            {renderTitle('whitespace-nowrap')}
            <span
              aria-hidden="true"
              className={cn(
                'h-0 min-w-px flex-1 border-t',
                connectorColor,
                CONNECTOR_BASE,
              )}
            />
          </span>
          {renderDescription()}
          {children}
        </span>
      </li>
    );
  },
);

StepperItem.displayName = 'StepperItem';

// ─── Stepper ──────────────────────────────────────────────────────────────────

export interface StepperProps extends OlHTMLAttributes<HTMLOListElement> {
  /** Defaults to `'filled'`. */
  variant?: StepperVariant;
  /** Defaults to `'horizontal'`. */
  orientation?: StepperOrientation;
  /**
   * Zero-based index of the active step. Earlier steps read as `completed`,
   * later ones as `upcoming`. Defaults to `0`.
   */
  current?: number;
  /**
   * `StepperItem` elements. They must be direct children — an item rendered by a
   * wrapper component shares its wrapper's step index.
   */
  children?: ReactNode;
}

export const Stepper = forwardRef<HTMLOListElement, StepperProps>(
  (
    {
      variant = 'filled',
      orientation = 'horizontal',
      current = 0,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    // Each item is wrapped rather than cloned, so it keeps its own props and ref.
    const items = Children.toArray(children).filter(isValidElement);

    return (
      <StepperContext.Provider value={{ variant, orientation, current }}>
        <ol
          ref={ref}
          className={cn(
            'flex w-full',
            orientation === 'vertical' ? 'flex-col gap-1' : 'items-start gap-2',
            className,
          )}
          {...rest}
        >
          {items.map((item, index) => (
            <StepIndexContext.Provider key={item.key ?? index} value={index}>
              {item}
            </StepIndexContext.Provider>
          ))}
        </ol>
      </StepperContext.Provider>
    );
  },
);

Stepper.displayName = 'Stepper';
