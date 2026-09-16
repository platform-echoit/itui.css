import {
  forwardRef,
  SVGProps,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
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
  /** Box and label size: 20px/`text-sm` or 16px/`text-xs`. */
  size?: CheckboxSize;
  /**
   * Text beside the box. The input already sits inside a `<label>`, so passing it
   * here both names the checkbox and makes the text part of its hit target —
   * prefer it over wrapping a label of your own. Without it, supply an
   * `aria-label`, or the checkbox has no accessible name.
   */
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


const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
    <path d="M10.5005 2.7124C10.6764 2.71241 10.8448 2.78232 10.9692 2.90674C11.0937 3.03116 11.1636 3.19953 11.1636 3.37549C11.1636 3.55144 11.0937 3.71981 10.9692 3.84424L10.8989 3.91553L10.897 3.91357L4.96826 9.84229L4.96924 9.84326C4.90769 9.90503 4.83395 9.95436 4.75342 9.98779C4.67293 10.0212 4.58666 10.0386 4.49951 10.0386C4.41237 10.0386 4.32609 10.0212 4.24561 9.98779C4.16508 9.95436 4.09133 9.90503 4.02979 9.84326V9.84229L1.40576 7.21826C1.34416 7.15666 1.29457 7.08391 1.26123 7.00342C1.22793 6.92296 1.21143 6.83659 1.21143 6.74951C1.21143 6.66242 1.22791 6.57607 1.26123 6.49561C1.29457 6.41511 1.34415 6.34237 1.40576 6.28076C1.46737 6.21916 1.54012 6.16957 1.62061 6.13623C1.70107 6.10292 1.78743 6.08643 1.87451 6.08643C1.9616 6.08643 2.04796 6.10292 2.12842 6.13623C2.20891 6.16957 2.28166 6.21916 2.34326 6.28076L4.49951 8.43604L10.0317 2.90674C10.1562 2.78232 10.3245 2.7124 10.5005 2.7124Z" fill="#FAFAFA" stroke="#FAFAFA" strokeWidth="0.2" />
  </svg>
)

/**
 * A checkbox over a real `<input type="checkbox">` — the visual box is CSS on a
 * visually-hidden input, so forms, `required`, and `react-hook-form`'s
 * `{...field}` all work unchanged. Take the value from `onCheckedChange` for the
 * boolean, or from `onChange` for the native event; both fire.
 */
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
            'peer-focus-visible:focus-ring',
          )}
        >
          {checked && (
            <CheckIcon
              aria-hidden="true"
              width={12}
              height={12}
              className="[&_path]:fill-current"
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
