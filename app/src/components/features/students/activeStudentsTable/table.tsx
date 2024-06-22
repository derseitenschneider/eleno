import { DataTable } from "@/components/ui/data-table"
import { Student } from "@/types/types"
import {
  type RowSelectionState,
  type SortingState,
  type FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useMemo, useState } from "react"
import useStudentsQuery from "../studentsQueries"
import { studentsColumns } from "./columns"
import StudentsControl from "./control"

export default function ActiveStudentsTable() {
  const { data: students, isPending, isError, isFetching } = useStudentsQuery()
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const activeStudents = useMemo(
    () => students?.filter((student) => !student.archive),
    [students],
  )

  const fuzzyFilter: FilterFn<Student> = (row, _, searchValue) => {
    const firstName = row.original.firstName
    const lastName = row.original.lastName
    const instrument = row.original.instrument
    const dayOfLesson = row.original.dayOfLesson
    const location = row.original.location

    return (
      firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
      lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
      instrument.toLowerCase().includes(searchValue.toLowerCase()) ||
      dayOfLesson?.toLowerCase().includes(searchValue.toLowerCase()) ||
      location?.toLowerCase().includes(searchValue.toLowerCase()) ||
      false
    )
  }

  const table = useReactTable({
    data: activeStudents,
    columns: studentsColumns,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      rowSelection,
      globalFilter,
    },
  })
  if (isPending) return <p>...loading</p>
  if (isError) return <p>...ERROR</p>

  return (
    <div className=''>
      <StudentsControl
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isFetching={isFetching}
        selected={rowSelection}
      />
      <DataTable
        table={table}
        columns={studentsColumns}
        messageEmpty='Kein Schüler:innen vorhanden'
        isFetching={isFetching}
      />
    </div>
  )
}
