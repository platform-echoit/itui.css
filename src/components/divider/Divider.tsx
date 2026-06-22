import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind map (Figma node 26941:4032)
  ─────────────────────────────────────────────────────────────────────────────
  LINE COLOR
    border/neutral/subtle  #ededed → bg-surface-neutral-hover

  THICKNESS
    stroke/xs  1px  → h-px   (Normal)
    stroke/lg  12px → h-3    (Thick)

  TEXT variant
    gap spacing/md 12px            → gap-3
    text/neutral/muted   #595858   → text-neutral-muted
    body/md/medium 14px 24 0.2 500 → text-sm leading-6 tracking-md font-medium
  ─────────────────────────────────────────────────────────────────────────────
*/

export type DividerVariant = 'normal' | 'thick';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Line thickness — `normal` (1px) or `thick` (12px). Ignored when `children` is set. */
  variant?: DividerVariant;
  /** When provided, renders a labeled divider (line · text · line). */
  children?: ReactNode;
}

const LINE = 'bg-surface-neutral-hover';

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ variant = 'normal', className, children, ...rest }, ref) => {
    if (children != null) {
      return (
        <div
          ref={ref}
          className={cn('flex w-full items-center gap-3', className)}
          {...rest}
        >
          <span aria-hidden="true" className={cn('h-px flex-1', LINE)} />
          <span className="shrink-0 whitespace-nowrap text-sm font-medium leading-6 tracking-md text-neutral-muted">
            {children}
          </span>
          <span aria-hidden="true" className={cn('h-px flex-1', LINE)} />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn(
          'w-full shrink-0',
          LINE,
          variant === 'thick' ? 'h-3' : 'h-px',
          className,
        )}
        {...rest}
      />
    );
  },
);

Divider.displayName = 'Divider';
