'use client';

import { forwardRef, type ReactNode } from 'react';
import { Button, type ButtonProps } from '../button/Button';
import { InputText, type InputTextProps } from './InputText';

/*
  Token → Tailwind map (Figma node 28964:9802 `WithButton` · 27096:9857 `…WithLabel`)
  ─────────────────────────────────────────────────────────────────────────────
  InputText box with a trailing action:
    height/button/sm 32px → Button size="sm"   (fits inside the 48px box)
    surface/primary/default #009ce0 → Button variant="primary"
  The box keeps the shell's uniform spacing/md 12px padding — Figma does not
  tighten the right edge for this type.
  Disabled is inherited: the shell sets pointer-events-none, and the button gets
  the same `disabled` so it also renders its disabled colors.
  ─────────────────────────────────────────────────────────────────────────────
*/

export interface InputWithButtonProps extends Omit<InputTextProps, 'suffix'> {
  /** Text on the trailing button. */
  buttonLabel: ReactNode;
  /** Runs on the trailing button. The field's own value is not passed — read it yourself. */
  onButtonClick?: () => void;
  /** Disables only the button — the field stays editable */
  buttonDisabled?: boolean;
  /** Escape hatch for variant/size/icons on the trailing button */
  buttonProps?: Omit<ButtonProps, 'children' | 'onClick' | 'disabled'>;
}

/** `InputText` with a trailing action button inside the box. */
export const InputWithButton = forwardRef<
  HTMLInputElement,
  InputWithButtonProps
>(
  (
    {
      buttonLabel,
      onButtonClick,
      buttonDisabled = false,
      buttonProps,
      disabled = false,
      ...rest
    },
    ref,
  ) => (
    <InputText
      ref={ref}
      disabled={disabled}
      suffix={
        <Button
          size="sm"
          variant="primary"
          disabled={disabled || buttonDisabled}
          onClick={onButtonClick}
          {...buttonProps}
        >
          {buttonLabel}
        </Button>
      }
      {...rest}
    />
  ),
);

InputWithButton.displayName = 'InputWithButton';
