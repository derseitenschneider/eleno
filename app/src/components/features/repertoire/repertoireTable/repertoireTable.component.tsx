import { NavLink, useParams } from "react-router-dom"

import RepertoireControl from "./repertoireControl"
import AddRepertoireItem from "../addRepertoireItem/AddRepertoireItem.component"
import { ChevronLeft } from "lucide-react"
import { useRepertoireQuery } from "../repertoireQueries"
import { DataTable } from "../../../ui/data-table"
import { repertoireColumns } from "./repertoireColumns"
import {
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type FilterFn,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { useState } from "react"
import type { RepertoireItem } from "@/types/types"
import { useUserLocale } from "@/services/context/UserLocaleContext"

function RepertoireList() {
  const { studentId } = useParams()
  const { userLocale } = useUserLocale()
  const {
    data: repertoire,
    isPending,
    isError,
    isFetching,
  } = useRepertoireQuery(Number(studentId))
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const fuzzyFilter: FilterFn<RepertoireItem> = (row, _, value) => {
    const title = row.getValue("title") as string
    const startDate = row.getValue("startDate") as Date
    const endDate = row.getValue("endDate") as Date

    return (
      title?.toLowerCase().includes(value?.toLowerCase()) ||
      startDate
        ?.toLocaleDateString(userLocale, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .toLowerCase()
        .includes(value?.toLowerCase()) ||
      endDate
        ?.toLocaleDateString(userLocale, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .toLowerCase()
        .includes(value?.toLowerCase())
    )
  }

  const table = useReactTable({
    data: repertoire,
    columns: repertoireColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
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
      <RepertoireControl
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isFetching={isFetching}
      />
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
