import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference
  (Figma "Skeleton" 27976:711 · "Animation/Wave" 27996:744 · "Animation/Pulse" 28230:183)
  ─────────────────────────────────────────────────────────────────────────────
  SURFACE
  color/opacity/black/xs  #1a1a1a14 → bg-opacity-black-xs
      The repo token is rgba(15,15,15,.08) — the same 8% alpha over a
      near-identical ink — so it is reused rather than registering a duplicate.

  SHAPE — Figma Style=Text / Rectangle / Circle
  Text       200×32 · radius/sm 8px  → h-8 w-50 rounded-lg
  Rectangle   60×60 · radius/sm 8px  → size-15 rounded-lg
  Circle      60×60 · radius/full    → size-15 rounded-full

  ANIMATION — Figma Animation=Wave / Pulse
  Pulse  Start #1a1a1a14 → End rgba(0,0,0,0.04). The end fill is exactly half the
         start alpha, which is what the built-in `animate-pulse` (opacity 1 → .5)
         already draws — no extra token needed.
  Wave   a band half the skeleton's width: transparent → rgba(0,0,0,0.08) @48.4%
         → transparent, i.e. bg-linear-to-l from-transparent via-opacity-black-xs
         to-transparent, swept by --animate-skeleton-wave (see global.css).

  TEXT BLOCK — Figma "content" 28080:1476 (Wave) / 28230:205 (Pulse)
  spacing/sm 8px → gap-2 · radius/xs 4px → rounded-sm
  heading line 16×141 → h-4 w-35 (140px) · body lines 12px → h-3 w-full
  closing line 12×173 → h-3 w-43 (172px)

  DESIGN NOTES
  - Figma's `Position=Start|End` is not a prop: it is the first and last frame of
    the looping animation, so it is modelled as keyframes, not as public API.
  - Variant sizes are defaults only. Every composition in 27996:744 / 28230:183
    overrides them through className — h-40 media block, h-3 text line, size-10
    avatar — which is why nothing here is width-locked beyond the default.
  - The skeleton is decorative, so it is `aria-hidden`; announce loading state on
    the surrounding region (`aria-busy` / `role="status"`) instead.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

export type SkeletonVariant = 'text' | 'rectangle' | 'circle';
export type SkeletonAnimation = 'wave' | 'pulse' | 'none';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma `Style` — the placeholder's default shape and size. */
  variant?: SkeletonVariant;
  /** Figma `Animation` — `none` renders the static fill. */
  animation?: SkeletonAnimation;
}

export interface SkeletonTextProps extends HTMLAttributes<HTMLDivElement> {
  /** Total line count, including the heading line when `heading` is set. */
  lines?: number;
  /** Opens the block with the taller, shorter line of Figma's text skeleton. */
  heading?: boolean;
  /** Passed through to every line. */
  animation?: SkeletonAnimation;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const variantClass: Record<SkeletonVariant, string> = {
  text: 'h-8 w-50 rounded-lg',
  rectangle: 'size-15 rounded-lg',
  circle: 'size-15 rounded-full',
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    { variant = 'text', animation = 'wave', className, children, ...rest },
    ref,
  ) => (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        'relative overflow-hidden bg-opacity-black-xs',
        variantClass[variant],
        animation === 'pulse' && 'animate-pulse motion-reduce:animate-none',
        className,
      )}
      {...rest}
    >
      {animation === 'wave' && (
        // Hidden rather than paused under reduced motion: a parked gradient band
        // would read as a lighting artefact on the left half of the skeleton.
        <span className="animate-skeleton-wave absolute inset-y-0 left-0 w-1/2 bg-linear-to-l from-transparent via-opacity-black-xs to-transparent motion-reduce:hidden" />
      )}
      {children}
    </div>
  ),
);
Skeleton.displayName = 'Skeleton';

// ─── SkeletonText ─────────────────────────────────────────────────────────────

export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  (
    { lines = 4, heading = true, animation = 'wave', className, ...rest },
    ref,
  ) => {
    const bodyLines = Math.max(0, heading ? lines - 1 : lines);

    return (
      <div
        ref={ref}
        className={cn('flex w-full flex-col gap-2', className)}
        {...rest}
      >
        {heading && (
          <Skeleton animation={animation} className="h-4 w-35 rounded-sm" />
        )}
        {Array.from({ length: bodyLines }, (_, index) => (
          <Skeleton
            key={index}
            animation={animation}
            // Figma closes the paragraph on a short line — but only when there is
            // more than one body line, so a lone line still spans its container.
            className={cn(
              'h-3 rounded-sm',
              bodyLines > 1 && index === bodyLines - 1 ? 'w-43' : 'w-full',
            )}
          />
        ))}
      </div>
    );
  },
);
SkeletonText.displayName = 'SkeletonText';
