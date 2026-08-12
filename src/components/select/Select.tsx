'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { CaretDownRegularIcon } from '../../icons/ITUI/caret-down';
import { CaretUpRegularIcon } from '../../icons/ITUI/caret-up';
import { useFieldA11y } from '../input/useFieldA11y';
import { cn } from '../../lib/utils';

// ─── Select ───────────────────────────────────────────────────────────────────

/**
 * The select root — state and context only, it renders no DOM of its own. Pair
 * it with `SelectTrigger` and `SelectContent`. Radix builds a real listbox
 * rather than a native `<select>`, so it also renders a hidden native input to
 * keep forms working.
 */
function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

// ─── SelectGroup ──────────────────────────────────────────────────────────────

/** Groups related options under a `SelectLabel`. */
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

/**
 * Prints the chosen option's text inside the trigger, or the placeholder while
 * nothing is chosen. `SelectTrigger`'s `placeholder` prop renders one for you.
 */
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
  /** Trigger height: the compact 36px row, or the 48px field. @default 'default' */
  size?: 'sm' | 'default';
  /** Text above the trigger. It is what names the select for assistive technology. */
  label?: string;
  /** Message under the trigger. It also paints the error border and sets `aria-invalid`. */
  error?: string;
  /**
   * Shorthand for the common trigger body: with no `children`, the trigger
   * renders `<SelectValue placeholder={placeholder} />` for you. Pass your own
   * children when the body needs anything else — they win, and this prop is
   * then unused.
   */
  placeholder?: React.ReactNode;
}

const triggerBase =
  'group flex items-center justify-between gap-2 h-12 px-3 rounded-lg border overflow-hidden outline-none cursor-pointer';

const triggerVariants = {
  disabled: 'bg-neutral-100 border-input pointer-events-none',
  error: 'bg-white border-destructive',
  /*
    `focus-visible:border-ring` is the *field* focus idiom, the one
    `InputFieldShell.tsx` uses — not `Button`'s outline ring. A select sits next
    to an `InputText` in a form, so borrowing the button's indicator would make
    two neighbouring fields light up differently (I-16).

    It replaces an explicit `focus-visible:ring-0 focus-visible:outline-none`,
    which left the keyboard user with no indicator at all: `data-[state=open]`
    only fires once the menu is open, which is not the same moment as focus.
    The `data-[state=closed]` pair that used to follow is gone with it — it
    restated the base colours and only muddied which rule wins while focused.
  */
  default:
    'bg-white border-input focus-visible:border-ring data-[state=open]:border-brand data-[state=open]:bg-accent',
};

/**
 * The button that opens the list, plus the label and message around it — the
 * same wiring the `Input` family uses, so `label` names the trigger and `error`
 * is announced. With no children it renders a `SelectValue` from `placeholder`.
 */
function SelectTrigger({
  className,
  size = 'default',
  children,
  label,
  disabled,
  error,
  placeholder,
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: SelectTriggerProps) {
  const isDisabled = !!disabled;

  /*
    `nameFromLabelId` is what makes this different from `InputText`: Radix
    renders the trigger as `<button role="combobox">`, and a combobox takes no
    name from its own content — so the name fell back to the placeholder while
    the visible `label` reached nobody. `aria-labelledby` is the one mechanism
    that names it in every AT; the button's text stays the combobox *value*.
    `labelProps.htmlFor` is kept for the pointer behaviour.
  */
  const { fieldProps, labelProps, messageProps, isError } = useFieldA11y({
    id,
    label,
    error,
    disabled: isDisabled,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    nameFromLabelId: true,
  });

  const variant = isDisabled
    ? triggerVariants.disabled
    : isError
      ? triggerVariants.error
      : triggerVariants.default;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          {...labelProps}
          className="shrink-0 text-sm font-medium leading-6 tracking-md text-foreground"
        >
          {label}
        </label>
      )}

      <SelectPrimitive.Trigger
        {...fieldProps}
        data-slot="select-trigger"
        data-size={size}
        className={cn(triggerBase, variant, className)}
        {...props}
      >
        {/*
          `placeholder` used to be declared, destructured and then dropped — the
          trigger rendered nothing for it, so every caller had to repeat the
          string on a `SelectValue` of their own. Defaulting the body here is
          what makes the prop mean something (I-21).
        */}
        {children ?? <SelectValue placeholder={placeholder} />}
        <SelectPrimitive.Icon asChild>
          <CaretDownRegularIcon className="text-muted-foreground size-4 pointer-events-none transition-transform duration-100 ease-out group-data-[state=open]:rotate-180 [&_path]:fill-current" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      {isError && (
        <p
          {...messageProps}
          className="text-sm font-normal leading-5 tracking-md text-destructive"
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

/**
 * The dropdown listbox. It portals itself, so it escapes an `overflow: hidden`
 * ancestor, and matches the trigger's width in the default `popper` position.
 */
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

/** A non-interactive heading over a `SelectGroup`. */
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
  "mx-2 hover:bg-accent hover:cursor-pointer rounded-lg focus:bg-secondary focus:text-accent-foreground focus-visible:focus-ring not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2 p-2 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-[calc(100%-1rem)] cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 overflow-hidden";

/** One option. Its `value` is what `Select` reports — it must be unique and non-empty. */
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

/** A rule between two groups of options. */
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

/** The "more above" affordance on a long list. `SelectContent` renders one already. */
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
      <CaretUpRegularIcon className="size-4 [&_path]:fill-current" />
    </SelectPrimitive.ScrollUpButton>
  );
}

// ─── SelectScrollDownButton ───────────────────────────────────────────────────

/** The "more below" affordance on a long list. `SelectContent` renders one already. */
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
      <CaretDownRegularIcon className="size-4 [&_path]:fill-current" />
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
