'use client';

import { useId, type ReactNode } from 'react';
import { inputMessage, inputMessageId } from './InputFieldShell';

/*
  The one place a field decides how its label and its message reach assistive
  technology.

  Before this hook the decision was made once per component, and only two of the
  six field types made all of it: `InputTextarea`, `InputTag` and
  `InputFileUpload` rendered a message the control never pointed at, and
  `InputTextFormatting` had no id at all — so its `<label>` pointed nowhere and
  its message paragraph had no id to be pointed at. The markup looked right in
  every case; nothing but a screen reader could tell the difference (I-5).

  Deliberately not exported from the barrel: like `InputFieldShell`, this is an
  internal building block, not public API.
*/

export interface UseFieldA11yOptions {
  /**
   * The control's `id`. One is generated when omitted — a consumer-supplied id
   * is never overwritten, which is what keeps adopting this hook non-breaking.
   */
  id?: string;
  /** Only read to decide whether there is a label to point `aria-labelledby` at */
  label?: ReactNode;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  /** A describedby the consumer already set — appended to, never replaced */
  'aria-describedby'?: string;
  /** A labelledby the consumer already set — appended to, never replaced */
  'aria-labelledby'?: string;
  /**
   * Also name the control through `aria-labelledby`, not `<label for>` alone.
   *
   * Needed by roles that take no accessible name from their own content: Radix
   * renders `SelectTrigger` as `<button role="combobox">`, whose text is the
   * *value*, so `for` alone left the name falling back to the placeholder.
   * A native `<input>` / `<textarea>` is named by `for` and does not need it.
   */
  nameFromLabelId?: boolean;
}

export interface FieldA11y {
  fieldId: string;
  /** `undefined` when no message is on screen — nothing to describe the field with */
  messageId?: string;
  /** The message actually rendered: `error` while enabled, otherwise `helperText` */
  message?: string;
  isError: boolean;
  /** Spread on the control itself */
  fieldProps: {
    id: string;
    'aria-invalid': true | undefined;
    'aria-describedby': string | undefined;
    'aria-labelledby': string | undefined;
  };
  /** Spread on a `<label>` the component renders itself — `InputFieldShell` already does this */
  labelProps: {
    id: string | undefined;
    htmlFor: string;
  };
  /** Spread on a message element the component renders itself */
  messageProps: {
    id: string | undefined;
    role: 'alert' | undefined;
  };
}

export function useFieldA11y({
  id,
  label,
  error,
  helperText,
  disabled = false,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  nameFromLabelId = false,
}: UseFieldA11yOptions): FieldA11y {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  const message = inputMessage({ error, helperText, disabled });
  const isError = !!error && !disabled;
  const messageId = message ? inputMessageId(fieldId) : undefined;
  // Truthiness, not `!= null`: the label element is itself rendered under
  // `{label && …}`, and an id pointing at an element nobody rendered would name
  // the control with nothing at all.
  const labelId = nameFromLabelId && label ? `${fieldId}-label` : undefined;

  // Consumer ids come first in both lists: their hint or their label is the one
  // they wrote, and ours is the supplement.
  const join = (ids: (string | undefined)[]) =>
    ids.filter(Boolean).join(' ') || undefined;

  return {
    fieldId,
    messageId,
    message,
    isError,
    fieldProps: {
      id: fieldId,
      'aria-invalid': isError || undefined,
      'aria-describedby': join([ariaDescribedBy, messageId]),
      'aria-labelledby': join([ariaLabelledBy, labelId]),
    },
    labelProps: { id: labelId, htmlFor: fieldId },
    messageProps: { id: messageId, role: isError ? 'alert' : undefined },
  };
}
