import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind map (Figma node 28390:4906 "GNB")
  ─────────────────────────────────────────────────────────────────────────────
  BAR
  height/gnb/sm            72px      → h-18   (--size-gnb exists but the --size-*
                                       namespace only generates the square size-*
                                       utility, never h-* — see TOKENS.md §9)
  padding                  48px      → px-12
  color/static/white       #fafafa   → bg-inverse            (--color-inverse)
  border/neutral/subtle    #ededed   → border-border-neutral-subtle
  stroke/xs                1px       → border-b
  shadow/downwards/sm                → shadow-downwards-sm   (0 4px 16px 0
                                       rgba(26,26,26,0.08) — the box-shadow form of
                                       Figma's DROP_SHADOW blur/sm at offset-y 4)

  LAYOUT — gaps
  spacing/3xl              32px      → gap-8   (logo ↔ menu, type="Default")
  spacing/2xl              24px      → gap-6   (logo ↔ menu, type="Search")
  spacing/lg               16px      → gap-4   (search ↔ actions)
  spacing/md               12px      → gap-3   (between actions)
  spacing/5xl              48px      → gap-12  (between menu items)

  LOGO
  Figma "icon_size" frame  40px      → size-10 box. The mark itself is
                                       consumer-supplied, so the box is a plain
                                       centering slot — it never resizes the child.

  MENU ITEM
  typography/body/lg/medium 16/26/0.09 medium
                                     → text-base leading-lg tracking-lg font-medium
  text/neutral/default     #0f0f0f   → text-foreground
  text/primary/default     #009ce0   → text-primary  (active / hover)

  Figma specs no hover or active state for the menu items — all five render
  identically. `active` and `hover:` mirror BottomNavigationItem in
  navigation/Navigation.tsx, which already paints the current item text-primary,
  so the two nav families stay consistent.

  Responsive: the bar is w-full (Figma pins 1440px, a canvas width). The trailing
  cluster is pushed right with ml-auto; menu items never wrap.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Gnb (desktop global nav bar) ─────────────────────────────────────────────

export interface GnbProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Brand mark, centered in Figma's 40px `icon_size` box. */
  logo?: ReactNode;
  /** Primary navigation — typically a `<GnbMenu>`. */
  menu?: ReactNode;
  /** Search field placed before the actions (Figma `type="Search"`). */
  search?: ReactNode;
  /** Trailing cluster — buttons, icon buttons, avatar. */
  actions?: ReactNode;
}

export const Gnb = forwardRef<HTMLElement, GnbProps>(
  ({ logo, menu, search, actions, className, ...rest }, ref) => (
    <header
      ref={ref}
      className={cn(
        'flex h-18 w-full items-center gap-6 px-12',
        'border-b border-border-neutral-subtle bg-inverse shadow-downwards-sm',
        className,
      )}
      {...rest}
    >
      {(logo != null || menu != null) && (
        // Figma tightens this gap from 32px to 24px on the Search variant to
        // make room for the input.
        <div
          className={cn(
            'flex min-w-0 items-center',
            search != null ? 'gap-6' : 'gap-8',
          )}
        >
          {logo != null && (
            <span className="flex size-10 shrink-0 items-center justify-center">
              {logo}
            </span>
          )}
          {menu}
        </div>
      )}

      {(search != null || actions != null) && (
        <div className="ml-auto flex shrink-0 items-center gap-4">
          {search}
          {actions != null && (
            <div className="flex items-center gap-3">{actions}</div>
          )}
        </div>
      )}
    </header>
  ),
);
Gnb.displayName = 'Gnb';

// ─── GnbMenu ──────────────────────────────────────────────────────────────────

export interface GnbMenuProps extends HTMLAttributes<HTMLElement> {}

export const GnbMenu = forwardRef<HTMLElement, GnbMenuProps>(
  ({ className, children, ...rest }, ref) => (
    <nav
      ref={ref}
      aria-label="Main"
      className={cn('flex min-w-0 items-center gap-12', className)}
      {...rest}
    >
      {children}
    </nav>
  ),
);
GnbMenu.displayName = 'GnbMenu';

// ─── GnbMenuItem ──────────────────────────────────────────────────────────────

export interface GnbMenuItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Marks the current page — paints text-primary and sets aria-current. */
  active?: boolean;
  /** Render the child element instead of a `<button>` — e.g. a router `<Link>`. */
  asChild?: boolean;
}

export const GnbMenuItem = forwardRef<HTMLButtonElement, GnbMenuItemProps>(
  (
    { active = false, asChild = false, className, type = 'button', ...rest },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        // Slot forwards every prop onto the child, where `type` would be meaningless.
        {...(asChild ? {} : { type })}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'cursor-pointer whitespace-nowrap select-none',
          'text-base leading-lg tracking-lg font-medium',
          'transition-colors duration-150 ease-out',
          'hover:text-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
          'disabled:pointer-events-none disabled:text-neutral-disabled',
          active ? 'text-primary' : 'text-foreground',
          className,
        )}
        {...rest}
      />
    );
  },
);
GnbMenuItem.displayName = 'GnbMenuItem';
