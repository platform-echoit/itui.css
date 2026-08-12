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
  Token → Tailwind map (Figma node 27138:1772)
  ─────────────────────────────────────────────────────────────────────────────
  Same token families as Chip, but radius/sm 8px → rounded-lg (boxy, not pill).

  SIZES (padding spacing/sm 8px → px-2 · gap spacing/xs 4px → gap-1 · close icon 16px → size-4)
    height/tag/lg 32px → h-8   ·  height/tag/md 28px → h-7  ·  height/tag/sm 24px → h-6

  TYPOGRAPHY — label (font/weight/medium 500 → font-medium)
    lg/md body/md/medium    14px leading-24 0.20px → text-sm leading-6 tracking-md
    sm    caption/sm/medium 12px leading-20 0.30px → text-xs leading-5 tracking-sm

  COLORS — Outline (border/neutral/subtle #ededed → border-surface-neutral-hover · text-foreground)
    surface/neutral/secondary/default #fafafa → bg-inverse                 (default)
    surface/neutral/secondary/hover   #f5f5f5 → hover:bg-surface-neutral-subtle
    surface/neutral/secondary/pressed #ededed → bg-surface-neutral-hover   (selected)
    text/neutral/disabled             #c2c2c2 → text-neutral-disabled      (disabled keeps #fafafa bg + border)

  COLORS — Filled (no border)
    surface/neutral/subtle/default    #f5f5f5 → bg-surface-neutral-subtle  (default)
    surface/neutral/subtle/hover      #ededed → hover:bg-surface-neutral-hover
    surface/neutral/subtle/pressed    #dadada → bg-surface-neutral-pressed (selected)
    surface/neutral/disabled/inverse  #ededed → bg-surface-neutral-disabled (disabled)

  Figma "Style" (Label / LabelClose) is modeled via the optional onClose handler
  (LabelClose = onClose provided → trailing X button).
  ─────────────────────────────────────────────────────────────────────────────
*/

export type TagVariant = 'outline' | 'filled';
export type TagSize = 'lg' | 'md' | 'sm';

export interface TagProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** `outline` is the bordered tag on the page background, `filled` the tinted one. */
  variant?: TagVariant;
  /** Height: 32 / 28 / 24px. */
  size?: TagSize;
  /** Paints the chosen state. It is presentation only — you own the selection. */
  selected?: boolean;
  /** Greys the tag out and stops it responding to clicks. */
  disabled?: boolean;
  /** When provided, the tag behaves as a button. */
  onClick?: () => void;
  /** When provided, renders a trailing close (X) button that calls this handler. */
  onClose?: () => void;
  /** Accessible label for the close button. */
  closeLabel?: string;
  /** The tag's label. */
  children: ReactNode;
}

const sizeConfig: Record<TagSize, string> = {
  lg: 'h-8 text-sm leading-6 tracking-md',
  md: 'h-7 text-sm leading-6 tracking-md',
  sm: 'h-6 text-xs leading-5 tracking-sm',
};

function boxClasses(
  variant: TagVariant,
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
 * A status or tier label — the component to reach for instead of `Badge`, which
 * is the notification counter and clips text. Like `Chip`, it only becomes
 * interactive when you give it `onClick` or `onClose`, so a plain `<Tag>` still
 * renders from a Server Component.
 */
export const Tag = forwardRef<HTMLDivElement, TagProps>(
  (
    {
      variant = 'outline',
      size = 'md',
      selected = false,
      disabled = false,
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
          'inline-flex shrink-0 items-center gap-1 px-2 rounded-lg',
          'font-medium whitespace-nowrap select-none',
          // Gated on the same flag as `tabIndex` below: a decorative tag is a
          // plain <div> with no tab stop, so an unconditional ring class could
          // never match — it only made the component read as though it focused.
          // The close button keeps its own ring; it is a real <button> either way.
          isInteractive && 'focus-visible:focus-ring',
          sizeConfig[size],
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
        // tag two tab stops with two different meanings. No consumer does today.
        // See ACCESSIBILITY.md, "Chip and Tag: one interaction each".
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-pressed={isInteractive ? selected : undefined}
        aria-disabled={disabled || undefined}
        onClick={isInteractive ? () => onClick?.() : undefined}
        // Gated like `onClick` above, and for the same reason: a bare handler
        // here is a function on a DOM prop, which fails a Server Component
        // render even when the tag is decorative (I-15).
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        {...rest}
      >
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

Tag.displayName = 'Tag';
