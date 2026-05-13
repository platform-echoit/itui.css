import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference
  ──────────────────────────────────────────────────────────────────────────────
  COLORS (from global.css @theme)
  surface/neutral/secondary/default  #fff     → bg-sidebar / bg-white
  surface/neutral/secondary/hover    #f5f5f5  → bg-surface-hover     (--color-surface-hover)
  surface/neutral/secondary/pressed  #ededed  → bg-surface-pressed   (--color-surface-pressed)
  border/neutral/subtle              #ededed  → border-sidebar-border (--color-sidebar-border)
  text/neutral/default               #0f0f0f  → text-ink             (--color-ink)
  text/neutral/muted                 #595858  → text-ink-muted       (--color-ink-muted)

  SIZING (Tailwind v4: n × 0.25rem; @theme for named tokens)
  height/lnb/sm     36px → h-9   (2.25rem)
  height/lnb/md     48px → h-12  (3rem)
  height/icon/lg    20px → h-icon-lg  w-icon-lg  (--height/width-icon-lg)
  height/icon/md    16px → h-icon-md  w-icon-md  (--height/width-icon-md)
  height/profile/sm 24px → h-profile-sm  w-profile-sm
  sidebar collapsed  52px → w-13  (3.25rem)
  sidebar expanded  264px → w-66  (16.5rem)

  SPACING
  static/space/8   8px  → p-2 / gap-2
  static/space/32  32px → gap-8
  sub-item indent  36px → px-9  (2.25rem)

  RADIUS
  radius/sm  8px → rounded-lg  (0.5rem — confirmed in Button.tsx)

  SHADOW
  shadow/rightwards/sm → shadow-rightwards-sm  (--shadow-rightwards-sm in @theme)

  TYPOGRAPHY
  font/size/14          14px  → text-sm
  font/size/12          12px  → text-xs
  font/line-height/md   20px  → leading-5
  font/line-height/sm   16px  → leading-4
  font/letter-spacing/md 0.2px → tracking-md  (--tracking-md in @theme)
  font/letter-spacing/sm 0.3px → tracking-xs  (--tracking-xs in @theme)
  font/weight/medium    500   → font-medium

  RSC STRATEGY
  No createContext / useContext — zero client hooks.
  Sidebar sets data-collapsed attribute + group/sidebar class.
  Sub-components adapt via group-data-[collapsed]/sidebar: CSS variants.
  The consuming layout manages collapsed state; no 'use client' needed here.
  ──────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Collapse to icon-only rail (52 px). Default: false → 264 px expanded. */
  collapsed?: boolean;
  children?: ReactNode;
}

export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface SidebarMenuProps extends HTMLAttributes<HTMLUListElement> {
  children?: ReactNode;
}

export interface SidebarItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected/active state — bg-surface-pressed + text-ink. */
  active?: boolean;
  /** Leading 20 px icon slot. Required in collapsed mode for visual identification. */
  icon?: ReactNode;
  /** Sub-item variant: 36 px left indent, no icon. */
  indented?: boolean;
  /** Tooltip text shown to the right of the item when the sidebar is collapsed. Falls back to children if omitted and children is a string. */
  label?: string;
  children?: ReactNode;
}

export interface SidebarFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ collapsed = false, className, children, ...rest }, ref) => (
    <nav
      ref={ref}
      data-sidebar
      data-collapsed={collapsed || undefined}
      className={cn(
        'group/sidebar flex flex-col h-full justify-between bg-sidebar p-2',
        'border-r border-sidebar-border shadow-[4px_0_16px_0_rgba(137,137,137,0.10)]',
        collapsed ? 'w-13 items-center' : 'w-66 items-start',
        className,
      )}
      {...rest}
    >
      {children}
    </nav>
  ),
);
Sidebar.displayName = 'Sidebar';

// ─── SidebarHeader ────────────────────────────────────────────────────────────

export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-8 shrink-0 items-start w-full',
        'group-data-collapsed/sidebar:items-center group-data-collapsed/sidebar:w-auto',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);
SidebarHeader.displayName = 'SidebarHeader';

// ─── SidebarMenu ──────────────────────────────────────────────────────────────

export const SidebarMenu = forwardRef<HTMLUListElement, SidebarMenuProps>(
  ({ className, children, ...rest }, ref) => (
    <ul
      ref={ref}
      className={cn(
        'flex flex-col gap-2 shrink-0 list-none p-0 m-0 w-full',
        'group-data-collapsed/sidebar:items-center group-data-collapsed/sidebar:w-auto',
        className,
      )}
      {...rest}
    >
      {children}
    </ul>
  ),
);
SidebarMenu.displayName = 'SidebarMenu';

// ─── SidebarItem ──────────────────────────────────────────────────────────────

export const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
  (
    {
      active = false,
      icon,
      indented = false,
      label,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const tooltipText =
      label ?? (typeof children === 'string' ? children : undefined);
    return (
      <li
        data-sidebar-item
        className="list-none w-full group-data-collapsed/sidebar:w-auto relative"
      >
        <button
          ref={ref}
          type="button"
          aria-current={active ? 'page' : undefined}
          className={cn(
            'flex items-center rounded-lg font-medium text-sm leading-5 tracking-md font-sans cursor-pointer hover:bg-sidebar-accent',
            // Expanded defaults
            'gap-2 h-9 w-full',
            indented ? 'px-9 py-2' : 'p-2',
            // Collapsed overrides (CSS wins via group ancestor data attribute)
            'group-data-collapsed/sidebar:justify-center group-data-collapsed/sidebar:w-9',
            indented && 'group-data-collapsed/sidebar:p-2!',
            active
              ? 'bg-surface-pressed text-ink'
              : 'bg-white text-ink-muted hover:bg-sidebar-accent active:bg-secondary',
            className,
          )}
          {...rest}
        >
          {icon && (
            <span
              className="shrink-0 h-icon-lg w-icon-lg flex items-center justify-center"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          {/* sr-only keeps text accessible as button label when icon-only */}
          <span className="truncate group-data-collapsed/sidebar:sr-only">
            {label ?? children}
          </span>
        </button>
        {tooltipText && (
          <span
            data-sidebar-tooltip
            className={cn(
              'hidden absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50',
              'items-center p-2 rounded-lg pointer-events-none whitespace-nowrap',
              'text-[11px] font-normal leading-4 tracking-xs bg-white shadow-downwards-sm',
            )}
            aria-hidden="true"
          >
            {tooltipText}
          </span>
        )}
      </li>
    );
  },
);
SidebarItem.displayName = 'SidebarItem';

// ─── SidebarFooter ────────────────────────────────────────────────────────────

export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-2 shrink-0 w-full',
        'group-data-collapsed/sidebar:items-center group-data-collapsed/sidebar:w-auto',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);
SidebarFooter.displayName = 'SidebarFooter';
