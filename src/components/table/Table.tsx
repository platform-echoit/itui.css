import {
  type HTMLAttributes,
  type Ref,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
} from 'react';
import { ArrowDownRegularIcon } from '../../icons/ITUI/arrow-down';
import { ArrowUpRegularIcon } from '../../icons/ITUI/arrow-up';
import { ArrowsDownUpRegularIcon } from '../../icons/ITUI/arrows-down-up';
import { cn } from '../../lib/utils';

// ── Token → Tailwind map ─────────────────────────────────────────────────────
/*
  surface/neutral/secondary/default (#fafafa) → bg-inverse
  surface/neutral/secondary/hover   (#f5f5f5) → bg-surface-hover             (@theme)
  surface/neutral/disabled/inverse  (#ededed) → bg-surface-neutral-disabled  (@theme)
  border/neutral/subtle             (#ededed) → border-border-neutral-subtle (@theme)
  text/neutral/default              (#0f0f0f) → text-foreground              (@theme)
  text/neutral/muted                (#595858) → text-neutral-muted           (@theme)
  text/neutral/disabled             (#c2c2c2) → text-neutral-disabled        (@theme)
  border/primary/default as text    (#009ce0) → text-brand                   (@theme)
  radius/sm (8px)                   → rounded-lg
  height/table/sm (40px)           → h-10
  spacing/md (12px)                → px-3 / gap-3
  spacing/sm (8px)                 → py-2 / gap-2
  font/size/14 (14px)              → text-sm
  font/weight/medium (500)         → font-medium
  font/weight/regular (400)        → font-normal
  font/line-height/md (24px)       → leading-6
  font/letter-spacing/md (0.2px)   → tracking-md    (@theme)
  height/icon/sm (12px)            → size-3

  ⚠ `border-neutral-subtle` and `bg-neutral-subtle` are NOT this border colour.
  Both resolve to --color-neutral-subtle (#9e9e9e, the icon/text grey); the
  #ededed surface and border live under the longer names above.

  UNMAPPED:
    size/container/6xl (1024px) — demo width; Table renders w-full.
    checkbox column 40px        — no Tailwind match; consumer applies className.
*/

// ── Types ────────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Ref to the `<table>`, not to the scrolling wrapper around it. */
  ref?: Ref<HTMLTableElement>;
}
export interface TableHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  /** Ref to the `<thead>`. */
  ref?: Ref<HTMLTableSectionElement>;
}
export interface TableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  /** Ref to the `<tbody>`. */
  ref?: Ref<HTMLTableSectionElement>;
}
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Ref to the `<tr>`. */
  ref?: Ref<HTMLTableRowElement>;
  /** Paints the chosen state. It is presentation only — you own the selection. */
  selected?: boolean;
  /** Greys the row out and drops both its click and its keyboard handlers. */
  disabled?: boolean;
}
export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Ref to the `<th>`. */
  ref?: Ref<HTMLTableCellElement>;
  /**
   * Which way this column is currently sorted. It draws the arrow and sets
   * `aria-sort`; doing the sorting is yours.
   */
  sortDirection?: SortDirection;
  /**
   * Marks a sortable column that is not currently sorted, so it still reports
   * `aria-sort="none"` and stays keyboard-reachable. Implied by `sortDirection`.
   */
  sortable?: boolean;
  /**
   * Called with the direction to move to when the sort control is activated,
   * cycling `asc → desc → undefined` (back to unsorted). The cell stays
   * presentational: it tells you what was asked for and paints whatever
   * `sortDirection` you hand back.
   *
   * Reach for `useTableSort` unless you are sorting on the server — it keeps
   * this wired for you.
   */
  onSortChange?: (next: SortDirection | undefined) => void;
}
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Ref to the `<td>`. */
  ref?: Ref<HTMLTableCellElement>;
}

// ── Table ────────────────────────────────────────────────────────────────────

/**
 * A real `<table>` in a bordered, horizontally scrolling frame. It supplies the
 * surface and the type scale only — which state a row or column is in stays with
 * the caller, so `TableRow.selected` and `TableHead.sortDirection` are
 * presentational and this file stays server-renderable.
 *
 * For sorting that means: `TableHead` reports the next direction through
 * `onSortChange` and paints the `sortDirection` you give back. `useTableSort`
 * holds that state and does the comparison for client-side data; drive the two
 * props yourself when the server sorts.
 */
export const Table = ({ className, ...props }: TableProps) => (
  <div className="w-full overflow-x-auto rounded-lg border border-border-neutral-subtle">
    <table className={cn('w-full bg-inverse', className)} {...props} />
  </div>
);

// ── TableHeader ───────────────────────────────────────────────────────────────

/** The `<thead>` — a `TableRow` of `TableHead` cells. */
export const TableHeader = ({ className, ...props }: TableHeaderProps) => (
  // No border of its own: the header is a TableRow, which already draws the
  // 1px rule under itself.
  <thead className={cn('bg-inverse', className)} {...props} />
);

// ── TableBody ─────────────────────────────────────────────────────────────────

/** The `<tbody>` — the data rows. */
export const TableBody = ({ className, ...props }: TableBodyProps) => (
  // The last row drops its rule so the frame's own bottom border is the only
  // line there — a row border would cut straight across the rounded corners.
  // It sits here rather than as `last:` on TableRow, which would also strip the
  // header's rule: that row is the last one in its own <thead>.
  <tbody className={cn('[&_tr:last-child]:border-b-0', className)} {...props} />
);

// ── TableRow ──────────────────────────────────────────────────────────────────

/**
 * One row. `disabled` drops its `onClick` **and** its `onKeyDown`, so a disabled
 * row cannot be triggered by Enter either.
 */
export const TableRow = ({
  className,
  selected,
  disabled,
  onClick,
  onKeyDown,
  ...props
}: TableRowProps) => (
  <tr
    aria-disabled={disabled || undefined}
    data-disabled={disabled ? '' : undefined}
    className={cn(
      'border-b border-border-neutral-subtle',
      selected
        ? 'bg-surface-hover'
        : disabled
          ? 'bg-surface-neutral-disabled'
          : 'bg-inverse',
      disabled && 'pointer-events-none text-neutral-disabled',
      className,
    )}
    // A clickable row stays the caller's to make reachable. A <tr> is not
    // focusable, so `onClick` on its own is mouse-only: pass `tabIndex={0}`, an
    // `onKeyDown` that answers Enter, and `focus-visible:focus-ring-inset`
    // through `className` — the frame around the table scrolls on x, so an
    // outward ring on a row would be clipped. Deliberately not done here:
    // `role="button"` is the obvious pairing and it is wrong (it drops the row
    // out of the table for a screen reader), and adding `tabIndex` unasked would
    // turn every row of every existing table into a tab stop. See ACCESSIBILITY.md.
    //
    // pointer-events-none only stops the mouse, so drop the keyboard path too —
    // otherwise a disabled row still fires the consumer's handlers via Enter.
    onClick={disabled ? undefined : onClick}
    onKeyDown={disabled ? undefined : onKeyDown}
    {...props}
  />
);

// ── TableHead ─────────────────────────────────────────────────────────────────

const ARIA_SORT: Record<SortDirection, 'ascending' | 'descending'> = {
  asc: 'ascending',
  desc: 'descending',
};

/**
 * The tri-state cycle every sort control walks. Unsorted is a real state, not a
 * missing one: it is how a user gets the original row order back.
 */
const NEXT_DIRECTION: Record<
  'none' | SortDirection,
  SortDirection | undefined
> = {
  none: 'asc',
  asc: 'desc',
  desc: undefined,
};

/**
 * A header cell. Given `sortable` or `sortDirection` it wraps its content in a
 * real `<button>` — a `<th>` cannot take focus — so an `onClick` on the cell
 * starts firing on Enter and Space as well.
 */
export const TableHead = ({
  className,
  sortDirection,
  sortable,
  onSortChange,
  children,
  ...props
}: TableHeadProps) => {
  const isSortable = sortable || sortDirection != null;

  return (
    <th
      scope="col"
      aria-sort={
        sortDirection
          ? ARIA_SORT[sortDirection]
          : isSortable
            ? 'none'
            : undefined
      }
      className={cn(
        'h-10 px-3 py-2 text-left align-middle',
        'text-sm font-medium leading-6 tracking-md text-neutral-muted whitespace-nowrap',
        className,
      )}
      {...props}
    >
      {isSortable ? (
        // A <th> can't take focus, so the sort control has to be a real button.
        // Its click bubbles to the <th>, so an onClick already sitting there
        // keeps working — and now fires on Enter/Space too.
        <button
          type="button"
          className="inline-flex items-center gap-2 cursor-pointer rounded-sm text-left focus-visible:focus-ring"
          onClick={
            onSortChange &&
            (() => onSortChange(NEXT_DIRECTION[sortDirection ?? 'none']))
          }
        >
          {children}
          {sortDirection === 'asc' ? (
            <ArrowUpRegularIcon
              width={12}
              height={12}
              className="shrink-0 [&_path]:fill-current"
            />
          ) : sortDirection === 'desc' ? (
            <ArrowDownRegularIcon
              width={12}
              height={12}
              className="shrink-0 [&_path]:fill-current"
            />
          ) : (
            // Sortable but unsorted used to render nothing at all, which left the
            // column with no sign it could be clicked. Muted so it reads as an
            // affordance rather than as a third sort state.
            <ArrowsDownUpRegularIcon
              width={12}
              height={12}
              className="shrink-0 text-neutral-subtle [&_path]:fill-current"
            />
          )}
        </button>
      ) : (
        children
      )}
    </th>
  );
};

// ── TableCell ─────────────────────────────────────────────────────────────────

/** One data cell. Its content does not wrap; give it `whitespace-normal` if it should. */
export const TableCell = ({ className, ...props }: TableCellProps) => (
  <td
    className={cn(
      'h-10 px-3 py-2 align-middle',
      'text-sm font-normal leading-6 tracking-md text-foreground whitespace-nowrap',
      className,
    )}
    {...props}
  />
);
