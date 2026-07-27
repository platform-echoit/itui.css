import { isValidElement, type CSSProperties, type ReactNode } from 'react';
import {
  DayPicker,
  useDayPicker,
  type DateRange,
  type DayButtonProps,
  type DayPickerProps,
  type DayProps,
  type MonthCaptionProps,
} from '@daypicker/react';
import { format } from 'date-fns';
import type { Locale } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import {
  CaretDownRegularIcon,
  CaretLeftRegularIcon,
  CaretRightRegularIcon,
  CaretUpRegularIcon,
} from '../../icons/ITUI';
import {
  BaseDate,
  BaseDateButton,
  baseDateRangeEdgeFromModifiers,
  baseDateStateFromModifiers,
} from './BaseDate';
import { DateHeader } from './DateHeader';
import { DateFooter, type DateFooterAlignment } from './DateFooter';

/*
  Token → Tailwind class reference
  (Figma 27729:651 DateRange · 27733:2626 SingleDate · 27729:706 RangePicker)
  ─────────────────────────────────────────────────────────────────────────────
  CARD
  surface/neutral/secondary/default #fafafa → bg-inverse
  border/neutral/subtle        #ededed  → border-border-neutral-subtle
  radius/md                    12px     → rounded-xl
  shadow/downwards/sm                   → shadow-downwards-sm
  size/container/md            358px    → w-calendar-md   (one month)
  RangePicker frame            624px    → w-calendar-xl   (two months)
  RangePicker month panel      312px    → the two panels split the card (flex-1)

  MONTH PANEL
  spacing/lg                   16px     → p-4
  spacing/sm                   8px      → gap-2 (caption ↔ weekdays ↔ week rows)
  height/date-picker           36px     → h-9 (weekday cells, handled by BaseDate for days)

  WEEKDAY HEADER — the frame builds these from Base Date instances, using its red
  variant for 일 and its blue one for 토. A plain `th` with the same typography and
  height renders identically, so the weekday row is styled through `classNames`:
  text/neutral/muted           #595858  → text-neutral-muted
  color/semantic/red/500       #f44336  → first:text-destructive  (일)
  text/primary/default         #009ce0  → last:text-primary       (토)

  DROPDOWN CAPTION (Date Header `Dropdown` variant) — DayPicker's own dropdown is
  reused, so the year/month controls stay real `<select>` elements: the native
  select is laid transparently over the label, which carries the design's styling.
  spacing/sm 8px → gap-2 (year ↔ month) · spacing/xs 4px → gap-1 (label ↔ caret)

  DEVIATIONS FROM THE FRAME
  · Day cells are `flex-1` instead of a fixed 36px, so a range band never breaks
    across the gaps the frame has to cover with an absolutely positioned bar.
  · Day numbers are never tinted by weekday — the frames colour 일/토 in the header
    row only, and leave every day number `text/neutral/default`.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

export type DatePickerProps = DayPickerProps & {
  /** Renders the confirm button; omit it and no confirm button appears. */
  confirmText?: ReactNode;
  /** Renders the cancel button; omit it and no cancel button appears. */
  cancelText?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmDisabled?: boolean;
  /** @default 'right' for two months (PC), `center` otherwise (mobile) */
  footerAlignment?: DateFooterAlignment;
  /** Left slot of the inline footer. Defaults to the selected range, formatted. */
  summary?: ReactNode;
  formatRangeSummary?: (range: DateRange) => ReactNode;
};

// ─── DayPicker parts ──────────────────────────────────────────────────────────
// Defined at module scope: DayPicker remounts a custom component whenever its
// identity changes, which would drop focus out of the caption's <select>.

function DateChevron({
  orientation,
  className,
  style,
}: {
  orientation?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  style?: CSSProperties;
}) {
  const Icon =
    orientation === 'up'
      ? CaretUpRegularIcon
      : orientation === 'left'
        ? CaretLeftRegularIcon
        : orientation === 'right'
          ? CaretRightRegularIcon
          : CaretDownRegularIcon;
  // Only className/style are forwarded — `size`/`disabled` are not SVG attributes.
  return <Icon width={16} height={16} className={className} style={style} />;
}

/** The month caption row — `DateHeader` driven by DayPicker's navigation. */
function DatePickerCaption({
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

/**
 * `children` is DayPicker's `DayButton` while a selection mode is set, and the
 * bare day number otherwise — so the read-only branch supplies its own cell.
 */
function DatePickerDay({
  day: _day,
  modifiers,
  className,
  children,
  ...rest
}: DayProps) {
  return (
    <td className={className} {...rest}>
      {isValidElement(children) ? (
        children
      ) : (
        <BaseDate
          state={baseDateStateFromModifiers(modifiers)}
          rangeEdge={baseDateRangeEdgeFromModifiers(modifiers)}
        >
          {children}
        </BaseDate>
      )}
    </td>
  );
}

function DatePickerDayButton({
  day: _day,
  modifiers,
  children,
  ...rest
}: DayButtonProps) {
  return (
    <BaseDateButton
      state={baseDateStateFromModifiers(modifiers)}
      rangeEdge={baseDateRangeEdgeFromModifiers(modifiers)}
      {...rest}
    >
      {children}
    </BaseDateButton>
  );
}

// ─── Range summary ────────────────────────────────────────────────────────────

/** `PPP` renders `2026년 1월 26일` under `ko`, which is the format in the design. */
function formatRange(range: DateRange, locale?: Locale): string {
  if (!range.from) return '';
  const from = format(range.from, 'PPP', { locale });
  const to = range.to ? format(range.to, 'PPP', { locale }) : undefined;
  return to ? `${from} - ${to}` : from;
}

// ─── DatePicker ───────────────────────────────────────────────────────────────

/**
 * The date picker card: `DateHeader` + the month grid of `BaseDate` cells +
 * an optional `DateFooter`.
 *
 * Every DayPicker prop (`mode`, `selected`, `numberOfMonths`, `locale`,
 * `disabled`, `modifiers`…) is forwarded as-is. Pass `numberOfMonths={2}` for the
 * two-month range card, and `captionLayout="dropdown"` for the year/month
 * dropdown caption.
 */
export function DatePicker(props: DatePickerProps) {
  const {
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    confirmDisabled,
    footerAlignment,
    summary,
    formatRangeSummary,
    className,
    classNames,
    components,
    numberOfMonths = 1,
    showOutsideDays = true,
    captionLayout,
    startMonth,
    endMonth,
    ...rest
  } = props;

  // `props` (not `rest`) keeps the discriminated union, so `selected` narrows.
  const selectedRange = props.mode === 'range' ? props.selected : undefined;

  const isDropdown = captionLayout?.startsWith('dropdown') ?? false;
  // DayPicker needs a navigation range to build the year options; without one the
  // year dropdown would render empty.
  const currentYear = new Date().getFullYear();
  const resolvedStartMonth =
    startMonth ?? (isDropdown ? new Date(currentYear - 10, 0) : undefined);
  const resolvedEndMonth =
    endMonth ?? (isDropdown ? new Date(currentYear + 10, 11) : undefined);

  const alignment: DateFooterAlignment =
    footerAlignment ?? (numberOfMonths > 1 ? 'right' : 'center');

  const resolvedSummary =
    summary ??
    (selectedRange?.from && alignment === 'right'
      ? (formatRangeSummary?.(selectedRange) ??
        // DayPicker locales are date-fns locales extended with `labels`.
        formatRange(selectedRange, props.locale as Locale | undefined))
      : undefined);

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-border-neutral-subtle bg-inverse',
        'font-sans text-foreground shadow-downwards-sm',
        numberOfMonths > 1 ? 'w-calendar-xl' : 'w-calendar-md',
        className,
      )}
    >
      <DayPicker
        hideNavigation
        numberOfMonths={numberOfMonths}
        showOutsideDays={showOutsideDays}
        captionLayout={captionLayout}
        startMonth={resolvedStartMonth}
        endMonth={resolvedEndMonth}
        classNames={{
          root: 'w-full',
          months: 'flex',
          // Panels split the card evenly; the divider is the second panel's border.
          month:
            'flex flex-1 basis-0 flex-col items-center gap-2 border-l border-border-neutral-subtle p-4 first:border-l-0',

          // Flex, not table layout, so the 8px row gap from the design applies.
          month_grid: 'flex w-full flex-col gap-2',
          weekdays: 'flex items-center',
          weekday:
            'flex h-9 flex-1 basis-0 items-center justify-center text-sm font-normal leading-md tracking-md text-neutral-muted first:text-destructive last:text-primary',
          weeks: 'flex flex-col gap-2',
          week: 'flex items-center',
          day: 'flex min-w-0 flex-1 basis-0',

          // Dropdown caption: the native select sits transparently over the label.
          dropdowns: 'flex items-center gap-2',
          dropdown_root: 'relative flex items-center',
          dropdown: 'absolute inset-0 cursor-pointer opacity-0',
          caption_label:
            'flex items-center gap-1 whitespace-nowrap text-sm font-medium leading-md tracking-md text-foreground',

          hidden: 'invisible',
          ...classNames,
        }}
        components={{
          Chevron: DateChevron,
          MonthCaption: DatePickerCaption,
          Day: DatePickerDay,
          DayButton: DatePickerDayButton,
          ...components,
        }}
        {...rest}
      />

      {(confirmText != null || cancelText != null) && (
        <DateFooter
          alignment={alignment}
          confirmText={confirmText}
          cancelText={cancelText}
          onConfirm={onConfirm}
          onCancel={onCancel}
          confirmDisabled={confirmDisabled}
        >
          {resolvedSummary}
        </DateFooter>
      )}
    </div>
  );
}
