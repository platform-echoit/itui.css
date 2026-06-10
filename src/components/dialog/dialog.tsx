import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils';
import { XRegularIcon } from '../../icons/ITUI';

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

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

function DialogContent({
  className,
  children,
  showCloseButton = true,
  hideHeaderBorder = true,
  contentClassName,
  onOpenAutoFocus,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  hideHeaderBorder?: boolean;
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
          'bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 flex w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] flex-col rounded-xl border border-neutral-subtle shadow-sm duration-200 outline-none sm:max-w-[480px]',
          'max-h-[90vh] overflow-hidden',
          className,
        )}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          onOpenAutoFocus?.(e);
        }}
        {...props}
      >
        {header != null && (
          <div
            className={cn(
              'relative shrink-0 px-5 pt-4 pb-4',
              hideHeaderBorder ? '' : 'border-b border-neutral-subtle',
            )}
          >
            {header}
            {showCloseButton && (
              <DialogPrimitive.Close
                data-slot="dialog-close"
                className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-4 transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              >
                <XRegularIcon />
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

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-4', className)}
      {...props}
    />
  );
}

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
