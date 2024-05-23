import Loader from "@/components/ui/loader/Loader"
import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Share,
  Share2Icon,
  Trash,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Lesson } from "@/types/types"
import { useEffect, useState } from "react"
import SearchBar from "@/components/ui/searchBar/SearchBar.component"
import { fetchAllLessonsSupabase } from "@/services/api/lessons.api"

type AllLessonsTableProps = {
  isPending: boolean
}
export default function AllLessonsTable({ isPending }: AllLessonsTableProps) {
  if (isPending) return <Loader loading={isPending} />
  return <DataTableDemo />
}

const data: Lesson[] = [
  {
    id: 1,
    lessonContent: "trarira",
    homework: "success",
    date: new Date(),
    studentId: 1,
  },
  {
    id: 2,
    lessonContent: "schulimulli ",
    homework: "slfjweröaksdjfadsf",
    date: new Date(),
    studentId: 1,
  },
]

export const columns: ColumnDef<Lesson>[] = [
  {
    accessorKey: "date",
    header: "Datum",
    cell: ({ row }) => {
      // const parsedDate = row.getValue("date").toLocaleString("de")
      return <div className='capitalize'>{"testikng"}</div>
    },
  },
  {
    accessorKey: "lessonContent",
    header: "Lektion",
    cell: ({ row }) => (
      <div className='lowercase'>{row.getValue("lessonContent")}</div>
    ),
  },
  {
    accessorKey: "homework",
    header: "Hausaufgaben",
    cell: ({ row }) => <div>{row.getValue("homework")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-4 w-4 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>
              <Pencil className='h-4 w-4 mr-3 text-primary' />
              <span>Lektion bearbeiten</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share className='h-4 w-4 mr-3 text-primary' />
              <span>Hausaufgaben teilen</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Trash2 className='h-4 w-4 mr-3 text-warning' />
              <span>Lektion löschen</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [lessons, setLessons] = useState<Array<Lesson>>()

  useEffect(() => {
    const fetchAllLessons = async () => {
      const data = await fetchAllLessonsSupabase(1)
      if (data) {
        setLessons(data)
      }
    }
    fetchAllLessons()
  }, [])

  const table = useReactTable({
    lessons,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  console.log(lessons)
  if (!lessons || lessons.length === 0) return null
  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <SearchBar
          searchInput={
            (table.getColumn("lessonContent")?.getFilterValue() as string) ?? ""
          }
          handlerSearchInput={(event) =>
            table.getColumn("lessonContent")?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
