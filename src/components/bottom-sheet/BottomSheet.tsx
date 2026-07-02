import { type ReactNode } from 'react';
import { Dialog as RadixDialog } from 'radix-ui';
import { cn } from '../../lib/utils';
import { Button } from '../button';

/*
  Token → Tailwind map (Figma node 28375:7517)
  ─────────────────────────────────────────────────────────────────────────────
  PANEL  surface/neutral/secondary #fafafa → bg-inverse · radius/2xl 28px → rounded-t-[28px]
  HANDLE tab 44×6 · border/neutral/subtle #ededed → bg-surface-neutral-hover · radius/xs 4px → rounded-sm
         wrapper padding spacing/md 12px → p-3
  TITLE  heading/2xl/semibold 20px/32/-0.24 → text-xl leading-2xl tracking-2xl font-semibold · h-[54px]
  FOOTER stacked buttons gap-3 · pt-4 pb-8 (spacing/3xl 32px) px-4 · Button size md
  OVERLAY dim/black → bg-dim-black
  SIZE   Full / Tall / Regular → sheet height (dvh)
  ─────────────────────────────────────────────────────────────────────────────
*/

export type BottomSheetSize = 'full' | 'tall' | 'regular';

const sizeMap: Record<BottomSheetSize, string> = {
  full: 'h-[100dvh]',
  tall: 'h-[90dvh]',
  regular: 'max-h-[75dvh]',
};

export interface BottomSheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  size?: BottomSheetSize;
  title?: ReactNode;
  /** Show the drag handle affordance at the top. @default true */
  showHandle?: boolean;
  children?: ReactNode;
  /** Replace the default footer entirely. */
  footer?: ReactNode;
  /** Convenience footer: primary button. */
  primaryText?: ReactNode;
  onPrimary?: () => void;
  /** Convenience footer: secondary (cancel) button — its presence makes it a two-button footer. */
  secondaryText?: ReactNode;
  onSecondary?: () => void;
  className?: string;
}

export function BottomSheet({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  size = 'regular',
  title,
  showHandle = true,
  children,
  footer,
  primaryText,
  onPrimary,
  secondaryText,
  onSecondary,
  className,
}: BottomSheetProps) {
  const defaultFooter = primaryText != null && (
    <>
      <Button variant="primary" size="md" fullWidth onClick={onPrimary}>
        {primaryText}
      </Button>
      {secondaryText != null && (
        <RadixDialog.Close asChild>
          <Button variant="secondary" size="md" fullWidth onClick={onSecondary}>
            {secondaryText}
          </Button>
        </RadixDialog.Close>
      )}
    </>
  );
  const footerContent = footer ?? defaultFooter;

  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger != null && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-dim-black" />
        <RadixDialog.Content
          aria-describedby={undefined}
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[480px] flex-col',
            'rounded-t-[28px] bg-inverse focus:outline-none',
            sizeMap[size],
            className,
          )}
        >
          {showHandle && (
            <div className="flex shrink-0 justify-center p-3">
              <div className="h-1.5 w-11 rounded-sm bg-surface-neutral-hover" />
            </div>
          )}

          <RadixDialog.Title
            className={cn(
              'flex h-[54px] shrink-0 items-center justify-center px-2 py-4 text-center text-xl leading-2xl tracking-2xl font-semibold text-foreground',
              title == null && 'sr-only',
            )}
          >
            {title ?? '메뉴'}
          </RadixDialog.Title>

          {children != null && (
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 text-sm leading-6 tracking-md text-foreground">
              {children}
            </div>
          )}

          {footerContent && (
            <div className="flex shrink-0 flex-col gap-3 px-4 pb-8 pt-4">
              {footerContent}
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
