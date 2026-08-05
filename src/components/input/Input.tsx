'use client';

import { forwardRef } from 'react';
import { InputText, type InputTextProps } from './InputText';

export type InputProps = InputTextProps;

/**
 * The original single-line field, now a thin alias over `InputText`.
 *
 * It used to carry its own copy of the markup, which had drifted from the rest
 * of the family: hard-coded `bg-white` instead of the `bg-inverse` token, and
 * `fieldClassName` appended rather than merged. Only the default width still
 * differs — `Input` shrinks to its content, `InputText` fills the container —
 * so pass `block` to pick explicitly.
 *
 * @deprecated Use `InputText`, or `<InputV2 />` with no `variant`.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ block = false, ...rest }, ref) => (
    <InputText ref={ref} block={block} {...rest} />
  ),
);

Input.displayName = 'Input';
