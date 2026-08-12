import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '../../lib/utils';
import { Button } from '../button/Button';
import { DotsThreeVerticalBoldIcon } from '../../icons/ITUI/dots-three-vertical';

/*
  Token → Tailwind map (Figma node 28392:283 "Overflow Menu")
  ─────────────────────────────────────────────────────────────────────────────
  A "more actions" menu: a 32×32 dots trigger over a 160px panel of label rows.
  Wraps @radix-ui/react-dropdown-menu, so focus trap, roving focus, typeahead
  and dismiss behaviour all come from Radix — only Tailwind classes are added.

  TRIGGER — Figma "General / Button" (28959:730)
  height/button/sm       32px     → Button variant="secondary" size="sm", which
                                    already paints #fafafa on a 1px #ededed
                                    border at radius/sm — no extra classes
  height/icon/md         16px     → a 16px DotsThreeVertical inside a size-5
                                    centring box — Button's own icon slot is a
                                    bare 20px box that does not centre its child

  CONTENT — Figma "OverFlow" (28959:732)
  size/container/xs      160px    → w-container-xs   (--width-container-xs)
  surface/neutral/secondary/default #fafafa → bg-inverse        (--color-inverse)
  border/neutral/subtle  #ededed  → border-border-neutral-subtle
  stroke/xs              1px      → border
  radius/sm              8px      → rounded-lg  (Tailwind 0.5rem = 8px)
  shadow/downwards/md    0 12px 24px #1a1a1a14 → shadow-downwards-md
  spacing/sm             8px      → p-2
  spacing/none           0px      → gap-0 (rows sit flush)

  ITEM — Figma "Base Overflow Menu" (28959:724), types LabelIcon | Label
  spacing/sm             8px      → p-2 · gap-2 (icon ↔ label)
  radius/sm              8px      → rounded-lg
  height/icon/md         16px     → size-4
  typography/body/md/regular 14/24/0.2 → text-sm leading-md tracking-md
  text|icon/neutral/default  #0f0f0f → text-foreground        (State=Enabled)
  surface/neutral/secondary/hover #f5f5f5 → bg-muted           (State=Hover)
  text|icon/neutral/disabled #c2c2c2 → text-neutral-disabled   (State=Disabled)

  The standalone Base Overflow Menu symbol pins height/overFlow (36px), but every
  instance inside the panel measures 40px (8 + 24 + 8) — panel 176px = 8 + 4×40 + 8
  per get_metadata. The row is therefore auto-height, matching composed usage.

  ITUI icons hardcode fill="#101010", so both icon slots add [&_path]:fill-current
  to let text-foreground / text-neutral-disabled reach the glyph.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Root / Portal ────────────────────────────────────────────────────────────

// Plain aliases, same as dropdown-menu.tsx — assigning displayName here would
// mutate the shared Radix primitive that DropdownMenu also re-exports.
/**
 * The "more actions" menu — a dots trigger over a short panel of labelled rows.
 * Built on Radix's dropdown menu, so focus, roving arrow keys, typeahead and
 * dismiss all come for free, but painted in ITUI tokens rather than the raw
 * `slate-*` classes `DropdownMenu` still uses. Reach for `DropdownMenu` only
 * when you need submenus, checkbox items or radio items.
 */
export const OverflowMenu = DropdownMenuPrimitive.Root;

/** Renders menu content into `document.body`. `OverflowMenuContent` portals itself already. */
export const OverflowMenuPortal = DropdownMenuPrimitive.Portal;

// ─── OverflowMenuTrigger ──────────────────────────────────────────────────────

export interface OverflowMenuTriggerProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger> {
  /** Glyph shown in the default trigger. Ignored when `asChild` is set. */
  icon?: ReactNode;
}

/**
 * The button that opens the menu. Left alone it renders the 32px dots button
 * from the design, named "More actions"; pass `asChild` to supply your own
 * element instead — then `icon` no longer applies.
 */
export const OverflowMenuTrigger = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  OverflowMenuTriggerProps
>(
  (
    {
      icon,
      asChild = false,
      className,
      children,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) => {
    // asChild: the consumer owns the element entirely, so pass it straight through.
    if (asChild) {
      return (
        <DropdownMenuPrimitive.Trigger
          ref={ref}
          asChild
          className={className}
          aria-label={ariaLabel}
          {...rest}
        >
          {children}
        </DropdownMenuPrimitive.Trigger>
      );
    }

    return (
      <DropdownMenuPrimitive.Trigger ref={ref} asChild {...rest}>
        <Button
          variant="secondary"
          size="sm"
          aria-label={ariaLabel ?? 'More actions'}
          className={cn('[&_path]:fill-current', className)}
          // Button's icon slot is a bare 20px box (height/icon/lg) that does not
          // centre its child, so Figma's 16px height/icon/md glyph needs its own
          // centring box to land on the button's centre.
          iconLeft={
            <span className="flex size-5 items-center justify-center">
              {icon ?? <DotsThreeVerticalBoldIcon width={16} height={16} />}
            </span>
          }
        />
      </DropdownMenuPrimitive.Trigger>
    );
  },
);
OverflowMenuTrigger.displayName = 'OverflowMenuTrigger';

// ─── OverflowMenuContent ──────────────────────────────────────────────────────

export interface OverflowMenuContentProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {}

/**
 * The 160px panel of rows. It portals itself, so it escapes an
 * `overflow: hidden` ancestor, and defaults to aligning with the trigger's end.
 */
export const OverflowMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  OverflowMenuContentProps
>(({ className, sideOffset = 8, align = 'end', ...rest }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 flex w-container-xs flex-col gap-0 p-2',
        'bg-inverse border border-border-neutral-subtle rounded-lg shadow-downwards-md',
        'outline-none',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
        'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
        className,
      )}
      {...rest}
    />
  </DropdownMenuPrimitive.Portal>
));
OverflowMenuContent.displayName = 'OverflowMenuContent';

// ─── OverflowMenuItem ─────────────────────────────────────────────────────────

export interface OverflowMenuItemProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  /** Leading glyph — rendered in Figma's 16px `height/icon/md` box (type=LabelIcon). */
  icon?: ReactNode;
}

/**
 * One action row, with an optional leading glyph. Use `onSelect` rather than
 * `onClick` — it also fires on Enter and Space, and it closes the menu.
 */
export const OverflowMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  OverflowMenuItemProps
>(({ icon, className, children, ...rest }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'flex w-full cursor-pointer items-center gap-2 rounded-lg p-2 select-none outline-none',
      'text-sm leading-md tracking-md text-foreground',
      'transition-colors duration-150 ease-out',
      // Radix sets data-highlighted on both pointer hover and keyboard focus, so
      // it carries the hover surface only; the ring stays on `:focus-visible` so
      // a mouse hover does not draw one.
      'data-[highlighted]:bg-muted focus-visible:focus-ring',
      'data-[disabled]:pointer-events-none data-[disabled]:text-neutral-disabled',
      className,
    )}
    {...rest}
  >
    {icon != null && (
      <span
        className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4 [&_path]:fill-current"
        aria-hidden="true"
      >
        {icon}
      </span>
    )}
    <span className="min-w-0 flex-1 truncate text-left">{children}</span>
  </DropdownMenuPrimitive.Item>
));
OverflowMenuItem.displayName = 'OverflowMenuItem';
