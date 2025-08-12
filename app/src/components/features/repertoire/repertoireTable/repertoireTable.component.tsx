import { NavLink } from 'react-router-dom'

import Empty from '@/components/ui/Empty.component'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import type { RepertoireItem } from '@/types/types'
import {
  type FilterFn,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronLeft, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { DataTable } from '../../../ui/data-table'
import useCurrentHolder from '../../lessons/useCurrentHolder'
import CreateRepertoireItem from '../CreateRepertoireItem.component'
import { repertoireColumns } from './repertoireColumns'
import { repertoireColumnsMobile } from './repertoireColumnsMobile'
import RepertoireControl from './repertoireControl'

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
    columns: isMobile ? repertoireColumnsMobile : repertoireColumns,
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
            size='sm'
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
            className='min-w-0 [&_tr]:border-b sm:[&_tr]:border-none'
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
      <Drawer
        open={modalOpen === 'CREATE'}
        onOpenChange={() => setModalOpen(null)}
      >
        <DrawerContent>
          <DrawerClose asChild>
            <Button
              variant='ghost'
              className='absolute right-4 top-4 text-foreground/70'
            >
              <X className='size-5' />
            </Button>
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle>Song erfassen</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className='mb-10 text-base'>
            Erfasse einen neuen Song für{' '}
            {currentLessonHolder.type === 's'
              ? currentLessonHolder.holder.firstName
              : currentLessonHolder.holder.name}
            .
          </DrawerDescription>
          <CreateRepertoireItem onCloseModal={() => setModalOpen(null)} />
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default RepertoireTable
