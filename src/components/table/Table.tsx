import {
  forwardRef,
  type HTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
} from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '../../lib/utils';

// ── Token → Tailwind map ─────────────────────────────────────────────────────
/*
  surface/neutral/secondary/default (#fff)    → bg-white
  surface/neutral/secondary/hover   (#f5f5f5) → bg-neutral-100       (@theme)
  surface/neutral/disabled/inverse  (#ededed) → bg-neutral-subtle     (@theme)
  border/neutral/subtle             (#ededed) → border-neutral-subtle  (@theme)
  text/neutral/strong + default     (#1a1a1a, #0f0f0f) → text-ink    (@theme)
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

export type SortDirection = 'asc' | 'desc';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {}
export interface TableHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement> {}
export interface TableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {}
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  disabled?: boolean;
}
export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortDirection?: SortDirection;
}
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {}

// ── Table ────────────────────────────────────────────────────────────────────

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto">
      <div className="overflow-hidden rounded-lg border border-neutral-subtle">
        <table
          ref={ref}
          className={cn('w-full bg-white', className)}
          {...props}
        />
      </div>
    </div>
  ),
);
Table.displayName = 'Table';

// ── TableHeader ───────────────────────────────────────────────────────────────

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-white', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

// ── TableBody ─────────────────────────────────────────────────────────────────

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn(className)} {...props} />
  ),
);
TableBody.displayName = 'TableBody';

// ── TableRow ──────────────────────────────────────────────────────────────────

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, disabled, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-neutral-subtle last:border-b-0',
        selected
          ? 'bg-neutral-100'
          : disabled
            ? 'bg-neutral-subtle'
            : 'bg-white',
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = 'TableRow';

// ── TableHead ─────────────────────────────────────────────────────────────────

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortDirection, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-6 py-2 text-left align-middle',
        'text-sm font-medium leading-6 tracking-md text-ink whitespace-nowrap',
        className,
      )}
      {...props}
    >
      {sortDirection != null ? (
        <span className="inline-flex items-center gap-2">
          {children}
          {sortDirection === 'asc' ? (
            <ArrowUp size={12} className="shrink-0" />
          ) : (
            <ArrowDown size={12} className="shrink-0" />
          )}
        </span>
      ) : (
        children
      )}
    </th>
  ),
);
TableHead.displayName = 'TableHead';

// ── TableCell ─────────────────────────────────────────────────────────────────

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'h-12 px-6 py-2 align-middle',
        'text-sm font-normal leading-6 tracking-md text-ink whitespace-nowrap',
        className,
      )}
      {...props}
    />
  ),
);
TableCell.displayName = 'TableCell';
