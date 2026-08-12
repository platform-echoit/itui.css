import {
  Children,
  cloneElement,
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';
import { CaretRight } from '../../icons/ITUI/icons';

/*
  Token → Tailwind class reference (Figma node 27901:1443 — "List")
  ─────────────────────────────────────────────────────────────────────────────
  CONTAINER (List — Figma node 27901:1785)
  surface/neutral/secondary/default  #fafafa  → bg-inverse
  border/neutral/subtle              #ededed  → border border-border-neutral-subtle
  radius/sm                          8px      → rounded-lg
  shadow/downwards/sm                         → shadow-downwards-sm
  spacing/sm                         8px      → p-2 (padding), gap-2 (row gap)

  ROW (Base List — Figma node 27901:1438)
  spacing/sm                         8px      → p-2 (row padding), gap-2 (slot gap)
  radius/sm                          8px      → rounded-lg
  height/list/sm                     40px     → min-h-10  (label-only row)
  height/list/md                     56px     → min-h-14  (row with description)

  ROW — interactive states (CSS-only, RSC compatible)
  surface/neutral/secondary/default  #fafafa  → bg-inverse                      (default)
  surface/neutral/secondary/hover    #f5f5f5  → hover:bg-surface-neutral-subtle (hover)
  surface/neutral/secondary/pressed  #ededed  → active:bg-surface-neutral-hover (pressed)
  surface/neutral/secondary/pressed  #ededed  → bg-surface-neutral-hover        (active prop)

  TYPOGRAPHY
  body/md/medium   14px 500 leading-24 0.20px → text-sm font-medium leading-md tracking-md
  body/md/regular  14px 400 leading-24 0.20px → text-sm font-normal leading-md tracking-md
  text/neutral/default  #0f0f0f → text-foreground     (title)
  text/neutral/muted    #595858 → text-neutral-muted  (description)
  text/neutral/disabled #c2c2c2 → text-neutral-disabled

  ICONS
  height/icon/lg  20px → size-5 (leading icon, kebab) — sized by the caller
  height/icon/md  16px → size-4 (trailing CaretRight)
  icon/neutral/default  #0f0f0f → text-icon-neutral

  DESIGN NOTES
  - Figma's `Type=LabelIcon` / `Type=Avatar` are modeled as one row: the leading
    slot takes an icon or an <Avatar>, and `description` turns the row into the
    two-line (Avatar) layout.
  - Row heights are `min-h-*`, not fixed: Figma's composed List draws the Avatar
    row at 56px while its two `leading-md` lines need 64px. The minimum keeps
    single-line rows on the 40px grid without clipping two-line ones.
  - Width: Figma pins the container to `size/container/md` (358px). Omitted here
    so a list stretches to its own container — pass `className` to constrain it.
  - `active` uses the pressed surface, matching the highlighted row of Figma's
    composed List (27901:1785). The Base List `State=Active` variant is drawn
    identical to Default, which reads as an unfinished variant.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ListProps extends HTMLAttributes<HTMLDivElement> {}

export interface ListItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Leading slot — a 20×20 icon, an `<Avatar size="md">`, or any node. */
  leading?: ReactNode;
  /** Secondary line below the title — turns the row into the two-line layout. */
  description?: ReactNode;
  /** Trailing content at the right edge — e.g. a `<Button>` and a kebab menu. */
  trailing?: ReactNode;
  /** Appends a CaretRight indicator after `trailing`, for rows that navigate. */
  chevron?: boolean;
  /** Marks the row as the selected one — renders on the pressed surface. */
  active?: boolean;
  /**
   * Render the row as its single child element (e.g. an `<a>` or a router link)
   * instead of a `<button>`. That child's own children become the row title.
   */
  asChild?: boolean;
}

// ─── List ─────────────────────────────────────────────────────────────────────

/**
 * The bordered, shadowed card that holds `ListItem` rows. It only supplies the
 * surface and the spacing — the rows carry their own behaviour.
 */
export const List = forwardRef<HTMLDivElement, ListProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-2 p-2 rounded-lg bg-inverse border border-border-neutral-subtle shadow-downwards-sm',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);
List.displayName = 'List';

// ─── ListItem ─────────────────────────────────────────────────────────────────

/**
 * One row: a leading slot, a title (its children), an optional second line, and
 * a trailing slot. It is a `<button>` by default — pass `asChild` when the row
 * should be a link, and the child's children become the title.
 */
export const ListItem = forwardRef<HTMLButtonElement, ListItemProps>(
  (
    {
      leading,
      description,
      trailing,
      chevron = false,
      active = false,
      asChild = false,
      disabled = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    // With `asChild`, the consumer owns the outer element and its children are
    // only the title — the row's own markup is grafted in below.
    const child = asChild
      ? (Children.only(children) as ReactElement<{ children?: ReactNode }>)
      : null;
    const title = child ? child.props.children : children;

    const rowClassName = cn(
      'flex w-full items-center justify-between gap-2 p-2 rounded-lg text-left select-none',
      'focus-visible:focus-ring',
      description ? 'min-h-14' : 'min-h-10',
      active
        ? 'bg-surface-neutral-hover'
        : 'bg-inverse hover:bg-surface-neutral-subtle active:bg-surface-neutral-hover',
      disabled ? 'pointer-events-none cursor-not-allowed' : 'cursor-pointer',
      className,
    );

    const content = (
      <>
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {leading && (
            <span
              className={cn(
                'flex shrink-0 items-center justify-center',
                disabled ? 'text-icon-neutral-disabled' : 'text-icon-neutral',
              )}
            >
              {leading}
            </span>
          )}
          <span className="flex min-w-0 flex-col">
            <span
              className={cn(
                'truncate text-sm font-medium leading-md tracking-md',
                disabled ? 'text-neutral-disabled' : 'text-foreground',
              )}
            >
              {title}
            </span>
            {description && (
              <span
                className={cn(
                  'truncate text-sm font-normal leading-md tracking-md',
                  disabled ? 'text-neutral-disabled' : 'text-neutral-muted',
                )}
              >
                {description}
              </span>
            )}
          </span>
        </span>
        {(trailing || chevron) && (
          <span className="flex shrink-0 items-center gap-2">
            {trailing}
            {chevron && <CaretRight width={16} height={16} />}
          </span>
        )}
      </>
    );

    const stateProps = {
      'aria-disabled': disabled || undefined,
      'data-active': active || undefined,
      'data-disabled': disabled || undefined,
    };

    if (child) {
      return (
        <Slot ref={ref} className={rowClassName} {...stateProps} {...rest}>
          {cloneElement(child, undefined, content)}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={rowClassName}
        {...stateProps}
        {...rest}
      >
        {content}
      </button>
    );
  },
);
ListItem.displayName = 'ListItem';
