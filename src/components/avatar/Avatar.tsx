import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference
  ─────────────────────────────────────────────────────────────────────────────
  COLORS (from global.css @theme)
  color/semantic/red/700          #ad3026 → bg-semantic-red-700  (--color-semantic-red-700)
  text/sematic/inverse            #ffffff → text-white
  border/neutral/inverse          #ffffff → border-white
  surface/neutral/subtle/default  #f5f5f5 → bg-surface-hover     (--color-surface-hover)

  RADIUS
  radius/full  999px → rounded-full

  BORDER (AvatarGroup overlap outline)
  stroke/sm    2px → border-2
  stroke/none  0px → (omit border)

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

  AVATAR GROUP
  static/space/8  8px → -mr-2 (overlap) / pr-2 (container right padding)
  stroke/sm       2px → border-2 (white outline between overlapping avatars)
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  src?: string;
  alt?: string;
  /**
   * Background color for initial/icon mode.
   * Pass a valid @theme color token name — e.g. 'semantic-red-700', 'brand'.
   * Raw hex values (#fff) and CSS variables are not accepted.
   * @default 'semantic-red-700'
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
  sm: 'h-profile-sm  w-profile-sm',
  md: 'h-profile-md  w-profile-md',
  lg: 'h-profile-lg  w-profile-lg',
  xl: 'h-profile-xl  w-profile-xl',
  '2xl': 'h-profile-2xl w-profile-2xl',
  '3xl': 'h-profile-3xl w-profile-3xl',
};

const textSizeMap: Record<AvatarSize, string> = {
  sm: 'text-11   leading-4  tracking-xs',
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
  'semantic-red-700': 'bg-semantic-red-700',
  brand: 'bg-brand',
  'brand-hover': 'bg-brand-hover',
  'brand-pressed': 'bg-brand-pressed',
  'brand-subtle': 'bg-brand-subtle',
  'surface-hover': 'bg-surface-hover',
  'surface-pressed': 'bg-surface-pressed',
  ink: 'bg-ink',
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      size = 'md',
      src,
      alt = '',
      backgroundColor = 'semantic-red-700',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const bgClass = BG_CLASS[backgroundColor] ?? 'bg-semantic-red-700';
    const isImage = !!src;
    return (
      <div
        ref={ref}
        className={cn(
          'shrink-0 rounded-full overflow-hidden flex items-center justify-center text-white',
          containerSizeMap[size],
          !isImage && bgClass,
          className,
        )}
        {...rest}
      >
        {isImage ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span
            className={cn(
              'font-semibold text-white select-none',
              textSizeMap[size],
            )}
          >
            {typeof children === 'string'
              ? children.charAt(0).toUpperCase()
              : children}
          </span>
        )}
      </div>
    );
  },
);
Avatar.displayName = 'Avatar';

// ─── AvatarGroup ──────────────────────────────────────────────────────────────

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ count, size = 'md', className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center pr-2',
        '[&>*]:-mr-2 [&>*]:border-2 [&>*]:border-white',
        className,
      )}
      {...rest}
    >
      {children}
      {!!count && (
        <div
          className={cn(
            'shrink-0 rounded-full flex items-center justify-center',
            'bg-semantic-red-700 border-2 border-white',
            containerSizeMap[size],
          )}
          aria-label={`${count} more`}
        >
          <span
            className={cn(
              'font-semibold text-white select-none',
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
