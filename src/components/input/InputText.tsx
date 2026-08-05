'use client';

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import {
  InputFieldShell,
  inputFieldClass,
  inputMessage,
  inputMessageId,
  inputSlotClass,
  type InputFieldShellProps,
} from './InputFieldShell';

/*
  Figma node 27096:9849 `Input` · 28361:2330 `InputWithLabel`.
  Styling lives in InputFieldShell; this file only adds the single-line control
  and its two slots. Every other field type is this component plus behaviour.
*/

export interface InputTextProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  helperText?: string;
  /** Slot rendered on the left of the field — icon, text, or any ReactNode */
  prefix?: ReactNode;
  /** Slot rendered on the right of the field — icon, button, or any ReactNode */
  suffix?: ReactNode;
  /** Stretch to the container width — see `InputFieldShellProps.block` */
  block?: boolean;
  /** Disables only the `<input>`; the box and its slots stay interactive */
  disabledInput?: boolean;
  /** Extra classes applied to the native `<input>` */
  fieldClassName?: string;
  /** Extra classes applied to the bordered box */
  boxClassName?: string;
  /** Click anywhere on the box — note that clicks on the field bubble here too */
  onBoxClick?: InputFieldShellProps['onBoxClick'];
  /** Handle on the bordered box — see `InputFieldShellProps.boxRef` */
  boxRef?: InputFieldShellProps['boxRef'];
}

/** The plain single-line field — `<InputV2 />` with no `fieldType`. */
export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  (
    {
      label,
      error,
      helperText,
      prefix,
      suffix,
      disabled = false,
      disabledInput = false,
      block = true,
      id,
      className,
      fieldClassName,
      boxClassName,
      onBoxClick,
      boxRef,
      'aria-describedby': ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const isError = !!error && !disabled;

    // The message is only reachable by a screen reader if the field points at
    // it. Appended rather than replacing, so a consumer's own hint id survives.
    const describedBy =
      [
        ariaDescribedBy,
        inputMessage({ error, helperText, disabled })
          ? inputMessageId(inputId)
          : null,
      ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <InputFieldShell
        label={label}
        error={error}
        helperText={helperText}
        disabled={disabled}
        block={block}
        className={className}
        boxClassName={boxClassName}
        htmlFor={inputId}
        onBoxClick={onBoxClick}
        boxRef={boxRef}
      >
        {prefix && <span className={inputSlotClass(disabled)}>{prefix}</span>}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled || disabledInput}
          aria-invalid={isError || undefined}
          aria-describedby={describedBy}
          className={inputFieldClass(disabled || disabledInput, fieldClassName)}
          {...rest}
        />

        {suffix && <span className={inputSlotClass(disabled)}>{suffix}</span>}
      </InputFieldShell>
    );
  },
);

InputText.displayName = 'InputText';
