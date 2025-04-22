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
import { DataTable } from '@/components/ui/data-table'
import { allLessonsColumns } from './allLessonsColumns'
import AllLessonsControl from './allLessonsControl.component'
import useHasBanner from '@/hooks/useHasBanner'
import { cn } from '@/lib/utils'

type AllLessonsTableProps = {
  lessons: Array<Lesson>
  isFetching: boolean
}

export default function AllLessonsTable({
  lessons,
  isFetching,
}: AllLessonsTableProps) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const hasBanner = useHasBanner()
  const { userLocale } = useUserLocale()

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

  return (
    <div
      className={cn(
        hasBanner ? 'h-[calc(100%-132px)]' : 'h-[calc(100%-100px)]',
        'mb-20 flex flex-col overflow-hidden p-4 px-5 py-6 sm:mb-10 sm:h-[calc(100%-40px)] sm:py-4 sm:pl-6 sm:pr-4',
      )}
    >
      <AllLessonsControl
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        table={table}
        isFetching={isFetching}
      />
      <DataTable
        className='h-full min-w-[600px] [&_td:not(:has(button)):not(:has(input))]:px-6 [&_td:not(:has(button))]:align-top [&_td]:py-3 [&_th]:px-6'
        table={table}
        columns={allLessonsColumns}
        messageEmpty='Keine Lektionen vorhanden'
        isFetching={isFetching}
        isSelectable={false}
      />
    </div>
  )
}
