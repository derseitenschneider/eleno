import {
  type ColumnDef,
  flexRender,
  type Table as TTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  messageEmpty: string
  isFetching: boolean
  table: TTable<TData>
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  messageEmpty,
  isFetching,
  table,
  className,
}: DataTableProps<TData, TValue>) {
  return (
    <Table
      className={cn(
        isFetching && "opacity-50",
        "pb-4 h-full border-none",
        className,
      )}
    >
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  style={{ width: `${header.column.columnDef.size}%` }}
                  key={header.id}
                  className='text-foreground/75 py-2'
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
      <TableBody className='h-full mb-4 overflow-scroll'>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow >
            <TableCell
              colSpan={columns.length}
              className='p-8 text-foreground/75 text-center'
            >
              {messageEmpty}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
