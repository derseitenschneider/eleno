import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import SearchBar from "@/components/ui/searchBar/SearchBar.component"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { File } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import ExportLessons from "../exportLessons/ExportLessons.component"
import { useLessons } from "@/services/context/LessonsContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  messageEmpty: string
  selectedYear?: number
  setSelectedYear: (year: number) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  messageEmpty,
  selectedYear,
  setSelectedYear,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const { lessonYears } = useLessons()
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
        <div className='flex items-center gap-4'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => setModalOpen("EXPORT")}
          >
            <File className='h-4 w-4 text-primary mr-2' />
            Exportieren
          </Button>
          <Select defaultValue={String(selectedYear)}>
            <SelectTrigger className='-[180px]'>
              <SelectValue placeholder='Jahr' />
            </SelectTrigger>
            <SelectContent>
              {lessonYears.map((year) => (
                <SelectItem key={year.year} value={String(year.year)}>
                  {year.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
