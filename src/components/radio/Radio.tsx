import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from 'react';
import { RadioGroup as RadixRadioGroup } from 'radix-ui';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind map (Figma node 27480:540)
  ─────────────────────────────────────────────────────────────────────────────
  SIZES (radius/full → rounded-full · stroke/xs 1px → border)
    outer  height/radio/md 20px → size-5   ·  height/radio/sm 16px → size-4
    dot    height/dot/md   12px → size-3   ·  height/dot/sm   10px → size-2.5

  COLORS — circle
    surface/neutral/secondary/default #fafafa → bg-inverse                 (unchecked / checked bg)
    border/neutral/default            #595858 → border-neutral-muted       (unchecked border)
    border/primary/default            #009ce0 → border-brand               (checked border)
    surface/primary/default           #009ce0 → bg-brand                   (checked dot)
    surface/neutral/disabled/inverse  #ededed → bg-surface-neutral-disabled (disabled bg)
    border/neutral/disabled           #c2c2c2 → border-neutral-disabled    (disabled border + disabled dot)

  COLORS — label text
    text/neutral/default   #0f0f0f → text-foreground
    text/neutral/disabled  #c2c2c2 → text-neutral-disabled

  TYPOGRAPHY — label (regular by default, medium when selected)
    md body/md     14px leading-24 0.20px → text-sm leading-6 tracking-md
    sm caption/sm  12px leading-20 0.30px → text-xs leading-5 tracking-sm

  NOTE: built from Figma metadata + variables + screenshot (the per-node design
  context tool was unavailable). Hover affordance added for parity with Checkbox.
  ─────────────────────────────────────────────────────────────────────────────
*/

export type RadioSize = 'md' | 'sm';

// ─── RadioGroup ─────────────────────────────────────────────────────────────

export interface RadioGroupProps
  extends ComponentPropsWithoutRef<typeof RadixRadioGroup.Root> {}

export const RadioGroup = forwardRef<
  ComponentRef<typeof RadixRadioGroup.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => (
  <RadixRadioGroup.Root
    ref={ref}
    className={cn('flex flex-col gap-2', className)}
    {...props}
  />
));
RadioGroup.displayName = 'RadioGroup';

// ─── Radio (item) ───────────────────────────────────────────────────────────

const outerSizeMap: Record<RadioSize, string> = {
  md: 'size-5',
  sm: 'size-4',
};

const dotSizeMap: Record<RadioSize, string> = {
  md: 'size-3',
  sm: 'size-2.5',
};

const labelTypeMap: Record<RadioSize, string> = {
  md: 'text-sm leading-6 tracking-md',
  sm: 'text-xs leading-5 tracking-sm',
};

export interface RadioProps
  extends ComponentPropsWithoutRef<typeof RadixRadioGroup.Item> {
  size?: RadioSize;
  /** Optional label rendered next to the radio. */
  children?: ReactNode;
}

export const Radio = forwardRef<
  ComponentRef<typeof RadixRadioGroup.Item>,
  RadioProps
>(({ size = 'md', className, children, disabled, ...props }, ref) => (
  <label
    className={cn(
      'inline-flex items-center gap-2',
      disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    )}
  >
    <RadixRadioGroup.Item
      ref={ref}
      disabled={disabled}
      className={cn(
        'peer relative flex shrink-0 items-center justify-center rounded-full border bg-inverse',
        outerSizeMap[size],
        'border-neutral-muted',
        'enabled:hover:border-brand',
        'data-[state=checked]:border-brand',
        'disabled:border-neutral-disabled disabled:bg-surface-neutral-disabled',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
        className,
      )}
      {...props}
    >
      <RadixRadioGroup.Indicator
        className={cn(
          'block rounded-full bg-brand data-[disabled]:bg-neutral-disabled',
          dotSizeMap[size],
        )}
      />
    </RadixRadioGroup.Item>
    {children != null && (
      <span
        className={cn(
          'font-normal peer-data-[state=checked]:font-medium',
          labelTypeMap[size],
          'text-foreground peer-disabled:text-neutral-disabled',
        )}
      >
        {children}
      </span>
    )}
  </label>
));
Radio.displayName = 'Radio';
