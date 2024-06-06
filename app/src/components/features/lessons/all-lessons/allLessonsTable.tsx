import {
  type ColumnFiltersState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  FilterFn,
} from "@tanstack/react-table"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import { NavLink, useParams, useSearchParams } from "react-router-dom"
import { DataTable } from "../../../ui/data-table"
import { useAllLessonsPerStudent, useLessonYearsQuery } from "../lessonsQueries"
import { allLessonsColumns } from "./allLessonsColumns"
import AllLessonsControl from "./allLessonsControl.component"

export default function AllLessons() {
  const { studentId } = useParams()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedYear = searchParams.get("year")
  const { data: lessonYears, isPending: isPendingYears } = useLessonYearsQuery(
    Number(studentId),
  )
  const {
    data: lessons,
    isPending: isPendingLessons,
    isError,
    isFetching,
  } = useAllLessonsPerStudent(Number(selectedYear) || 0, Number(studentId))

  const fuzzyFilter: FilterFn<Lesson> = (row, columnId, filterValue) => {
    const searchableRowContent = `${row.original.lessonContent} ${row.original.homework} ${row.original.date}`

    return searchableRowContent
      .toLowerCase()
      .includes(filterValue.toLowerCase())
  }

  const table = useReactTable({
    data: lessons,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    columns: allLessonsColumns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy",
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      globalFilter,
    },
  })

  if (isPendingLessons || isPendingYears) return <div>...Loading</div>

  if (isError) return <div>ERROR</div>

  return (
    <>
      <div className='flex items-center justify-between mb-4'>
        <NavLink
          to={`/lessons/${studentId}`}
          className='flex items-center gap-2'
        >
          <ChevronLeft className='h-4 w-4 text-primary' />
          <span>Zur Lektion</span>
        </NavLink>
      </div>
      <AllLessonsControl
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        table={table}
        isFetching={isFetching}
      />
      <DataTable
        table={table}
        columns={allLessonsColumns}
        messageEmpty='Keine Lektionen vorhanden'
        data={lessons}
        lessonYears={lessonYears?.years || []}
        isFetching={isFetching}
      />
    </>
  )
}
