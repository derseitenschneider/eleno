import { DataTable } from '@/components/ui/data-table'
import type { Group } from '@/types/types'
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
import { groupsColumns } from './columns'
import GroupsControl from './control'
import Empty from '@/components/ui/Empty.component'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'react-router-dom'

type TGroupsTable = {
  groups: Array<Group>
  isPending: boolean
  isError: boolean
  isFetching: boolean
}

export default function GroupsTable({
  groups,
  isPending,
  isError,
  isFetching,
}: TGroupsTable) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const fuzzyFilter: FilterFn<Group> = (row, _, searchValue) => {
    const name = row.original.name

    return name.toLowerCase().includes(searchValue.toLowerCase()) || false
  }

  const table = useReactTable({
    data: groups,
    columns: groupsColumns,
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
      <GroupsControl
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isFetching={isFetching}
        selected={rowSelection}
        setSelected={setRowSelection}
      />
      {groups.length > 0 ? (
        <DataTable
          table={table}
          columns={groupsColumns}
          messageEmpty='Keine Gruppen vorhanden'
          isFetching={isFetching}
        />
      ) : (
        <Empty emptyMessage='Keine Gruppen vorhanden' className='mt-8'>
          <Button
            className='mt-4'
            size='sm'
            variant='outline'
            onClick={() => {
              searchParams.set('modal', 'add-group')
              setSearchParams(searchParams)
            }}
          >
            Neue Gruppe erstellen
          </Button>
        </Empty>
      )}
    </div>
  )
}
