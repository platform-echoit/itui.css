'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type FocusEvent,
} from 'react';
import { format, isValid, parse } from 'date-fns';
import type { Matcher } from '@daypicker/react';
import { useForwardedRef } from '../../lib/use-forwarded-ref';
import { CalendarBlankRegularIcon } from '../../icons/ITUI/calendar-blank';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '../popover/Popover';
import { DatePicker } from '../calendar/DatePicker';
import { InputText, type InputTextProps } from './InputText';

/*
  Token → Tailwind map (Figma node 27832:1496 `Date` · 28964:9382 `DateWithLabel`)
  ─────────────────────────────────────────────────────────────────────────────
  Field: InputText as-is. Trailing calendar affordance:
    icon/neutral/muted #595858 → text-neutral-muted (from the InputText slot)
    height/icon/lg 20px → size-5
  Panel: the existing DatePicker card, which already carries
    radius/md 12px → rounded-xl · shadow/downwards/sm · size/container/md 358px,
  so PopoverContent drops its own surface (border/bg/shadow) and only positions.
  The panel is anchored to the box (see boxRef) — anchoring to the whole field
  would push the calendar below the label and the error message.
  ─────────────────────────────────────────────────────────────────────────────
*/

/** Figma renders dates as `2026.01.10`. */
const DATE_PATTERN = 'yyyy.MM.dd';
const MASK_LENGTH = 10;

/** Digits only, dots injected after the year and the month. */
function maskDate(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
}

function parseDate(text: string): Date | null {
  if (text.length !== MASK_LENGTH) return null;
  const parsed = parse(text, DATE_PATTERN, new Date());
  return isValid(parsed) ? parsed : null;
}

const sameDay = (a: Date | null, b: Date | null) =>
  (a?.getTime() ?? null) === (b?.getTime() ?? null);

export interface InputDateProps
  extends Omit<
    InputTextProps,
    'value' | 'defaultValue' | 'type' | 'suffix' | 'onChange' | 'min' | 'max'
  > {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  /** Earliest selectable date — earlier dates are disabled and rejected */
  min?: Date;
  /** Latest selectable date */
  max?: Date;
  /** Shown when the typed text is not a date in range */
  invalidMessage?: string;
  /** Accessible name of the calendar button */
  calendarLabel?: string;
  /** Pass-through for the popover calendar (locale, formatters…) */
  calendarProps?: Partial<
    Omit<
      ComponentProps<typeof DatePicker>,
      'mode' | 'selected' | 'onSelect' | 'disabled'
    >
  >;
}

/** `InputText` with a `YYYY.MM.DD` mask and a `DatePicker` popover. */
export const InputDate = forwardRef<HTMLInputElement, InputDateProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      error,
      invalidMessage = 'Please enter a valid date.',
      calendarLabel = 'Choose date',
      calendarProps,
      disabled = false,
      placeholder = 'YYYY.MM.DD',
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const [inputRef, setInputRef] = useForwardedRef(ref);
    const boxRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState(() => {
      const initial = value ?? defaultValue;
      return initial ? format(initial, DATE_PATTERN) : '';
    });
    const [isInvalid, setIsInvalid] = useState(false);

    const isControlled = value !== undefined;

    const inRange = useCallback(
      (date: Date) =>
        (!min || date.getTime() >= min.getTime()) &&
        (!max || date.getTime() <= max.getTime()),
      [min, max],
    );

    // Only overwrite what the user typed when the incoming date really differs —
    // otherwise a half-typed `2026.01.1` (which parses to null) would be wiped.
    useEffect(() => {
      if (!isControlled) return;
      const incoming = value ?? null;
      setText((current) =>
        sameDay(parseDate(current), incoming)
          ? current
          : incoming
            ? format(incoming, DATE_PATTERN)
            : '',
      );
    }, [isControlled, value]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const masked = maskDate(event.target.value);
      setText(masked);

      const parsed = parseDate(masked);
      const next = parsed && inRange(parsed) ? parsed : null;
      // A complete but unparseable date is wrong right away; anything shorter is
      // still being typed, so it only fails on blur.
      setIsInvalid(masked.length === MASK_LENGTH && !next);
      onValueChange?.(next);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      const parsed = parseDate(text);
      setIsInvalid(text.length > 0 && !(parsed && inRange(parsed)));
      onBlur?.(event);
    };

    const handleSelect = (date: Date | undefined) => {
      if (!date) return;
      setText(format(date, DATE_PATTERN));
      setIsInvalid(false);
      onValueChange?.(date);
      setOpen(false);
      inputRef.current?.focus();
    };

    // Disable everything outside [min, max] — two matchers, not one interval.
    const disabledDays: Matcher[] = [];
    if (min) disabledDays.push({ before: min });
    if (max) disabledDays.push({ after: max });

    const selected = parseDate(text) ?? undefined;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        {/* virtualRef: positions against the box without rendering a wrapper. */}
        <PopoverAnchor virtualRef={boxRef} />

        <InputText
          ref={setInputRef}
          boxRef={boxRef}
          inputMode="numeric"
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          onBlur={handleBlur}
          error={error ?? (isInvalid ? invalidMessage : undefined)}
          suffix={
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={calendarLabel}
                disabled={disabled}
                className="flex size-5 cursor-pointer items-center justify-center"
              >
                <CalendarBlankRegularIcon width={20} height={20} />
              </button>
            </PopoverTrigger>
          }
          {...rest}
        />

        <PopoverContent
          align="start"
          className="w-auto border-0 bg-transparent p-0 shadow-none"
        >
          <DatePicker
            {...calendarProps}
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            defaultMonth={selected}
            disabled={disabledDays.length > 0 ? disabledDays : undefined}
          />
        </PopoverContent>
      </Popover>
    );
  },
);

InputDate.displayName = 'InputDate';
