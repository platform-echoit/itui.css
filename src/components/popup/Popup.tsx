import { type ReactNode } from 'react';
import { Dialog as RadixDialog } from 'radix-ui';
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
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  variant?: PopupVariant;
  /** Header title (text variant). */
  title?: ReactNode;
  /** Body content (text variant). */
  children?: ReactNode;
  /** Image element (image variant). Falls back to a placeholder. */
  image?: ReactNode;
  /** Footer link action (text variant). */
  actionText?: ReactNode;
  onAction?: () => void;
  /** "Don't show again" checkbox. */
  showDontShowAgain?: boolean;
  dontShowAgain?: boolean;
  onDontShowAgainChange?: (checked: boolean) => void;
  dontShowAgainLabel?: ReactNode;
  className?: string;
}

const CARD =
  'overflow-hidden rounded-xl border border-surface-neutral-hover bg-inverse shadow-downwards-sm';

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('opacity-40', className)} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
  dontShowAgainLabel = '다시 보지 않기',
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
      className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center text-icon-neutral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <XIcon className="size-5" />
    </RadixDialog.Close>
  );

  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger != null && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
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
              <RadixDialog.Title className="sr-only">{title ?? '알림'}</RadixDialog.Title>
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
