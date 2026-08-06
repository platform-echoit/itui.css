import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import * as RadixProgress from '@radix-ui/react-progress';
import { cn } from '../../lib/utils';
import CheckCircleRegularIcon from '../../icons/ITUI/check-circle/CheckCircleRegularIcon';
import CheckRegularIcon from '../../icons/ITUI/check/CheckRegularIcon';
import XCircleRegularIcon from '../../icons/ITUI/xcircle/XCircleRegularIcon';
import XRegularIcon from '../../icons/ITUI/x/XRegularIcon';

/*
  Token → Tailwind map (Figma node 27280:1270 "progress bar")
  ─────────────────────────────────────────────────────────────────────────────
  SHARED
    surface/neutral/disabled/inverse #ededed → bg/stroke-surface-neutral-disabled (track)
    surface/primary/default          #009ce0 → bg/stroke-brand                    (fill)
    color/semantic/red/500           #f44336 → bg/stroke-destructive              (error)
    text/neutral/muted               #595858 → text-neutral-muted                 (value text)
    radius/full                              → rounded-full
    spacing/sm                       8px     → gap-2

  CIRCULAR ("Circular progress bar" 27280:821) — the ring fills the whole box, no padding.
    height/progress/lg 128px → size-progress-lg · Border Width/200 8px stroke
    height/progress/md  72px → size-progress-md · 5px stroke
    height/progress/sm  40px → size-progress-sm · 4px stroke (Figma renders ~3.6px)
    Center label — Lg typography/heading/3xl/semibold 24/36/-0.55 → text-2xl leading-3xl tracking-3xl
                   Md typography/heading/xl/semibold  18/28/-0.04 → text-lg  leading-xl  tracking-xl
                   Sm has no label in the design (showValue defaults to false)
    done/error icon — height/icon/2xl 40px (lg) · height/icon/xl 32px (md) · height/icon/lg 20px (sm)

  LINEAR ("Linear Progress Bar" 29103:1556)
    height/scroll-bar/sm 6px → h-1.5 · radius/full → rounded-full
    typography/body/md/semibold 14/24/0.2 → text-sm leading-md tracking-md font-semibold
    size/container/md 358px → intentionally NOT hardcoded; the root is w-full so the
                              consumer decides the width.
    done/error icon — CheckCircle/XCircle 20px → height/icon/lg

  NOTE — ITUI icons hardcode fill="#101010" on their <path>, so their `color` prop is a
  no-op. `[&_path]:fill-current` + a text-* class is the only way to recolour them.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProgressVariant = 'circular' | 'linear';
export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressStatus = 'active' | 'done' | 'error';

/** Where the text block sits relative to the bar/ring. */
export type ProgressPlacement =
  /** linear — value on the right of the bar (Figma `LinearTextRight`) */
  | 'right'
  /** linear — label on the left + value on the right, above the bar (`LinearTextTop`) */
  | 'top'
  /** linear — value centered below the bar (`LinearTextBottom`) */
  | 'bottom'
  /** circular — value in the middle of the ring */
  | 'inside';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Shape of the progress. Defaults to `'linear'`. */
  variant?: ProgressVariant;

  /** Current amount of progress, from 0 to `max`. Defaults to `0`. */
  value?: number;
  /** Value that counts as complete. Defaults to `100`, so raw counts work too: `value={3} max={7}`. */
  max?: number;
  /**
   * `'active'` shows the percentage, `'done'` shows a check icon on a full bar,
   * `'error'` turns the bar red and shows an X icon. Defaults to `'active'`.
   */
  status?: ProgressStatus;

  /** Ring size. Only applies to `variant="circular"`. Defaults to `'lg'`. */
  size?: ProgressSize;

  /**
   * Where the text block sits. Defaults to `'right'` for linear and `'inside'` for
   * circular; a placement that does not belong to the current variant falls back to
   * that default instead of breaking the layout.
   */
  placement?: ProgressPlacement;
  /** Leading description text. Only rendered when `placement="top"`. */
  label?: ReactNode;

  /** Show the percentage text. Defaults to `true`, except for circular `size="sm"` (matches the design). */
  showValue?: boolean;
  /** Custom percentage text. Defaults to ``(percent) => `${percent}%` ``. */
  formatValue?: (percent: number) => ReactNode;
}

// ─── Size tokens ──────────────────────────────────────────────────────────────

interface CircularSizeSpec {
  /** Ring box in px — also the SVG viewBox, so the geometry math stays in one unit. */
  box: number;
  /** Ring stroke in px. */
  stroke: number;
  /** done/error icon in px. */
  icon: number;
  boxClass: string;
  textClass: string;
}

const circularSizes: Record<ProgressSize, CircularSizeSpec> = {
  lg: {
    box: 128,
    stroke: 8,
    icon: 40,
    boxClass: 'size-progress-lg',
    textClass: 'text-2xl leading-3xl tracking-3xl',
  },
  md: {
    box: 72,
    stroke: 5,
    icon: 32,
    boxClass: 'size-progress-md',
    textClass: 'text-lg leading-xl tracking-xl',
  },
  sm: {
    box: 40,
    stroke: 4,
    icon: 20,
    boxClass: 'size-progress-sm',
    textClass: 'text-sm leading-md tracking-md',
  },
};

/** Linear bars always use the 20px circled glyphs from the design. */
const LINEAR_ICON_SIZE = 20;

const valueTextClass = 'font-semibold text-neutral-muted whitespace-nowrap';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** `done` and `error` always render a complete bar, whatever `value` says. */
function toPercent(value: number, max: number, status: ProgressStatus): number {
  if (status !== 'active') return 100;
  if (!(max > 0)) return 0;
  return Math.round(Math.min(Math.max(value / max, 0), 1) * 100);
}

/**
 * The "Base Progress" element from the design: the percentage text, or the status
 * glyph once the progress has finished or failed.
 */
function ProgressValue({
  status,
  percent,
  showValue,
  formatValue,
  iconSize,
  iconStyle,
  textClass,
}: {
  status: ProgressStatus;
  percent: number;
  showValue: boolean;
  formatValue: (percent: number) => ReactNode;
  iconSize: number;
  /** `'plain'` = bare Check/X (circular), `'circle'` = filled CheckCircle/XCircle (linear). */
  iconStyle: 'plain' | 'circle';
  textClass: string;
}) {
  if (status === 'done' || status === 'error') {
    const isDone = status === 'done';
    const Icon = isDone
      ? iconStyle === 'circle'
        ? CheckCircleRegularIcon
        : CheckRegularIcon
      : iconStyle === 'circle'
        ? XCircleRegularIcon
        : XRegularIcon;

    return (
      <Icon
        width={iconSize}
        height={iconSize}
        className={cn(
          'shrink-0 [&_path]:fill-current',
          isDone ? 'text-brand' : 'text-destructive',
        )}
      />
    );
  }

  if (!showValue) return null;

  return (
    <span className={cn(valueTextClass, textClass)}>{formatValue(percent)}</span>
  );
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      variant = 'linear',
      value = 0,
      max = 100,
      status = 'active',
      size = 'lg',
      placement,
      label,
      showValue,
      formatValue = (percent) => `${percent}%`,
      className,
      ...rest
    },
    ref,
  ) => {
    const isCircular = variant === 'circular';
    const percent = toPercent(value, max, status);
    const resolvedShowValue = showValue ?? !(isCircular && size === 'sm');
    const fillColorClass = status === 'error' ? 'bg-destructive' : 'bg-brand';

    // Radix reports the real numbers to assistive tech, not the rounded percentage.
    const ariaValue = status === 'active' ? Math.min(Math.max(value, 0), max) : max;

    if (isCircular) {
      const { box, stroke, icon, boxClass, textClass } = circularSizes[size];
      const radius = (box - stroke) / 2;
      const circumference = 2 * Math.PI * radius;

      return (
        <RadixProgress.Root
          ref={ref}
          value={ariaValue}
          max={max}
          className={cn(
            'relative inline-flex shrink-0 items-center justify-center',
            boxClass,
            className,
          )}
          {...rest}
        >
          <svg
            viewBox={`0 0 ${box} ${box}`}
            className="absolute inset-0 size-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx={box / 2}
              cy={box / 2}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              className="stroke-surface-neutral-disabled"
            />
            {/* A round cap on a zero-length arc would still paint a dot, so 0% draws nothing. */}
            {percent > 0 && (
              <circle
                cx={box / 2}
                cy={box / 2}
                r={radius}
                fill="none"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - percent / 100)}
                className={cn(
                  'transition-[stroke-dashoffset] duration-300 ease-out',
                  status === 'error' ? 'stroke-destructive' : 'stroke-brand',
                )}
              />
            )}
          </svg>

          <ProgressValue
            status={status}
            percent={percent}
            showValue={resolvedShowValue}
            formatValue={formatValue}
            iconSize={icon}
            iconStyle="plain"
            textClass={textClass}
          />
        </RadixProgress.Root>
      );
    }

    const resolvedPlacement =
      placement && placement !== 'inside' ? placement : 'right';

    const track = (
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-neutral-disabled">
        <RadixProgress.Indicator
          className={cn(
            'h-full rounded-full transition-[width] duration-300 ease-out',
            fillColorClass,
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    );

    const renderValueSlot = (slotClassName?: string) => (
      <span className={cn('flex shrink-0 items-center', slotClassName)}>
        <ProgressValue
          status={status}
          percent={percent}
          showValue={resolvedShowValue}
          formatValue={formatValue}
          iconSize={LINEAR_ICON_SIZE}
          iconStyle="circle"
          textClass="text-sm leading-md tracking-md"
        />
      </span>
    );

    if (resolvedPlacement === 'top') {
      return (
        <RadixProgress.Root
          ref={ref}
          value={ariaValue}
          max={max}
          className={cn('flex w-full flex-col gap-2', className)}
          {...rest}
        >
          <span className="flex w-full items-center justify-between gap-2">
            <span className={cn(valueTextClass, 'text-sm leading-md tracking-md')}>
              {label}
            </span>
            {renderValueSlot('justify-end')}
          </span>
          {track}
        </RadixProgress.Root>
      );
    }

    if (resolvedPlacement === 'bottom') {
      return (
        <RadixProgress.Root
          ref={ref}
          value={ariaValue}
          max={max}
          className={cn('flex w-full flex-col items-center gap-2', className)}
          {...rest}
        >
          {track}
          {renderValueSlot('justify-center')}
        </RadixProgress.Root>
      );
    }

    return (
      <RadixProgress.Root
        ref={ref}
        value={ariaValue}
        max={max}
        className={cn('flex w-full items-center gap-2', className)}
        {...rest}
      >
        <span className="min-w-px flex-1">{track}</span>
        {/* min-w-10 keeps the bar from resizing as the text goes 0% → 100% → icon. */}
        {renderValueSlot('min-w-10 justify-center')}
      </RadixProgress.Root>
    );
  },
);

Progress.displayName = 'Progress';
