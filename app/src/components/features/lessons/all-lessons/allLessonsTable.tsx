import { useUserLocale } from "@/services/context/UserLocaleContext"
import { Lesson } from "@/types/types"
import {
  type FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
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
  const [globalFilter, setGlobalFilter] = useState("")
  const [searchParams] = useSearchParams()
  const [sorting, setSorting] = useState<SortingState>([])
  const { userLocale } = useUserLocale()

  const selectedYear = searchParams.get("year")

  const { isPending: isPendingYears } = useLessonYearsQuery(Number(studentId))

  const {
    data: lessons,
    isPending: isPendingLessons,
    isError,
    isFetching,
  } = useAllLessonsPerStudent(Number(selectedYear) || 0, Number(studentId))

  const fuzzyFilter: FilterFn<Lesson> = (row, _, value) => {
    const date = row.getValue("date") as Date
    const lessonContent = row.getValue("lessonContent") as string
    const homework = row.getValue("homework") as string

    return (
      date
        ?.toLocaleDateString(userLocale, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .toLowerCase()
        .includes(value?.toLowerCase()) ||
      lessonContent?.toLowerCase().includes(value?.toLowerCase()) ||
      homework?.toLowerCase().includes(value?.toLowerCase())
    )
  }

  const table = useReactTable({
    data: lessons,
    globalFilterFn: fuzzyFilter,
    columns: allLessonsColumns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      sorting,
    },
  })

  if (isPendingLessons || isPendingYears) return <div>...Loading</div>

  if (isError) return <div>ERROR</div>

  return (
    <div className='mb-10'>
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
        isFetching={isFetching}
      />
    </div>
  )
}
