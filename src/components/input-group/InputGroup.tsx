'use client';

import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button, ButtonProps } from '../button';
import { Input, InputProps } from '../input/Input';
// import { Textarea } from "@/components/ui/textarea";

/*
  Focus indicator — where this family stands today (checked, not assumed).

  The group frame is the indicator: it watches the control with
  `has-[[data-slot=input-group-control]:focus-visible]` and answers with a
  `ring-[3px]` box-shadow, an idiom no other component here uses. That ring is
  NOT the library's `focus-ring`, so `--itui-focus-ring-width` does not reach it
  — a consumer who raises the token to 2px for WCAG 2.2 leaves this family at 3px.

  `InputGroupInput`'s reset does not cancel the ring `InputFieldShell` draws, for
  two separate reasons: `focus-visible:ring-0` clears a Tailwind `ring`
  (box-shadow) while the shell's indicator is an `outline`, and the reset lands
  on the wrong node anyway — `Input` is an alias of `InputText`, whose
  `className` addresses the outer wrapper, not the bordered box. So the box keeps
  its border, its height and its own focus ring inside the group's frame.

  Left as-is on purpose: nothing imports this family — no story, no screen, no
  entry in the docs — so there is no composition to verify a fix against.
  Reach for `InputText` with `prefix` / `suffix`, which is the same idea drawn
  from the Figma spec and carries the library's focus ring.
*/

/**
 * A single bordered frame around one control and its adornments, so a prefix,
 * a unit, or a trailing button read as part of the field rather than as
 * neighbours. It draws the border and the focus ring itself; the
 * `InputGroupInput` inside it is stripped of both.
 */
function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'w-full border-input dark:bg-input/30 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 h-9 rounded-md border shadow-xs transition-[color,box-shadow] has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot][aria-invalid=true]]:ring-[3px] has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5 [[data-slot=combobox-content]_&]:focus-within:border-inherit [[data-slot=combobox-content]_&]:focus-within:ring-0 group/input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto',
        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "text-muted-foreground h-auto gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4 flex cursor-text items-center justify-center select-none",
  {
    variants: {
      align: {
        'inline-start':
          'pl-2 has-[>button]:ml-[-0.25rem] has-[>kbd]:ml-[-0.15rem] order-first',
        'inline-end':
          'pr-2 has-[>button]:mr-[-0.25rem] has-[>kbd]:mr-[-0.15rem] order-last',
        'block-start':
          'px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2 order-first w-full justify-start',
        'block-end':
          'px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2 order-last w-full justify-start',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
);

/**
 * An adornment inside an `InputGroup` — an icon, a unit, a button. Clicking it
 * focuses the control, so it never reads as dead space; a click on a `<button>`
 * inside it is left alone.
 */
function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & {
  /**
   * Where the adornment sits. The `inline-*` values put it beside the control;
   * the `block-*` values stack it above or below and make the group taller.
   */
  align?: 'inline-start' | 'inline-end' | 'block-start' | 'block-end' | null;
}) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      {...props}
    />
  );
}

/** A `Button` presized for an `InputGroupAddon` — same props, smaller defaults. */
function InputGroupButton({
  className,
  type = 'button',
  variant = 'primary',
  size = 'sm',
  ...props
}: ButtonProps) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={className}
      {...props}
    />
  );
}

/** Muted text inside an addon — a unit, a prefix, a hint. */
function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        "text-muted-foreground gap-2 text-sm [&_svg:not([class*='size-'])]:size-4 flex items-center [&_svg]:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

/**
 * The control of an `InputGroup`: an `Input` with its own border, ring and
 * background removed so the group's frame is the only one you see.
 */
function InputGroupInput({ className, ...props }: InputProps) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        'rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent flex-1',
        className,
      )}
      {...props}
    />
  );
}

// function InputGroupTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
// 	return (
// 		<Textarea
// 			data-slot="input-group-control"
// 			className={cn(
// 				"rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent flex-1 resize-none",
// 				className
// 			)}
// 			{...props}
// 		/>
// 	);
// }

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  // InputGroupTextarea,
};
