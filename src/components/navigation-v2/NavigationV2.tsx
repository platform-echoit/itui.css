import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind map (Figma node 28390:4665 "Navigation")
  ─────────────────────────────────────────────────────────────────────────────
  The mobile navigation bars. Deliberately separate from navigation/Navigation.tsx
  (V1), which stays untouched — hence the V2 suffix on every export.

  BARS (shared)
  height/navigation/md       56px      → h-14   (--size-navigation-md exists but the
                                        --size-* namespace only generates the square
                                        size-* utility, never h-* — see TOKENS.md §9)
  surface/neutral/secondary  #fafafa   → bg-inverse           (--color-inverse)
  spacing/lg                 16px      → px-4
  spacing/sm                 8px       → py-2   (bottom bar only)
  shadow/downwards/sm                  → shadow-downwards-sm  (0 4px 16px rgba(26,26,26,.08))
  shadow/upwards/sm                    → shadow-upwards-sm    (same blur at offset-y -4)

  TOP BAR — types BackIcon · BackButton · MenuAvatar · Logo · LogoBack
  inner "icon" frame         32px      → h-8. Figma's 16px vertical padding would
                                        overflow the 56px bar (16+32+16), so the row
                                        is only centered — same resolution as Gnb.
  spacing/md                 12px      → gap-3  (left / right cluster, default)
  spacing/lg                 16px      → gap-4  (BackIcon cell → actionGap="lg")
  typography/body/lg/medium  16/26/0.09 → text-base leading-lg tracking-lg font-medium
  text/neutral/default       #0f0f0f   → text-foreground

  All five Figma cells are the same three slots — a left cluster, an optional
  centered title, a right cluster — so they are props rather than variants:
    BackIcon   left=caret            right=3 icon buttons (actionGap="lg")
    BackButton left=caret            right=primary button + icon button
    MenuAvatar left=menu button      title="제목"   right=avatar
    Logo       left=logo             right=3 icon buttons
    LogoBack   left=caret + logo     right=3 icon buttons

  BOTTOM BAR — Base Navigation item, State=Default | Select
  item box                   56px      → min-w-14 (+ flex-1, see below)
  spacing/sm                 8px       → p-2
  spacing/xs                 4px       → gap-1
  height/icon/lg             20px      → size-5
  typography/body/md/medium  14/24/0.2 → text-sm leading-md tracking-md font-medium
  text|icon/primary/default  #009ce0   → text-primary     (State=Select)
  text|icon/neutral/default  #0f0f0f   → text-foreground  (State=Default)

  Figma pins 56px items on a 390px bar with justify-between; here the items are
  flex-1 with a 56px floor, so they stay evenly spread at any width and tab count —
  the same behaviour as BottomNavigationItem in V1. ITUI icons hardcode
  fill="#101010", so the icon slot adds [&_path]:fill-current to let the active
  colour reach the glyph.

  Responsive: both bars are w-full; consumers add fixed/sticky positioning.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── TopNavigationV2 (mobile app bar) ─────────────────────────────────────────

export interface TopNavigationV2Props
  extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Leading cluster — back caret, menu button, logo, or any combination. */
  left?: ReactNode;
  /** Centered title. Truncates when the clusters leave too little room. */
  title?: ReactNode;
  /** Trailing cluster — icon buttons, a primary button, or an avatar. */
  right?: ReactNode;
  /**
   * Gap inside both clusters: `spacing/md` (12px) on every Figma cell except
   * BackIcon, which spaces its three icon buttons by `spacing/lg` (16px).
   * @default 'md'
   */
  actionGap?: 'md' | 'lg';
}

/**
 * The mobile app bar: a leading slot, a centred title and a trailing slot. The
 * current version of `TopNavigation` — every slot also accepts `asChild`, so a
 * router link can be the element itself.
 */
export const TopNavigationV2 = forwardRef<HTMLElement, TopNavigationV2Props>(
  ({ left, title, right, actionGap = 'md', className, ...rest }, ref) => {
    const clusterClass = cn(
      'flex shrink-0 items-center',
      actionGap === 'lg' ? 'gap-4' : 'gap-3',
    );

    return (
      <header
        ref={ref}
        className={cn(
          'flex h-14 w-full items-center px-4',
          'bg-inverse shadow-downwards-sm',
          className,
        )}
        {...rest}
      >
        <div className="flex h-8 min-w-0 flex-1 items-center">
          <div className={clusterClass}>{left}</div>
          {/* Always rendered: with no title it is the spacer that pushes the
              right cluster to the edge, i.e. Figma's justify-between cells. */}
          <div className="flex min-w-0 flex-1 items-center justify-center">
            {title != null && (
              <span className="truncate text-base leading-lg tracking-lg font-medium text-foreground">
                {title}
              </span>
            )}
          </div>
          <div className={clusterClass}>{right}</div>
        </div>
      </header>
    );
  },
);
TopNavigationV2.displayName = 'TopNavigationV2';

// ─── BottomNavigationV2 (mobile tab bar) ──────────────────────────────────────

export interface BottomNavigationV2Props extends HTMLAttributes<HTMLElement> {}

/**
 * The mobile tab bar pinned to the bottom edge. Holds `BottomNavigationItemV2`s,
 * which share the width evenly.
 */
export const BottomNavigationV2 = forwardRef<
  HTMLElement,
  BottomNavigationV2Props
>(({ className, children, ...rest }, ref) => (
  <nav
    ref={ref}
    aria-label="Bottom navigation"
    className={cn(
      'flex h-14 w-full items-center px-4 py-2',
      'bg-inverse shadow-upwards-sm',
      className,
    )}
    {...rest}
  >
    {children}
  </nav>
));
BottomNavigationV2.displayName = 'BottomNavigationV2';

// ─── BottomNavigationItemV2 ───────────────────────────────────────────────────

export interface BottomNavigationItemV2Props
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Glyph slot — rendered in Figma's 20px `height/icon/lg` box. */
  icon?: ReactNode;
  /** Caption under the icon. Truncates rather than wrapping. */
  label?: ReactNode;
  /** Figma `State=Select` — paints icon + label text-primary and sets aria-current. */
  active?: boolean;
  /** Render the child element instead of a `<button>` — e.g. a router `<Link>`. */
  asChild?: boolean;
}

/**
 * One tab of a `BottomNavigationV2` — icon over label. Pass `asChild` to make it
 * a router link rather than a `<button>`.
 */
export const BottomNavigationItemV2 = forwardRef<
  HTMLButtonElement,
  BottomNavigationItemV2Props
>(
  (
    {
      icon,
      label,
      active = false,
      asChild = false,
      className,
      type = 'button',
      children,
      ...rest
    },
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
          'flex min-w-14 flex-1 cursor-pointer flex-col items-center justify-center gap-1 p-2 select-none',
          'transition-colors duration-150 ease-out',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
          'disabled:pointer-events-none disabled:text-neutral-disabled',
          active ? 'text-primary' : 'text-foreground',
          className,
        )}
        {...rest}
      >
        {icon != null && (
          <span
            className="flex size-5 shrink-0 items-center justify-center [&>svg]:size-5 [&_path]:fill-current"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        {label != null && (
          <span className="max-w-full truncate text-sm leading-md tracking-md font-medium">
            {label}
          </span>
        )}
        {/* asChild: Slottable marks the consumer element, so icon/label become
            its children instead of extra siblings Slot would reject. */}
        <Slottable>{children}</Slottable>
      </Comp>
    );
  },
);
BottomNavigationItemV2.displayName = 'BottomNavigationItemV2';
