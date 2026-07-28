'use client';

import {
  createContext,
  forwardRef,
  useContext,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import {
  Toaster as Sonner,
  toast,
  type ExternalToast,
  type ToasterProps,
} from 'sonner';
import { cn } from '../../lib/utils';
import { Button, type ButtonProps } from '../button/Button';

/*
  Token → Tailwind class reference (Figma node 28080:1986)
  ─────────────────────────────────────────────────────────────────────────────
  BAR
  size/container/md              358px                → w-snackbar (--width-snackbar)
  spacing/lg                     16px                 → px-4
  spacing/md                     12px                 → py-3
  spacing/sm                     8px                  → gap-2 (icon → content)
  radius/sm                      8px                  → rounded-lg
  blur/default                   BACKGROUND_BLUR 4    → backdrop-blur-dialog (blur(4px / 2))

  BAR — Tone=Light
  color/opacity/white/xl         #ffffffcc            → bg-opacity-white-xl
  shadow/downwards/sm            0 4px 16px #1a1a1a14 → shadow-downwards-sm

  BAR — Tone=Dark
  color/opacity/black/lg         #1a1a1a99            → bg-surface-snackbar-dark
                                                        (--color-surface-snackbar-dark)
  Dark carries no shadow in Figma.

  TYPOGRAPHY — typography/body/md/semibold, both lines
  typography/size/14             14px                 → text-sm
  font/weight/semibold           600                  → font-semibold
  typography/letter-spacing/md   0.2px                → tracking-md

  TEXT COLORS
  text/neutral/default           #0f0f0f              → text-foreground   (light title)
  text/neutral/muted             #595858              → text-neutral-muted (light description)
  text/neutral/inverse           #fafafa              → text-inverse       (dark, both lines)

  ACTION — "Button/Alternative/Link Label/Default/Small"
  Height/Button/Small            32px                 → h-button-sm (via <Button size="sm">)
  border/primary/default         #009ce0              → text-brand  (via variant="link")
  spacing/md                     12px                 → px-3 (Button sm ships px-4)

  ICON SLOT — Figma "icon/content"
  Button/Size/Small/Icon         20px                 → h-icon-lg w-icon-lg
                                                        (--size-icon-* has no `lg` step)

  DEVIATION — line height
  Figma pins typography/line-height/md (24px) on the text nodes but sizes the content
  frame to a fixed 40px, so the two lines render 20px apart and the bar lands on 64px.
  We reproduce the rendered geometry: h-10 column + leading-sm (20px) lines. Fixed height
  means overflow has to be handled, hence `truncate` on both lines.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Tone ─────────────────────────────────────────────────────────────────────

export type SnackbarTone = 'light' | 'dark';

/** Lets Title/Description pick their colour without every call site repeating `tone`. */
const SnackbarToneContext = createContext<SnackbarTone>('light');

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SnackbarProps extends HTMLAttributes<HTMLDivElement> {
  tone?: SnackbarTone;
  /** Leading icon slot — Figma "icon/content", rendered at 20px */
  icon?: ReactNode;
  /** Trailing action slot — pass a `SnackbarAction` */
  action?: ReactNode;
}

export interface SnackbarTitleProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export interface SnackbarDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export interface SnackbarActionProps
  extends Omit<ButtonProps, 'variant' | 'size'> {}

// ─── Snackbar ─────────────────────────────────────────────────────────────────

export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
  ({ tone = 'light', icon, action, className, children, ...rest }, ref) => (
    <SnackbarToneContext.Provider value={tone}>
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          'flex w-snackbar max-w-full items-center justify-between rounded-lg px-4 py-3 backdrop-blur-dialog',
          tone === 'dark'
            ? 'bg-surface-snackbar-dark'
            : 'bg-opacity-white-xl shadow-downwards-sm',
          className,
        )}
        {...rest}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 self-stretch">
          {icon && (
            <span
              className="flex h-icon-lg w-icon-lg shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <div className="flex h-10 min-w-0 flex-1 flex-col justify-center text-sm font-semibold tracking-md">
            {children}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </SnackbarToneContext.Provider>
  ),
);
Snackbar.displayName = 'Snackbar';

// ─── SnackbarTitle ────────────────────────────────────────────────────────────

export const SnackbarTitle = forwardRef<
  HTMLParagraphElement,
  SnackbarTitleProps
>(({ className, children, ...rest }, ref) => {
  const tone = useContext(SnackbarToneContext);
  return (
    <p
      ref={ref}
      className={cn(
        'truncate leading-sm',
        tone === 'dark' ? 'text-inverse' : 'text-foreground',
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
});
SnackbarTitle.displayName = 'SnackbarTitle';

// ─── SnackbarDescription ──────────────────────────────────────────────────────

export const SnackbarDescription = forwardRef<
  HTMLParagraphElement,
  SnackbarDescriptionProps
>(({ className, children, ...rest }, ref) => {
  const tone = useContext(SnackbarToneContext);
  return (
    <p
      ref={ref}
      className={cn(
        'truncate leading-sm',
        tone === 'dark' ? 'text-inverse' : 'text-neutral-muted',
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
});
SnackbarDescription.displayName = 'SnackbarDescription';

// ─── SnackbarAction ───────────────────────────────────────────────────────────

export const SnackbarAction = forwardRef<
  HTMLButtonElement,
  SnackbarActionProps
>(({ className, ...rest }, ref) => (
  <Button
    ref={ref}
    variant="link"
    size="sm"
    className={cn('px-3', className)}
    {...rest}
  />
));
SnackbarAction.displayName = 'SnackbarAction';

// ─── SnackbarToaster ──────────────────────────────────────────────────────────

/**
 * Scopes snackbars to their own sonner viewport. sonner renders a toast only in the
 * `<Toaster>` whose `id` matches its `toasterId`, so the app-wide `<Toaster>` used by
 * `Toast` never picks these up (and vice versa).
 */
export const SNACKBAR_TOASTER_ID = 'itui-snackbar';

export interface SnackbarToasterProps extends Omit<ToasterProps, 'id'> {}

export const SnackbarToaster = ({
  toastOptions,
  style,
  ...props
}: SnackbarToasterProps) => (
  <Sonner
    id={SNACKBAR_TOASTER_ID}
    position="bottom-center"
    // `unstyled` drops sonner's own box (padding/background/border); its stacking,
    // positioning and enter/exit transitions live on [data-sonner-toast] and stay.
    toastOptions={{ unstyled: true, ...toastOptions }}
    style={{ '--width': 'var(--width-snackbar)', ...style } as CSSProperties}
    {...props}
  />
);

// ─── snackbar() ───────────────────────────────────────────────────────────────

export interface SnackbarOptions
  extends Omit<ExternalToast, 'toasterId' | 'action'> {
  tone?: SnackbarTone;
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Trailing link button. Clicking it dismisses the snackbar, then runs `onClick`. */
  action?: { label: ReactNode; onClick?: () => void };
}

/** Imperatively show a snackbar in the nearest `<SnackbarToaster />`. */
export function snackbar({
  tone,
  icon,
  title,
  description,
  action,
  ...options
}: SnackbarOptions) {
  return toast.custom(
    (id) => (
      <Snackbar
        tone={tone}
        icon={icon}
        action={
          action && (
            <SnackbarAction
              onClick={() => {
                toast.dismiss(id);
                action.onClick?.();
              }}
            >
              {action.label}
            </SnackbarAction>
          )
        }
      >
        <SnackbarTitle>{title}</SnackbarTitle>
        {description && (
          <SnackbarDescription>{description}</SnackbarDescription>
        )}
      </Snackbar>
    ),
    { toasterId: SNACKBAR_TOASTER_ID, ...options },
  );
}

/** Dismiss one snackbar by id, or all of them when called with no argument. */
snackbar.dismiss = (id?: number | string) => toast.dismiss(id);
