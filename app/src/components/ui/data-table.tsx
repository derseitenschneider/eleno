import {
  type ColumnDef,
  flexRender,
  type Table as TTable,
  type Row,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import Empty from './Empty.component'
import { ScrollArea } from './scroll-area'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  messageEmpty: string
  isFetching: boolean
  table: TTable<TData>
  className?: string
  isSelectable?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  messageEmpty,
  isFetching,
  table,
  className,
  isSelectable = true,
}: DataTableProps<TData, TValue>) {
  function toggleSelection(row: Row<TData>) {
    if (!isSelectable) return
    row.toggleSelected()
  }
  return (
    <ScrollArea className='border border-hairline sm:min-h-[unset]'>
      <Table
        className={cn(
          isFetching && 'opacity-50',
          'pb-4 shadow w-full lg:min-w-[650px]',
          className,
        )}
      >
        <TableHeader className='sticky top-0 z-10 bg-background50 after:absolute after:bottom-0 after:h-[1px] after:w-full after:bg-hairline'>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    style={{ width: `${header.column.columnDef.size}%` }}
                    key={header.id}
                    className='[&>*]:text-foreground/75'
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className='mb-4 w-full'>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={cn(
                  'odd:bg-background100',
                  isSelectable && 'cursor-pointer',
                )}
                onClick={() => toggleSelection(row)}
              >
                {row.getVisibleCells().map((cell) => {
                  if (cell.column.columnDef.meta?.colSpan?.(row) === 0)
                    return null
                  return (
                    <TableCell
                      key={cell.id}
                      colSpan={cell.column.columnDef.meta?.colSpan?.(row) ?? 1}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='p-8 text-center text-foreground/75'
              >
                <Empty emptyMessage={messageEmpty} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}
