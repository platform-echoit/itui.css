export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './Table';

export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  SortDirection,
} from './Table';

// Named, not `export *`: this module is 'use client', and a star export over a
// client module pulls the whole library into the client bundle (check:barrels).
export { useTableSort } from './use-table-sort';
export type { TableSortHeadProps, UseTableSortResult } from './use-table-sort';
