import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { ComponentProps, RefObject } from 'react';
import { cn } from '../../lib/utils';

// ─── Root / Trigger / Portal / Close ─────────────────────────────────────────

/**
 * The popover root — state and context only, it renders no DOM of its own.
 * Pair it with `PopoverTrigger` and `PopoverContent`.
 */
export function Popover(props: ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root {...props} />;
}
Popover.displayName = 'Popover';

/*
  The root deliberately does NOT accept `className`. It used to, and dropped it
  on the floor — the root has no element to put it on. Rejecting it is what makes
  the rename fail loudly: `<Popover className="w-56">` was the old panel, and the
  panel is now `PopoverPanel`. Without this, that call would still typecheck and
  simply render nothing.
*/

/**
 * @deprecated Renamed to `Popover` — the root is now spelled like `Dialog` /
 * `Tabs` / `Tooltip`, and the panel that held the `Popover` name is now
 * `PopoverPanel`. The rename landed in `1.0.15`; `1.1.0` is the release that
 * signals it in the version number. This alias is kept for the whole `1.x`
 * line and removed in `2.0.0`.
 */
export const PopoverRoot = Popover;

export function PopoverTrigger({
  className,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger className={cn(className)} {...props} />;
}
PopoverTrigger.displayName = 'PopoverTrigger';

type RadixAnchorProps = ComponentProps<typeof PopoverPrimitive.Anchor>;

export interface PopoverAnchorProps
  extends Omit<RadixAnchorProps, 'virtualRef'> {
  /**
   * Position against this element instead — nothing is rendered. Use it to
   * anchor to a node the anchor cannot wrap, such as an input's box while the
   * label and error message stay outside the popover's reference rect.
   */
  virtualRef?: RefObject<Element | null>;
}

/**
 * Positions the content against something other than the trigger — e.g. a whole
 * input field whose caret button is the trigger.
 */
export function PopoverAnchor({
  className,
  virtualRef,
  ...props
}: PopoverAnchorProps) {
  return (
    <PopoverPrimitive.Anchor
      className={cn(className)}
      // Radix's types predate refs that are null before mount; the runtime only
      // reads the ref once it is measuring.
      virtualRef={virtualRef as RadixAnchorProps['virtualRef']}
      {...props}
    />
  );
}
PopoverAnchor.displayName = 'PopoverAnchor';

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
