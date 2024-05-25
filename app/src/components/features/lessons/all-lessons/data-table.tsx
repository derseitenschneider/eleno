import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import SearchBar from "@/components/ui/searchBar/SearchBar.component"
import { Button } from "@/components/ui/button"
import { File } from "lucide-react"
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import ExportLessons from "../exportLessons/ExportLessons.component"
import { useParams } from "react-router-dom"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  messageEmpty: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  messageEmpty,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [modalOpen, setModalOpen] = useState<"EXPORT" | "">("")
  const { studentId } = useParams()
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <SearchBar
          searchInput={
            (table.getColumn("lessonContent")?.getFilterValue() as string) ?? ""
          }
          handlerSearchInput={(event) =>
            table.getColumn("lessonContent")?.setFilterValue(event.target.value)
          }
        />
        <Button
          size='sm'
          variant='outline'
          onClick={() => setModalOpen("EXPORT")}
        >
          <File className='h-4 w-4 text-primary mr-2' />
          Exportieren
        </Button>
      </div>
      <Table className='border border-hairline'>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                {messageEmpty}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Dialog
        open={modalOpen === "EXPORT"}
        onOpenChange={() => setModalOpen("")}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lektionsliste exportieren</DialogTitle>
            <ExportLessons studentId={Number(studentId)} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
