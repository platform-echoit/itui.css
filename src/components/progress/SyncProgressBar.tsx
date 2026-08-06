import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface SyncProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Current amount of progress, from 0 to `max`. @default 0 */
  value?: number;
  /** Value that counts as complete, so raw counts work too. @default 100 */
  max?: number;
  /** Centre the bar over a full-screen dimmed layer, blocking the page behind it. */
  overlay?: boolean;
}

/**
 * SyncProgressBar component as per Sheetric premium design (Note-5 mockup).
 * Displays a thin linear progress bar with a percentage text below.
 */
export const SyncProgressBar = forwardRef<HTMLDivElement, SyncProgressBarProps>(
  ({ value = 0, max = 100, overlay = false, className = '', ...rest }, ref) => {
    const percentage = Math.min(
      100,
      Math.max(0, Math.round((value / max) * 100)),
    );

    const content = (
      <div
        className={cn(
          'flex flex-col items-center gap-2 w-[331px]',
          overlay ? '' : className,
        )}
        {...rest}
      >
        {/* Progress Track */}
        <div className="w-full h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
          {/* Progress Fill */}
          <div
            className="h-full bg-[#4CAF50] transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {/* Percentage Text */}
        <span className="text-sm font-semibold text-[#595858]">
          {percentage}%
        </span>
      </div>
    );

    if (overlay) {
      return (
        <div
          ref={ref}
          className={cn(
            'fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 [backdrop-filter:blur(2px)] animate-in fade-in duration-500',
            className,
          )}
        >
          {content}
        </div>
      );
    }

    return (
      <div ref={ref} {...rest}>
        {content}
      </div>
    );
  },
);

SyncProgressBar.displayName = 'SyncProgressBar';
