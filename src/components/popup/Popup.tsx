'use client';

import { type ReactNode } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { ImageRegularIcon } from '../../icons/ITUI/image';
import { XLightIcon } from '../../icons/ITUI/x';
import { cn } from '../../lib/utils';
import { Button } from '../button';
import { Checkbox } from '../checkbox';

/*
  Token → Tailwind map (Figma node 28500:5020)
  ─────────────────────────────────────────────────────────────────────────────
  CARD  surface/neutral/secondary #fafafa → bg-inverse · border/neutral/subtle #ededed
        radius/md 12px → rounded-xl · shadow/downwards/sm → shadow-downwards-sm · w 358px
  TITLE heading/2xl/semibold 20px/32/-0.24 → text-xl leading-2xl tracking-2xl font-semibold
  BODY  body/lg/regular 16px/26/0.09 → text-base leading-lg tracking-lg
  FOOTER (text) border-t · h-14 · centered link Button
  IMAGE area  h-[460px] · surface/neutral/disabled #f5f5f5 → bg-surface-neutral-subtle
  CLOSE X 20px · "다시 보지 않기" → reused Checkbox
  OVERLAY dim/black → bg-dim-black
  ─────────────────────────────────────────────────────────────────────────────
*/

export type PopupVariant = 'text' | 'image';

export interface PopupProps {
  /** Controlled open state. Pair it with `onOpenChange`, or use `defaultOpen`. */
  open?: boolean;
  /** Open state for the uncontrolled case — the popup then owns it. */
  defaultOpen?: boolean;
  /** Fires on every open and close, including Esc and the ✕. */
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the popup. Omit it when you drive `open` yourself. */
  trigger?: ReactNode;
  /** `text` is the title-and-body card; `image` is the artwork-led one. */
  variant?: PopupVariant;
  /** Header title (text variant). */
  title?: ReactNode;
  /** Body content (text variant). */
  children?: ReactNode;
  /** Image element (image variant). Falls back to a placeholder. */
  image?: ReactNode;
  /** Footer link action (text variant). */
  actionText?: ReactNode;
  /** Runs on the footer link. It does not close the popup — do that yourself. */
  onAction?: () => void;
  /** "Don't show again" checkbox. */
  showDontShowAgain?: boolean;
  /** Checked state of that checkbox. Persisting the choice is yours to do. */
  dontShowAgain?: boolean;
  /** Fires with the checkbox's next state. */
  onDontShowAgainChange?: (checked: boolean) => void;
  /** Text beside the checkbox. @default "Don't show again" */
  dontShowAgainLabel?: ReactNode;
  /** Lands on the popup card, not on the scrim. */
  className?: string;
}

const CARD =
  'overflow-hidden rounded-xl border border-surface-neutral-hover bg-inverse shadow-downwards-sm';

/** Stand-in artwork for an empty image slot — same shape `CardTemplates` uses. */
function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <ImageRegularIcon
      aria-hidden="true"
      className={cn('opacity-40 [&_path]:fill-current', className)}
    />
  );
}

/**
 * The announcement card: image slot, body, and an optional "don't show again".
 * Not a variant of `Modal` — a different design with a different job.
 *
 * @see https://github.com/platform-echoit/itui.css#picking-between-similar-names
 */
export function Popup({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  variant = 'text',
  title,
  children,
  image,
  actionText,
  onAction,
  showDontShowAgain = true,
  dontShowAgain,
  onDontShowAgainChange,
  dontShowAgainLabel = "Don't show again",
  className,
}: PopupProps) {
  const isImage = variant === 'image';

  const dontShowAgainCheckbox = (
    <Checkbox
      checked={dontShowAgain}
      onChange={(event) => onDontShowAgainChange?.(event.target.checked)}
      label={dontShowAgainLabel}
    />
  );

  const closeButton = (
    <RadixDialog.Close
      aria-label="Close"
      className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center text-icon-neutral focus-visible:focus-ring"
    >
      <XLightIcon aria-hidden="true" className="size-5 [&_path]:fill-current" />
    </RadixDialog.Close>
  );

  return (
    <RadixDialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {trigger != null && (
        <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
      )}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-dim-black" />
        <RadixDialog.Content
          aria-describedby={undefined}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'flex w-[358px] max-w-[calc(100vw-2rem)] flex-col gap-4 focus:outline-none',
            className,
          )}
        >
          {isImage ? (
            <div className={cn(CARD, 'flex flex-col')}>
              <RadixDialog.Title className="sr-only">
                {title ?? 'Notice'}
              </RadixDialog.Title>
              <div className="flex h-[460px] items-center justify-center bg-surface-neutral-subtle text-neutral-subtle">
                {image ?? <ImagePlaceholder className="size-[140px]" />}
              </div>
              <div className="flex items-center justify-between p-4">
                {showDontShowAgain ? dontShowAgainCheckbox : <span />}
                {closeButton}
              </div>
            </div>
          ) : (
            <>
              <div className={cn(CARD, 'flex flex-col')}>
                <div className="flex items-center justify-between gap-2 px-5 pt-4">
                  <RadixDialog.Title className="min-w-0 flex-1 text-xl leading-2xl tracking-2xl font-semibold text-foreground">
                    {title}
                  </RadixDialog.Title>
                  {closeButton}
                </div>
                <div className="p-4 text-base leading-lg tracking-lg text-foreground">
                  {children}
                </div>
                {actionText != null && (
                  <div className="flex h-14 items-center justify-center border-t border-surface-neutral-hover">
                    <Button variant="link" size="lg" onClick={onAction}>
                      {actionText}
                    </Button>
                  </div>
                )}
              </div>
              {showDontShowAgain && dontShowAgainCheckbox}
            </>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
