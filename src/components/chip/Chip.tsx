import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { XLightIcon } from '../../icons/ITUI/x';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind map (Figma node 27462:4164)
  ─────────────────────────────────────────────────────────────────────────────
  SIZES (radius/full → rounded-full · stroke/xs 1px → border · padding spacing/sm 8px → px-2 · gap spacing/xs 4px → gap-1 · icon 16px → size-4)
                        height        avatar             avatar left inset
    height/chip/lg  32px → h-8   24px → size-6       4px → pl-1
    height/chip/md  28px → h-7   22px → size-[22px]  3px → pl-[3px]
    height/chip/sm  24px → h-6   20px → size-5       2px → pl-0.5

  TYPOGRAPHY — label (font/weight/medium 500 → font-medium)
    lg/md body/md/medium     14px leading-24 0.20px → text-sm leading-6 tracking-md
    sm    caption/sm/medium  12px leading-20 0.30px → text-xs leading-5 tracking-sm

  COLORS — Outline (border/neutral/subtle #ededed → border-surface-neutral-hover · text/neutral/default #0f0f0f → text-foreground)
    surface/neutral/secondary/default #fafafa → bg-inverse                 (default)
    surface/neutral/secondary/hover   #f5f5f5 → hover:bg-surface-neutral-subtle
    surface/neutral/secondary/pressed #ededed → bg-surface-neutral-hover   (selected)
    text/neutral/disabled             #c2c2c2 → text-neutral-disabled      (disabled keeps #fafafa bg + border)

  COLORS — Filled (no border)
    surface/neutral/subtle/default    #f5f5f5 → bg-surface-neutral-subtle  (default)
    surface/neutral/subtle/hover      #ededed → hover:bg-surface-neutral-hover
    surface/neutral/subtle/pressed    #dadada → bg-surface-neutral-pressed (selected)
    surface/neutral/disabled/inverse  #ededed → bg-surface-neutral-disabled (disabled)

  COMPOSITION
    Figma "Type" (Label / LabelClose / CheckLabel / CheckLabelClose /
    AvatarLabel / AvatarLabelClose) is modeled via composition:
      leading (16px icon) · avatar (per-size) · children (label) · onClose (X button).
    Avatar chips are the one place Figma breaks the uniform 8px padding — the
    avatar is inset by 4/3/2px — so `avatar` swaps the left pad for that inset.
  ─────────────────────────────────────────────────────────────────────────────
*/

export type ChipVariant = 'outline' | 'filled';
export type ChipSize = 'lg' | 'md' | 'sm';

export interface ChipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** `outline` is the bordered chip on the page background, `filled` the tinted one. */
  variant?: ChipVariant;
  /** Height: 32 / 28 / 24px. */
  size?: ChipSize;
  /** Paints the chosen state. It is presentation only — you own the selection. */
  selected?: boolean;
  /** Greys the chip out and stops it responding to clicks. */
  disabled?: boolean;
  /**
   * Leading 16px icon — Figma `Type=CheckLabel`. SVG children are sized to 16px
   * and recoloured to the label colour, so the glyph greys out with `disabled`.
   */
  leading?: ReactNode;
  /**
   * Leading avatar — Figma `Type=AvatarLabel`. Sized to the chip (24/22/20px for
   * lg/md/sm) whatever size the avatar asks for, and inset tighter than `leading`.
   */
  avatar?: ReactNode;
  /** When provided, the chip behaves as a button (e.g. a filter chip). */
  onClick?: () => void;
  /** When provided, renders a trailing close (X) button that calls this handler. */
  onClose?: () => void;
  /** Accessible label for the close button. */
  closeLabel?: string;
  /** The chip's label. */
  children: ReactNode;
}

interface SizeSpec {
  /** Chip height + label typography. */
  box: string;
  /** Avatar diameter — 8/6/4px smaller than the chip, so not the 16px icon size. */
  avatar: string;
  /** Left padding when an avatar leads, replacing the uniform 8px. */
  avatarPad: string;
}

const sizeConfig: Record<ChipSize, SizeSpec> = {
  // height/chip/lg 32px
  lg: {
    box: 'h-8 text-sm leading-6 tracking-md',
    avatar: 'size-6',
    avatarPad: 'pl-1',
  },
  // height/chip/md 28px
  md: {
    box: 'h-7 text-sm leading-6 tracking-md',
    avatar: 'size-[22px]',
    avatarPad: 'pl-[3px]',
  },
  // height/chip/sm 24px
  sm: {
    box: 'h-6 text-xs leading-5 tracking-sm',
    avatar: 'size-5',
    avatarPad: 'pl-0.5',
  },
};

function boxClasses(
  variant: ChipVariant,
  selected: boolean,
  disabled: boolean,
): string {
  if (variant === 'filled') {
    if (disabled) return 'bg-surface-neutral-disabled text-neutral-disabled';
    return cn(
      'text-foreground',
      selected
        ? 'bg-surface-neutral-pressed'
        : 'bg-surface-neutral-subtle hover:bg-surface-neutral-hover',
    );
  }
  // outline
  if (disabled)
    return 'bg-inverse border border-surface-neutral-hover text-neutral-disabled';
  return cn(
    'border border-surface-neutral-hover text-foreground',
    selected
      ? 'bg-surface-neutral-hover'
      : 'bg-inverse hover:bg-surface-neutral-subtle',
  );
}

/**
 * A compact label that can carry an icon or avatar, be selected, and be
 * dismissed — the filter/entry chip. It only becomes interactive when you give
 * it `onClick` or `onClose`; without either it stays a plain label, and stays
 * renderable from a Server Component. `Tag` is the same idea in the static,
 * status-label form.
 */
export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      variant = 'outline',
      size = 'md',
      selected = false,
      disabled = false,
      leading,
      avatar,
      onClick,
      onClose,
      closeLabel = 'Remove',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isInteractive = !!onClick && !disabled;
    const { box, avatar: avatarSize, avatarPad } = sizeConfig[size];

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isInteractive) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick?.();
      }
    };

    const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onClose?.();
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex shrink-0 items-center gap-1 px-2 rounded-full',
          'font-medium whitespace-nowrap select-none',
          // Gated on the same flag as `tabIndex` below: a decorative chip is a
          // plain <div> with no tab stop, so an unconditional ring class could
          // never match — it only made the component read as though it focused.
          // The close button keeps its own ring; it is a real <button> either way.
          isInteractive && 'focus-visible:focus-ring',
          box,
          // After px-2 so tailwind-merge keeps the 8px right pad and drops the left.
          avatar != null && avatarPad,
          boxClasses(variant, selected, disabled),
          disabled
            ? 'pointer-events-none'
            : isInteractive
              ? 'cursor-pointer'
              : '',
          className,
        )}
        // Pass `onClick` or `onClose`, not both: together they nest the close
        // <button> inside this role="button", which is invalid ARIA and gives one
        // chip two tab stops with two different meanings. No consumer does today.
        // See ACCESSIBILITY.md, "Chip and Tag: one interaction each".
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-pressed={isInteractive ? selected : undefined}
        aria-disabled={disabled || undefined}
        onClick={isInteractive ? () => onClick?.() : undefined}
        // Gated like `onClick` above, and for the same reason: a bare handler
        // here is a function on a DOM prop, which fails a Server Component
        // render even when the chip is decorative (I-15).
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        {...rest}
      >
        {avatar != null && (
          <span
            className={cn(
              // Avatar carries its own h-*/w-*, and Tailwind emits `h-*` after
              // `size-*`, so a plain `size-full` would lose the specificity tie.
              'inline-flex shrink-0 items-center justify-center [&>*]:size-full!',
              avatarSize,
            )}
            aria-hidden="true"
          >
            {avatar}
          </span>
        )}
        {leading != null && (
          <span
            className="inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-4 [&_path]:fill-current"
            aria-hidden="true"
          >
            {leading}
          </span>
        )}
        <span>{children}</span>
        {onClose && (
          <button
            type="button"
            onClick={handleClose}
            disabled={disabled}
            aria-label={closeLabel}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full text-current hover:opacity-70 focus-visible:focus-ring"
          >
            <XLightIcon
              aria-hidden="true"
              className="size-4 [&_path]:fill-current"
            />
          </button>
        )}
      </div>
    );
  },
);

Chip.displayName = 'Chip';
