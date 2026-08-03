'use client';

import {
  Children,
  forwardRef,
  isValidElement,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/utils';
import { useControllableState } from '../../lib/use-controllable-state';
import { useForwardedRef } from '../../lib/use-forwarded-ref';
import { CaretDownRegularIcon } from '../../icons/ITUI/caret-down';
import { CaretRightRegularIcon } from '../../icons/ITUI/caret-right';
import {
  PopoverAnchor,
  PopoverContent,
  PopoverRoot,
} from '../popover/PopoverRoot';
import { Radio, RadioGroup } from '../radio/Radio';
import { InputText, type InputTextProps } from './InputText';

/*
  Token → Tailwind map
  (Figma 27849:8057 `Dropdown` · 28406:2672 `DropdownWithLabel` · 28982:1111 panel)
  ─────────────────────────────────────────────────────────────────────────────
  TRIGGER — InputText, readOnly, with a caret that flips while the panel is open:
    icon/neutral/muted #595858 → text-neutral-muted (slot) · height/icon/md 16px → size-4

  PANEL — the design is a radio list with optional submenus, not a native select,
  so this is a Popover + RadioGroup rather than the existing Select component.
    radius/sm 8px → rounded-lg          (PopoverContent)
    shadow/downwards/sm → shadow-downwards-sm
    spacing/sm 8px → py-2               (panel padding)
    height/popover/sm 36px → h-9        (row)
    spacing/md 12px → px-3              (row padding)
    surface/neutral/secondary/hover #f5f5f5 → hover:bg-surface-neutral-subtle
  The panel is anchored to the box, so it stays glued to the field no matter how
  tall the label and the error message make the component. Its width follows the
  box through Radix's --radix-popover-trigger-width.
  ─────────────────────────────────────────────────────────────────────────────
*/

/** Rows are 36px tall and share the panel's horizontal rhythm. */
const ROW_CLASS = 'flex h-9 w-full items-center text-sm leading-6 tracking-md';

/**
 * Marks a submenu panel so the parent panel can tell "the user went into a
 * submenu" apart from "the user clicked away".
 */
const SUBMENU_ATTRIBUTE = 'data-input-dropdown-submenu';

// ─── InputDropdownItem ────────────────────────────────────────────────────────

export interface InputDropdownItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  value: string;
  /** Text shown in the field once selected — required when `children` isn't a string */
  label?: string;
  disabled?: boolean;
  children: ReactNode;
}

/** One selectable row. Works at any depth, including inside `InputDropdownSub`. */
export const InputDropdownItem = forwardRef<
  HTMLDivElement,
  InputDropdownItemProps
>(({ value, label: _label, disabled, className, children, ...rest }, ref) => (
  // Selection is left entirely to the radio (and through it, RadioGroup) — the
  // row only stretches the radio's own label across the full width so the whole
  // row is a hit area, without a second handler firing the same change twice.
  <div
    ref={ref}
    className={cn(
      ROW_CLASS,
      '[&>label]:h-full [&>label]:flex-1 [&>label]:px-3',
      !disabled && 'hover:bg-surface-neutral-subtle',
      className,
    )}
    {...rest}
  >
    <Radio value={value} disabled={disabled}>
      {children}
    </Radio>
  </div>
));

InputDropdownItem.displayName = 'InputDropdownItem';

// ─── InputDropdownSub ─────────────────────────────────────────────────────────

export interface InputDropdownSubProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Row text — the category, which is not selectable itself */
  label: ReactNode;
  /** `InputDropdownItem` rows shown in the flyout */
  children: ReactNode;
  /** Extra classes on the flyout panel */
  panelClassName?: string;
}

/**
 * A category row that opens its own panel to the right. The items inside stay
 * part of the parent's RadioGroup, so selecting one closes the whole dropdown.
 */
export const InputDropdownSub = forwardRef<
  HTMLButtonElement,
  InputDropdownSubProps
>(
  (
    {
      label,
      children,
      disabled,
      className,
      panelClassName,
      onClick,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const [rowRef, setRowRef] = useForwardedRef(ref);
    const [open, setOpen] = useState(false);

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setOpen(false);
      }
    };

    return (
      <PopoverRoot open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <button
            ref={setRowRef}
            type="button"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={(event) => {
              onClick?.(event);
              setOpen(!open);
            }}
            onKeyDown={handleKeyDown}
            className={cn(
              ROW_CLASS,
              'gap-2 px-3 text-left',
              disabled
                ? 'cursor-not-allowed text-neutral-disabled'
                : 'cursor-pointer text-foreground hover:bg-surface-neutral-subtle',
              className,
            )}
            {...rest}
          >
            <span className="flex-1 truncate">{label}</span>
            <CaretRightRegularIcon
              width={16}
              height={16}
              className={cn(
                'shrink-0 text-neutral-muted transition-transform duration-150 [&_path]:fill-current',
                open && 'rotate-90',
              )}
            />
          </button>
        </PopoverAnchor>

        <PopoverContent
          side="right"
          align="start"
          sideOffset={4}
          className={cn('min-w-40 rounded-lg py-2', panelClassName)}
          // Keep focus on the row so ArrowLeft/Escape still reach it.
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            rowRef.current?.focus();
          }}
          {...{ [SUBMENU_ATTRIBUTE]: '' }}
        >
          {children}
        </PopoverContent>
      </PopoverRoot>
    );
  },
);

InputDropdownSub.displayName = 'InputDropdownSub';

// ─── InputDropdown ────────────────────────────────────────────────────────────

/** Walks the row tree (submenus included) for the label of the selected value. */
function findItemLabel(
  children: ReactNode,
  value: string | undefined,
): string | undefined {
  if (value === undefined) return undefined;

  let found: string | undefined;
  Children.forEach(children, (child) => {
    if (found !== undefined || !isValidElement(child)) return;
    const props = child.props as Partial<InputDropdownItemProps>;

    if (props.value === value) {
      found =
        props.label ??
        (typeof props.children === 'string' ? props.children : value);
      return;
    }
    if (props.children) found = findItemLabel(props.children, value);
  });

  return found;
}

export interface InputDropdownProps
  extends Omit<
    InputTextProps,
    'value' | 'defaultValue' | 'type' | 'suffix' | 'onChange' | 'readOnly'
  > {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Extra classes on the panel */
  panelClassName?: string;
  /** `InputDropdownItem` and `InputDropdownSub` rows */
  children: ReactNode;
}

/** `InputText` as a read-only trigger for a radio-list panel. */
export const InputDropdown = forwardRef<HTMLInputElement, InputDropdownProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      open,
      onOpenChange,
      disabled = false,
      placeholder = 'Select an option',
      fieldClassName,
      panelClassName,
      onKeyDown,
      children,
      ...rest
    },
    ref,
  ) => {
    const [inputRef, setInputRef] = useForwardedRef(ref);
    const boxRef = useRef<HTMLDivElement>(null);

    const [currentValue, setCurrentValue] = useControllableState({
      value,
      defaultValue: defaultValue ?? '',
      onChange: onValueChange,
    });
    const [isOpen, setIsOpen] = useControllableState({
      value: open,
      defaultValue: false,
      onChange: onOpenChange,
    });

    const select = (next: string) => {
      setCurrentValue(next);
      setIsOpen(false);
      inputRef.current?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (disabled || event.defaultPrevented) return;
      if (
        event.key === 'Enter' ||
        event.key === ' ' ||
        event.key === 'ArrowDown'
      ) {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    return (
      <PopoverRoot open={isOpen} onOpenChange={setIsOpen}>
        {/* virtualRef: positions against the box without rendering a wrapper. */}
        <PopoverAnchor virtualRef={boxRef} />

        <InputText
          ref={setInputRef}
          boxRef={boxRef}
          readOnly
          role="combobox"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          value={findItemLabel(children, currentValue) ?? ''}
          placeholder={placeholder}
          disabled={disabled}
          // The whole box toggles the panel, so the input itself has no onClick
          // (its clicks bubble here and would cancel the toggle out).
          onBoxClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          fieldClassName={cn('cursor-pointer', fieldClassName)}
          suffix={
            <CaretDownRegularIcon
              width={16}
              height={16}
              className={cn(
                'transition-transform duration-150',
                isOpen && 'rotate-180',
              )}
            />
          }
          {...rest}
        />

        <PopoverContent
          align="start"
          className={cn(
            'w-(--radix-popover-trigger-width) rounded-lg py-2',
            panelClassName,
          )}
          // Radix would look for a trigger to restore focus to; there is none.
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
          }}
          onInteractOutside={(event) => {
            const target = event.target as HTMLElement | null;
            // A click on the field: let the box's own toggle close the panel,
            // otherwise it would dismiss here and reopen on the click.
            if (boxRef.current?.contains(target ?? null)) {
              event.preventDefault();
              return;
            }
            // A click inside a submenu is still inside this dropdown, even though
            // that panel is portaled outside this one.
            if (target?.closest(`[${SUBMENU_ATTRIBUTE}]`)) {
              event.preventDefault();
            }
          }}
        >
          <RadioGroup
            value={currentValue}
            onValueChange={select}
            className="gap-0"
          >
            {children}
          </RadioGroup>
        </PopoverContent>
      </PopoverRoot>
    );
  },
);

InputDropdown.displayName = 'InputDropdown';
