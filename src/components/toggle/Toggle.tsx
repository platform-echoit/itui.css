import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
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
  conventional interactive state — the design does not mock it. `label` is the
  same: Figma mocks no labelled switch, so its typography and disabled colours
  are borrowed from `Checkbox` rather than invented (I-15).
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

// Matches Checkbox: md → body/md/regular, sm → caption/sm/regular.
const labelTypeMap: Record<ToggleSize, string> = {
  md: 'text-sm leading-6 tracking-md',
  sm: 'text-xs leading-5 tracking-sm',
};

export interface ToggleProps
  extends ComponentPropsWithoutRef<typeof RadixSwitch.Root> {
  /** Track size — the standard switch or the compact one. */
  size?: ToggleSize;
  /**
   * Text beside the switch, which also becomes its accessible name — the same
   * shape `Checkbox` takes, so a form does not switch paradigms halfway down.
   *
   * Without it, naming a switch means remembering `aria-label` by hand, and
   * nothing points that out until an audit does.
   */
  label?: ReactNode;
}

/**
 * An on/off switch. Unlike `Checkbox` it is not a form control — Radix renders a
 * `<button role="switch">` — so read the value from `onCheckedChange` rather
 * than from a form submission, and give it a `label` so it has a name.
 */
export const Toggle = forwardRef<
  ComponentRef<typeof RadixSwitch.Root>,
  ToggleProps
>(({ size = 'md', className, label, disabled, ...props }, ref) => {
  const track = (
    <RadixSwitch.Root
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors',
        'data-[state=checked]:bg-brand data-[state=unchecked]:bg-surface-neutral-disabled',
        'focus-visible:focus-ring',
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
  );

  // The wrapper is opt-in: with no `label` the DOM is exactly what it was
  // before this prop existed, so anyone styling `Toggle` through `className`
  // keeps aiming at the same element. Radix renders the switch as a `<button>`,
  // which is labelable — the wrapping `<label>` both names it and toggles it.
  if (!label) return track;

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      )}
    >
      {track}
      <span
        className={cn(
          'font-normal',
          labelTypeMap[size],
          disabled ? 'text-neutral-disabled' : 'text-foreground',
        )}
      >
        {label}
      </span>
    </label>
  );
});

Toggle.displayName = 'Toggle';
