import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import type { Modifiers } from '@daypicker/react';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference (Figma node 27193:2420 "Base Date")
  ─────────────────────────────────────────────────────────────────────────────
  CELL
  height/date-picker           36px     → h-9 (wrapper) · size-date-picker (circle)
  radius/full                  999px    → rounded-full
  spacing/sm                   8px      → py-2 (absorbed by the 36px height)

  STATE → TEXT COLOR
  text/neutral/default         #0f0f0f  → text-foreground        (Default)
  text/primary/default         #009ce0  → text-primary           (Primary — 토, today)
  color/semantic/red/500       #f44336  → text-destructive       (Figma calls this variant
                                          "Today", but it is the error/holiday tone —
                                          confirmed with the designer, so it is `error` here)
  text/neutral/disabled        #c2c2c2  → text-neutral-disabled  (Disabled · outside days)
  surface/primary/default      #009ce0  → bg-brand               (Active — selected circle)
  text/primary/inverse         #fafafa  → text-inverse           (Active label)
  surface/primary/subtle       #e6f5fc  → bg-surface-primary-subtle       (Range band)
  surface/primary/hover        #54bdea  → text-surface-primary-hover      (Range label)

  MARKER — 4px dot, filled with the state's own text colour (#0f0f0f on Default,
  #fafafa inside the Active circle) → size-1 rounded-full bg-current.

  TYPOGRAPHY
  body/md/regular  14px 400 leading-24 0.20px → text-sm font-normal leading-md tracking-md

  DEVIATIONS FROM THE FRAME
  · The range band at a selected edge is drawn with `surface/primary/subtle` (#e6f5fc),
    the same token as the middle of the range. The frame paints those half bands with a
    raw #f2f7fe that has no token and does not match the rest of the band.
  · The cell is `w-full` rather than a fixed 36px so the band stays continuous across a
    week row; the 36px circle inside keeps the designed size.
  · hover / pressed / focus are not drawn in the frame — they reuse the design system's
    interaction tokens, the same ones Popover items and `Calendar` already use.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

export type BaseDateState =
  | 'default'
  | 'primary'
  | 'error'
  | 'disabled'
  | 'selected'
  | 'range';

/** Which end of a range the cell sits on — draws the half band that joins it to the band. */
export type BaseDateRangeEdge = 'start' | 'end';

interface BaseDateOwnProps {
  /**
   * How the cell reads. `selected` fills the circle, `range` tints the band
   * between two ends, `primary` marks today, and `error` is the invalid date —
   * red here means "not allowed", not "today".
   */
  state?: BaseDateState;
  /** Which end of a range the cell sits on — draws the half band that joins it to the band. */
  rangeEdge?: BaseDateRangeEdge;
  /** `true` renders the 4px dot from the design; a node renders your own marker row. */
  marker?: boolean | ReactNode;
}

/** Props of `BaseDate` — the non-interactive cell. */
export interface BaseDateProps
  extends HTMLAttributes<HTMLSpanElement>,
    BaseDateOwnProps {}

/** Props of `BaseDateButton` — the same cell as a `<button>`. */
export interface BaseDateButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    BaseDateOwnProps {}

// ─── Class maps ───────────────────────────────────────────────────────────────

const cellClasses = 'relative flex h-9 w-full items-center justify-center';

const circleClasses =
  'relative flex size-date-picker items-center justify-center rounded-full text-sm font-normal leading-md tracking-md transition-colors duration-150 ease-out';

const stateClasses: Record<BaseDateState, string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  error: 'text-destructive',
  disabled: 'text-neutral-disabled',
  selected: 'bg-brand text-inverse',
  range: 'text-surface-primary-hover',
};

/** Half band behind a selected edge, so start/end join the middle of the range. */
const rangeEdgeClasses: Record<BaseDateRangeEdge, string> = {
  start:
    'before:absolute before:inset-y-0 before:right-0 before:left-1/2 before:bg-surface-primary-subtle',
  end: 'before:absolute before:inset-y-0 before:left-0 before:right-1/2 before:bg-surface-primary-subtle',
};

// ─── DayPicker modifiers → state ──────────────────────────────────────────────

/**
 * Shared by `Calendar` and `DatePicker` so a day looks the same in both.
 *
 * `holiday` is not a DayPicker built-in — it is the custom modifier both
 * components document, so `modifiers={{ holiday: [...] }}` paints those days red.
 */
export function baseDateStateFromModifiers(
  modifiers: Modifiers,
): BaseDateState {
  if (modifiers.disabled || modifiers.outside) return 'disabled';
  // Every day of a range carries `selected`, so the band has to be claimed first —
  // otherwise the whole range renders as a row of filled circles.
  if (modifiers.range_middle) return 'range';
  if (modifiers.selected) return 'selected';
  if (modifiers.holiday) return 'error';
  if (modifiers.today) return 'primary';
  return 'default';
}

/** A range end only needs its half band when the range actually spans further. */
export function baseDateRangeEdgeFromModifiers(
  modifiers: Modifiers,
): BaseDateRangeEdge | undefined {
  if (modifiers.range_start && !modifiers.range_end) return 'start';
  if (modifiers.range_end && !modifiers.range_start) return 'end';
  return undefined;
}

// ─── Parts ────────────────────────────────────────────────────────────────────

function DateMarker({ marker }: { marker: boolean | ReactNode }) {
  return (
    <span className="absolute bottom-1 flex items-center gap-0.5">
      {marker === true ? (
        <span className="size-1 rounded-full bg-current" />
      ) : (
        marker
      )}
    </span>
  );
}

/**
 * One cell of a date grid: the 36px circle plus the range band behind it.
 *
 * Used for the day numbers, for the weekday labels (`월`, `화`… — the design
 * builds those from this same component), and as the read-only cell whenever the
 * calendar has no selection mode. Use `BaseDateButton` for the interactive form.
 */
export const BaseDate = forwardRef<HTMLSpanElement, BaseDateProps>(
  (
    { state = 'default', rangeEdge, marker, className, children, ...rest },
    ref,
  ) => (
    <span
      ref={ref}
      className={cn(
        cellClasses,
        state === 'range' && 'bg-surface-primary-subtle',
        rangeEdge && rangeEdgeClasses[rangeEdge],
        className,
      )}
      {...rest}
    >
      <span className={cn(circleClasses, stateClasses[state])}>
        {children}
        {marker ? <DateMarker marker={marker} /> : null}
      </span>
    </span>
  ),
);
BaseDate.displayName = 'BaseDate';

/**
 * `BaseDate` as a button. The whole cell is the hit target — wider than the
 * circle — while hover/pressed paint the circle, which is what the eye follows.
 */
export const BaseDateButton = forwardRef<
  HTMLButtonElement,
  BaseDateButtonProps
>(
  (
    { state = 'default', rangeEdge, marker, className, children, ...rest },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(
        cellClasses,
        // The ring is painted by the inner circle via `group-focus-visible`, so
        // the button itself only has to keep the UA outline out of the way.
        'group cursor-pointer outline-none',
        'disabled:pointer-events-none',
        state === 'range' && 'bg-surface-primary-subtle',
        rangeEdge && rangeEdgeClasses[rangeEdge],
        className,
      )}
      {...rest}
    >
      <span
        className={cn(
          circleClasses,
          stateClasses[state],
          // Selected keeps its brand fill through hover/pressed instead of greying out.
          state === 'selected'
            ? 'group-hover:bg-brand-hover group-active:bg-brand-pressed'
            : 'group-hover:bg-muted group-active:bg-secondary',
          'group-focus-visible:focus-ring',
        )}
      >
        {children}
        {marker ? <DateMarker marker={marker} /> : null}
      </span>
    </button>
  ),
);
BaseDateButton.displayName = 'BaseDateButton';
