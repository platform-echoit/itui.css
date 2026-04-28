'use client'

import { forwardRef, useId, useRef, useState, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { Button } from '../button'
import { Spinner } from '../spinner'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Renders a label above the input (Style=InputWithLabel) */
  label?: string
  /** Error message below the input; activates error border */
  error?: string
  /** Leading icon slot (e.g. search, calendar) */
  iconLeft?: ReactNode
  /** Trailing icon slot (e.g. clear, chevron) */
  iconRight?: ReactNode
  fullWidth?: boolean
  /** Extra classes applied directly to the native <input> element */
  inputClassName?: string
  /**
   * Label for the action button rendered inside the input at the right.
   * When onAction returns a Promise the input is disabled until it resolves.
   */
  actionLabel?: ReactNode
  /** Callback for the action button. Receives the current input value. Return a Promise to trigger loading state. */
  onAction?: (value: string) => Promise<void> | void
}

// ─── Input ────────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      iconLeft,
      iconRight,
      fullWidth = false,
      disabled,
      id,
      className = '',
      inputClassName = '',
      actionLabel,
      onAction,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const isDisabled = !!disabled
    const isError = !!error && !isDisabled

    const [actionLoading, setActionLoading] = useState(false)
    const [inputValue, setInputValue] = useState(
      (rest.value as string | undefined) ?? (rest.defaultValue as string | undefined) ?? '',
    )
    const inputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
      ;(rest as InputHTMLAttributes<HTMLInputElement>).onChange?.(e)
    }

    const hasValue = (rest.value !== undefined ? String(rest.value) : inputValue).length > 0

    const handleAction = async () => {
      if (!onAction) return
      const value = inputRef.current?.value ?? ''
      const result = onAction(value)
      if (result instanceof Promise) {
        setActionLoading(true)
        try { await result } finally { setActionLoading(false) }
      }
    }

    /*
      Token → class map (deterministic):
        surface/neutral/secondary/default → bg-white
        border/neutral/subtle      #ededed → border-neutral-subtle   (@theme)
        border/primary/default     #009ce0 → border-brand            (@theme)
        border/neutral/disabled    #c2c2c2 → border-neutral-disabled (@theme)
        surface/neutral/disabled   #f5f5f5 → bg-neutral-100          (@theme)
        text/neutral/default       #0f0f0f → text-ink                (@theme)
        text/neutral/muted         #595858 → text-ink-muted          (@theme)
        text/neutral/disabled      #c2c2c2 → text-neutral-disabled   (@theme)
        height/input               48px    → h-12   (Tailwind scale 3rem=48px)
        radius/sm                  8px     → rounded-md (vars.css --radius-md=8px)
        stroke/xs                  1px     → border
        static/space/4             4px     → gap-1  (Tailwind scale)
        static/space/8             8px     → gap-2  (Tailwind scale)
        static/space/12            12px    → px-3   (Tailwind scale)
        font/size/16               16px    → text-base
        font/size/14               14px    → text-sm
        font/line-height/lg        24px    → leading-6
        font/line-height/md        20px    → leading-5
        font/letter-spacing/lg    0.09px   → tracking-lg (@theme)
        font/letter-spacing/md    0.20px   → tracking-md (@theme)
        height/icon/lg             20px    → h-icon-lg w-icon-lg (@theme)
        height/button/sm           32px    → h-button-sm            (@theme) — action button
        radius/sm                   8px    → rounded-md              — action button

      UNMAPPED (no @theme token; arbitrary color values forbidden):
        border/sematic/error  #f44336 → border-red-500 (Tailwind default, approx.)
        text/sematic/error    #f44336 → text-red-500   (Tailwind default, approx.)
    */
    const boxClass = [
      'flex items-center gap-1 h-12 px-3 rounded-md border overflow-hidden',
      isDisabled
        ? 'bg-neutral-100 border-neutral-disabled'
        : isError
          ? 'bg-white border-red-500'
          : 'bg-white border-neutral-subtle focus-within:border-brand',
    ].join(' ')

    return (
      <div
        className={[
          'flex flex-col gap-2',
          fullWidth ? 'w-full' : '',
          className,
        ].filter(Boolean).join(' ')}
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
          {iconLeft && (
            <span
              className="shrink-0 flex items-center justify-center h-icon-lg w-icon-lg text-ink-muted"
              aria-hidden="true"
            >
              {iconLeft}
            </span>
          )}

          <input
            ref={(el) => {
              (inputRef as { current: HTMLInputElement | null }).current = el
              if (typeof ref === 'function') ref(el)
              else if (ref) (ref as { current: HTMLInputElement | null }).current = el
            }}
            id={inputId}
            disabled={isDisabled || actionLoading}
            className={[
              'flex-1 min-w-0 bg-transparent outline-none',
              'text-base leading-6 tracking-lg',
              isDisabled || actionLoading
                ? 'text-neutral-disabled placeholder:text-neutral-disabled cursor-not-allowed'
                : 'text-ink placeholder:text-ink-muted',
              inputClassName,
            ].filter(Boolean).join(' ')}
            {...rest}
            onChange={handleChange}
          />

          {actionLabel && (
            <Button type='button' variant='primary' size='sm' disabled={actionLoading || !hasValue} onClick={handleAction}>
              {actionLoading ? (
                <Spinner size='sm' />
              ) : actionLabel}
            </Button>
          )}

          {!actionLabel && iconRight && (
            <span
              className="shrink-0 flex items-center justify-center h-icon-lg w-icon-lg text-ink-muted"
              aria-hidden="true"
            >
              {iconRight}
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
