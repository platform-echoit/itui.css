import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference (Figma node 26871:5818)
  ─────────────────────────────────────────────────────────────────────────────
  SIZES
  height/checkbox/md  18px → h-checkbox-md  w-checkbox-md
  height/checkbox/sm  16px → h-checkbox-sm  w-checkbox-sm
  height/icon/sm      12px → size-3

  RADIUS
  radius/xs  4px → rounded-xs

  BORDER
  stroke/xs  1px → border (Tailwind default)

  COLORS — box states
  surface/neutral/secondary/default  white    → bg-white       (unchecked)
  border/neutral/default             #595858  → border-neutral-muted (unchecked)
  surface/primary/default            #009ce0  → bg-brand        (checked)
  surface/neutral/disabled/inverse   #ededed  → bg-neutral-subtle (disabled)
  border/neutral/disabled            #c2c2c2  → border-neutral-disabled

  COLORS — icon
  icon/neutral/inverse  white   → text-white
  icon/neutral/disabled #c2c2c2 → text-neutral-disabled

  COLORS — label text
  text/neutral/default   #0f0f0f → text-foreground
  text/neutral/disabled  #c2c2c2 → text-neutral-disabled

  TYPOGRAPHY — label
  caption/sm/regular  12px 400 leading-4 0.30px → text-xs font-normal leading-4 tracking-sm
  ─────────────────────────────────────────────────────────────────────────────
*/

export type CheckboxSize = 'sm' | 'md';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: CheckboxSize;
  label?: ReactNode;
}

const boxSizeMap: Record<CheckboxSize, string> = {
  md: 'h-checkbox-md w-checkbox-md',
  sm: 'h-checkbox-sm w-checkbox-sm',
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1.5 5L4 7.5L8.5 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ size = 'md', label, className, checked, disabled, ...rest }, ref) => (
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
        {...rest}
      />
      <span
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center rounded-sm border overflow-hidden',
          boxSizeMap[size],
          disabled
            ? 'bg-neutral-subtle border-neutral-disabled text-neutral-disabled'
            : checked
              ? 'bg-brand border-transparent text-white hover:bg-brand-pressed'
              : 'bg-inverse border-neutral-muted hover:border-brand',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-1',
        )}
      >
        {checked && <CheckIcon className="size-3" />}
      </span>
      {label && (
        <span
          className={cn(
            'font-normal',
            disabled ? 'text-neutral-disabled' : 'text-foreground',
          )}
        >
          {label}
        </span>
      )}
    </label>
  ),
);
Checkbox.displayName = 'Checkbox';
