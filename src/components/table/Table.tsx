import {
  type HTMLAttributes,
  type Ref,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
} from 'react';
import { ArrowDownRegularIcon } from '../../icons/ITUI/arrow-down';
import { ArrowUpRegularIcon } from '../../icons/ITUI/arrow-up';
import {cn} from '../../lib/utils';

// ── Token → Tailwind map ─────────────────────────────────────────────────────
/*
  surface/neutral/secondary/default (#fff)    → bg-white
  surface/neutral/secondary/hover   (#f5f5f5) → bg-neutral-100       (@theme)
  surface/neutral/disabled/inverse  (#ededed) → bg-neutral-subtle     (@theme)
  border/neutral/subtle             (#ededed) → border-neutral-subtle  (@theme)
  text/neutral/strong + default     (#1a1a1a, #0f0f0f) → text-foreground    (@theme)
  text/neutral/disabled             (#c2c2c2) → text-neutral-disabled  (@theme)
  border/primary/default as text    (#009ce0) → text-brand             (@theme)
  radius/sm (8px)                   → rounded-lg
  height/table (48px)               → h-12
  static/spacing/24 (24px)         → px-6
  static/spacing/8  (8px)          → py-2
  static/spacing/12 (12px)         → gap-3
  font/size/14 (14px)              → text-sm
  font/weight/medium (500)         → font-medium
  font/weight/regular (400)        → font-normal
  font/line-height/md (24px)       → leading-6
  font/letter-spacing/md (0.2px)   → tracking-md    (@theme)
  height/icon/sm (12px)            → size-3

  UNMAPPED:
    container/7xl (1024px) — demo width; Table renders w-full.
    checkbox column 68px   — no Tailwind match; consumer applies className.
*/

// ── Types ────────────────────────────────────────────────────────────────────

export type SortDirection='asc'|'desc';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  ref?: Ref<HTMLTableElement>;
}
export interface TableHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  ref?: Ref<HTMLTableSectionElement>;
}
export interface TableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  ref?: Ref<HTMLTableSectionElement>;
}
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  ref?: Ref<HTMLTableRowElement>;
  selected?: boolean;
  disabled?: boolean;
}
export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  ref?: Ref<HTMLTableCellElement>;
  sortDirection?: SortDirection;
  /**
   * Marks a sortable column that is not currently sorted, so it still reports
   * `aria-sort="none"` and stays keyboard-reachable. Implied by `sortDirection`.
   */
  sortable?: boolean;
}
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  ref?: Ref<HTMLTableCellElement>;
}

// ── Table ────────────────────────────────────────────────────────────────────

export const Table=({className,...props}: TableProps) => (
  <div className="w-full overflow-x-auto rounded-lg border border-neutral-subtle border-b-0">
    <table className={cn('w-full bg-white',className)} {...props} />
  </div>
);

// ── TableHeader ───────────────────────────────────────────────────────────────

export const TableHeader=({className,...props}: TableHeaderProps) => (
  <thead
    className={cn('bg-white border-b border-neutral-subtle',className)}
    {...props}
  />
);

// ── TableBody ─────────────────────────────────────────────────────────────────

export const TableBody=({className,...props}: TableBodyProps) => (
  <tbody className={cn(className)} {...props} />
);

// ── TableRow ──────────────────────────────────────────────────────────────────

export const TableRow=({
  className,
  selected,
  disabled,
  onClick,
  onKeyDown,
  ...props
}: TableRowProps) => (
  <tr
    aria-disabled={disabled||undefined}
    data-disabled={disabled? '':undefined}
    className={cn(
      'border-b border-neutral-subtle',
      selected? 'bg-neutral-100':disabled? 'bg-neutral-subtle':'bg-white',
      disabled&&'pointer-events-none text-neutral-disabled',
      className,
    )}
    // pointer-events-none only stops the mouse, so drop the keyboard path too —
    // otherwise a disabled row still fires the consumer's handlers via Enter.
    onClick={disabled? undefined:onClick}
    onKeyDown={disabled? undefined:onKeyDown}
    {...props}
  />
);

// ── TableHead ─────────────────────────────────────────────────────────────────

const ARIA_SORT: Record<SortDirection,'ascending'|'descending'> = {
  asc: 'ascending',
  desc: 'descending',
};

export const TableHead=({
  className,
  sortDirection,
  sortable,
  children,
  ...props
}: TableHeadProps) => {
  const isSortable=sortable||sortDirection!=null;

  return (
    <th
      scope="col"
      aria-sort={
        sortDirection? ARIA_SORT[sortDirection]:isSortable? 'none':undefined
      }
      className={cn(
        'h-10 px-3 text-left align-middle',
        'text-sm font-medium leading-6 tracking-md text-brand-secondary-900 whitespace-nowrap',
        className,
      )}
      {...props}
    >
      {isSortable? (
        // A <th> can't take focus, so the sort control has to be a real button.
        // Its click bubbles to the <th>, so an onClick already sitting there
        // keeps working — and now fires on Enter/Space too.
        <button
          type="button"
          className="inline-flex items-center gap-2 cursor-pointer rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {children}
          {sortDirection==='asc'? (
            <ArrowUpRegularIcon
              width={12}
              height={12}
              className="shrink-0 [&_path]:fill-current"
            />
          ):sortDirection==='desc'? (
            <ArrowDownRegularIcon
              width={12}
              height={12}
              className="shrink-0 [&_path]:fill-current"
            />
          ):null}
        </button>
      ):(
        children
      )}
    </th>
  );
};

// ── TableCell ─────────────────────────────────────────────────────────────────

export const TableCell=({className,...props}: TableCellProps) => (
  <td
    className={cn(
      'h-10 px-3 py-2 align-middle',
      'text-sm font-normal leading-6 tracking-md text-foreground whitespace-nowrap',
      className,
    )}
    {...props}
  />
);
