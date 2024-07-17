import { DataTable } from '@/components/ui/data-table'
import type { LessonHolder, Student } from '@/types/types'
import {
  type RowSelectionState,
  type SortingState,
  type FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { inactiveHoldersColumns } from './columns'
import InactiveStudentsControl from './control'
type TInactiveHoldersTable = {
  inactiveHolders: Array<LessonHolder>
  isPending: boolean
  isFetching: boolean
  isError: boolean
}

export default function InactiveHoldersTable({
  inactiveHolders,
  isPending,
  isFetching,
  isError,
}: TInactiveHoldersTable) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const fuzzyFilter: FilterFn<LessonHolder> = (row, _, searchValue) => {
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
    data: inactiveHolders,
    columns: inactiveHoldersColumns,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) =>
      row.type === 's' ? `s-${row.holder.id}` : `g-${row.holder.id}`,
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
      <InactiveStudentsControl
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isFetching={isFetching}
        selected={rowSelection}
        setSelected={setRowSelection}
      />
      <DataTable
        table={table}
        columns={inactiveHoldersColumns}
        messageEmpty='Keine Schüler:innen vorhanden'
        isFetching={isFetching}
      />
    </div>
  )
}
