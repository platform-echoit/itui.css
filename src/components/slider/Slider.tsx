import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from 'react';
import { Slider as RadixSlider } from 'radix-ui';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind map (Figma node 27138:4247)
  ─────────────────────────────────────────────────────────────────────────────
  TRACK (height/scroll-bar/sm 6px → h-1.5 · radius/full → rounded-full)
    surface/neutral/subtle/default  #f5f5f5 → bg-surface-neutral-subtle  (rail / inactive)
    surface/primary/default         #009ce0 → bg-brand                   (range / active)

  THUMB ("Dot" Lg, height/dot/lg 20px → size-5 · radius/full · bg surface/neutral/secondary #fafafa → bg-inverse)
    border/primary/subtle    #b0e0f5 → border-surface-primary-muted   (default)
    border/primary/default   #009ce0 → border-brand                   (hover / pressed / focus)
    border/primary/focus     #e6f5fc → ring-brand-subtle (2px ring)   (hover / pressed / focus)
    border/neutral/disabled  #c2c2c2 → border-neutral-disabled        (disabled)

  NOTES
    - Single vs Range is derived from the value/defaultValue array length
      (Radix renders one Thumb per value) — no `type` prop needed.
    - The Figma "Dot XS" (6px) is a decorative midpoint marker in the mockup,
      not a functional slider element, so it is intentionally not implemented.
  ─────────────────────────────────────────────────────────────────────────────
*/

export interface SliderProps
  extends ComponentPropsWithoutRef<typeof RadixSlider.Root> {}

export const Slider = forwardRef<
  ComponentRef<typeof RadixSlider.Root>,
  SliderProps
>(({ className, value, defaultValue, min = 0, max = 100, ...props }, ref) => {
  const thumbValues = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min];

  return (
    <RadixSlider.Root
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        'data-[disabled]:pointer-events-none',
        className,
      )}
      {...props}
    >
      <RadixSlider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-surface-neutral-subtle">
        <RadixSlider.Range className="absolute h-full rounded-full bg-brand data-[disabled]:bg-neutral-disabled" />
      </RadixSlider.Track>
      {thumbValues.map((_, index) => (
        <RadixSlider.Thumb
          key={index}
          className={cn(
            'block size-5 shrink-0 cursor-pointer rounded-full border bg-inverse transition-colors',
            'border-surface-primary-muted',
            'hover:border-brand hover:ring-2 hover:ring-brand-subtle',
            'active:border-brand active:ring-2 active:ring-brand-subtle',
            'focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-subtle',
            'data-[disabled]:cursor-not-allowed data-[disabled]:border-neutral-disabled data-[disabled]:ring-0',
          )}
        />
      ))}
    </RadixSlider.Root>
  );
});

Slider.displayName = 'Slider';
