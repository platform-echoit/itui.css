import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference (Figma node 28386:3249 "Float")
  ─────────────────────────────────────────────────────────────────────────────
  CONTAINER
  height/float/md      56px    → size-float-md   (--size-float-md)
  height/float/sm      40px    → size-float-sm   (--size-float-sm)
  spacing/sm           8px     → p-2
  radius/full          999px   → rounded-full
  shadow/downwards/md          → shadow-downwards-md  (--shadow-downwards-md,
                                 0 12px 24px 0 rgba(26,26,26,0.08) — the box-shadow
                                 form of Figma's DROP_SHADOW blur/md at offset-y 12)

  SURFACE — states
  surface/primary/default  #009ce0 → bg-surface-primary
  surface/primary/hover    #54bdea → hover:bg-surface-primary-hover
  surface/primary/pressed  #008ecc → active:bg-surface-primary-pressed

  ICON
  icon/primary/inverse  #fafafa → text-inverse + [&_path]:fill-current
                                  (ITUI icons hardcode fill="#101010" on the path,
                                  so a text-* class alone cannot recolour them)
  height/icon/lg        20px    → [&_svg]:size-5  (size sm)
  exception/icon/28     28px    → [&_svg]:size-7  (1.75rem, already on the spacing
                                  scale — no dedicated icon token needed)

  DISABLED — not specified in Figma; mirrors Button variant="primary" so the two
  brand-filled controls grey out the same way.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

export type FloatingButtonSize = 'sm' | 'md';

export interface FloatingButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 56px with a 28px icon, or 40px with a 20px one. @default 'md' */
  size?: FloatingButtonSize;
  /** Render the child element instead of a `<button>` — e.g. a router `<Link>`. */
  asChild?: boolean;
}

// ─── Size map ─────────────────────────────────────────────────────────────────

/* Figma pins the button box and the icon box separately — padding never scales
   the icon, so each size carries both classes. */
const sizeConfig: Record<FloatingButtonSize, { root: string; icon: string }> = {
  md: { root: 'size-float-md', icon: '[&_svg]:size-7' },
  sm: { root: 'size-float-sm', icon: '[&_svg]:size-5' },
};

// ─── FloatingButton ───────────────────────────────────────────────────────────

/**
 * The round, shadowed action button that floats over content — a FAB. It draws
 * only the button: pinning it to a corner is the page's job, and its icon child
 * is recoloured and sized to match, so pass a bare icon rather than a wrapper.
 */
export const FloatingButton = forwardRef<
  HTMLButtonElement,
  FloatingButtonProps
>(
  (
    { size = 'md', asChild = false, className, type = 'button', ...rest },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    const { root, icon } = sizeConfig[size];

    return (
      <Comp
        ref={ref}
        // Slot forwards every prop onto the child, where `type` would be meaningless.
        {...(asChild ? {} : { type })}
        className={cn(
          'inline-flex shrink-0 cursor-pointer select-none items-center justify-center',
          'rounded-full p-2 shadow-downwards-md',
          'bg-surface-primary text-inverse',
          'hover:bg-surface-primary-hover',
          'active:bg-surface-primary-pressed',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
          'disabled:pointer-events-none disabled:bg-secondary disabled:text-neutral-disabled disabled:shadow-none',
          '[&_svg]:shrink-0 [&_path]:fill-current',
          root,
          icon,
          className,
        )}
        {...rest}
      />
    );
  },
);

FloatingButton.displayName = 'FloatingButton';
