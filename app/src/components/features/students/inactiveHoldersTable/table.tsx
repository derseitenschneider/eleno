import { DataTable } from '@/components/ui/data-table'
import type { LessonHolder } from '@/types/types'
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
import InactiveHoldersControl from './control'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { inactiveHoldersColumnsMobile } from './columnsMobile'
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
  const isMobile = useIsMobileDevice()

  const fuzzyFilter: FilterFn<LessonHolder> = (row, _, searchValue) => {
    if (row.original.type === 's') {
      const firstName = row.original.holder.firstName
      const lastName = row.original.holder.lastName
      const instrument = row.original.holder.instrument
      const dayOfLesson = row.original.holder.dayOfLesson
      const location = row.original.holder.location

      return (
        firstName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        lastName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        instrument?.toLowerCase().includes(searchValue.toLowerCase()) ||
        dayOfLesson?.toLowerCase().includes(searchValue.toLowerCase()) ||
        location?.toLowerCase().includes(searchValue.toLowerCase()) ||
        false
      )
    }
    const name = row.original.holder.name
    const dayOfLesson = row.original.holder.dayOfLesson
    const location = row.original.holder.location

    return (
      name.toLowerCase().includes(searchValue.toLowerCase()) ||
      dayOfLesson?.toLowerCase().includes(searchValue.toLowerCase()) ||
      location?.toLowerCase().includes(searchValue.toLowerCase()) ||
      false
    )
  }

  const table = useReactTable({
    data: inactiveHolders,
    columns: isMobile ? inactiveHoldersColumnsMobile : inactiveHoldersColumns,
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
    <div>
      <InactiveHoldersControl
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isFetching={isFetching}
        selected={rowSelection}
        setSelected={setRowSelection}
      />
      <DataTable
        table={table}
        columns={inactiveHoldersColumns}
        messageEmpty='Das Archiv ist leer.'
        isFetching={isFetching}
      />
    </div>
  )
}
