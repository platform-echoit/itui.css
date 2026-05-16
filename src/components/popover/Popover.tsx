import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { CaretRight } from '../../icons/ITUI/icons';

/*
  Token → Tailwind class reference (Figma node 28208:791)
  ─────────────────────────────────────────────────────────────────────────────
  CONTAINER
  surface/neutral/secondary/default  white    → bg-white
  border/neutral/subtle              #ededed  → border border-neutral-subtle
  radius/sm                          8px      → rounded-[8px]
  shadow/downwards/sm                         → shadow-downwards-sm

  ITEM — spacing & heights
  static/space/8  8px → p-2 (item padding), gap-2 (icon-to-label gap)
  static/space/4  4px → gap-1 (label-to-description gap)
  height/popover/sm  auto: p-2 + 20px line    = 36px (label-only row)
  height/popover/md  auto: p-2 + 20+4+16px   = 56px (description row)

  ITEM — interactive states (CSS-only, RSC compatible)
  hover    surface/neutral/secondary/hover    #f5f5f5 → hover:bg-surface-hover
  pressed  surface/neutral/secondary/pressed  #ededed → active:bg-surface-pressed

  TYPOGRAPHY
  body/md/medium     14px 500 leading-5 0.20px → text-sm font-medium   leading-5 tracking-md
  caption/sm/regular 12px 400 leading-4 0.30px → text-xs font-normal   leading-4 tracking-sm

  ICONS
  height/icon/lg  20px → size-5 (leading icon)
  height/icon/md  16px → size-4 (trailing chevron)

  HEADER (Avatar variant)
  static/space/20  20px → px-5
  static/space/16  16px → py-4
  static/space/12  12px → gap-3
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {}

export interface PopoverHeaderProps extends HTMLAttributes<HTMLDivElement> {
  avatar?: ReactNode;
  name?: ReactNode;
  email?: ReactNode;
  actions?: ReactNode;
}

export interface PopoverGroupProps extends HTMLAttributes<HTMLDivElement> {}

export interface PopoverSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

export interface PopoverItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Leading icon slot — render any 20×20 icon node */
  icon?: ReactNode;
  /** Secondary description text rendered below the label */
  description?: ReactNode;
  /** Trailing content (text or icon) rendered at the right edge */
  trailing?: ReactNode;
  /** Appends a ChevronRight indicator for submenu items */
  isSubmenu?: boolean;
}

// ─── Popover ──────────────────────────────────────────────────────────────────

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white border border-neutral-subtle rounded-[8px] shadow-downwards-sm flex flex-col overflow-hidden',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);
Popover.displayName = 'Popover';

// ─── PopoverHeader ────────────────────────────────────────────────────────────

export const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(
  ({ avatar, name, email, actions, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-3 px-5 py-4 border-b border-neutral-subtle shrink-0',
        className,
      )}
      {...rest}
    >
      {(avatar || name || email) && (
        <div className="flex gap-3 items-center">
          {avatar && <span className="shrink-0">{avatar}</span>}
          {(name || email) && (
            <div className="flex flex-col min-w-0">
              {name && (
                <span className="text-sm font-medium leading-5 tracking-md text-foreground truncate">
                  {name}
                </span>
              )}
              {email && (
                <span className="text-xs font-normal leading-4 tracking-sm text-neutral-muted truncate">
                  {email}
                </span>
              )}
            </div>
          )}
        </div>
      )}
      {actions && <div className="flex gap-2 items-center">{actions}</div>}
    </div>
  ),
);
PopoverHeader.displayName = 'PopoverHeader';

// ─── PopoverGroup ─────────────────────────────────────────────────────────────

export const PopoverGroup = forwardRef<HTMLDivElement, PopoverGroupProps>(
  ({ className, children, ...rest }, ref) => (
    <div ref={ref} className={cn('flex flex-col p-2', className)} {...rest}>
      {children}
    </div>
  ),
);
PopoverGroup.displayName = 'PopoverGroup';

// ─── PopoverSeparator ─────────────────────────────────────────────────────────

export const PopoverSeparator = forwardRef<
  HTMLDivElement,
  PopoverSeparatorProps
>(({ className, ...rest }, ref) => (
  <div
    ref={ref}
    className={cn('h-px bg-neutral-subtle shrink-0', className)}
    {...rest}
  />
));
PopoverSeparator.displayName = 'PopoverSeparator';

// ─── PopoverItem ──────────────────────────────────────────────────────────────

export const PopoverItem = forwardRef<HTMLButtonElement, PopoverItemProps>(
  (
    {
      icon,
      description,
      trailing,
      isSubmenu = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'flex w-full items-center gap-2 p-2 rounded-lg cursor-pointer select-none leading-md',
        'bg-inverse hover:bg-muted active:bg-secondary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      {icon && (
        <span className="shrink-0 size-5 flex items-center justify-center text-foreground">
          {icon}
        </span>
      )}
      <span className="flex flex-col flex-1 min-w-0 gap-1">
        <span className="text-sm font-medium leading-5 tracking-md text-foreground text-left">
          {children}
        </span>
        {description && (
          <span className="text-xs font-normal leading-4 tracking-sm text-neutral-muted text-left">
            {description}
          </span>
        )}
      </span>
      {trailing && (
        <span className="shrink-0 text-neutral-muted text-xs font-normal leading-4 tracking-sm">
          {trailing}
        </span>
      )}
      {isSubmenu && (
<CaretRight width={16} height={16}  />
      )}
    </button>
  ),
);
PopoverItem.displayName = 'PopoverItem';
