'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import {
  InputFieldShell,
  inputFieldClass,
  inputSlotClass,
  type InputFieldShellProps,
} from './InputFieldShell';
import { useFieldA11y } from './useFieldA11y';

/*
  Figma node 27096:9849 `Input` · 28361:2330 `InputWithLabel`.
  Styling lives in InputFieldShell; this file only adds the single-line control
  and its two slots. Every other field type is this component plus behaviour.
*/

export interface InputTextProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  /** Text above the box — it is what names the field for assistive technology. */
  label?: string;
  /** Message under the box. It also paints the error border and sets `aria-invalid`. */
  error?: string;
  /** Hint under the box. `error` replaces it while the field is invalid. */
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

    return (
      <InputFieldShell
        label={label}
        error={error}
        helperText={helperText}
        disabled={disabled}
        block={block}
        className={className}
        boxClassName={boxClassName}
        htmlFor={fieldId}
        onBoxClick={onBoxClick}
        boxRef={boxRef}
      >
        {prefix && <span className={inputSlotClass(disabled)}>{prefix}</span>}

        <input
          ref={ref}
          {...fieldProps}
          disabled={disabled || disabledInput}
          className={inputFieldClass(disabled || disabledInput, fieldClassName)}
          {...rest}
        />

        {suffix && <span className={inputSlotClass(disabled)}>{suffix}</span>}
      </InputFieldShell>
    );
  },
);

InputText.displayName = 'InputText';
