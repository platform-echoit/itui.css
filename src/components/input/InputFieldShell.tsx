'use client';

import { type MouseEvent, type ReactNode, type Ref } from 'react';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind map (Figma node 27096:9849 `Input` · 28361:2330 `InputWithLabel`)
  ─────────────────────────────────────────────────────────────────────────────
  The frame every input variant is built from — label, bordered box, message.

  BOX  (height/input 48px → h-12 · spacing/md 12px → px-3 · spacing/xs 4px → gap-1
        radius/sm 8px → rounded-lg · stroke/xs 1px → border)
    surface/neutral/secondary/default #fafafa → bg-inverse
    border/neutral/subtle             #ededed → border-input     (--input)
    border/primary/default            #009ce0 → border-ring      (--ring, focus-within)
    border/semantic/error             #f44336 → border-destructive
    surface/neutral/disabled/default  #f5f5f5 → bg-surface-neutral-subtle
    border/neutral/disabled           #c2c2c2 → border-neutral-disabled

  TEXT
    typography/body/lg/regular 16/26/0.09 → text-base leading-lg tracking-lg
    text/neutral/default   #0f0f0f → text-foreground
    text/neutral/muted     #595858 → text-neutral-muted     (placeholder + icon slots)
    text/neutral/disabled  #c2c2c2 → text-neutral-disabled

  LABEL / HELPER / ERROR (spacing/sm 8px → gap-2)
    typography/body/md/medium  14/24/0.2 w500 → text-sm leading-md tracking-md font-medium
    typography/body/md/regular 14/24/0.2      → text-sm leading-md tracking-md
    text/semantic/error #f44336 → text-destructive

  Figma "State" is not a prop: `focused` = focus-within, `filled` = has value.
  Only `disabled` and `error` are real props.
  ─────────────────────────────────────────────────────────────────────────────
*/

export interface InputFieldShellProps {
  /** Rendering a label switches the Figma style from `Input` to `InputWithLabel` */
  label?: string;
  /** Error message — also flips the box to the error border */
  error?: string;
  /** Hint under the box; replaced by `error` when the field is invalid */
  helperText?: string;
  disabled?: boolean;
  /**
   * Stretch to the container width. `false` shrinks the frame to its content —
   * the shape the deprecated `Input` shipped with, kept so aliasing it here does
   * not silently widen every call-site.
   */
  block?: boolean;
  /** Extra classes on the outer wrapper (label + box + message) */
  className?: string;
  /** Extra classes on the bordered box */
  boxClassName?: string;
  /** id of the control the label points at */
  htmlFor?: string;
  /** Click anywhere on the box — used by InputTag to focus its inner field */
  onBoxClick?: (event: MouseEvent<HTMLDivElement>) => void;
  /**
   * Handle on the bordered box. `InputDate` / `InputDropdown` anchor their
   * popover to it so the panel hugs the box instead of the whole field
   * (which grows with the label and the error message).
   */
  boxRef?: Ref<HTMLDivElement>;
  /** Content of the box — the control itself plus any slots */
  children: ReactNode;
}

/**
 * Label + bordered box + message frame shared by every input variant.
 *
 * Not exported from the barrel on purpose: it is an internal building block for
 * the input family (`InputText`, `InputTextarea`, `InputTag`…), not a public
 * component. Consumers reach every variant through `InputV2`.
 */
export function InputFieldShell({
  label,
  error,
  helperText,
  disabled = false,
  block = true,
  className,
  boxClassName,
  htmlFor,
  onBoxClick,
  boxRef,
  children,
}: InputFieldShellProps) {
  const isError = !!error && !disabled;
  const message = inputMessage({ error, helperText, disabled });

  return (
    <div className={cn('flex flex-col gap-2', block && 'w-full', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="shrink-0 text-sm leading-md tracking-md font-medium text-foreground"
        >
          {label}
        </label>
      )}

      <div
        ref={boxRef}
        onClick={onBoxClick}
        className={cn(
          'flex items-center gap-1 h-12 px-3 rounded-lg border overflow-hidden',
          'transition-colors duration-150',
          disabled
            ? 'bg-surface-neutral-subtle border-neutral-disabled pointer-events-none'
            : isError
              ? 'bg-inverse border-destructive'
              : 'bg-inverse border-input focus-within:border-ring',
          boxClassName,
        )}
      >
        {children}
      </div>

      {message && (
        <p
          id={inputMessageId(htmlFor)}
          role={isError ? 'alert' : undefined}
          className={cn(
            'text-sm leading-md tracking-md',
            isError ? 'text-destructive' : 'text-neutral-muted',
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}

/**
 * The message actually rendered under the box: `error` wins while the field is
 * enabled, otherwise `helperText`. Exported so a control can ask the same
 * question the shell asks — a control must only point `aria-describedby` at the
 * message when one is on screen.
 */
export function inputMessage({
  error,
  helperText,
  disabled = false,
}: Pick<InputFieldShellProps, 'error' | 'helperText' | 'disabled'>) {
  return !!error && !disabled ? error : helperText;
}

/**
 * id of the message paragraph, derived from the control id so the shell and the
 * control agree without passing anything between them.
 */
export function inputMessageId(htmlFor?: string) {
  return htmlFor ? `${htmlFor}-message` : undefined;
}

/**
 * `[&_path]:fill-current` is required: ITUI icons hard-code `fill="#101010"`,
 * so without it a slot icon ignores the surrounding text color.
 */
export function inputSlotClass(disabled: boolean, className?: string) {
  return cn(
    'shrink-0 flex items-center [&_path]:fill-current',
    disabled ? 'text-neutral-disabled' : 'text-neutral-muted',
    className,
  );
}

/** Field classes, shared so `<input>` and `<textarea>` variants stay in sync. */
export function inputFieldClass(disabled: boolean, className?: string) {
  return cn(
    'flex-1 min-w-0 bg-transparent outline-none',
    'text-base leading-lg tracking-lg',
    disabled
      ? 'text-neutral-disabled placeholder:text-neutral-disabled cursor-not-allowed'
      : 'text-foreground placeholder:text-neutral-muted',
    className,
  );
}
