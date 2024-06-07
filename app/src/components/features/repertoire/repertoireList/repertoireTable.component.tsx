import { NavLink, useParams } from "react-router-dom"

import AddRepertoireItem from "../addRepertoireItem/AddRepertoireItem.component"
import ExportRepertoire from "../exportRepertoire/ExportRepertoire.component"
import { ChevronLeft } from "lucide-react"
import { useRepertoireQuery } from "../repertoireQueries"
import { DataTable } from "../../../ui/data-table"
import { repertoireColumns } from "./repertoireColumns"
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"

function RepertoireList() {
  const { studentId } = useParams()
  const {
    data: repertoire,
    isPending,
    isError,
    isFetching,
  } = useRepertoireQuery(Number(studentId))
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: repertoire,
    columns: repertoireColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  if (isPending) return <p>...loading</p>
  if (isError) return <p>ERROR</p>

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <NavLink
          to={`/lessons/${studentId}`}
          className='flex items-center gap-2'
        >
          <ChevronLeft className='h-4 w-4 text-primary' />
          <span>Zur Lektion</span>
        </NavLink>
      </div>
      <AddRepertoireItem studentId={Number(studentId)} />
      <DataTable
        table={table}
        columns={repertoireColumns}
        messageEmpty='Keine Stücke vorhanden'
        data={repertoire}
        isFetching={isFetching}
      />
    </div>
  )
}

export default RepertoireList
