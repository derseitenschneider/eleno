import { DataTable } from '@/components/ui/data-table'
import type { Student } from '@/types/types'
import { compareLastName } from '@/utils/sortLessonHolders'
import {
  type RowSelectionState,
  type SortingState,
  type FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { studentsColumns } from './columns'
import StudentsControl from './control'
import useScrollTo from '@/hooks/useScrollTo'
import Empty from '@/components/ui/Empty.component'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'react-router-dom'
import { appConfig } from '@/config'
import mockStudents from '@/services/api/mock-db/mockStudents'

type TActiveStudentsTable = {
  students: Array<Student>
  isError: boolean
  isFetching: boolean
  isPending: boolean
}

export default function ActiveStudentsTable({
  students,
  isError,
  isPending,
  isFetching,
}: TActiveStudentsTable) {
  useScrollTo(0, 0)
  const [searchParams, setSearchParams] = useSearchParams()

  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const activeSortedStudents = useMemo(
    () => students?.filter((student) => !student.archive).sort(compareLastName),
    [students],
  )

  const fuzzyFilter: FilterFn<Student> = (row, _, searchValue) => {
    const firstName = row.original.firstName
    const lastName = row.original.lastName
    const instrument = row.original.instrument
    const dayOfLesson = row.original.dayOfLesson
    const location = row.original.location

    return (
      firstName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      lastName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      instrument?.toLowerCase().includes(searchValue.toLowerCase()) ||
      dayOfLesson?.toLowerCase().includes(searchValue.toLowerCase()) ||
      location?.toLowerCase().includes(searchValue.toLowerCase()) ||
      false
    )
  }

  const table = useReactTable({
    data: activeSortedStudents,
    columns: studentsColumns,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => String(row.id),
    state: {
      sorting,
      rowSelection,
      globalFilter,
    },
  })
  if (isPending) return <p>...loading</p>
  if (isError) return <p>...ERROR</p>

  return (
    <div>
      <StudentsControl
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isFetching={isFetching}
        selected={rowSelection}
        setSelected={setRowSelection}
      />
      {activeSortedStudents.length > 0 ? (
        <DataTable
          table={table}
          columns={studentsColumns}
          messageEmpty='Keine Schüler:innen vorhanden'
          isFetching={isFetching}
        />
      ) : (
        <Empty emptyMessage='Keine Schüler:innen vorhanden' className='mt-8'>
          <Button
            className='mt-4'
            size='sm'
            variant='outline'
            onClick={() => {
              searchParams.set('modal', 'add-students')
              setSearchParams(searchParams)
            }}
          >
            Neue Schüler:innen erfassen
          </Button>
        </Empty>
      )}
    </div>
  )
}
