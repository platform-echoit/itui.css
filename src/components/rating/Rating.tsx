'use client';

import { forwardRef, useId, useState, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { StarFillIcon, StarRegularIcon } from '../../icons/ITUI/star';

/*
  Token → Tailwind class reference (Figma node 27901:3604 — "Rating")
  ─────────────────────────────────────────────────────────────────────────────
  STAR (Base Rating — Figma nodes 27901:3499 / 27901:3512 / 27901:3523)
  height/icon/lg           20px     → h-icon-lg w-icon-lg
  surface/primary/default  #009ce0  → text-icon-primary  (filled share, via fill-current)
  icon/neutral/disabled    #c2c2c2  → [&_path]:fill-icon-neutral-disabled (empty share)

  ROW (Rating — Figma nodes 27901:4065 … 27901:4075)
  spacing/xs               4px      → gap-1

  INTERACTIVE STATES (not drawn in Figma — mapped onto the existing primary ramp)
  icon/primary/hover       #33b0e6  → text-icon-primary-hover          (hover preview)
  icon/primary/pressed     #008ecc  → active:text-icon-primary-pressed
  focus ring                        → ring-2 ring-brand ring-offset-1  (Radio/Checkbox convention)

  DESIGN NOTES
  - Figma builds the half star from two mask groups over the same Star glyph.
    The same silhouette is produced here by a StarRegularIcon base with a
    `currentColor` StarFillIcon clipped to `w-1/2` on top — no masks, no
    exported assets.
    The base is the one place the library keeps a weight *pair* rather than a
    single weight: outline-empty against solid-filled is what carries the value
    (I-22). Figma draws the empty star as a grey solid instead, so this reads
    lighter than the mock — deliberate, and the one deviation in this component.
  - Figma's `rating` variants run 0 → 5 in 0.5 steps, so the input domain matches:
    every star carries two half-width hit areas, for `index + 0.5` and `index + 1`.
  - Group semantics, arrow-key navigation and form participation come from native
    `<input type="radio">` sharing one `name`, hidden with `sr-only` — the same
    hidden-input pattern as Checkbox. The ring is keyed off `has-[:focus-visible]`
    because the focused input sits inside the overlaying label, not beside the star.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

/** Coloured share of one star — Figma's Base Rating variants. */
export type RatingStarFill = 'empty' | 'half' | 'full';

export interface RatingStarProps extends HTMLAttributes<HTMLSpanElement> {
  /** How much of the star is coloured in. @default 'empty' */
  fill?: RatingStarFill;
}

export interface RatingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Current rating: 0 → `count`, in 0.5 steps. */
  value?: number;
  /** Called with the picked rating. */
  onValueChange?: (value: number) => void;
  /** How many stars to draw. */
  count?: number;
  /** Render as a static display — no inputs, no hover preview. */
  readOnly?: boolean;
  /** `name` shared by the underlying radios. Defaults to a generated id. */
  name?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Figma's rating domain advances half a star at a time. */
const STEP = 0.5;

function fillAt(value: number, index: number): RatingStarFill {
  const filled = value - index;
  if (filled >= 1) return 'full';
  if (filled >= STEP) return 'half';
  return 'empty';
}

// ─── RatingStar ───────────────────────────────────────────────────────────────

/**
 * One star, drawn as an outline with a coloured layer clipped over it. Exported
 * for building a legend or a static score; `Rating` draws its own.
 */
export const RatingStar = forwardRef<HTMLSpanElement, RatingStarProps>(
  ({ fill = 'empty', className, children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cn(
        'relative inline-flex h-icon-lg w-icon-lg shrink-0',
        className,
      )}
      {...rest}
    >
      <StarRegularIcon
        aria-hidden
        className="h-icon-lg w-icon-lg [&_path]:fill-icon-neutral-disabled"
      />
      {fill !== 'empty' && (
        <span
          aria-hidden
          className={cn(
            'absolute inset-y-0 left-0 flex overflow-hidden',
            fill === 'half' ? 'w-1/2' : 'w-full',
          )}
        >
          <StarFillIcon className="h-icon-lg w-icon-lg shrink-0 [&_path]:fill-current" />
        </span>
      )}
      {children}
    </span>
  ),
);
RatingStar.displayName = 'RatingStar';

// ─── Rating ───────────────────────────────────────────────────────────────────

/**
 * A star rating in half-star steps. Interactive, it is a real radio group — each
 * half-star is an `<input type="radio">`, so arrow keys and forms work without
 * help. Pass `readOnly` for the display-only form.
 */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value = 0,
      onValueChange,
      count = 5,
      readOnly = false,
      name,
      className,
      ...rest
    },
    ref,
  ) => {
    // The cursor previews a rating without committing it, so what is drawn is
    // the hovered value while hovering and the real value otherwise.
    const [preview, setPreview] = useState<number | null>(null);
    const generatedName = useId();
    const stars = Array.from({ length: count }, (_, index) =>
      fillAt(preview ?? value, index),
    );

    if (readOnly) {
      return (
        <div
          ref={ref}
          role="img"
          aria-label={`${value} out of ${count}`}
          className={cn('flex items-center gap-1 text-icon-primary', className)}
          {...rest}
        >
          {stars.map((fill, index) => (
            <RatingStar key={index} fill={fill} />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label="Rating"
        className={cn(
          'flex items-center gap-1 active:text-icon-primary-pressed',
          preview === null ? 'text-icon-primary' : 'text-icon-primary-hover',
          className,
        )}
        onMouseLeave={() => setPreview(null)}
        {...rest}
      >
        {stars.map((fill, index) => (
          <RatingStar
            key={index}
            fill={fill}
            className="rounded-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-1"
          >
            {[STEP, 1].map((offset) => {
              const starValue = index + offset;
              return (
                <label
                  key={offset}
                  className={cn(
                    'absolute inset-y-0 w-1/2 cursor-pointer',
                    offset === STEP ? 'left-0' : 'right-0',
                  )}
                  onMouseEnter={() => setPreview(starValue)}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={name ?? generatedName}
                    value={starValue}
                    checked={value === starValue}
                    aria-label={`${starValue} out of ${count}`}
                    onChange={() => onValueChange?.(starValue)}
                  />
                </label>
              );
            })}
          </RatingStar>
        ))}
      </div>
    );
  },
);
Rating.displayName = 'Rating';
