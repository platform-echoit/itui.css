import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

/*
  Token → Tailwind map (Figma node 27277:112)
  ─────────────────────────────────────────────────────────────────────────────
  CELL  height/pagination 32px → h-8 w-8 · radius/xs 4px → rounded-sm
        body/md/regular 14px/24/0.2 → text-sm leading-6 tracking-md · icon 20px → size-5
    PageNumber Default  surface/neutral/secondary #fafafa → bg-inverse · text-foreground
    PageNumber Hover    surface/primary/subtle    #e6f5fc → bg-brand-subtle
    PageNumber Active   surface/primary/default   #009ce0 → bg-brand · text/neutral/inverse #fafafa → text-inverse
  ROW   gap between arrow clusters spacing/lg 16px → gap-4 · arrows gap-1 (4px) · numbers gap-2 (8px)
  ─────────────────────────────────────────────────────────────────────────────
*/

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page (1-based). */
  page: number;
  /** Total number of pages. */
  total: number;
  onPageChange?: (page: number) => void;
  /** Pages shown on each side of the current page. @default 1 */
  siblingCount?: number;
  /** Show the jump-to-first / jump-to-last double-chevron buttons. @default true */
  showEdges?: boolean;
}

const CELL =
  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-sm leading-6 tracking-md transition-colors';

function getPages(
  page: number,
  total: number,
  siblingCount: number,
): (number | 'ellipsis')[] {
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const totalToShow = siblingCount * 2 + 5;
  if (total <= totalToShow) return range(1, total);

  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, total);
  const showLeft = left > 2;
  const showRight = right < total - 1;

  if (!showLeft && showRight) {
    return [...range(1, siblingCount * 2 + 3), 'ellipsis', total];
  }
  if (showLeft && !showRight) {
    return [1, 'ellipsis', ...range(total - (siblingCount * 2 + 2), total)];
  }
  return [1, 'ellipsis', ...range(left, right), 'ellipsis', total];
}

function Chevron({
  direction,
  double,
  className,
}: {
  direction: 'left' | 'right';
  double?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(direction === 'right' && '-scale-x-100', className)}
      aria-hidden="true"
    >
      <path d="M12 5L7 10L12 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {double && (
        <path d="M16 5L11 10L16 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function EllipsisIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="5" cy="10" r="1.3" />
      <circle cx="10" cy="10" r="1.3" />
      <circle cx="15" cy="10" r="1.3" />
    </svg>
  );
}

interface CellButtonProps {
  active?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

function CellButton({ active, disabled, ariaLabel, onClick, children }: CellButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className={cn(
        CELL,
        'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
        active
          ? 'bg-brand text-inverse'
          : 'bg-inverse text-foreground hover:bg-brand-subtle',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-inverse',
      )}
    >
      {children}
    </button>
  );
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page,
      total,
      onPageChange,
      siblingCount = 1,
      showEdges = true,
      className,
      ...rest
    },
    ref,
  ) => {
    const goTo = (p: number) => {
      const next = Math.min(Math.max(p, 1), total);
      if (next !== page) onPageChange?.(next);
    };
    const pages = getPages(page, total, siblingCount);

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Pagination"
        className={cn('flex items-center gap-4', className)}
        {...rest}
      >
        <div className="flex items-center gap-1">
          {showEdges && (
            <CellButton ariaLabel="First page" disabled={page <= 1} onClick={() => goTo(1)}>
              <Chevron direction="left" double className="size-5" />
            </CellButton>
          )}
          <CellButton ariaLabel="Previous page" disabled={page <= 1} onClick={() => goTo(page - 1)}>
            <Chevron direction="left" className="size-5" />
          </CellButton>
        </div>

        <div className="flex items-center gap-2">
          {pages.map((p, index) =>
            p === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className={cn(CELL, 'text-neutral-muted')}
              >
                <EllipsisIcon className="size-5" />
              </span>
            ) : (
              <CellButton
                key={p}
                active={p === page}
                ariaLabel={`Page ${p}`}
                onClick={() => goTo(p)}
              >
                {p}
              </CellButton>
            ),
          )}
        </div>

        <div className="flex items-center gap-1">
          <CellButton ariaLabel="Next page" disabled={page >= total} onClick={() => goTo(page + 1)}>
            <Chevron direction="right" className="size-5" />
          </CellButton>
          {showEdges && (
            <CellButton ariaLabel="Last page" disabled={page >= total} onClick={() => goTo(total)}>
              <Chevron direction="right" double className="size-5" />
            </CellButton>
          )}
        </div>
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';
