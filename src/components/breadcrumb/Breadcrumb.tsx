'use client';

import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  type ElementType,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';
import { CaretRight } from '../../icons/ITUI/icons';

/*
  Token → Tailwind map (Figma node 28104:1336 — "Breadcrumb")
  ─────────────────────────────────────────────────────────────────────────────
  LIST (Breadcrumb 28106:559)
  spacing/xs                  4px      → gap-1 (crumb ↔ separator)

  CRUMB (Base Breadcrumb 28110:666)
  spacing/sm                  8px      → gap-2 (icon ↔ label)
  height/icon/md              16px     → size-4 (leading icon)
  body/md/regular  14/24/0.2px/400     → text-sm font-normal leading-md tracking-md
  body/md/medium   14/24/0.2px/500     → text-sm font-medium leading-md tracking-md

  CRUMB — states (CSS-only, RSC compatible)
  State=Default   text/neutral/default #0f0f0f → text-foreground
                  icon/neutral/default #0f0f0f → text-icon-neutral
  State=Hover     text/neutral/subtle  #9e9e9e → hover:text-neutral-subtle
                  icon/neutral/subtle  #9e9e9e → group-hover:text-icon-neutral-subtle
  State=Selected  text/neutral/default #0f0f0f → text-foreground + font-medium

  SEPARATOR (Icon 28104:1497)
  frame                       12px     → size-3
  icon/neutral/default        #0f0f0f  → text-icon-neutral
  Type=Arrow                           → CaretRight (Phosphor, matches the 4.5×8.25px glyph)
  Type=ForwardSlash                    → the "/" character; Figma draws it as a text layer
                                         at 12px, not as an icon path → text-xs

  DESIGN NOTES
  - Figma sets the crumb gap to spacing/xs (4px) on the Icon=No variant, but that gap
    has no second child to separate, so only the spacing/sm (8px) icon gap is rendered.
  - Hover only exists on crumbs you can navigate back to; the `current` crumb is a
    <span>, so it neither hovers nor takes focus.
  - Width: Figma pins nothing — the list stretches to its own container.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

/** Figma's `Type=Slash | Arrow` — the glyph drawn between two crumbs. */
export type BreadcrumbSeparatorType = 'slash' | 'arrow';

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Defaults to `'slash'`. Inherited by every separator in the list. */
  separator?: BreadcrumbSeparatorType;
}

export interface BreadcrumbItemProps extends HTMLAttributes<HTMLElement> {
  /** Turns the crumb into a link. Omit it for a crumb that only labels a level. */
  href?: string;
  /** Leading 16×16 icon — Figma's `Icon=Yes` variant. */
  icon?: ReactNode;
  /** The page you are on: medium weight, not interactive. Figma's `State=Selected`. */
  current?: boolean;
  /** Render the crumb as its single child (e.g. a router `<Link>`) instead of `<a>`. */
  asChild?: boolean;
}

export interface BreadcrumbSeparatorProps
  extends Omit<LiHTMLAttributes<HTMLLIElement>, 'type'> {
  /** Overrides the type inherited from `<Breadcrumb separator>`. */
  type?: BreadcrumbSeparatorType;
  /** Replaces the default glyph. */
  children?: ReactNode;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const BreadcrumbSeparatorContext =
  createContext<BreadcrumbSeparatorType>('slash');

// ─── BreadcrumbSeparator ──────────────────────────────────────────────────────

/**
 * The glyph between two crumbs. `Breadcrumb` inserts these for you, so write one
 * by hand only where you need a different glyph — around a collapsed "…", say.
 * A hand-placed separator suppresses the automatic one on both sides.
 */
export const BreadcrumbSeparator = forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ type, className, children, ...rest }, ref) => {
  const inherited = useContext(BreadcrumbSeparatorContext);
  const resolved = type ?? inherited;

  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cn(
        'flex size-3 shrink-0 items-center justify-center text-icon-neutral',
        className,
      )}
      {...rest}
    >
      {children ??
        (resolved === 'arrow' ? (
          <CaretRight width={12} height={12} />
        ) : (
          <span className="text-xs leading-none">/</span>
        ))}
    </li>
  );
});
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

// ─── BreadcrumbItem ───────────────────────────────────────────────────────────

/**
 * One level in the trail. It renders an `<a>` when it navigates and a `<span>`
 * with `aria-current="page"` when it is `current`, so the crumb you are on is
 * neither focusable nor hoverable.
 */
export const BreadcrumbItem = forwardRef<HTMLElement, BreadcrumbItemProps>(
  (
    {
      href,
      icon,
      current = false,
      asChild = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const interactive = !current;
    /*
      One render path for three elements: the consumer's child under `asChild`, an <a>
      for a crumb that navigates, a <span> for the current page. Typed as ElementType
      so the shared `ref` and props type-check across all three.
    */
    const Crumb = (asChild ? Slot : current ? 'span' : 'a') as ElementType;

    return (
      <li className="flex items-center">
        <Crumb
          ref={ref}
          href={interactive ? href : undefined}
          aria-current={current ? 'page' : undefined}
          className={cn(
            'group flex items-center gap-2 text-sm leading-md tracking-md text-foreground',
            current ? 'font-medium' : 'font-normal',
            interactive && 'cursor-pointer hover:text-neutral-subtle',
            className,
          )}
          {...rest}
        >
          {icon && (
            <span
              className={cn(
                'flex size-4 shrink-0 items-center justify-center text-icon-neutral',
                interactive && 'group-hover:text-icon-neutral-subtle',
              )}
            >
              {icon}
            </span>
          )}
          {children}
        </Crumb>
      </li>
    );
  },
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

/**
 * The trail of pages leading to this one, as a labelled `<nav>` around an `<ol>`.
 * List only `BreadcrumbItem`s — separators are woven in between them for you, so
 * the markup stays the crumbs themselves.
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ separator = 'slash', className, children, ...rest }, ref) => {
    /*
      Separators are woven in here so a crumb list stays plain markup. One the consumer
      placed themselves — around an ellipsis, say — is left alone: its neighbours don't
      get a second one.
    */
    const crumbs = Children.toArray(children).filter(isValidElement);
    const isSeparator = (node: ReactElement | undefined) =>
      node?.type === BreadcrumbSeparator;

    const content = crumbs.flatMap((crumb, index) =>
      index > 0 && !isSeparator(crumb) && !isSeparator(crumbs[index - 1])
        ? [<BreadcrumbSeparator key={`separator-${index}`} />, crumb]
        : [crumb],
    );

    return (
      <nav ref={ref} aria-label="breadcrumb" className={className} {...rest}>
        <BreadcrumbSeparatorContext.Provider value={separator}>
          <ol className="flex items-center gap-1">{content}</ol>
        </BreadcrumbSeparatorContext.Provider>
      </nav>
    );
  },
);
Breadcrumb.displayName = 'Breadcrumb';
