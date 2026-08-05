'use client';

import { forwardRef, useState, type ChangeEvent, type FocusEvent } from 'react';
import { useControllableState } from '../../lib/use-controllable-state';
import { InputText, type InputTextProps } from './InputText';

/*
  Token → Tailwind map (Figma node 28964:9695 `PhoneNumber` · 27096:9853 `…WithLabel`)
  ─────────────────────────────────────────────────────────────────────────────
  Visually identical to InputText — the type only adds a digit mask and KR mobile
  validation. Figma renders the value unmasked (`01012345678`), hence format='raw'
  by default; `dashed` is opt-in.
  ─────────────────────────────────────────────────────────────────────────────
*/

/** KR mobile numbers: 010/011/016/017/018/019 + 7~8 digits. */
const KR_MOBILE_PATTERN = /^01[016789]\d{7,8}$/;
const MAX_DIGITS = 11;

const toDigits = (text: string) => text.replace(/\D/g, '').slice(0, MAX_DIGITS);

/** `010-1234-5678` for 11 digits, `010-123-4567` for the older 10-digit numbers. */
function formatDashed(digits: string) {
  if (digits.length <= 3) return digits;
  const middle = digits.length > 10 ? 4 : 3;
  if (digits.length <= 3 + middle)
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 3 + middle)}-${digits.slice(3 + middle)}`;
}

export interface InputPhoneNumberProps
  extends Omit<InputTextProps, 'value' | 'defaultValue' | 'type'> {
  /** Digits only, no separators — e.g. `01012345678` */
  value?: string;
  defaultValue?: string;
  /** Receives the digits only, whatever `format` is displayed */
  onValueChange?: (digits: string) => void;
  format?: 'raw' | 'dashed';
  /** Shown on blur when the value is not a valid KR mobile number */
  invalidMessage?: string;
}

/** `InputText` restricted to a KR mobile number, validated on blur. */
export const InputPhoneNumber = forwardRef<
  HTMLInputElement,
  InputPhoneNumberProps
>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      onChange,
      onBlur,
      format = 'raw',
      error,
      invalidMessage = 'Please enter a valid mobile number.',
      ...rest
    },
    ref,
  ) => {
    const [digits, setDigits] = useControllableState({
      value: value === undefined ? undefined : toDigits(value),
      defaultValue: toDigits(defaultValue ?? ''),
      onChange: onValueChange,
    });
    const [isInvalid, setIsInvalid] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setDigits(toDigits(event.target.value));
      // Typing again means the user is fixing the number — drop the stale error.
      if (isInvalid) setIsInvalid(false);
      onChange?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      setIsInvalid(digits.length > 0 && !KR_MOBILE_PATTERN.test(digits));
      onBlur?.(event);
    };

    return (
      <InputText
        ref={ref}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        // Dashes take 2 extra characters at 11 digits.
        maxLength={format === 'dashed' ? MAX_DIGITS + 2 : MAX_DIGITS}
        value={format === 'dashed' ? formatDashed(digits) : digits}
        onChange={handleChange}
        onBlur={handleBlur}
        // A caller-provided error always wins over the built-in validation.
        error={error ?? (isInvalid ? invalidMessage : undefined)}
        {...rest}
      />
    );
  },
);

InputPhoneNumber.displayName = 'InputPhoneNumber';
