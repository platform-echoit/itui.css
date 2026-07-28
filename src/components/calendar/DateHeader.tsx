import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { CaretLeftRegularIcon, CaretRightRegularIcon } from '../../icons/ITUI';

/*
  Token → Tailwind class reference (Figma node 27193:2381 "Date Header")
  ─────────────────────────────────────────────────────────────────────────────
  ROW
  size 280×36                           → w-date-header (--width-date-header) · h-9
  surface/neutral/secondary/default #fafafa → bg-inverse
  radius/sm                    8px      → rounded-lg

  NAV BUTTON
  36×36 with spacing/xs 4px padding     → size-9
  height/icon/md               16px     → CaretLeft/CaretRightRegularIcon 16×16
  radius/sm                    8px      → rounded-lg (hover surface)

  CAPTION
  body/md/medium  14px 500 leading-24 0.20px → text-sm font-medium leading-md tracking-md
  text/neutral/default         #0f0f0f  → text-foreground
  spacing/sm                   8px      → gap-2 (between the year and month dropdowns)
  spacing/xs                   4px      → gap-1 (between a dropdown label and its caret)

  The frame's two variants — `Default` (a plain caption) and `Dropdown`
  (`2026년 ⌄` `1월 ⌄`) — differ only in what sits between the arrows, so both are
  served by the `children` slot rather than a `type` prop.

  hover / pressed / focus are not drawn in the frame; they reuse the interaction
  tokens already used by `Calendar` and Popover items.
  ─────────────────────────────────────────────────────────────────────────────
*/

export interface DateHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Center slot: the caption text, or the year/month dropdowns. */
  children?: ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  /** @default true */
  showPrevious?: boolean;
  /** @default true */
  showNext?: boolean;
  previousLabel?: string;
  nextLabel?: string;
}

const navButtonClasses = cn(
  'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-1',
  'transition-colors duration-150 ease-out hover:bg-muted active:bg-secondary',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  'disabled:pointer-events-none disabled:opacity-50',
);

/**
 * The month navigation row: previous · caption · next.
 *
 * Presentational — it owns no month state. `DatePicker` wires it to DayPicker,
 * and standalone consumers pass their own `children` / `onPrevious` / `onNext`.
 */
export const DateHeader = forwardRef<HTMLDivElement, DateHeaderProps>(
  (
    {
      children,
      onPrevious,
      onNext,
      previousDisabled,
      nextDisabled,
      showPrevious = true,
      showNext = true,
      previousLabel = 'Previous month',
      nextLabel = 'Next month',
      className,
      ...rest
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        'flex h-9 w-date-header items-center justify-between rounded-lg bg-inverse',
        className,
      )}
      {...rest}
    >
      {showPrevious && (
        <button
          type="button"
          aria-label={previousLabel}
          disabled={previousDisabled}
          onClick={onPrevious}
          className={navButtonClasses}
        >
          <CaretLeftRegularIcon width={16} height={16} />
        </button>
      )}

      <div className="flex min-w-px flex-1 items-center justify-center gap-2 text-center text-sm font-medium leading-md tracking-md text-foreground">
        {children}
      </div>

      {showNext && (
        <button
          type="button"
          aria-label={nextLabel}
          disabled={nextDisabled}
          onClick={onNext}
          className={navButtonClasses}
        >
          <CaretRightRegularIcon width={16} height={16} />
        </button>
      )}
    </div>
  ),
);
DateHeader.displayName = 'DateHeader';
