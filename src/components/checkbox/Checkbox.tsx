import {
  forwardRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { CheckRegularIcon } from '../../icons/ITUI/check';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference (Figma node 26871:5818)
  ─────────────────────────────────────────────────────────────────────────────
  SIZES
  height/checkbox/md  18px → h-checkbox-md  w-checkbox-md
  height/checkbox/sm  16px → h-checkbox-sm  w-checkbox-sm
  height/icon/sm      12px → size-3

  RADIUS
  radius/xs  4px → rounded-sm  (Tailwind v4: rounded-sm = 0.25rem = 4px)

  BORDER
  stroke/xs  1px → border (Tailwind default)

  COLORS — box states
  surface/neutral/secondary/default  #fafafa  → bg-inverse      (unchecked)
  border/neutral/default             #595858  → border-neutral-muted (unchecked)
  surface/primary/default            #009ce0  → bg-brand        (checked)
  surface/neutral/disabled/inverse   #ededed  → bg-surface-neutral-disabled (disabled)
  border/neutral/disabled            #c2c2c2  → border-neutral-disabled

  COLORS — icon
  icon/neutral/inverse  #fafafa → text-inverse
  icon/neutral/disabled #c2c2c2 → text-neutral-disabled

  COLORS — label text
  text/neutral/default   #0f0f0f → text-foreground
  text/neutral/disabled  #c2c2c2 → text-neutral-disabled

  TYPOGRAPHY — label (size-dependent)
  md body/md/regular     14px 400 leading-6 0.20px → text-sm leading-6 tracking-md
  sm caption/sm/regular  12px 400 leading-5 0.30px → text-xs leading-5 tracking-sm
  ─────────────────────────────────────────────────────────────────────────────
*/

export type CheckboxSize = 'sm' | 'md';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: CheckboxSize;
  label?: ReactNode;
  /**
   * Fires with the next checked state — the same shape as `Radio`, `Toggle`,
   * `Select` and `Rating`, so a form does not switch paradigms mid-way.
   *
   * Runs *after* the native `onChange`, which keeps working: spreading
   * `react-hook-form`'s `{...field}` onto this component relies on it.
   */
  onCheckedChange?: (checked: boolean) => void;
}

const boxSizeMap: Record<CheckboxSize, string> = {
  md: 'h-checkbox-md w-checkbox-md',
  sm: 'h-checkbox-sm w-checkbox-sm',
};

// Label typography per size (Figma: Md → body/md/regular, Sm → caption/sm/regular)
const labelTypeMap: Record<CheckboxSize, string> = {
  md: 'text-sm leading-6 tracking-md',
  sm: 'text-xs leading-5 tracking-sm',
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'md',
      label,
      className,
      checked,
      disabled,
      onChange,
      onCheckedChange,
      ...rest
    },
    ref,
  ) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onCheckedChange?.(event.target.checked);
    };

    return (
      <label
        className={cn(
          'inline-flex items-center gap-2',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          className,
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="sr-only peer"
          // Attached only when there is something to call. This file carries no
          // `'use client'`, and a Server Component may not pass a function to a
          // DOM element — the regression I-26 hit on `Button`.
          onChange={onChange || onCheckedChange ? handleChange : undefined}
          {...rest}
        />
        <span
          className={cn(
            'relative inline-flex shrink-0 items-center justify-center rounded-sm border overflow-hidden',
            boxSizeMap[size],
            disabled
              ? 'bg-surface-neutral-disabled border-neutral-disabled text-neutral-disabled'
              : checked
                ? 'bg-brand border-transparent text-inverse hover:bg-brand-pressed'
                : 'bg-inverse border-neutral-muted hover:border-brand',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-1',
          )}
        >
          {checked && (
            <CheckRegularIcon
              aria-hidden="true"
              className="size-3 [&_path]:fill-current"
            />
          )}
        </span>
        {label && (
          <span
            className={cn(
              'font-normal',
              labelTypeMap[size],
              disabled ? 'text-neutral-disabled' : 'text-foreground',
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';
