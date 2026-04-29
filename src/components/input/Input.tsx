'use client'

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string
  error?: string
  /** Slot rendered on the left — icon, text, or any ReactNode */
  prefix?: ReactNode
  /** Slot rendered on the right — icon, button, or any ReactNode */
  suffix?: ReactNode
  block?: boolean
  /** Extra classes applied to the native <input> element */
  fieldClassName?: string
  /** Disables only the <input> field; box styling and prefix/suffix remain interactive */
  disabledInput?: boolean
}

// ─── Input ────────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      prefix,
      suffix,
      block = false,
      disabled,
      disabledInput = false,
      id,
      className = '',
      fieldClassName = '',
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const isDisabled = !!disabled
    const isInputDisabled = isDisabled || disabledInput
    const isError = !!error && !isDisabled

    /*
      Token → class map:
        surface/neutral/secondary/default → bg-white
        border/neutral/subtle      #ededed → border-neutral-subtle   (@theme)
        border/primary/default     #009ce0 → border-brand            (@theme)
        border/neutral/disabled    #c2c2c2 → border-neutral-disabled (@theme)
        surface/neutral/disabled   #f5f5f5 → bg-neutral-100          (@theme)
        text/neutral/default       #0f0f0f → text-ink                (@theme)
        text/neutral/muted         #595858 → text-ink-muted          (@theme)
        text/neutral/disabled      #c2c2c2 → text-neutral-disabled   (@theme)
        border/semantic/error      #f44336 → border-red-500
        text/semantic/error        #f44336 → text-red-500
    */
    const boxClass = [
      'flex items-center gap-2 h-12 px-3 rounded-md border overflow-hidden',
      isDisabled
        ? 'bg-neutral-100 border-neutral-disabled pointer-events-none'
        : isError
          ? 'bg-white border-red-500'
          : 'bg-white border-neutral-subtle focus-within:border-brand',
    ].join(' ')

    return (
      <div
        className={['flex flex-col gap-2', block ? 'w-full' : '', className]
          .filter(Boolean)
          .join(' ')}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="shrink-0 text-sm font-medium leading-5 tracking-md text-ink"
          >
            {label}
          </label>
        )}

        <div className={boxClass}>
          {prefix && (
            <span className="shrink-0 flex items-center text-ink-muted" aria-hidden="true">
              {prefix}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={isInputDisabled}
            className={[
              'flex-1 min-w-0 bg-transparent outline-none',
              'text-base leading-6 tracking-lg',
              isDisabled
                ? 'bg-neutral-100 text-neutral-disabled placeholder:text-neutral-disabled cursor-not-allowed'
                : disabledInput
                  ? 'bg-transparent text-neutral-disabled placeholder:text-neutral-disabled cursor-not-allowed'
                  : 'bg-transparent text-ink placeholder:text-ink-muted',
              fieldClassName,
            ]
              .filter(Boolean)
              .join(' ')}
            {...rest}
          />

          {suffix && (
            <span className="shrink-0 flex items-center text-ink-muted" aria-hidden="true">
              {suffix}
            </span>
          )}
        </div>

        {isError && (
          <p className="text-sm font-normal leading-5 tracking-md text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
