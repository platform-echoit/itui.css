'use client';

import { Select as SelectPrimitive } from 'radix-ui';
import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

// ─── Select ───────────────────────────────────────────────────────────────────

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

// ─── SelectGroup ──────────────────────────────────────────────────────────────

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn('scroll-my-1 p-1', className)}
      {...props}
    />
  );
}

// ─── SelectValue ──────────────────────────────────────────────────────────────

function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('truncate min-w-0 flex-1', className)}
      {...props}
    />
  );
}

// ─── SelectTrigger ────────────────────────────────────────────────────────────

export interface SelectTriggerProps
  extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
  size?: 'sm' | 'default';
  label?: string;
  error?: string;
  placeholder?: string;
}

const triggerBase =
  'group flex items-center justify-between gap-2 h-12 px-3 rounded-lg border overflow-hidden outline-none cursor-pointer';

const triggerVariants = {
  disabled: 'bg-neutral-100 border-input pointer-events-none',
  error: 'bg-white border-destructive',
  default:
    'bg-white border-input focus-visible:ring-0 focus-visible:outline-none data-[state=open]:border-brand data-[state=open]:bg-accent data-[state=closed]:border-input data-[state=closed]:bg-white',
};

function SelectTrigger({
  className,
  size = 'default',
  children,
  label,
  disabled,
  error,
  placeholder,
  ...props
}: SelectTriggerProps) {
  const isDisabled = !!disabled;
  const isError = !!error && !isDisabled;

  const variant = isDisabled
    ? triggerVariants.disabled
    : isError
      ? triggerVariants.error
      : triggerVariants.default;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="shrink-0 text-sm font-medium leading-6 tracking-md text-foreground">
          {label}
        </label>
      )}

      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        data-size={size}
        className={cn(triggerBase, variant, className)}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <CaretDownIcon className="text-muted-foreground size-4 pointer-events-none transition-transform duration-100 ease-out group-data-[state=open]:rotate-180" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      {isError && (
        <p
          className="text-sm font-normal leading-5 tracking-md text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ─── SelectContent ────────────────────────────────────────────────────────────

const contentBase =
  'w-(--radix-select-trigger-width) py-2 bg-inverse shadow-downwards-sm border-secondary text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-36 rounded-lg ring-1 duration-100 relative z-50 max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto';

const contentPopper =
  'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1';

const viewportBase =
  'data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-[min(var(--radix-select-trigger-width),18rem)]';

function SelectContent({
  className,
  children,
  position = 'popper',
  align = 'center',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          contentBase,
          position === 'popper' && contentPopper,
          className,
        )}
        position={position}
        align={align}
        sideOffset={8}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={viewportBase}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

// ─── SelectLabel ──────────────────────────────────────────────────────────────

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
      {...props}
    />
  );
}

// ─── SelectItem ───────────────────────────────────────────────────────────────

const itemBase =
  "mx-2 hover:bg-accent hover:cursor-pointer rounded-lg focus:bg-secondary focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2 p-2 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-[calc(100%-1rem)] cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 overflow-hidden";

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(itemBase, className)}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

// ─── SelectSeparator ──────────────────────────────────────────────────────────

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('bg-border -mx-1 my-1 h-px pointer-events-none', className)}
      {...props}
    />
  );
}

// ─── SelectScrollUpButton ─────────────────────────────────────────────────────

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <CaretUpIcon />
    </SelectPrimitive.ScrollUpButton>
  );
}

// ─── SelectScrollDownButton ───────────────────────────────────────────────────

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <CaretDownIcon />
    </SelectPrimitive.ScrollDownButton>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
