import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/utils';
import { CaretRight } from '../../icons/ITUI/icons';

/*
  Token → Tailwind class reference (Figma node 28208:791)
  ─────────────────────────────────────────────────────────────────────────────
  CONTAINER
  surface/neutral/secondary/default  #fafafa  → bg-inverse
  border/neutral/subtle              #ededed  → border border-border-neutral-subtle
  radius/lg                          16px     → rounded-2xl
  shadow/downwards/sm                         → shadow-downwards-sm
  size/container/sm                  288px    → w-72

  ⚠ `border-neutral-subtle` is NOT this token. It reads like it, but it resolves to
  --color-neutral-subtle = #9e9e9e, the icon/text grey. border/neutral/subtle is
  --color-border-neutral-subtle, hence the doubled word.
  ⚠ radius/sm (8px) is the radius of an ITEM, not of the container.

  ITEM — spacing & heights
  static/space/8  8px  → p-2 (item padding), gap-2 (icon-to-label gap)
  static/space/4  4px  → gap-1 (label-to-description gap)
  static/space/12 12px → py-3, for the one row that needs it (see below)
  height/popover/sm  auto: p-2 + 20px line        = 36px (label-only row)
  height/popover/md  auto: p-2 + 20+4+16px        = 56px (description row)
  (no token, 64px)   auto: py-3 + 20+4+16px       = 64px (icon + description)

  DEVIATION — line-height. The text styles say body/md is 14/24 and caption/sm is
  12/20, but the height tokens above only come out at 36 / 56 / 64px if the line
  boxes are 20 / 16px. The two sources contradict each other inside the same Figma
  file and cannot both be satisfied. We follow the height tokens (a named variable
  beats a shared text style), so leading-5 / leading-4 below are deliberate. Moving
  to leading-md / leading-sm would make the rows 40 / 64px and change every Popover
  story's height — check with design first.

  ITEM — interactive states (CSS-only, RSC compatible)
  hover    surface/neutral/secondary/hover    #f5f5f5 → hover:bg-muted
  pressed  surface/neutral/secondary/pressed  #ededed → active:bg-secondary
  Deliberately the `@theme inline` pair, not --color-surface-hover/-pressed:
  identical in light mode, but only these two follow dark mode.

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

export interface PopoverPanelProps extends HTMLAttributes<HTMLDivElement> {}

export interface PopoverHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Leading avatar, usually an `<Avatar size="md">`. */
  avatar?: ReactNode;
  /** Primary line — the display name. Truncates rather than wrapping. */
  name?: ReactNode;
  /** Secondary line under the name. Truncates rather than wrapping. */
  email?: ReactNode;
  /** Buttons under the identity row — "Manage account", "Sign out". */
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
  /** Appends a CaretRight indicator for submenu items */
  isSubmenu?: boolean;
  /**
   * Renders the item as `role="menuitem"`. Required for items inside
   * `PopoverMenu` — that is the role it finds its items by, and it owns the
   * `tabIndex` from then on. Has no effect outside a `PopoverMenu`.
   */
  asMenuItem?: boolean;
}

// ─── PopoverPanel ─────────────────────────────────────────────────────────────

/**
 * The standalone surface, for a panel that is not driven by `Popover`'s Radix
 * root — a sidebar flyout, a story, anything already positioned by its parent.
 * Inside an open popover reach for `PopoverContent` instead: it paints the same
 * surface and adds the portal, positioning and dismiss behaviour.
 */
export const PopoverPanel = forwardRef<HTMLDivElement, PopoverPanelProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-inverse border border-border-neutral-subtle rounded-2xl shadow-downwards-sm flex flex-col overflow-hidden w-72',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);
PopoverPanel.displayName = 'PopoverPanel';

// ─── PopoverHeader ────────────────────────────────────────────────────────────

/** The identity block at the top of a panel: avatar, name, email and actions. */
export const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(
  ({ avatar, name, email, actions, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-3 px-5 py-4 border-b border-border-neutral-subtle shrink-0',
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

/** A padded run of `PopoverItem`s. Use one per section of the panel. */
export const PopoverGroup = forwardRef<HTMLDivElement, PopoverGroupProps>(
  ({ className, children, ...rest }, ref) => (
    <div ref={ref} className={cn('flex flex-col p-2', className)} {...rest}>
      {children}
    </div>
  ),
);
PopoverGroup.displayName = 'PopoverGroup';

// ─── PopoverSeparator ─────────────────────────────────────────────────────────

/** A rule between two `PopoverGroup`s. */
export const PopoverSeparator = forwardRef<
  HTMLDivElement,
  PopoverSeparatorProps
>(({ className, ...rest }, ref) => (
  <div
    ref={ref}
    className={cn('h-px bg-border-neutral-subtle shrink-0', className)}
    {...rest}
  />
));
PopoverSeparator.displayName = 'PopoverSeparator';

// ─── PopoverItem ──────────────────────────────────────────────────────────────

/**
 * One row of a panel: leading icon, label, optional description and trailing
 * slot. It is a `<button>`; inside a `PopoverMenu` add `asMenuItem` so the menu
 * can find it and manage its focus.
 */
export const PopoverItem = forwardRef<HTMLButtonElement, PopoverItemProps>(
  (
    {
      icon,
      description,
      trailing,
      isSubmenu = false,
      asMenuItem = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => (
    <button
      ref={ref}
      type="button"
      role={asMenuItem ? 'menuitem' : undefined}
      // Seeded at -1; PopoverMenu promotes exactly one item to 0 (roving
      // tabindex). Static attributes only, so this file stays server-safe.
      tabIndex={asMenuItem ? -1 : undefined}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg cursor-pointer select-none',
        // Rows are height tokens in Figma, and only one of them needs a different
        // vertical padding: label 36px and description 56px both come out of
        // spacing/sm, but icon + description is 64px = 12 + (20 + 4 + 16) + 12.
        icon && description ? 'px-2 py-3' : 'p-2',
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
        <span className="text-sm font-normal leading-6 tracking-md text-foreground text-left">
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
      {isSubmenu && <CaretRight width={16} height={16} />}
    </button>
  ),
);
PopoverItem.displayName = 'PopoverItem';
