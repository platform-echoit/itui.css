'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Toaster as Sonner, toast, type ToasterProps } from 'sonner';
import {
  SuccessIcon,
  InfoIcon,
  WarningIcon,
  ErrorIcon,
} from '../../icons/toast';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind class reference (Figma node 28082:3013)
  ─────────────────────────────────────────────────────────────────────────────
  BAR
  spacing/lg                     16px                 → px-4
  spacing/md                     12px                 → py-3, gap-3 (icon → content)
  radius/sm                      8px                  → rounded-lg
  blur/default                   BACKGROUND_BLUR      → backdrop-blur-dialog (blur(2px))

  BAR — Tone=Light
  color/opacity/white/xl         #ffffffcc            → bg-opacity-white-xl
  shadow/downwards/sm            0 4px 16px #1a1a1a14 → shadow-downwards-sm

  BAR — Tone=Dark
  color/opacity/black/lg         #1a1a1a99            → bg-surface-snackbar-dark
                                                        (one token, shared with Snackbar —
                                                         both bars are the same Figma variable)
  Dark carries no shadow in Figma.

  CONTENT — Figma pins the column to a fixed 240px, so long text wraps and the
  bar grows taller rather than the column growing wider.
  typography/body/md/semibold    14px/24px/0.2px      → text-sm font-semibold leading-6 tracking-md
  text/neutral/muted             #595858              → text-neutral-muted (light)
  text/neutral/inverse           #fafafa              → text-inverse       (dark)

  ICON — 16px slot, one icon per Type. Type=Normal is the icon-less variant.
  The icons carry their own Figma fills (#4CAF50 / #009CE0 / #FFAD33 / #F44336)
  and their own intrinsic size — Warning is 16×15 — so the slot centres them
  instead of stretching them to a square.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Toast ────────────────────────────────────────────────────────────────────

export type ToastTone = 'light' | 'dark';

/** Figma spells the third one "Infomation". */
export type ToastType = 'normal' | 'success' | 'info' | 'warning' | 'error';

const TYPE_ICON: Record<ToastType, ReactNode> = {
  normal: null,
  success: <SuccessIcon />,
  info: <InfoIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
};

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  tone?: ToastTone;
  type?: ToastType;
  /** Replaces the icon `type` picks, in the same 16px slot. */
  icon?: ReactNode;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    { tone = 'light', type = 'normal', icon, className, children, ...rest },
    ref,
  ) => {
    const resolvedIcon = icon ?? TYPE_ICON[type];
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          'flex w-fit max-w-full items-center gap-3 rounded-lg px-4 py-3 backdrop-blur-dialog',
          tone === 'dark'
            ? 'bg-surface-snackbar-dark text-inverse'
            : 'bg-opacity-white-xl text-neutral-muted shadow-downwards-sm',
          className,
        )}
        {...rest}
      >
        {resolvedIcon && (
          <span
            className="flex size-4 shrink-0 items-center justify-center"
            aria-hidden="true"
          >
            {resolvedIcon}
          </span>
        )}
        <p className="w-60 text-sm font-semibold leading-6 tracking-md">
          {children}
        </p>
      </div>
    );
  },
);
Toast.displayName = 'Toast';

// ─── Toaster ──────────────────────────────────────────────────────────────────

const Toaster = ({ className, ...props }: ToasterProps) => {
  return (
    <Sonner
      className={cn('toaster group', className)}
      icons={{
        success: <SuccessIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <WarningIcon className="size-4" />,
        error: <ErrorIcon className="size-4" />,
      }}
      position="top-center"
      expand={true}
      visibleToasts={5}
      toastOptions={{
        classNames: {
          toast:
            'rounded-lg bg-white/80 backdrop-blur-sm flex items-center gap-3 px-4 py-3 border h-[48px]',
          title:
            'text-sm font-semibold! leading-6! tracking-md h-full flex items-center text-brand-600',
          icon: 'm-0!',
        },
      }}
      style={
        {
          '--normal-text': 'var(--muted-foreground, #595858)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

// Re-exported so consumers never have to import `sonner` directly — it is our
// dependency, not theirs, and a bare `from 'sonner'` only resolves by hoisting.
export { Toaster, toast };

export type { ToasterProps };
