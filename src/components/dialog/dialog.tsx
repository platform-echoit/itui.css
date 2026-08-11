'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils';
import XLightIcon from '../../icons/ITUI/x/XLightIcon';

/**
 * The primitive you compose freely — `Modal`, `Popup` and `BottomSheet` are
 * ready-made shapes built on it. Four different designs, not four versions of
 * one, so none of them is deprecated.
 *
 * @see https://github.com/platform-echoit/itui.css#picking-between-similar-names
 */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/**
 * The element that opens the dialog. Pass `asChild` to keep your own button
 * rather than nesting one inside Radix's.
 */
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/**
 * Renders the dialog into `document.body`. `DialogContent` already portals
 * itself, so reach for this only when you are assembling the parts by hand.
 */
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/**
 * Closes the dialog from anywhere inside it. Wrap your own button with `asChild`
 * — the built-in ✕ in the header is separate and controlled by
 * `DialogContent`'s `showCloseButton`.
 */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/**
 * The blurred scrim behind the dialog. `DialogContent` renders one already, so
 * this is only for hand-assembled dialogs.
 */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-opacity-black-sm backdrop-blur-dialog',
        className,
      )}
      {...props}
    />
  );
}

/**
 * The dialog panel, with its portal and scrim included. It splits `children` by
 * position: the **first** child becomes the fixed header (and gets the ✕), and
 * everything after it becomes the scrolling body — so the order of your children
 * is load-bearing, and a header you meant to be a body will end up pinned.
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  hideHeaderBorder = true,
  contentClassName,
  onOpenAutoFocus,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  /** Render the ✕ in the header. Only appears when there is a header child. */
  showCloseButton?: boolean;
  /** Keeps the header borderless. Set `false` for a ruled header. @default true */
  hideHeaderBorder?: boolean;
  /** Lands on the scrolling body. `className` goes to the panel itself. */
  contentClassName?: string;
}) {
  const childArray = React.Children.toArray(children);
  const header = childArray[0];
  const body = childArray.slice(1);

  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:pointer-events-none fixed top-[50%] left-[50%] z-50 flex w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col rounded-xl border border-neutral-subtle shadow-sm duration-200 outline-none sm:max-w-[480px]',
          'max-h-[90vh] overflow-hidden',
          className,
        )}
        onOpenAutoFocus={onOpenAutoFocus}
        {...props}
      >
        {header != null && (
          <div
            className={cn(
              'relative shrink-0 p-4',
              hideHeaderBorder ? '' : 'border-b border-neutral-subtle',
            )}
          >
            {header}
            {showCloseButton && (
              <DialogPrimitive.Close
                data-slot="dialog-close"
                className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-4 transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              >
                {/* Size passed explicitly rather than left to the parent's
                    `[&_svg:not([class*='size-'])]:size-4`, and `fill-current`
                    because the ITUI paths carry a hard-coded `fill="#101010"`
                    that ignores the surrounding `text-*`. */}
                <XLightIcon
                  width={16}
                  height={16}
                  className="[&_path]:fill-current"
                />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}
          </div>
        )}
        <div
          className={cn([
            'flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden p-4 pt-0',
            contentClassName,
          ])}
        >
          {body}
        </div>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/**
 * Groups `DialogTitle` and `DialogDescription`. Put it first inside
 * `DialogContent` — that is the position that becomes the pinned header.
 */
function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-4', className)}
      {...props}
    />
  );
}

/**
 * The action row: stacked on mobile with the primary button on top, right-aligned
 * from `sm` up. It cancels the body's padding to sit flush at the bottom, so it
 * belongs as the last child of the body rather than outside it.
 */
function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        '-mx-4 -mb-4 px-4 py-4 border-t border-neutral-subtle flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}

/**
 * The dialog's heading — and its accessible name. Radix warns at runtime when a
 * dialog has none, so include one even if you hide it with `sr-only`.
 */
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        'text-xl font-semibold leading-7 text-center tracking-2xl text-foreground ',
        className,
      )}
      {...props}
    />
  );
}

/**
 * The supporting line under the title, wired to the dialog's
 * `aria-describedby`. It renders a `div` rather than the usual `<p>`, so rich
 * content inside it stays valid markup.
 */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      asChild
      data-slot="dialog-description"
      className={cn(
        'text-foreground text-base leading-6 text-center tracking-lg',
        className,
      )}
    >
      <div {...props} />
    </DialogPrimitive.Description>
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
