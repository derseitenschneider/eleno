import { NavLink } from 'react-router-dom'

import RepertoireControl from './repertoireControl'
import CreateRepertoireItem from '../CreateRepertoireItem.component'
import { ChevronLeft } from 'lucide-react'
import { DataTable } from '../../../ui/data-table'
import { repertoireColumns } from './repertoireColumns'
import {
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type FilterFn,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { useState } from 'react'
import type { RepertoireItem } from '@/types/types'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import useCurrentHolder from '../../lessons/useCurrentHolder'
import Empty from '@/components/ui/Empty.component'

type RepertoireTableProps = {
  repertoire: Array<RepertoireItem>
  isPending: boolean
  isFetching: boolean
}
function RepertoireTable({
  repertoire,
  isPending,
  isFetching,
}: RepertoireTableProps) {
  const { currentLessonHolder } = useCurrentHolder()
  const { userLocale } = useUserLocale()
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'startDate', desc: false },
  ])
  const [globalFilter, setGlobalFilter] = useState('')

  const fuzzyFilter: FilterFn<RepertoireItem> = (row, _, value) => {
    const title = row.getValue('title') as string
    const startDate = row.getValue('startDate') as Date
    const endDate = row.getValue('endDate') as Date

    return (
      title?.toLowerCase().includes(value?.toLowerCase()) ||
      startDate
        ?.toLocaleDateString(userLocale, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        .toLowerCase()
        .includes(value?.toLowerCase()) ||
      endDate
        ?.toLocaleDateString(userLocale, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
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
    initialState: {
      sorting: [{ id: 'startDate', desc: false }],
    },
  })

  if (isPending) return <p>...loading</p>

  return (
    <div className='mb-14'>
      <div className='flex items-center justify-between mb-2'>
        <NavLink
          to={`/lessons/${currentLessonHolder?.type}-${currentLessonHolder?.holder.id}`}
          className='text-sm sm:text-base flex items-center gap-1'
        >
          <ChevronLeft className='h-4 w-4 text-primary' />
          <span>Zur Lektion</span>
        </NavLink>
      </div>
      <h2>Repertoire</h2>
      <CreateRepertoireItem
        holderType={currentLessonHolder?.type || 's'}
        holderId={currentLessonHolder?.holder.id || 0}
      />
      {repertoire.length > 0 && (
        <RepertoireControl
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          isFetching={isFetching}
        />
      )}
      {repertoire.length > 0 ? (
        <DataTable
          className='min-w-0'
          isSelectable={false}
          table={table}
          columns={repertoireColumns}
          messageEmpty='Keine Songs vorhanden.'
          isFetching={isFetching}
        />
      ) : (
        <Empty emptyMessage='Kein Repertoire erfasst.' />
      )}
    </div>
  )
}

export default RepertoireTable
