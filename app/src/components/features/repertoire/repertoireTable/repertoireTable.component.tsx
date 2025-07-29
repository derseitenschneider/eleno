import { NavLink } from 'react-router-dom'

import RepertoireControl from './repertoireControl'
import CreateRepertoireItem from '../CreateRepertoireItem.component'
import { ChevronLeft, Plus, PlusIcon } from 'lucide-react'
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
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { Button } from '@/components/ui/button'
import {
  DrawerOrDialog,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'

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
  const [modalOpen, setModalOpen] = useState<'CREATE' | null>(null)
  const isMobile = useIsMobileDevice()
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

  if (!currentLessonHolder) return
  if (isPending) return <p>...loading</p>

  return (
    <>
      <div className='mb-20 flex h-full flex-col'>
        <NavLink
          to={`/lessons/${currentLessonHolder?.type}-${currentLessonHolder?.holder.id}`}
          className='mb-2 flex items-center gap-1'
        >
          <ChevronLeft className='h-4 w-4 text-primary' />
          <span className='text-primary'>Zur Lektion</span>
        </NavLink>
        <h2>Repertoire</h2>
        {isMobile ? (
          <Button
            className='mb-4 flex items-center gap-1'
            onClick={() => setModalOpen('CREATE')}
          >
            <Plus className='h-4 w-4' />
            Song erfassen
          </Button>
        ) : (
          <CreateRepertoireItem />
        )}
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
      <DrawerOrDialog
        open={modalOpen === 'CREATE'}
        onOpenChange={() => setModalOpen(null)}
      >
        <DrawerOrDialogContent>
          <DrawerOrDialogHeader>
            <DrawerOrDialogTitle>Song erfassen</DrawerOrDialogTitle>
          </DrawerOrDialogHeader>
          <DrawerOrDialogDescription className='mb-10 text-base'>
            Erfasse einen neuen Song für{' '}
            {currentLessonHolder.type === 's'
              ? currentLessonHolder.holder.firstName
              : currentLessonHolder.holder.name}
            .
          </DrawerOrDialogDescription>
          <CreateRepertoireItem onCloseModal={() => setModalOpen(null)} />
        </DrawerOrDialogContent>
      </DrawerOrDialog>
    </>
  )
}

export default RepertoireTable
