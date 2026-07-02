import { type ReactNode } from 'react';
import { Dialog as RadixDialog } from 'radix-ui';
import { cn } from '../../lib/utils';
import { Button } from '../button';

/*
  Token → Tailwind map (Figma node 27260:2855)
  ─────────────────────────────────────────────────────────────────────────────
  PANEL  surface/neutral/secondary #fafafa → bg-inverse · border/neutral/subtle #ededed
         radius/md 12px → rounded-xl · shadow/downwards/sm → shadow-downwards-sm
         size/container/md 358px → w-[358px]
  TITLE  heading/2xl/semibold 20px/32/-0.24 → text-xl leading-2xl tracking-2xl font-semibold
  BODY   body/lg/regular 16px/26/0.09 → text-base leading-lg tracking-lg
  FOOTER border-t border/neutral/subtle · padding spacing/lg 16px → p-4 · gap-2
         buttons size lg (h-48), stretched equally
  OVERLAY  dim/black → bg-dim-black

  Figma "Type": Default (2 buttons) · SingleButton (1 button) · Input (Input in body).
  ─────────────────────────────────────────────────────────────────────────────
*/

export interface ModalProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Optional element that opens the modal (e.g. a Button). */
  trigger?: ReactNode;
  title: ReactNode;
  /** Body — centered text, an Input, or any content. */
  children?: ReactNode;
  cancelText?: ReactNode;
  confirmText?: ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
  /** Render only the confirm button (Figma "SingleButton"). */
  singleButton?: boolean;
  /** Replace the default footer buttons entirely. */
  footer?: ReactNode;
  className?: string;
}

export function Modal({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  children,
  cancelText = '취소',
  confirmText = '확인',
  onCancel,
  onConfirm,
  singleButton = false,
  footer,
  className,
}: ModalProps) {
  const defaultFooter = singleButton ? (
    <Button variant="primary" size="lg" onClick={onConfirm}>
      {confirmText}
    </Button>
  ) : (
    <>
      <RadixDialog.Close asChild>
        <Button variant="secondary" size="lg" onClick={onCancel}>
          {cancelText}
        </Button>
      </RadixDialog.Close>
      <Button variant="primary" size="lg" onClick={onConfirm}>
        {confirmText}
      </Button>
    </>
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
            'flex w-[358px] max-w-[calc(100vw-2rem)] flex-col',
            'rounded-xl border border-surface-neutral-hover bg-inverse shadow-downwards-sm',
            'focus:outline-none',
            className,
          )}
        >
          <RadixDialog.Title className="px-4 pt-4 text-center text-xl leading-2xl tracking-2xl font-semibold text-foreground">
            {title}
          </RadixDialog.Title>

          {children != null && (
            <div className="p-4 text-base leading-lg tracking-lg text-foreground">
              {children}
            </div>
          )}

          <div className="flex items-center gap-2 border-t border-surface-neutral-hover p-4 [&>*]:flex-1">
            {footer ?? defaultFooter}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
