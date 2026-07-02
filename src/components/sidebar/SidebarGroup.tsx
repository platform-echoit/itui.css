import { useState, type ReactNode } from 'react';
import { CaretDownRegularIcon } from '../../icons/ITUI';
import { cn } from '../../lib/utils';

/*
  Collapsible group for the Sidebar / LNB — completes the Figma "Expand (With Folding)"
  variant (node 28392:397). Header mirrors SidebarItem styling; the ITUI CaretDown icon
  rotates when open and the indented children (SidebarItem `indented`) fold in/out.

  Interactive (uses state) → use inside a client boundary. In the collapsed rail the
  label, caret and children are hidden (group-data-collapsed/sidebar:*), leaving the icon.
*/

export interface SidebarGroupProps {
  /** Leading 20px icon (required for the collapsed rail). */
  icon?: ReactNode;
  label: ReactNode;
  /** Highlight the group header (selected section). */
  active?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Sub-items — typically <SidebarItem indented>. */
  children?: ReactNode;
  className?: string;
}

export function SidebarGroup({
  icon,
  label,
  active = false,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  children,
  className,
}: SidebarGroupProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const toggle = () => {
    const next = !open;
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <li
      data-sidebar-item
      className="relative w-full list-none group-data-collapsed/sidebar:w-auto"
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={cn(
          'flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg p-2',
          'font-sans text-sm font-medium leading-5 tracking-md hover:bg-sidebar-accent',
          'group-data-collapsed/sidebar:w-9 group-data-collapsed/sidebar:justify-center',
          active
            ? 'bg-secondary text-foreground'
            : 'bg-white text-neutral-muted active:bg-secondary',
          className,
        )}
      >
        {icon && (
          <span
            className="flex h-icon-lg w-icon-lg shrink-0 items-center justify-center"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <span className="truncate group-data-collapsed/sidebar:sr-only">
          {label}
        </span>
        <CaretDownRegularIcon
          width={16}
          height={16}
          aria-hidden="true"
          className={cn(
            'ml-auto shrink-0 transition-transform group-data-collapsed/sidebar:hidden',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <ul className="m-0 mt-2 flex w-full list-none flex-col gap-2 p-0 group-data-collapsed/sidebar:hidden">
          {children}
        </ul>
      )}
    </li>
  );
}
