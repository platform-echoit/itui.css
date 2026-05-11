import { forwardRef, type HTMLAttributes } from 'react';

export interface SyncProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  overlay?: boolean;
}

/**
 * SyncProgressBar component as per Sheetric premium design (Note-5 mockup).
 * Displays a thin linear progress bar with a percentage text below.
 */
export const SyncProgressBar = forwardRef<HTMLDivElement, SyncProgressBarProps>(
  ({ value = 0, max = 100, overlay = false, className = '', ...rest }, ref) => {
    const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

    const content = (
      <div
        className={`flex flex-col items-center gap-3 w-64 ${overlay ? '' : className}`}
        {...rest}
      >
        {/* Progress Track */}
        <div className="w-full h-1.5 bg-neutral-subtle/30 rounded-full overflow-hidden backdrop-blur-sm">
          {/* Progress Fill */}
          <div
            className="h-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)] transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {/* Percentage Text */}
        <span className="text-sm font-bold text-slate-600 drop-shadow-sm">
          {percentage}%
        </span>
      </div>
    );

    if (overlay) {
      return (
        <div
          ref={ref}
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 ${className}`}
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
  }
);

SyncProgressBar.displayName = 'SyncProgressBar';
