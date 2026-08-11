'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import {
  useEffect,
  useState,
  type ComponentProps,
  type RefObject,
} from 'react';
import { cn } from '../../lib/utils';

// ─── Root / Trigger / Portal / Close ─────────────────────────────────────────

export interface PopoverProps
  extends ComponentProps<typeof PopoverPrimitive.Root> {
  /**
   * Not accepted here — the root renders no DOM, so there is nothing to style.
   * `<Popover className="w-56">` was the `1.0.14` panel; it is now
   * `<PopoverPanel className="w-56">`.
   *
   * @deprecated `className` moved to `PopoverPanel`.
   */
  className?: never;
}

/**
 * The popover root — state and context only, it renders no DOM of its own.
 * Pair it with `PopoverTrigger` and `PopoverContent`.
 */
export function Popover(props: PopoverProps) {
  return <PopoverPrimitive.Root {...props} />;
}
Popover.displayName = 'Popover';

/*
  The root deliberately does NOT accept `className`. It used to, and dropped it
  on the floor — the root has no element to put it on. Rejecting it is what makes
  the rename fail loudly: `<Popover className="w-56">` was the old panel, and the
  panel is now `PopoverPanel`. Without this, that call would still typecheck and
  simply render nothing.

  Radix's own root props type is *also* named `PopoverProps`, so before this
  interface existed the compiler said "not assignable to type
  'IntrinsicAttributes & PopoverProps'" and stopped there — correct, and useless
  to someone migrating. `className?: never` puts the destination in the hover
  text at the exact spot the error appears. It is a one-off for this migration
  door and should not be copied to other components.
*/

/**
 * The popover root under its old name — identical to `Popover`.
 *
 * @deprecated Renamed to `Popover` — the root is now spelled like `Dialog` /
 * `Tabs` / `Tooltip`, and the panel that held the `Popover` name is now
 * `PopoverPanel`. The rename landed in `1.0.15`; `1.1.0` is the release that
 * signals it in the version number. This alias is kept for the whole `1.x`
 * line and removed in `2.0.0`.
 */
export const PopoverRoot = Popover;

/** The element that opens the popover. Pass `asChild` to keep your own button. */
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
  /*
    Why the element goes through state instead of straight into `virtualRef`.

    Radix asserts the anchor from an effect and skips the call whenever
    `virtualRef.current` holds the same node as last time. Two things then work
    against a ref that is populated during the same commit:

    1. On the first render `PopoverTrigger` still wraps itself in an anchor of its
       own — it only stands down once `hasCustomAnchor` flips, which is what our
       own mount effect does. Its effect runs *after* this subtree's, so the
       trigger wins that first round.
    2. On the next render the trigger's anchor unmounts and takes its element with
       it, leaving Radix holding a detached node. Our ref still reads the same box
       it read before, so Radix sees no change and never re-asserts.

    The result is an anchor that measures 0×0 at the viewport origin: the panel
    lands at the top-left corner instead of under the field. Putting the element in
    state gives Radix a null on the first pass and the real node on the second, so
    the identity change it is watching for actually happens — after the trigger has
    stood down. `InputDropdown` never hit this only because it has no
    `PopoverTrigger` at all; `InputDate` does.

    No dependency array, mirroring Radix's own anchor effect: re-reading every
    render is what keeps up with a box that remounts, and `setState` bails out when
    the node is unchanged, so this settles after one extra render.
  */
  const [anchor, setAnchor] = useState<Element | null>(null);
  useEffect(() => {
    setAnchor(virtualRef?.current ?? null);
  });

  return (
    <PopoverPrimitive.Anchor
      className={cn(className)}
      // A plain `{ current }` object, not a ref: Radix only reads `.current` off
      // it, and passing the live element (rather than a virtual rect) is what lets
      // floating-ui keep tracking the box as it moves or resizes. Radix's types
      // predate refs that are null before mount, hence the cast.
      virtualRef={
        virtualRef
          ? ({ current: anchor } as RadixAnchorProps['virtualRef'])
          : undefined
      }
      {...props}
    />
  );
}
PopoverAnchor.displayName = 'PopoverAnchor';

/**
 * Renders popover content into `document.body`. `PopoverContent` portals itself
 * already, so this is only for hand-assembled popovers.
 */
export function PopoverPortal(
  props: ComponentProps<typeof PopoverPrimitive.Portal>,
) {
  return <PopoverPrimitive.Portal {...props} />;
}
PopoverPortal.displayName = 'PopoverPortal';

/** Closes the popover from inside it. Wrap your own button with `asChild`. */
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
  /** Which edge of the trigger the panel opens from. @default 'bottom' */
  side?: Side;
  /** How the panel lines up along that edge. @default 'start' */
  align?: Align;
}

/**
 * The floating panel: portalled, positioned and styled. Reach for `placement`
 * rather than `side` + `align` — it is the same pair in one prop, and it wins
 * when both are given.
 */
export function PopoverContent({
  className,
  sideOffset = 2,
  placement,
  side: sideProp = 'bottom',
  align: alignProp = 'start',
  collisionPadding = 8,
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
        collisionPadding={collisionPadding}
        className={cn(
          // Same surface as PopoverPanel — the two used to disagree (bg-white vs
          // bg-inverse, border-secondary vs border-neutral-subtle) even though
          // Figma draws one panel. `border-border-neutral-subtle` is #ededed;
          // `border-neutral-subtle` looks like the right token but resolves to
          // #9e9e9e, the icon/text grey. radius/lg 16px is the panel's radius;
          // the 8px it used to carry is the radius of an *item*.
          'bg-inverse border border-border-neutral-subtle rounded-2xl shadow-downwards-sm flex flex-col',
          // size/container/sm — every Figma variant of this panel is 288px wide.
          // Safe as a default: `cn` puts the caller's className last, and
          // tailwind-merge drops this for any incoming `w-*` (InputDate uses
          // `w-auto`, InputDropdown matches the trigger width).
          'w-72',
          // The panel is `position: fixed`, so a list taller than the gap between
          // the trigger and the viewport edge used to be simply cut off: the page
          // could not scroll to it and `overflow-hidden` clipped the rest. Radix
          // measures that gap for us (minus `collisionPadding`), so the panel caps
          // itself there and scrolls inside instead.
          //
          // `overflow-x-hidden` rather than dropping the axis: it keeps exactly
          // what the old `overflow-hidden` was doing sideways — clipping the first
          // and last row into the rounded corners — and stops a wide child from
          // adding a horizontal scrollbar that was never there before.
          'max-h-[var(--radix-popover-content-available-height)] overflow-x-hidden overflow-y-auto',
          'z-50 outline-none',
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
