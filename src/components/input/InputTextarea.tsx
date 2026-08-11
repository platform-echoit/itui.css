'use client';

import {
  forwardRef,
  type ChangeEvent,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '../../lib/utils';
import { useControllableState } from '../../lib/use-controllable-state';
import { InputFieldShell, inputFieldClass } from './InputFieldShell';
import { useFieldA11y } from './useFieldA11y';

/*
  Token → Tailwind map (Figma 27096:9852 `TextArea` · 28363:2455 `…WithLabel`)
  ─────────────────────────────────────────────────────────────────────────────
  Same shell as InputText with a taller, top-aligned box (a <textarea> instead of
  the single-line control is why this one composes InputFieldShell directly):
    content height 120px → min-h-30 (h-auto) · spacing/lg 16px → p-4
  COUNTER (`TextAreaWithCount`) — outside the border, under the box, right-aligned
    typography/caption/sm/regular 12/20/0.3 → text-xs leading-sm tracking-sm
    text/neutral/default #0f0f0f → text-foreground
    text/semantic/error  #f44336 → text-destructive (over the limit — ours, not
                                   a Figma state, and the only reason for `cn`)
    spacing/md 12px gap → the shell's own gap-2 plus mt-1
  ─────────────────────────────────────────────────────────────────────────────
*/

export interface InputTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Text above the box — it is what names the field for assistive technology. */
  label?: string;
  /** Message under the box. It also paints the error border and sets `aria-invalid`. */
  error?: string;
  /** Hint under the box. `error` replaces it while the field is invalid. */
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
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      ...rest
    },
    ref,
  ) => {
    const { fieldId, fieldProps } = useFieldA11y({
      id,
      error,
      helperText,
      disabled,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
    });

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
        boxClassName={cn('h-auto min-h-30 items-stretch p-4', boxClassName)}
        htmlFor={fieldId}
        footer={
          showCount && (
            <span
              // The shell's gap-2 plus mt-1 is the 12px Figma leaves here —
              // cheaper than giving the shell a second gap to reason about.
              className={cn(
                'mt-1 self-end text-xs leading-sm tracking-sm',
                isOverLimit ? 'text-destructive' : 'text-foreground',
              )}
            >
              {maxLength === undefined
                ? text.length
                : `${text.length}/${maxLength}`}
            </span>
          )
        }
      >
        <textarea
          ref={ref}
          {...fieldProps}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={inputFieldClass(
            disabled,
            cn('resize-none', fieldClassName),
          )}
          {...rest}
        />
      </InputFieldShell>
    );
  },
);

InputTextarea.displayName = 'InputTextarea';
