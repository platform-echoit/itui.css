import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from 'react';
import { Switch as RadixSwitch } from 'radix-ui';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind map (Figma node 26990:1456)
  ─────────────────────────────────────────────────────────────────────────────
  TRACK (radius/full → rounded-full · padding exception/spacing/2 2px → p-0.5)
    Md  height/toggle/md 32px · trackW/large  60px → h-8 w-15
    Sm  height/toggle/sm 24px · trackW/medium 44px → h-6 w-11
    On  surface/primary/default          #009ce0 → bg-brand
    Off surface/neutral/disabled/inverse #ededed → bg-surface-neutral-disabled

  THUMB (icon/primary/inverse #fafafa → bg-inverse · rounded-full)
    Md  height/dot/xl 28px → size-7 · slide 60-4-28 = 28px → translate-x-7
    Sm  height/dot/lg 20px → size-5 · slide 44-4-20 = 20px → translate-x-5

  NOTE: Figma shows only On/Off. Disabled (opacity + not-allowed) is added as a
  conventional interactive state — the design does not mock it.
  ─────────────────────────────────────────────────────────────────────────────
*/

export type ToggleSize = 'md' | 'sm';

const trackSizeMap: Record<ToggleSize, string> = {
  md: 'h-8 w-15',
  sm: 'h-6 w-11',
};

const thumbSizeMap: Record<ToggleSize, string> = {
  md: 'size-7 data-[state=checked]:translate-x-7',
  sm: 'size-5 data-[state=checked]:translate-x-5',
};

export interface ToggleProps
  extends ComponentPropsWithoutRef<typeof RadixSwitch.Root> {
  size?: ToggleSize;
}

export const Toggle = forwardRef<
  ComponentRef<typeof RadixSwitch.Root>,
  ToggleProps
>(({ size = 'md', className, ...props }, ref) => (
  <RadixSwitch.Root
    ref={ref}
    className={cn(
      'inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors',
      'data-[state=checked]:bg-brand data-[state=unchecked]:bg-surface-neutral-disabled',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
      'disabled:cursor-not-allowed disabled:opacity-50',
      trackSizeMap[size],
      className,
    )}
    {...props}
  >
    <RadixSwitch.Thumb
      className={cn(
        'pointer-events-none block rounded-full bg-inverse transition-transform',
        'translate-x-0',
        thumbSizeMap[size],
      )}
    />
  </RadixSwitch.Root>
));

Toggle.displayName = 'Toggle';
