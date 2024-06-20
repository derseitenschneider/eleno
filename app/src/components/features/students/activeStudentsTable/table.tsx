import { DataTable } from "@/components/ui/data-table"
import { Student } from "@/types/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getCoreRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import useStudentsQuery from "../studentsQueries"
import { studentsColumns } from "./columns"
import StudentsControl from "./control"

export default function ActiveStudentsTable() {
  const { data: students, isPending } = useStudentsQuery()
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const activeStudents = students?.filter((student) => !student.archive)

  const table = useReactTable({
    data: activeStudents,
    columns: studentsColumns,
    getCoreRowModel: getCoreRowModel(),
    // onRowSelectionChange: setRowSelection,
    // onSortingChange: setSorting,
    // globalFilterFn: fuzzyFilter,
    // onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    state: {
      // rowSelection,
      // sorting,
      // globalFilter,
    },
  })
  if (isPending) return <p>...loading</p>
  return (
    <div className=''>
      <StudentsControl />
      <DataTable
        table={table}
        columns={studentsColumns}
        messageEmpty='Keine Songs vorhanden.'
        data={activeStudents}
      // isFetching={isFetching}
      />
    </div>
  )
}
