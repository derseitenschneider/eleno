import { useUserLocale } from '@/services/context/UserLocaleContext'
import type { Lesson } from '@/types/types'
import {
  type FilterFn,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DataTable } from '@/components/ui/data-table'
import { useAllLessonsPerYear, useLessonYears } from '../lessonsQueries'
import { allLessonsColumns } from './allLessonsColumns'
import AllLessonsControl from './allLessonsControl.component'
import useCurrentHolder from '../useCurrentHolder'

export default function AllLessons() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [searchParams] = useSearchParams()
  const [sorting, setSorting] = useState<SortingState>([])
  const { userLocale } = useUserLocale()
  const { currentLessonHolder } = useCurrentHolder()

  const selectedYear = searchParams.get('year')

  const { isPending: isPendingYears, isError: isErrorYears } = useLessonYears(
    currentLessonHolder?.holder.id || 0,
    currentLessonHolder?.type || 's',
  )

  const {
    data: lessons,
    isPending: isPendingLessons,
    isError: isErrorLessons,
    isFetching,
  } = useAllLessonsPerYear(
    Number(selectedYear) || 0,
    currentLessonHolder?.holder.id || 0,
    currentLessonHolder?.type || 's',
  )

  const fuzzyFilter: FilterFn<Lesson> = (row, _, value) => {
    const date = row.original.date as Date
    const lessonContent = row.original.lessonContent as string
    const homework = row.original.homework

    return (
      date
        ?.toLocaleDateString(userLocale, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        .toLowerCase()
        .includes(value?.toLowerCase()) ||
      lessonContent?.toLowerCase().includes(value?.toLowerCase()) ||
      homework?.toLowerCase().includes(value?.toLowerCase()) ||
      false
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

  if (isErrorLessons || isErrorYears) return <div>ERROR</div>

  return (
    <div className='mb-14 sm:mb-10'>
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
        isFetching={isFetching}
        isSelectable={false}
      />
    </div>
  )
}
