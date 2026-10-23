import { forwardRef, type HTMLAttributes } from 'react';
import * as RadixAvatar from '@radix-ui/react-avatar';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference
  ─────────────────────────────────────────────────────────────────────────────
  COLORS (from global.css @theme)
  icon/neutral/subtle             #9e9e9e → bg-neutral-subtle         (Initial, "+N" badge)
  surface/neutral/subtle/default  #f5f5f5 → bg-surface-neutral-subtle (Default placeholder)
  icon/neutral/subtle             #9e9e9e → text-icon-neutral-subtle  (placeholder silhouette)
  text/sematic/inverse            #ffffff → text-inverse
  border/neutral/subtle           #ededed → ring-border-neutral-subtle (NOT ring-neutral-subtle, that is #9e9e9e)
  border/neutral/inverse          #ffffff → ring-inverse
  color/semantic/red/700          #ad3026 → bg-semantic-red-700  (opt-in via backgroundColor)

  RADIUS
  radius/full  999px → rounded-full

  BORDER — Figma draws every stroke OUTSIDE the box, so they are rings (box-shadow),
  not borders: the 24–72px box stays the fill and nothing shrinks.
  Figma Profile frame 26950:4337 — Type=Default 27779:584…617, Type=Initial 26957:4584 / 27627:1697…1806
  stroke/xs    1px → ring-1  (Default placeholder and photo)
  stroke/none  0px → (omit ring: Initial)
  stroke/sm    2px → ring-2  (inside AvatarGroup only, see below)

  SIZES (from @theme — --height/width-profile-*)
  height/profile/sm   24px → h-profile-sm  w-profile-sm
  height/profile/md   32px → h-profile-md  w-profile-md
  height/profile/lg   40px → h-profile-lg  w-profile-lg
  height/profile/xl   48px → h-profile-xl  w-profile-xl
  height/profile/2xl  60px → h-profile-2xl w-profile-2xl
  height/profile/3xl  72px → h-profile-3xl w-profile-3xl

  TYPOGRAPHY — initials (font/weight/semibold = 600 → font-semibold, all sizes)
  Sm:  font/size/11=11px    → text-11   leading-4  tracking-xs   (font/line-height/sm=16px,  font/letter-spacing/xs=0.33px)
  Md:  font/size/14=14px    → text-sm   leading-5  tracking-md   (font/line-height/md=20px,  font/letter-spacing/md=0.2px)
  Lg:  font/size/16=16px    → text-base leading-6  tracking-lg   (font/line-height/lg=24px,  font/letter-spacing/lg=0.09px)
  XL:  font/size/20=20px    → text-xl   leading-7  tracking-2xl  (font/line-height/2xl=28px, font/letter-spacing/2xl=-0.24px)
  2XL: font/size/24=24px    → text-2xl  leading-8  tracking-3xl  (font/line-height/3xl=32px, font/letter-spacing/3xl=-0.55px)
  3XL: Border Radius/xxl=32px → text-32 leading-11 tracking-4xl  (font/line-height/4xl=44px, font/letter-spacing/4xl=-0.64px)

  AVATAR GROUP (Figma Avatar/Group — Type=Default 27627:1883, Type=Number 27627:1884)
  static/space/8  8px → -mr-2 (overlap) / pr-2 (container right padding)
  stroke/sm       2px → [&>[data-slot=avatar]]:ring-2 ring-border-neutral-subtle (avatars) / ring-2 ring-inverse ("+N" badge)
  The group rings only `[data-slot=avatar]` children: class + attribute outranks the
  child's own ring-1, and the badge's ring-inverse is left alone (with a bare
  `[&>*]` the parent's colour won the tie and the badge rang #ededed — measured).
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** One of the six Figma profile sizes, 24px through 72px. */
  size?: AvatarSize;
  /** Photo to show. Without it the avatar falls back to initials, then to the silhouette. */
  src?: string;
  /**
   * Alt text for `src`. Defaults to `''`, which marks the photo decorative — the
   * right call when the person's name is already next to it. Set it when the
   * avatar stands alone.
   */
  alt?: string;
  /**
   * Background color for initial/placeholder mode.
   * Pass a valid @theme color token name — e.g. 'semantic-red-700', 'brand'.
   * Anything else is applied as a raw CSS color, so a per-user hex also works.
   * @default 'neutral-subtle' with initials, 'surface-neutral-subtle' without
   */
  backgroundColor?: string;
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Total overflow count rendered as a "+N" badge.
   * Omit or set to 0 to hide the badge.
   */
  count?: number;
  /** Size of the overflow badge — should match the Avatar children. @default 'md' */
  size?: AvatarSize;
}

// ─── Token maps ───────────────────────────────────────────────────────────────

const containerSizeMap: Record<AvatarSize, string> = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12',
  '2xl': 'h-15 w-15',
  '3xl': 'h-18 w-18',
};

const textSizeMap: Record<AvatarSize, string> = {
  sm: 'text-[11px] leading-[initial] tracking-xs',
  md: 'text-sm   leading-5  tracking-md',
  lg: 'text-base leading-6  tracking-lg',
  xl: 'text-xl   leading-7  tracking-2xl',
  '2xl': 'text-2xl  leading-8  tracking-3xl',
  '3xl': 'text-32   leading-11 tracking-4xl',
};

/**
 * Allowed @theme color token names for the avatar background.
 * Values are the full Tailwind bg-* class to keep the scanner happy.
 */
const BG_CLASS: Record<string, string> = {
  'neutral-subtle': 'bg-neutral-subtle',
  'surface-neutral-subtle': 'bg-surface-neutral-subtle',
  'semantic-red-700': 'bg-semantic-red-700',
  brand: 'bg-brand',
  'brand-hover': 'bg-brand-hover',
  'brand-pressed': 'bg-brand-pressed',
  'brand-subtle': 'bg-brand-subtle',
  'surface-hover': 'bg-surface-hover',
  'surface-pressed': 'bg-surface-pressed',
  ink: 'bg-foreground',
};

// ─── Placeholder ──────────────────────────────────────────────────────────────

/**
 * Figma's "Default" avatar: a head circle over a shoulders ellipse whose bottom
 * is clipped by the avatar's round edge.
 *
 * Coordinates are the exported mask geometry re-expressed in the avatar's own
 * 72×72 box, so one viewBox scales to every size: the 47×61 leaf sits 13px from
 * the left (18.06%) with its centre 12.5px below the middle, which puts the
 * shoulders' bottom edge at y=78.5 — outside the circle, hence the flush clip.
 */
function AvatarPlaceholder() {
  return (
    <svg
      viewBox="0 0 72 72"
      fill="currentColor"
      aria-hidden="true"
      className="size-full text-icon-neutral-subtle"
    >
      <circle cx="36.5" cy="31" r="12.6" />
      <ellipse cx="36.5" cy="62.5" rx="23" ry="16" />
    </svg>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

/**
 * A person or entity as a round photo, initials, or a silhouette — in that order
 * of preference, so it degrades on its own when `src` is missing or fails to
 * load. Pass the display name as children and only the first letter is rendered.
 *
 * Photos and the placeholder wear a 1px border/neutral/subtle ring outside the
 * box; initials alone do not (Figma `stroke/none`).
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      size = 'md',
      src,
      alt = '',
      backgroundColor,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const hasInitials = children != null && children !== '';
    // Figma puts initials on icon/neutral/subtle and the placeholder on the
    // lighter surface/neutral/subtle. An explicit backgroundColor always wins.
    const bgToken =
      backgroundColor ??
      (hasInitials ? 'neutral-subtle' : 'surface-neutral-subtle');
    const bgClass = BG_CLASS[bgToken];
    // Token names outside the map fall through to a raw CSS color, which is how
    // callers pass a per-user hex.
    const bgStyle = !src && !bgClass ? { backgroundColor: bgToken } : undefined;
    const initial =
      typeof children === 'string'
        ? children.charAt(0).toUpperCase()
        : children;
    // Figma: Initial is the one variant with stroke/none. Everything else — the
    // light placeholder and photos — gets stroke/xs so it still reads on white.
    const isInitialsOnly = hasInitials && !src;

    return (
      <RadixAvatar.Root
        ref={ref}
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full text-inverse',
          containerSizeMap[size],
          !src && bgClass,
          !isInitialsOnly && 'ring-1 ring-border-neutral-subtle',
          className,
        )}
        style={bgStyle}
        // AvatarGroup targets this to ring its avatars but not its "+N" badge.
        data-slot="avatar"
        {...rest}
      >
        {src && (
          <RadixAvatar.Image
            src={src}
            alt={alt}
            className="size-full object-cover"
          />
        )}
        <RadixAvatar.Fallback
          delayMs={0}
          className={cn(
            'flex size-full items-center justify-center overflow-hidden font-semibold',
            textSizeMap[size],
          )}
        >
          {hasInitials ? initial : !src && <AvatarPlaceholder />}
        </RadixAvatar.Fallback>
      </RadixAvatar.Root>
    );
  },
);
Avatar.displayName = 'Avatar';

// ─── AvatarGroup ──────────────────────────────────────────────────────────────

/**
 * Overlaps its `Avatar` children into a stack and closes it with an optional
 * "+N" badge. It only lays them out — pass the same `size` here as on the
 * children, since the badge has no way to read theirs.
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ count, size = 'md', className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center pr-2',
        // Figma: every avatar in a group wears stroke/sm in border/neutral/subtle.
        // Target `[data-slot=avatar]`, not `*`: the attribute gives this rule a
        // higher specificity than the child's own `ring-1`, and keeps the badge
        // below out of it so its `ring-inverse` stands.
        '[&>*]:-mr-2',
        '[&>[data-slot=avatar]]:ring-2 [&>[data-slot=avatar]]:ring-border-neutral-subtle',
        className,
      )}
      {...rest}
    >
      {children}
      {!!count && (
        <div
          className={cn(
            // `relative` keeps the badge on top of the stack: Avatar is itself
            // positioned, so a static badge would paint *under* its neighbour.
            'relative shrink-0 rounded-full flex items-center justify-center',
            // The badge is the one child on border/neutral/inverse; the parent
            // only rings `[data-slot=avatar]`, so nothing competes with this.
            'bg-neutral-subtle ring-2 ring-inverse',
            containerSizeMap[size],
          )}
          aria-label={`${count} more`}
        >
          <span
            className={cn(
              'font-semibold text-inverse select-none',
              textSizeMap[size],
            )}
          >
            +{count}
          </span>
        </div>
      )}
    </div>
  ),
);
AvatarGroup.displayName = 'AvatarGroup';
