import type { ColumnMeta, RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    colSpan?: (row: Row<TData>) => number
  }
}
