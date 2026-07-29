'use client';

import {
  forwardRef,
  useId,
  type ChangeEvent,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '../../lib/utils';
import { useControllableState } from '../../lib/use-controllable-state';
import { InputFieldShell, inputFieldClass } from './InputFieldShell';

/*
  Token → Tailwind map (Figma 27096:9852 `TextArea` · 28363:2455 `…WithLabel`)
  ─────────────────────────────────────────────────────────────────────────────
  Same shell as InputText with a taller, top-aligned box (a <textarea> instead of
  the single-line control is why this one composes InputFieldShell directly):
    content height 120px → min-h-30 (h-auto) · spacing/md 12px → p-3
    stacked so the counter can sit under the text → flex-col · spacing/xs 4px → gap-1
  COUNTER (`TextAreaWithCount`)
    typography/caption/sm/regular 12/20/0.3 → text-xs leading-sm tracking-sm
    text/neutral/muted   #595858 → text-neutral-muted
    text/semantic/error  #f44336 → text-destructive (over the limit)
  ─────────────────────────────────────────────────────────────────────────────
*/

export interface InputTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  /** Renders the character counter — the Figma `TextAreaWithCount` type */
  showCount?: boolean;
  /** Extra classes on the bordered box */
  boxClassName?: string;
  /** Extra classes on the native `<textarea>` */
  fieldClassName?: string;
}

const toText = (value: unknown) => (value == null ? '' : String(value));

/** The input family's multi-line field, with an optional character counter. */
export const InputTextarea = forwardRef<
  HTMLTextAreaElement,
  InputTextareaProps
>(
  (
    {
      label,
      error,
      helperText,
      showCount = false,
      disabled = false,
      rows = 3,
      maxLength,
      value,
      defaultValue,
      onChange,
      id,
      className,
      boxClassName,
      fieldClassName,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    // Only drives the counter, so uncontrolled usage can show one too.
    const [text, setText] = useControllableState({
      value: value === undefined ? undefined : toText(value),
      defaultValue: toText(defaultValue),
    });
    const isOverLimit = maxLength !== undefined && text.length > maxLength;

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setText(event.target.value);
      onChange?.(event);
    };

    return (
      <InputFieldShell
        label={label}
        error={error}
        helperText={helperText}
        disabled={disabled}
        className={className}
        boxClassName={cn(
          'h-auto min-h-30 flex-col items-stretch gap-1 p-3',
          boxClassName,
        )}
        htmlFor={textareaId}
      >
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={(!!error && !disabled) || undefined}
          className={inputFieldClass(
            disabled,
            cn('resize-none', fieldClassName),
          )}
          {...rest}
        />

        {showCount && (
          <span
            className={cn(
              'shrink-0 self-end text-xs leading-sm tracking-sm',
              isOverLimit ? 'text-destructive' : 'text-neutral-muted',
            )}
          >
            {maxLength === undefined
              ? text.length
              : `${text.length}/${maxLength}`}
          </span>
        )}
      </InputFieldShell>
    );
  },
);

InputTextarea.displayName = 'InputTextarea';
