'use client';

import { isValidElement } from 'react';
import {
  DayPicker,
  useDayPicker,
  type DayButtonProps,
  type DayPickerProps,
  type DayProps,
  type MonthCaptionProps,
} from '@daypicker/react';
import { cn } from '../../lib/utils';
import {
  BaseDate,
  BaseDateButton,
  baseDateRangeEdgeFromModifiers,
  baseDateStateFromModifiers,
} from './BaseDate';
import { DateHeader } from './DateHeader';

/*
  Token → Tailwind class reference (Figma node 27735:4206)
  ─────────────────────────────────────────────────────────────────────────────
  CONTAINER
  surface/neutral/secondary/default  #fafafa  → bg-inverse
  border/neutral/subtle              #ededed  → border-border-neutral-subtle
                                                 (NOT `border-neutral-subtle`, which is #9e9e9e)
  typography/family/body             Pretendard → font-sans
  radius/md                          12px     → rounded-xl
  shadow/downwards/sm                         → shadow-downwards-sm (size md only)
  size/container/lg                  480px    → w-calendar-lg (--width-calendar-lg)
  size/container/md                  358px    → w-calendar-md (--width-calendar-md)
  spacing/xl                         20px     → px-5 pt-5
  spacing/sm                         8px      → gap-2 (caption/weekday/week rows) · py-2
  scale/12                           12px     → pb-3 (week row bottom padding)

  Columns are `flex-1 basis-0` rather than the design's fixed 53px (PC) / 36px (Mobile):
  both distribute the 7 columns edge to edge, but equal flex columns also hold up when the
  consumer overrides the width.

  DATE CELL & NAV BUTTON — see `BaseDate` and `DateHeader`, which own those two
  pieces for the whole calendar family. The header is stretched to the full width
  here (the design puts its arrows at the container edges), instead of the 280px
  it keeps inside `DatePicker`.

  TEXT COLORS
  text/neutral/muted                 #595858  → text-neutral-muted     (weekday)
  color/semantic/red/500             #f44336  → text-destructive       (일 header)
  text/primary/default               #009ce0  → text-primary           (토 header)

  EVENT BADGE (size lg) — height/label/sm 24px → h-6 · radius/xs 4px → rounded-sm
  primary  surface/primary/muted        #b0e0f5    → bg-surface-primary-muted text-primary
  success  color/semantic/green/600@30  #459f494d  → bg-surface-success-muted text-success
  error    color/semantic/red/600@30    #de3d314d  → bg-surface-error-muted   text-destructive

  EVENT MARKER (size md) — 4px dot → size-1 rounded-full, same tones as bg-*

  TYPOGRAPHY
  body/md/regular     14px 400 leading-24 0.20px → text-sm font-normal leading-md tracking-md
  body/md/medium      14px 500 leading-24 0.20px → text-sm font-medium leading-md tracking-md
  caption/sm/regular  12px 400 leading-20 0.30px → text-xs font-normal leading-sm tracking-sm
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

/** `lg` matches the Figma PC frame (480px, event badges); `md` the Mobile one (358px, dot markers). */
export type CalendarSize = 'md' | 'lg';

export type CalendarEventTone = 'primary' | 'success' | 'error';

/** One thing happening on a day, drawn as a badge at size `lg` and as a dot at `md`. */
export interface CalendarEvent {
  /** Badge text at size `lg`. Size `md` draws a coloured dot only, so the label is not shown. */
  label: string;
  /** Which semantic colour the badge or dot takes. @default 'primary' */
  tone?: CalendarEventTone;
}

/** Events keyed by local date in `yyyy-MM-dd` form, e.g. `{ '2026-01-03': [...] }`. */
export type CalendarEvents = Record<string, CalendarEvent[]>;

export type CalendarProps = DayPickerProps & {
  /** `lg` is the desktop grid with event badges; `md` the compact one with dots. */
  size?: CalendarSize;
  /** What happens on which day, keyed by `yyyy-MM-dd`. */
  events?: CalendarEvents;
  /** Badges rendered per day before the rest collapse into a `+N` row (size `lg` only). */
  maxVisibleEvents?: number;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const eventToneBadge: Record<CalendarEventTone, string> = {
  primary: 'bg-surface-primary-muted text-primary',
  success: 'bg-surface-success-muted text-success',
  error: 'bg-surface-error-muted text-destructive',
};

const eventToneMarker: Record<CalendarEventTone, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  error: 'bg-destructive',
};

/** Local `yyyy-MM-dd` key — `toISOString()` would shift the day for negative UTC offsets. */
function toDateKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Dot row under the day number — the `md` stand-in for the `lg` event badges. */
function eventMarkers(events?: CalendarEvent[]) {
  if (!events?.length) return undefined;

  return events.map((event, index) => (
    <span
      key={index}
      className={cn('size-1 rounded-full', eventToneMarker[event.tone ?? 'primary'])}
    />
  ));
}

// ─── DayPicker parts ──────────────────────────────────────────────────────────
// Module scope, so DayPicker does not remount them on every render.

/** Full-width month caption: previous · `2026년 1월` · next. */
function CalendarCaption({
  calendarMonth: _calendarMonth,
  displayIndex: _displayIndex,
  children,
  ...rest
}: MonthCaptionProps) {
  const { goToMonth, previousMonth, nextMonth } = useDayPicker();

  return (
    <DateHeader
      onPrevious={() => previousMonth && goToMonth(previousMonth)}
      onNext={() => nextMonth && goToMonth(nextMonth)}
      previousDisabled={!previousMonth}
      nextDisabled={!nextMonth}
      {...rest}
    >
      {children}
    </DateHeader>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

/**
 * Month calendar built on DayPicker. Every DayPicker prop (`mode`, `selected`,
 * `month`, `locale`, `disabled`, `modifiers`…) is forwarded as-is, and the
 * `holiday` modifier is pre-styled — `modifiers={{ holiday: [...] }}` paints
 * those dates red, as in the design.
 *
 * DayPicker owns its root element and accepts no `ref`, so — unlike the other
 * components in this package — Calendar is a plain function component.
 */
export function Calendar({
  size = 'lg',
  events,
  maxVisibleEvents = 1,
  className,
  classNames,
  components,
  showOutsideDays = true,
  ...rest
}: CalendarProps) {
  const isCompact = size === 'md';

  return (
    <DayPicker
      hideNavigation
      showOutsideDays={showOutsideDays}
      className={cn(
        'overflow-hidden rounded-xl border border-border-neutral-subtle bg-inverse px-5 pt-5',
        // Default font + day colour live here so per-day modifier classes can override them.
        'font-sans text-foreground',
        isCompact ? 'w-calendar-md shadow-downwards-sm' : 'w-calendar-lg',
        className,
      )}
      classNames={{
        months: 'flex flex-col',
        month: 'flex flex-col gap-2',
        // Stretches DateHeader past its 280px default, so the arrows sit at the edges.
        month_caption: 'w-full',

        // Flex, not table layout, so the uniform 8px row gap from the design applies.
        month_grid: 'flex w-full flex-col gap-2',

        // Weekday header — 일 red, 토 primary, the rest muted (Sunday-first weeks).
        weekdays: 'flex items-center',
        weekday:
          'flex h-9 flex-1 basis-0 items-center justify-center text-sm font-normal leading-md tracking-md text-neutral-muted first:text-destructive last:text-primary',

        weeks: 'flex flex-col gap-2',
        week: 'flex items-start border-b border-border-neutral-subtle pb-3 last:border-b-0',
        day: 'flex min-w-0 flex-1 basis-0 flex-col items-center gap-2',

        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        MonthCaption: CalendarCaption,
        Day: (dayProps) => (
          <CalendarDay
            {...dayProps}
            size={size}
            events={events?.[toDateKey(dayProps.day.date)]}
            maxVisibleEvents={maxVisibleEvents}
          />
        ),
        DayButton: (dayButtonProps) => (
          <CalendarDayButton
            {...dayButtonProps}
            size={size}
            events={events?.[toDateKey(dayButtonProps.day.date)]}
          />
        ),
        ...components,
      }}
      {...rest}
    />
  );
}

// ─── Day parts ────────────────────────────────────────────────────────────────

type CalendarDayProps = DayProps & {
  size: CalendarSize;
  events?: CalendarEvent[];
  maxVisibleEvents: number;
};

/**
 * The day cell: the date on top, its `lg` event badges stacked underneath.
 *
 * `children` is DayPicker's `DayButton` while the calendar is interactive, and
 * the bare day number otherwise — so the read-only branch supplies its own
 * `BaseDate`, which is where the whole event layer would be lost if it lived in
 * `DayButton` alone.
 */
function CalendarDay({
  size,
  events,
  maxVisibleEvents,
  day: _day,
  modifiers,
  className,
  children,
  ...rest
}: CalendarDayProps) {
  const isCompact = size === 'md';
  const visibleEvents = isCompact
    ? []
    : (events?.slice(0, maxVisibleEvents) ?? []);
  const hiddenCount = isCompact
    ? 0
    : Math.max((events?.length ?? 0) - maxVisibleEvents, 0);

  return (
    <td className={className} {...rest}>
      {isValidElement(children) ? (
        children
      ) : (
        <BaseDate
          state={baseDateStateFromModifiers(modifiers)}
          rangeEdge={baseDateRangeEdgeFromModifiers(modifiers)}
          marker={
            isCompact && !modifiers.hidden ? eventMarkers(events) : undefined
          }
        >
          {children}
        </BaseDate>
      )}

      {visibleEvents.map((event, index) => (
        <span
          key={index}
          className={cn(
            'flex h-6 max-w-full items-center justify-center rounded-sm px-2',
            'truncate text-sm font-medium leading-md tracking-md',
            eventToneBadge[event.tone ?? 'primary'],
          )}
        >
          {event.label}
        </span>
      ))}

      {hiddenCount > 0 && (
        <span className="text-xs font-normal leading-sm tracking-sm text-primary">
          +{hiddenCount}
        </span>
      )}
    </td>
  );
}

type CalendarDayButtonProps = DayButtonProps & {
  size: CalendarSize;
  events?: CalendarEvent[];
};

/** The date circle as a focusable button, used whenever a selection mode is set. */
function CalendarDayButton({
  size,
  events,
  day: _day,
  modifiers,
  children,
  ...rest
}: CalendarDayButtonProps) {
  return (
    <BaseDateButton
      state={baseDateStateFromModifiers(modifiers)}
      rangeEdge={baseDateRangeEdgeFromModifiers(modifiers)}
      marker={size === 'md' ? eventMarkers(events) : undefined}
      {...rest}
    >
      {children}
    </BaseDateButton>
  );
}
