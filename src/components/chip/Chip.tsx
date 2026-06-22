import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind map (Figma node 27462:4164)
  ─────────────────────────────────────────────────────────────────────────────
  SIZES (radius/full → rounded-full · stroke/xs 1px → border · padding spacing/sm 8px → px-2 · gap spacing/xs 4px → gap-1 · icon 16px → size-4)
    height/chip/lg  32px → h-[var(--size-chip-lg)]
    height/chip/md  28px → h-[var(--size-chip-md)]
    height/chip/sm  24px → h-[var(--size-chip-sm)]

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
      leading slot (check icon / avatar) + children (label) + onClose (X button).
    Note: avatar chips in Figma use pl-1 (4px); this component keeps px-2 (8px)
    uniformly for simplicity — a 4px difference on avatar chips only.
  ─────────────────────────────────────────────────────────────────────────────
*/

export type ChipVariant = 'outline' | 'filled';
export type ChipSize = 'lg' | 'md' | 'sm';

export interface ChipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  variant?: ChipVariant;
  size?: ChipSize;
  selected?: boolean;
  disabled?: boolean;
  /** Leading slot — e.g. a check icon or an avatar. SVG children are sized to 16px. */
  leading?: ReactNode;
  /** When provided, the chip behaves as a button (e.g. a filter chip). */
  onClick?: () => void;
  /** When provided, renders a trailing close (X) button that calls this handler. */
  onClose?: () => void;
  /** Accessible label for the close button. */
  closeLabel?: string;
  children: ReactNode;
}

const sizeConfig: Record<ChipSize, string> = {
  lg: 'h-8 text-sm leading-6 tracking-md', // height/chip/lg 32px
  md: 'h-7 text-sm leading-6 tracking-md', // height/chip/md 28px
  sm: 'h-6 text-xs leading-5 tracking-sm', // height/chip/sm 24px
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

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 4L12 12M12 4L4 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      variant = 'outline',
      size = 'md',
      selected = false,
      disabled = false,
      leading,
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
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
          sizeConfig[size],
          boxClasses(variant, selected, disabled),
          disabled ? 'pointer-events-none' : isInteractive ? 'cursor-pointer' : '',
          className,
        )}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-pressed={isInteractive ? selected : undefined}
        aria-disabled={disabled || undefined}
        onClick={isInteractive ? () => onClick?.() : undefined}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {leading != null && (
          <span
            className="inline-flex shrink-0 items-center justify-center [&>svg]:size-4"
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
            className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full text-current hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>
    );
  },
);

Chip.displayName = 'Chip';
