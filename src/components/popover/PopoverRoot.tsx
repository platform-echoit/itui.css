import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

// ─── Root / Trigger / Portal / Close ─────────────────────────────────────────

export function PopoverRoot(
  props: ComponentProps<typeof PopoverPrimitive.Root> & {
    className?: string;
  },
) {
  return <PopoverPrimitive.Root {...props} />;
}
PopoverRoot.displayName = 'PopoverRoot';

export function PopoverTrigger({
  className,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return (
    <PopoverPrimitive.Trigger
      className={cn(
        'data-[state=open]:shadow-[inset_0_0_0_9999px_rgba(0,0,0,0.08)] [&[data-state=open]_button]:shadow-[inset_0_0_0_9999px_rgba(0,0,0,0.08)]',
        className,
      )}
      {...props}
    />
  );
}
PopoverTrigger.displayName = 'PopoverTrigger';

export function PopoverPortal(
  props: ComponentProps<typeof PopoverPrimitive.Portal>,
) {
  return <PopoverPrimitive.Portal {...props} />;
}
PopoverPortal.displayName = 'PopoverPortal';

export function PopoverClose(
  props: ComponentProps<typeof PopoverPrimitive.Close>,
) {
  return <PopoverPrimitive.Close {...props} />;
}
PopoverClose.displayName = 'PopoverClose';

// ─── PopoverContent — styled with our token system ───────────────────────────

export type PopoverPlacement =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end'
  | 'left-start'
  | 'left-center'
  | 'left-end'
  | 'right-start'
  | 'right-center'
  | 'right-end';

type Side = 'top' | 'bottom' | 'left' | 'right';
type Align = 'start' | 'center' | 'end';

function parsePlacement(placement: PopoverPlacement): {
  side: Side;
  align: Align;
} {
  const [side, align = 'start'] = placement.split('-') as [Side, Align?];
  return { side, align: align ?? 'start' };
}

export interface PopoverContentProps
  extends Omit<
    ComponentProps<typeof PopoverPrimitive.Content>,
    'side' | 'align'
  > {
  /**
   * Convenience shorthand combining side + align.
   * When set, takes precedence over `side` and `align`.
   * @example "bottom-start" | "top-center" | "right-end"
   */
  placement?: PopoverPlacement;
  side?: Side;
  align?: Align;
}

export function PopoverContent({
  className,
  sideOffset = 2,
  placement,
  side: sideProp = 'bottom',
  align: alignProp = 'start',
  children,
  ...rest
}: PopoverContentProps) {
  const { side, align } = placement
    ? parsePlacement(placement)
    : { side: sideProp, align: alignProp };

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'bg-inverse border border-secondary rounded-lg shadow-downwards-sm flex flex-col overflow-hidden',
          'z-50 outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
          className,
        )}
        {...rest}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}
PopoverContent.displayName = 'PopoverContent';
