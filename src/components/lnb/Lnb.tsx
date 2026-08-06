import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';
import { Avatar } from '../avatar/Avatar';
import { CaretDownRegularIcon } from '../../icons/ITUI/caret-down';
import { SidebarSimpleRegularIcon } from '../../icons/ITUI/sidebar-simple';
import { UserRegularIcon } from '../../icons/ITUI/user';

/*
  Token → Tailwind map (Figma node 28392:397 "LNB")
  ─────────────────────────────────────────────────────────────────────────────
  The desktop left navigation rail. Deliberately separate from sidebar/Sidebar.tsx,
  which stays untouched — this one adds the folding sub-menu, the collapse toggle
  and the user footer that Figma specs here.

  RAIL — Type=Collapse | Expand (With Folding) | Expand (Without Folding)
  collapsed width                    52px    → w-13   (3.25rem)
  expanded width                    264px    → w-66   (16.5rem)
  surface/neutral/secondary/default #fafafa  → bg-inverse   (--color-inverse)
  border/neutral/subtle             #ededed  → border-r border-border-neutral-subtle
  stroke/xs                            1px   → border-r
  shadow/rightwards/sm    4px 0 16px #1a1a1a14 → shadow-rightwards-sm
  spacing/sm                           8px   → p-2
  spacing/3xl                         32px   → gap-8  (logo ↔ menu)

  BASE LNB ROW — Type=IconOnly | LabelIcon | Avatar, State=Default | Hover | Select
  height/lnb/sm                       36px   → h-9  (--size-lnb-sm exists but the
                                                --size-* namespace only generates the
                                                square size-* utility, never h-* —
                                                see TOKENS.md §9)
  height/lnb/md                       48px   → h-12 (Avatar row)
  radius/sm                            8px   → rounded-lg
  spacing/sm                           8px   → p-2 · gap-2
  spacing/md                          12px   → gap-3 (collapsed avatar cell)
  height/icon/lg                      20px   → size-5 (leading glyph)
  height/icon/md                      16px   → size-4 (caret)
  height/profile/sm                   24px   → Avatar size="sm"
  sub-item indent                     36px   → px-9
  surface/neutral/secondary/default #fafafa  → bg-inverse       (State=Default)
  surface/neutral/secondary/hover   #f5f5f5  → hover:bg-muted   (State=Hover)
  surface/neutral/secondary/pressed #ededed  → bg-secondary     (State=Select)
  text|icon/neutral/default         #0f0f0f  → text-foreground
  text/neutral/muted                #595858  → text-neutral-muted (sub-items · email)
  typography/body/md/medium      14/24/0.2   → text-sm leading-md tracking-md font-medium
  typography/caption/sm/regular  12/20/0.3   → text-xs leading-sm tracking-sm

  STATE STRATEGY
  No createContext / useContext — the rail sets data-collapsed + group/lnb and every
  part adapts through group-data-collapsed/lnb: variants, so the consuming layout owns
  the collapsed state (same approach as sidebar/Sidebar.tsx). Only LnbGroup is stateful,
  and that state is Radix Collapsible's own data-[state] attribute.

  Figma's three rail types are the same rail with two switches, so they are props
  rather than variants:
    Collapse                  collapsed + LnbLogo action (revealed on hover)
    Expand (With Folding)     LnbLogo action={<LnbToggle />}
    Expand (Without Folding)  LnbLogo with no action

  Figma's Collapse/Hover state swaps the logo for the SidebarSimple toggle. The swap
  is keyed off hovering the logo cell rather than the whole rail: a same-element group
  cannot be both the data-collapsed and the :hover ancestor, and pointing at the cell
  that changes is the clearer affordance. focus-within mirrors it for keyboard users.

  ITUI icons hardcode fill="#101010", so every glyph slot adds [&_path]:fill-current
  to let the row's text colour reach the path.

  ANIMATION
  rail 52 ⇄ 264px       transition-[width] duration-200 ease-out
  group open/close      animate-collapsible-down / -up (@keyframes in global.css)
  caret                 transition-transform duration-200 → rotate-180 when open
  logo ⇄ toggle         transition-opacity duration-150, crossfade on the collapsed rail
  row fills             transition-colors duration-150 ease-out (ROW_BASE)

  The tailwindcss-animate utilities (animate-in / fade-in-0 / zoom-in-95 /
  slide-in-from-*) that dialog, dropdown-menu, select, tooltip, popover and
  overflow-menu reach for are NOT available — the plugin is not a dependency, so
  those classes compile to nothing (bottom-sheet/BottomSheet.tsx documents the same
  finding). Everything here is therefore a plain transition or a real @keyframes
  token, both of which do compile. Durations/easing come from the motion tokens, and
  every one is disabled under motion-reduce: / prefers-reduced-motion.
  ─────────────────────────────────────────────────────────────────────────────
*/

/**
 * Shared Base LNB row geometry — LnbItem, LnbGroupTrigger and LnbUser are the same
 * 8px-padded, 8px-radius row that shrinks to Figma's 36×36 square on the collapsed rail.
 */
const ROW_BASE = [
  'flex w-full cursor-pointer items-center gap-2 rounded-lg p-2 text-left select-none outline-none',
  'transition-colors duration-150 ease-out',
  'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
  'disabled:pointer-events-none disabled:text-neutral-disabled',
  'group-data-collapsed/lnb:w-9 group-data-collapsed/lnb:justify-center',
].join(' ');

/** Figma State=Select keeps the pressed fill, so it must also win over :hover. */
const rowFill = (active: boolean) =>
  active
    ? 'bg-secondary hover:bg-secondary'
    : 'bg-inverse hover:bg-muted active:bg-secondary';

/** 20px `height/icon/lg` slot — hidden from AT, glyph inherits the row colour. */
const ICON_SLOT =
  'flex size-5 shrink-0 items-center justify-center [&>svg]:size-5 [&_path]:fill-current';

/** 16px `height/icon/md` caret slot. Figma's IconOnly row has no caret. */
const CARET_SLOT =
  'flex size-4 shrink-0 items-center justify-center [&>svg]:size-4 [&_path]:fill-current group-data-collapsed/lnb:hidden';

/**
 * Figma draws `CaretDown` closed and `CaretUp` open. `CaretUp` is `CaretDown` rotated
 * 180°, so one rotating glyph lands on the identical shape *and* can animate between
 * the two — swapping two separate glyphs cannot. Same resolution Accordion reached.
 */
const CARET_ICON =
  'transition-transform duration-200 ease-out motion-reduce:transition-none';

// ─── Lnb (rail) ───────────────────────────────────────────────────────────────

export interface LnbProps extends HTMLAttributes<HTMLElement> {
  /** Collapse to the 52px icon-only rail. Default: false → 264px expanded. */
  collapsed?: boolean;
}

/**
 * The left navigation rail: a full-height `<nav>` that toggles between a 264px
 * expanded state and a 52px icon-only one. `collapsed` is yours to control — the
 * rail publishes it to every part below through a data attribute, so labels,
 * carets and sub-menus all follow it without props of their own.
 */
export const Lnb = forwardRef<HTMLElement, LnbProps>(
  ({ collapsed = false, className, children, ...rest }, ref) => (
    <nav
      ref={ref}
      data-collapsed={collapsed || undefined}
      className={cn(
        'group/lnb flex h-full flex-col justify-between p-2',
        'bg-inverse border-r border-border-neutral-subtle shadow-rightwards-sm',
        'transition-[width] duration-200 ease-out motion-reduce:transition-none',
        collapsed ? 'w-13 items-center' : 'w-66 items-start',
        className,
      )}
      {...rest}
    >
      {children}
    </nav>
  ),
);
Lnb.displayName = 'Lnb';

// ─── LnbHeader (Figma "logo/menu") ────────────────────────────────────────────

export interface LnbHeaderProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * The scrolling top region of the rail — logo and menus. It takes the leftover
 * height, which is what keeps `LnbFooter` pinned when the menu grows long.
 */
export const LnbHeader = forwardRef<HTMLDivElement, LnbHeaderProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        // flex-1 + min-h-0 keeps the footer pinned while a long menu scrolls,
        // which is what Figma's 1080px rail draws once the menu outgrows it.
        'flex min-h-0 w-full flex-1 flex-col items-start gap-8 overflow-y-auto',
        'group-data-collapsed/lnb:w-auto group-data-collapsed/lnb:items-center',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);
LnbHeader.displayName = 'LnbHeader';

// ─── LnbLogo ──────────────────────────────────────────────────────────────────

export interface LnbLogoProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Trailing collapse control — Figma `Type=Expand (With Folding)`. Omit it for
   * `Expand (Without Folding)`. On the collapsed rail it replaces the logo on
   * hover/focus, which is Figma's `Collapse / Hover` state.
   */
  action?: ReactNode;
}

/**
 * The brand row at the top of the rail. Give it an `action` (usually an
 * `LnbToggle`) and, on the collapsed rail, that control takes the logo's place
 * on hover or focus rather than sitting beside it.
 */
export const LnbLogo = forwardRef<HTMLDivElement, LnbLogoProps>(
  ({ action, className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'group/lnb-logo relative flex h-9 w-full shrink-0 items-center justify-between',
        'group-data-collapsed/lnb:w-9 group-data-collapsed/lnb:justify-center',
        className,
      )}
      {...rest}
    >
      <span
        className={cn(
          'flex min-w-0 items-center',
          'transition-opacity duration-150 ease-out motion-reduce:transition-none',
          action != null &&
            'group-data-collapsed/lnb:group-hover/lnb-logo:opacity-0 group-data-collapsed/lnb:group-focus-within/lnb-logo:opacity-0',
        )}
      >
        {children}
      </span>
      {action != null && (
        <span
          className={cn(
            'flex shrink-0 items-center',
            'transition-opacity duration-150 ease-out motion-reduce:transition-none',
            // Collapsed: the toggle takes the logo's place instead of sitting beside it.
            // opacity-0 rather than invisible so the two crossfade — and so the button
            // keeps its place in the tab order, which is what makes the focus-within
            // reveal below reachable by keyboard at all.
            'group-data-collapsed/lnb:absolute group-data-collapsed/lnb:inset-0 group-data-collapsed/lnb:justify-center group-data-collapsed/lnb:opacity-0',
            'group-data-collapsed/lnb:group-hover/lnb-logo:opacity-100 group-data-collapsed/lnb:group-focus-within/lnb-logo:opacity-100',
          )}
        >
          {action}
        </span>
      )}
    </div>
  ),
);
LnbLogo.displayName = 'LnbLogo';

// ─── LnbToggle ────────────────────────────────────────────────────────────────

export interface LnbToggleProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Glyph override. Defaults to Figma's `SidebarSimple` (26864:20157). */
  icon?: ReactNode;
}

/**
 * The collapse/expand button. It only reports the intent — flipping `Lnb`'s
 * `collapsed` is still yours to do.
 */
export const LnbToggle = forwardRef<HTMLButtonElement, LnbToggleProps>(
  (
    { icon, className, type = 'button', 'aria-label': ariaLabel, ...rest },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel ?? 'Toggle navigation'}
      className={cn(
        'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg p-2 outline-none',
        'text-foreground transition-colors duration-150 ease-out',
        'hover:bg-muted active:bg-secondary',
        'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
        '[&>svg]:size-5 [&_path]:fill-current',
        className,
      )}
      {...rest}
    >
      {icon ?? <SidebarSimpleRegularIcon />}
    </button>
  ),
);
LnbToggle.displayName = 'LnbToggle';

// ─── LnbMenu ──────────────────────────────────────────────────────────────────

export interface LnbMenuProps extends HTMLAttributes<HTMLUListElement> {}

/** A `<ul>` of `LnbItem` rows and `LnbGroup`s. Use one per section of the rail. */
export const LnbMenu = forwardRef<HTMLUListElement, LnbMenuProps>(
  ({ className, children, ...rest }, ref) => (
    <ul
      ref={ref}
      className={cn(
        'm-0 flex w-full shrink-0 list-none flex-col gap-2 p-0',
        'group-data-collapsed/lnb:w-auto group-data-collapsed/lnb:items-center',
        className,
      )}
      {...rest}
    >
      {children}
    </ul>
  ),
);
LnbMenu.displayName = 'LnbMenu';

// ─── LnbItem ──────────────────────────────────────────────────────────────────

export interface LnbItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Leading glyph — Figma's 20px `height/icon/lg` slot. Drives the collapsed rail. */
  icon?: ReactNode;
  /** Row label. Visually hidden (but still the accessible name) when collapsed. */
  label?: ReactNode;
  /** Figma `State=Select` — paints the pressed fill and sets `aria-current`. */
  active?: boolean;
  /** Sub-item inside an open LnbGroup: 36px indent, muted label, no glyph. */
  indented?: boolean;
  /** Render `children` instead of a `<button>` — e.g. a router `<Link>`. */
  asChild?: boolean;
}

/**
 * One navigation row. On the collapsed rail the label is visually hidden but
 * stays the accessible name, so an icon-only row is still announced. It is a
 * `<button>` by default — pass `asChild` to make it a router link.
 */
export const LnbItem = forwardRef<HTMLButtonElement, LnbItemProps>(
  (
    {
      icon,
      label,
      active = false,
      indented = false,
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
      <li className="w-full list-none group-data-collapsed/lnb:w-auto">
        <Comp
          ref={ref}
          // Slot forwards every prop onto the child, where `type` is meaningless.
          {...(asChild ? {} : { type })}
          aria-current={active ? 'page' : undefined}
          className={cn(
            ROW_BASE,
            'h-9',
            rowFill(active),
            indented
              ? 'px-9 text-neutral-muted group-data-collapsed/lnb:px-2'
              : 'text-foreground',
            className,
          )}
          {...rest}
        >
          {/* Figma's sub-items carry no glyph, so the slot is dropped when indented. */}
          {icon != null && !indented && (
            <span className={ICON_SLOT} aria-hidden="true">
              {icon}
            </span>
          )}
          <span className="min-w-0 flex-1 truncate group-data-collapsed/lnb:sr-only">
            {label}
          </span>
          {/* asChild: Slottable marks the consumer element, so icon/label become its
              children instead of extra siblings Slot would reject. */}
          <Slottable>{children}</Slottable>
        </Comp>
      </li>
    );
  },
);
LnbItem.displayName = 'LnbItem';

// ─── LnbGroup (folding sub-menu) ──────────────────────────────────────────────

export interface LnbGroupProps
  extends ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root> {}

/**
 * A collapsible section of the menu: put an `LnbGroupTrigger` and an
 * `LnbGroupContent` inside it. It renders as the `<li>` that `LnbMenu` expects.
 */
export const LnbGroup = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Root>,
  LnbGroupProps
>(({ className, children, ...rest }, ref) => (
  // asChild keeps the markup valid: LnbMenu is a <ul>, so a group must be an <li>.
  // `children` has to be nested inside that <li> — as a sibling it would be the
  // element Slot clones, and the trigger/content would be dropped.
  <CollapsiblePrimitive.Root ref={ref} asChild {...rest}>
    <li
      className={cn(
        'w-full list-none group-data-collapsed/lnb:w-auto',
        className,
      )}
    >
      {children}
    </li>
  </CollapsiblePrimitive.Root>
));
LnbGroup.displayName = 'LnbGroup';

// ─── LnbGroupTrigger ──────────────────────────────────────────────────────────

export interface LnbGroupTriggerProps
  extends ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> {
  /** Leading glyph — Figma's 20px `height/icon/lg` slot. */
  icon?: ReactNode;
  /** Row label. Visually hidden (but still the accessible name) when collapsed. */
  label?: ReactNode;
}

/**
 * The row that opens an `LnbGroup`. It draws its own caret and keeps the
 * selected fill while the group is open.
 */
export const LnbGroupTrigger = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Trigger>,
  LnbGroupTriggerProps
>(({ icon, label, className, ...rest }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={cn(
      'group/lnb-trigger',
      ROW_BASE,
      'h-9 text-foreground',
      rowFill(false),
      // An open group is Figma's State=Select, so it keeps the pressed fill.
      'data-[state=open]:bg-secondary data-[state=open]:hover:bg-secondary',
      // ...except on the collapsed rail, where the sub-items it opens are hidden,
      // so the fill would advertise a state the user cannot see. Figma draws every
      // collapsed cell plain.
      'group-data-collapsed/lnb:data-[state=open]:bg-inverse group-data-collapsed/lnb:data-[state=open]:hover:bg-muted',
      className,
    )}
    {...rest}
  >
    {icon != null && (
      <span className={ICON_SLOT} aria-hidden="true">
        {icon}
      </span>
    )}
    <span className="min-w-0 flex-1 truncate group-data-collapsed/lnb:sr-only">
      {label}
    </span>
    <span className={CARET_SLOT} aria-hidden="true">
      <CaretDownRegularIcon
        className={cn(
          CARET_ICON,
          'group-data-[state=open]/lnb-trigger:rotate-180',
        )}
      />
    </span>
  </CollapsiblePrimitive.Trigger>
));
LnbGroupTrigger.displayName = 'LnbGroupTrigger';

// ─── LnbGroupContent ──────────────────────────────────────────────────────────

export interface LnbGroupContentProps
  extends ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content> {}

/**
 * The sub-items an `LnbGroup` reveals — pass `LnbItem`s with `indented`. It is
 * hidden entirely on the collapsed rail, which has no room for them.
 */
export const LnbGroupContent = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Content>,
  LnbGroupContentProps
>(({ className, children, ...rest }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    // The collapsed rail is icon-only, so Figma draws no sub-items there.
    // overflow-hidden is what lets the height keyframes clip the sub-items as they
    // slide; the keyframes themselves live in global.css (height cannot be animated
    // by a `transition` because `auto` has no interpolatable value).
    className={cn(
      'overflow-hidden group-data-collapsed/lnb:hidden',
      'data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up',
      className,
    )}
    {...rest}
  >
    <ul className="m-0 flex list-none flex-col gap-2 p-0 pt-2">{children}</ul>
  </CollapsiblePrimitive.Content>
));
LnbGroupContent.displayName = 'LnbGroupContent';

// ─── LnbFooter ────────────────────────────────────────────────────────────────

export interface LnbFooterProps extends HTMLAttributes<HTMLDivElement> {}

/** The pinned bottom region of the rail — settings, the signed-in user. */
export const LnbFooter = forwardRef<HTMLDivElement, LnbFooterProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex w-full shrink-0 flex-col gap-2 pt-2',
        'group-data-collapsed/lnb:w-auto group-data-collapsed/lnb:items-center',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);
LnbFooter.displayName = 'LnbFooter';

// ─── LnbUser (Base LNB, Type=Avatar) ──────────────────────────────────────────

/**
 * Figma's placeholder profile — a `User` glyph on a neutral circle. Avatar's own
 * default fill is `bg-semantic-red-700`, which has no `@theme` entry and so paints
 * nothing behind its white initial; passing the fill here keeps LnbUser on tokens
 * that exist without touching Avatar's defaults.
 *
 * surface/neutral/subtle/default #f5f5f5 → bg-surface-neutral-subtle
 * icon/neutral/subtle            #9e9e9e → text-neutral-subtle
 */
const LnbUserAvatar = () => (
  <Avatar
    size="sm"
    className="bg-surface-neutral-subtle text-neutral-subtle"
    aria-hidden="true"
  >
    <UserRegularIcon className="size-4 [&_path]:fill-current" />
  </Avatar>
);

// `name` shadows the button's own HTML attribute, so it is omitted — same
// resolution TopNavigationV2Props reached for `title`.
export interface LnbUserProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'name'> {
  /** Primary line — `typography/body/md/medium`. Also the collapsed accessible name. */
  name?: ReactNode;
  /** Secondary line — `typography/caption/sm/regular`. */
  email?: ReactNode;
  /** Avatar override. Defaults to a 24px `height/profile/sm` Avatar of `name`. */
  avatar?: ReactNode;
  /** Figma `State=Select` — paints the pressed fill. */
  active?: boolean;
  /** Render `children` instead of a `<button>` — e.g. a DropdownMenu trigger. */
  asChild?: boolean;
}

/**
 * The signed-in user row at the foot of the rail: avatar, name and email. Pass
 * `asChild` to make it the trigger of a menu rather than a plain button.
 */
export const LnbUser = forwardRef<HTMLButtonElement, LnbUserProps>(
  (
    {
      name,
      email,
      avatar,
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
        {...(asChild ? {} : { type })}
        className={cn(
          'group/lnb-user',
          ROW_BASE,
          'h-12 justify-between',
          rowFill(active),
          // Radix triggers set data-state, so the caret and fill follow an open menu.
          'data-[state=open]:bg-secondary data-[state=open]:hover:bg-secondary',
          // Collapsed: Figma's 36×36 AvatarOnly cell.
          'group-data-collapsed/lnb:size-9',
          className,
        )}
        {...rest}
      >
        <span className="flex min-w-0 items-center gap-2 group-data-collapsed/lnb:gap-3">
          {avatar ?? <LnbUserAvatar />}
          <span className="flex min-w-0 flex-col group-data-collapsed/lnb:sr-only">
            <span className="w-full truncate text-sm leading-md tracking-md font-medium text-foreground">
              {name}
            </span>
            {email != null && (
              <span className="w-full truncate text-xs leading-sm tracking-sm text-neutral-muted">
                {email}
              </span>
            )}
          </span>
        </span>
        <span className={CARET_SLOT} aria-hidden="true">
          <CaretDownRegularIcon
            className={cn(
              CARET_ICON,
              'group-data-[state=open]/lnb-user:rotate-180',
            )}
          />
        </span>
        <Slottable>{children}</Slottable>
      </Comp>
    );
  },
);
LnbUser.displayName = 'LnbUser';
