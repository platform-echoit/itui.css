'use client';

import { useCallback, useMemo, useState } from 'react';
import type { SortDirection, TableHeadProps } from './Table';

/*
  Deliberately a separate module from Table.tsx. That file has no hooks and no
  'use client', so a server component can render a table; putting this state in
  it would take that away from every consumer to serve the ones that sort.
*/

/** What `getHeadProps` hands to a `TableHead`. */
export type TableSortHeadProps = Pick<
  TableHeadProps,
  'sortable' | 'sortDirection' | 'onSortChange'
>;

export interface UseTableSortResult<T> {
  /** `rows`, ordered by the current sort. The original array is never mutated. */
  rows: T[];
  /** Which column is sorted, or `undefined` when the rows are in source order. */
  sortKey?: string;
  /** Which way that column is sorted. `undefined` together with `sortKey`. */
  sortDirection?: SortDirection;
  /** Spread onto the `TableHead` for `key`. */
  getHeadProps: (key: keyof T & string) => TableSortHeadProps;
  /** Jump straight to a sort, e.g. to restore one from the URL. */
  setSort: (
    key: string | undefined,
    direction: SortDirection | undefined,
  ) => void;
}

/*
  `numeric: true` is the reason a collator is here rather than `<`: it puts
  "Item 10" after "Item 9" instead of after "Item 1". `sensitivity: 'base'` makes
  it case- and accent-insensitive, so "apple" and "Apple" tie and keep their
  original relative order. Locale is left undefined on purpose — the runtime's
  locale is what the reader is reading in, which is what matters for Hangul.

  Built once at module scope: constructing an Intl.Collator is the expensive part,
  and this one carries no locale of its own to invalidate.
*/
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

/**
 * Compares two cell values, deciding on the values rather than on a declared
 * column type — a table's rows are almost always uniform, and asking the caller
 * to describe each column would be a second source of truth.
 */
function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return Number(a) - Number(b);
  }
  return collator.compare(String(a), String(b));
}

function isBlank(value: unknown): boolean {
  return value === null || value === undefined;
}

/**
 * Sorts `rows` for a `Table`, and gives each header the three props it needs.
 *
 * Clicking a header cycles `asc → desc → unsorted`, and unsorted restores the
 * order `rows` arrived in. Empty cells (`null` / `undefined`) always sink to the
 * bottom, in both directions — flipping them to the top would hide real data
 * behind a wall of blanks.
 *
 * @example
 * const { rows, getHeadProps } = useTableSort(files);
 * <TableHead {...getHeadProps('name')}>Name</TableHead>
 */
export function useTableSort<T extends object>(
  rows: T[],
  initial?: { key: keyof T & string; direction: SortDirection },
): UseTableSortResult<T> {
  const [sortKey, setSortKey] = useState<string | undefined>(initial?.key);
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(
    initial?.direction,
  );

  const sortedRows = useMemo(() => {
    if (!sortKey || !sortDirection) return rows;

    const sign = sortDirection === 'asc' ? 1 : -1;

    // A copy, because Array.prototype.sort is in place and `rows` belongs to the
    // caller. V8's sort is stable, so rows that tie keep their source order.
    return [...rows].sort((rowA, rowB) => {
      const a = (rowA as Record<string, unknown>)[sortKey];
      const b = (rowB as Record<string, unknown>)[sortKey];

      // Checked before `sign` is applied — blanks sink either way round.
      if (isBlank(a) || isBlank(b)) {
        if (isBlank(a) && isBlank(b)) return 0;
        return isBlank(a) ? 1 : -1;
      }

      return compareValues(a, b) * sign;
    });
  }, [rows, sortKey, sortDirection]);

  const setSort = useCallback(
    (key: string | undefined, direction: SortDirection | undefined) => {
      // Half a sort sorts nothing, so the pair moves together: no direction means
      // no key either, and the rows fall back to source order.
      setSortKey(direction ? key : undefined);
      setSortDirection(direction);
    },
    [],
  );

  const getHeadProps = useCallback(
    (key: keyof T & string): TableSortHeadProps => ({
      sortable: true,
      sortDirection: sortKey === key ? sortDirection : undefined,
      onSortChange: (next) => setSort(key, next),
    }),
    [sortKey, sortDirection, setSort],
  );

  return {
    rows: sortedRows,
    sortKey,
    sortDirection,
    getHeadProps,
    setSort,
  };
}
