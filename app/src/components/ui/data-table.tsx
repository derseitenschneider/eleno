import {
  type ColumnDef,
  flexRender,
  type Row,
  type Table as TTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { cn } from '@/lib/utils'
import Empty from './Empty.component'
import { ScrollArea } from './scroll-area'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  messageEmpty: string
  isFetching: boolean
  table: TTable<TData>
  className?: string
  testId?: string
  isSelectable?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  messageEmpty,
  isFetching,
  table,
  className,
  testId = '',
  isSelectable = true,
}: DataTableProps<TData, TValue>) {
  const isMobile = useIsMobileDevice()

  // Type guard to safely check for attendance_status property
  function hasAttendanceStatus(
    data: unknown,
  ): data is { attendance_status?: string } {
    return (
      typeof data === 'object' && data !== null && 'attendance_status' in data
    )
  }

  function toggleSelection(row: Row<TData>) {
    if (!isSelectable || isMobile) return
    row.toggleSelected()
  }
  return (
    <ScrollArea className='min-h-[100px] border border-hairline sm:min-h-[unset]'>
      <Table
        data-testid={testId}
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
                  'bg-background100 min-[769px]:even:bg-background50',
                  isSelectable && 'cursor-pointer',
                  hasAttendanceStatus(row.original) &&
                  row.original.attendance_status ===
                  'student_absent_not_excused' &&
                  'min-[769px]:border-l-4 border-warning/50 sm:!bg-warning/[7%]',
                  hasAttendanceStatus(row.original) &&
                  (row.original.attendance_status ===
                    'student_absent_excused' ||
                    row.original.attendance_status === 'teacher_absent') &&
                  'min-[769px]:border-l-4 border-yellow-600/50 sm:!bg-yellow-600/[3%]',
                  hasAttendanceStatus(row.original) &&
                  row.original.attendance_status === 'held' &&
                  'border-none',
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
