import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../button';

/*
  Token → Tailwind class reference (Figma node 27263:2840 "Base Modal/Footer")
  ─────────────────────────────────────────────────────────────────────────────
  ROW
  spacing/lg                   16px     → p-4
  spacing/sm                   8px      → gap-2
  border/neutral/subtle        #ededed  → border-t border-border-neutral-subtle
  stroke/size/small            1px      → border-t

  BUTTONS — the existing `Button` component covers both tones and heights:
  height/button/lg  48px · body/lg/semibold → <Button size="lg">   (확인, stacked footer)
  height/button/md  40px · body/md/semibold → <Button size="md">   (취소, and both buttons
                                                                    of the inline footer)
  surface/primary/default #009ce0            → variant="primary"
  surface/neutral/secondary + border/neutral/subtle → variant="secondary"

  SUMMARY SLOT (`right` alignment) — the selected range, e.g. `2026년 1월 26일 - 2026년 2월 3일`
  body/md/regular 14px 400 → text-sm leading-sm tracking-md text-foreground

  DEVIATION: the frame's `Right` variant draws its top border with a raw #f5f5f5
  (token `Boder/Neutral/Strong/SublteLV1`, itself a typo) while `Center` uses
  border/neutral/subtle #ededed. Both use #ededed here.

  Button labels carry no defaults — like `BottomSheet`, a button appears only when
  its text is passed, which keeps wording (and locale) with the consumer.
  ─────────────────────────────────────────────────────────────────────────────
*/

/** `right` = inline buttons (PC); `center` = full-width stacked buttons (mobile). */
export type DateFooterAlignment = 'right' | 'center';

export interface DateFooterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Which of the two layouts to draw. @default 'center' */
  alignment?: DateFooterAlignment;
  /** Label of the primary button. No label, no button — there is no default wording. */
  confirmText?: ReactNode;
  /** Label of the secondary button. Leaving it out makes this a one-button footer. */
  cancelText?: ReactNode;
  /** Runs on the primary button. */
  onConfirm?: () => void;
  /** Runs on the secondary button. */
  onCancel?: () => void;
  /** Greys out the primary button — for "nothing picked yet". */
  confirmDisabled?: boolean;
  /** Left slot of the `right` alignment — the design puts the range summary here. */
  children?: ReactNode;
}

/**
 * The confirm/cancel row under a date picker. Both buttons are opt-in: each one
 * appears only when its label is passed, which keeps the wording — and the
 * locale — with the caller.
 */
export const DateFooter = forwardRef<HTMLDivElement, DateFooterProps>(
  (
    {
      alignment = 'center',
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
      confirmDisabled,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const isStacked = alignment === 'center';
    // Inline footer with nothing to cancel (the wheel picker): the single button spans the row.
    const confirmFullWidth = isStacked || cancelText == null;

    const confirm = confirmText != null && (
      <Button
        variant="primary"
        size={isStacked ? 'lg' : 'md'}
        fullWidth={confirmFullWidth}
        disabled={confirmDisabled}
        onClick={onConfirm}
      >
        {confirmText}
      </Button>
    );

    const cancel = cancelText != null && (
      <Button
        variant="secondary"
        size="md"
        fullWidth={isStacked}
        onClick={onCancel}
      >
        {cancelText}
      </Button>
    );

    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full gap-2 border-t border-border-neutral-subtle p-4',
          isStacked
            ? 'flex-col items-stretch'
            : cn('items-center', children ? 'justify-between' : 'justify-end'),
          className,
        )}
        {...rest}
      >
        {!isStacked && children != null && (
          <span className="text-sm font-normal leading-sm tracking-md text-foreground">
            {children}
          </span>
        )}

        {/* Stacked puts the primary action on top; inline keeps cancel to its left. */}
        {isStacked ? (
          <>
            {confirm}
            {cancel}
          </>
        ) : (
          <span className={cn('flex items-center gap-2', confirmFullWidth && 'flex-1')}>
            {cancel}
            {confirm}
          </span>
        )}
      </div>
    );
  },
);
DateFooter.displayName = 'DateFooter';
