'use client';

import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { getDaysInMonth, setDate, setHours, setMonth, setYear } from 'date-fns';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference (Figma node 29103:747 "Wheel Picker")
  ─────────────────────────────────────────────────────────────────────────────
  LAYOUT
  spacing/lg                   16px     → px-4 (the wheel's own side padding)
  row 32px + spacing/sm 8px gap         → h-10 rows (40px pitch) with an h-8 highlight
                                          centred inside — same rhythm, but a whole-row
                                          scroll step, which is what snapping needs
  5 visible rows                        → h-50 (5 × 40px) · py-20 (2 rows of lead-in,
                                          so a wheel too short to loop can still
                                          bring its first and last option to centre)

  SELECTED ROW
  surface/primary/subtle       #e6f5fc  → bg-surface-primary-subtle
  radius/sm                    8px      → rounded-lg
  body/md/medium 14px 500 leading-24 0.20px → text-sm font-medium leading-md tracking-md
  text/neutral/default         #0f0f0f  → text-foreground

  UNSELECTED ROWS
  typography/size/12 · font/weight/medium · 0.20px → text-xs font-medium tracking-md
  text/neutral/muted           #595858  → text-neutral-muted

  The frame draws the sheet handle above the wheel and a 확인 button below; both come
  from `BottomSheet` (`showHandle`, `primaryText`) rather than being rebuilt here.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

/** One row of a wheel. */
export interface WheelPickerOption {
  /** Identity of the row, as it appears in the picker's `value` record. */
  value: string;
  /** What the row reads — free to be formatted (`1월`, `01`) while `value` stays raw. */
  label: ReactNode;
}

/** One wheel of a `WheelPicker`. */
export interface WheelPickerColumn {
  /** Identifies this column in the `value` record. */
  key: string;
  /** Rows of this wheel, top to bottom. */
  options: WheelPickerOption[];
  /** Accessible name of the wheel — there is no visible label above it. */
  'aria-label'?: string;
}

export interface WheelPickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The wheels, left to right. */
  columns: WheelPickerColumn[];
  /** Selected option value per column, keyed by `column.key`. */
  value: Record<string, string>;
  /** Receives the full next selection, not just the column that moved. */
  onChange?: (value: Record<string, string>) => void;
}
// How long the wheel must sit still before its resting row counts as the choice.
// `scrollend` would be the precise signal, but Safari does not fire it.
const SCROLL_SETTLE_MS = 120;

// Rows the window shows at once — `h-50` over `h-10` rows. A wheel with fewer
// options than that cannot loop: one turn would be shorter than the window, so
// the same option would have to appear twice on screen at the same time.
const VISIBLE_ROWS = 5;

// Rows of slack a looping wheel keeps on each side of centre. It is the budget
// for one throw: the strip is only re-centred once the wheel stops, so a throw
// that travels further than this reaches the end of the strip and stops there.
// At 40px a row, 50 rows is ~2000px — more than a flick covers in a 200px window.
const LOOP_RUNWAY_ROWS = 50;

// ─── Column ───────────────────────────────────────────────────────────────────

// Rows never take a `className` from outside, so their classes are settled here
// once instead of being merged per row on every render — a wheel is a hundred
// rows deep, and it re-renders on every notch it turns.
const ROW =
  'flex h-10 w-full cursor-pointer snap-center items-center justify-center text-sm leading-md tracking-md';
const ROW_SELECTED = `${ROW} font-medium text-foreground`;
const ROW_UNSELECTED = `${ROW} font-normal text-neutral-muted`;

interface WheelPickerColumnViewProps {
  column: WheelPickerColumn;
  value: string | undefined;
  onSelect: (optionValue: string) => void;
}

function WheelPickerColumnView({
  column,
  value,
  onSelect,
}: WheelPickerColumnViewProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<number | undefined>(undefined);

  const options = column.options;
  const count = options.length;
  const selectedIndex = options.findIndex((option) => option.value === value);

  // A looping wheel draws its options over and over and rests in the middle
  // copy, which leaves `LOOP_RUNWAY_ROWS` of strip to scroll into either way.
  const isLooping = count >= VISIBLE_ROWS;
  const copies = isLooping ? 2 * Math.ceil(LOOP_RUNWAY_ROWS / count) + 1 : 1;
  const homeCopy = (copies - 1) / 2;

  // Row height is read from the DOM rather than hardcoded, so the h-10 row class
  // stays the single source of truth for the pitch.
  const rowHeight = () => listRef.current?.firstElementChild?.clientHeight ?? 0;

  /** Which row of the whole strip — clones included — sits under the highlight. */
  const rowAt = (scrollTop: number, height: number) =>
    Math.round(scrollTop / height);

  /** The option that row lands on, as an index into `options`. */
  const indexAt = (row: number) =>
    isLooping
      ? ((row % count) + count) % count
      : Math.min(Math.max(row, 0), count - 1);

  /** Where the strip should sit for `index` — always in the middle copy. */
  const scrollTopFor = (index: number, height: number) =>
    (homeCopy * count + index) * height;

  // Park the wheel on the selected option — on mount, whenever the value changes
  // from the outside, and when the options themselves change (a shorter month
  // moves every row below it). A wheel already resting on that option is left
  // alone, whichever copy it happens to rest in.
  useEffect(() => {
    const list = listRef.current;
    const height = rowHeight();
    if (!list || !height || selectedIndex < 0) return;
    if (indexAt(rowAt(list.scrollTop, height)) === selectedIndex) return;

    list.scrollTop = scrollTopFor(selectedIndex, height);
  }, [selectedIndex, count]);

  useEffect(() => () => window.clearTimeout(settleTimer.current), []);

  // Nothing touches the wheel while it is moving. Writing `scrollTop` mid-flight
  // cancels the browser's own scroll animation, and a throw that dies halfway
  // reads as a stutter, so all the work waits for the wheel to come to rest.
  const handleScroll = () => {
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const list = listRef.current;
      const height = rowHeight();
      if (!list || !height) return;

      const row = rowAt(list.scrollTop, height);
      const index = indexAt(row);

      // Only once the wheel has wandered out of the middle copy is it worth
      // moving: every copy draws the same rows, so sliding back a whole turn
      // lands on identical pixels — nothing moves on screen, the wheel just
      // gets its runway back for the next throw.
      if (isLooping && Math.floor(row / count) !== homeCopy) {
        list.scrollTop = scrollTopFor(index, height);
      }

      const option = options[index];
      if (option && option.value !== value) onSelect(option.value);
    }, SCROLL_SETTLE_MS);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;

    // A looping wheel has no ends: past the last option comes the first again.
    const next =
      options[
        isLooping
          ? (selectedIndex + step + count) % count
          : selectedIndex + step
      ];
    if (!next) return;
    event.preventDefault();
    onSelect(next.value);
  };

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label={column['aria-label']}
      tabIndex={0}
      onScroll={handleScroll}
      onKeyDown={handleKeyDown}
      className={cn(
        'scrollbar-none relative h-50 flex-1 basis-0 overflow-y-auto py-20',
        'snap-y snap-mandatory',
        // A scroll container, not a DS control — it paints no focus ring, so all
        // it needs is the UA outline out of the way.
        'outline-none',
      )}
    >
      {Array.from({ length: copies }, (_, copy) =>
        options.map((option, index) => {
          // Only the middle copy is the list. The ones around it are the same
          // rows again, there to be scrolled into, so they stay out of the
          // accessibility tree instead of repeating every option to a reader.
          const isClone = copy !== homeCopy;

          return (
            <div
              key={`${copy}-${option.value}`}
              // Rows are plain elements, not buttons: they were never reachable
              // by Tab — the wheel itself takes the focus and the arrow keys.
              role={isClone ? undefined : 'option'}
              aria-selected={isClone ? undefined : index === selectedIndex}
              aria-hidden={isClone || undefined}
              onClick={() => onSelect(option.value)}
              className={
                index === selectedIndex ? ROW_SELECTED : ROW_UNSELECTED
              }
            >
              {option.label}
            </div>
          );
        }),
      )}
    </div>
  );
}

// ─── WheelPicker ──────────────────────────────────────────────────────────────

/**
 * Scroll-snapping wheels, one per column. Each column scrolls independently,
 * loops once it holds five options or more, and reports the option resting under
 * the highlight.
 *
 * Generic on purpose — `DateWheelPicker` builds the date columns on top of it.
 */
export function WheelPicker({
  columns,
  value,
  onChange,
  className,
  ...rest
}: WheelPickerProps) {
  return (
    <div className={cn('w-full px-4', className)} {...rest}>
      {/* The band lives inside the padding, so it lines up with the columns even
          when a consumer overrides `px` (a BottomSheet already pads its content). */}
      <div className="relative flex w-full">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-surface-primary-subtle"
        />

        {columns.map((column) => (
          <WheelPickerColumnView
            key={column.key}
            column={column}
            value={value[column.key]}
            onSelect={(optionValue) =>
              onChange?.({ ...value, [column.key]: optionValue })
            }
          />
        ))}
      </div>
    </div>
  );
}

// ─── DateWheelPicker ──────────────────────────────────────────────────────────

/** `date` = year·month·day · `year-month` = year·month · `time` = hour, as in the frame. */
export type DateWheelPickerType = 'date' | 'year-month' | 'time';

export interface DateWheelPickerProps
  extends Omit<WheelPickerProps, 'columns' | 'value' | 'onChange'> {
  /**
   * Which wheels to show: `date` is year · month · day, `year-month` drops the
   * day, and `time` is the hour wheel. @default 'date'
   */
  type?: DateWheelPickerType;
  /** The current date. Only the fields this `type` shows are read from it. */
  value: Date;
  /** Fires with a whole new `Date` — the untouched fields are carried over. */
  onChange?: (value: Date) => void;
  /** First year on the year wheel. @default value's year − 10 */
  fromYear?: number;
  /** Last year on the year wheel. @default value's year + 10 */
  toYear?: number;
  /** Formats the year label. Defaults to the plain number. */
  formatYear?: (year: number) => ReactNode;
  /** `month` is 0-indexed, matching `Date`. */
  formatMonth?: (month: number) => ReactNode;
  /** Formats the day label. Defaults to the plain number. */
  formatDay?: (day: number) => ReactNode;
  /** `hour` is 0–23. */
  formatHour?: (hour: number) => ReactNode;
}

const pad2 = (value: number) => String(value).padStart(2, '0');

const rangeOf = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index);

/** `09 AM`, the 12-hour label the frame uses. */
const defaultFormatHour = (hour: number) =>
  `${pad2(hour % 12 === 0 ? 12 : hour % 12)} ${hour < 12 ? 'AM' : 'PM'}`;

/**
 * `WheelPicker` wired to a `Date`. Labels are numeric by default — anything
 * language-specific is passed in through the `format*` props, the same way
 * `Calendar` and `DatePicker` take their `locale`.
 */
export function DateWheelPicker({
  type = 'date',
  value,
  onChange,
  fromYear,
  toYear,
  formatYear = String,
  formatMonth = (month) => pad2(month + 1),
  formatDay = pad2,
  formatHour = defaultFormatHour,
  ...rest
}: DateWheelPickerProps) {
  const year = value.getFullYear();
  const columns: WheelPickerColumn[] = [];

  if (type === 'date' || type === 'year-month') {
    columns.push({
      key: 'year',
      'aria-label': 'Year',
      options: rangeOf(fromYear ?? year - 10, toYear ?? year + 10).map((y) => ({
        value: String(y),
        label: formatYear(y),
      })),
    });
    columns.push({
      key: 'month',
      'aria-label': 'Month',
      options: rangeOf(0, 11).map((month) => ({
        value: String(month),
        label: formatMonth(month),
      })),
    });
  }

  if (type === 'date') {
    columns.push({
      key: 'day',
      'aria-label': 'Day',
      options: rangeOf(1, getDaysInMonth(value)).map((day) => ({
        value: String(day),
        label: formatDay(day),
      })),
    });
  }

  if (type === 'time') {
    columns.push({
      key: 'hour',
      'aria-label': 'Hour',
      options: rangeOf(0, 23).map((hour) => ({
        value: String(hour),
        label: formatHour(hour),
      })),
    });
  }

  const selection: Record<string, string> = {
    year: String(year),
    month: String(value.getMonth()),
    day: String(value.getDate()),
    hour: String(value.getHours()),
  };

  const handleChange = (next: Record<string, string>) => {
    let date = setYear(value, Number(next.year));
    date = setMonth(date, Number(next.month));
    // A shorter month has to pull the day back — 31 → 30 rather than spilling over.
    date = setDate(date, Math.min(Number(next.day), getDaysInMonth(date)));
    date = setHours(date, Number(next.hour));
    onChange?.(date);
  };

  return (
    <WheelPicker
      columns={columns}
      value={selection}
      onChange={handleChange}
      {...rest}
    />
  );
}
