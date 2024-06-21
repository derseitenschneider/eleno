import { DataTable } from "@/components/ui/data-table"
import {
  getCoreRowModel,
  getSortedRowModel,
  type RowSelectionState,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"
import { useState } from "react"
import useStudentsQuery from "../studentsQueries"
import { studentsColumns } from "./columns"
import StudentsControl from "./control"

export default function ActiveStudentsTable() {
  const { data: students, isPending, isError, isFetching } = useStudentsQuery()
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const activeStudents = students?.filter((student) => !student.archive)

  const table = useReactTable({
    data: activeStudents,
    columns: studentsColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })
  if (isPending) return <p>...loading</p>
  if (isError) return <p>...ERROR</p>
  return (
    <div className=''>
      <StudentsControl />
      <DataTable
        table={table}
        columns={studentsColumns}
        messageEmpty='Keine Songs vorhanden.'
        isFetching={isFetching}
      />
    </div>
  )
}
