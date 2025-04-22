import { Button } from '@/components/ui/button'
import SearchBar from '@/components/ui/SearchBar.component'
import type { Lesson } from '@/types/types'
import { ChevronLeft, FileDown } from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQueryClient } from '@tanstack/react-query'
import { NavLink, useSearchParams } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ExportLessons from '../ExportLessons.component'
import useCurrentHolder from '../useCurrentHolder'
import { isDemoMode } from '@/config'

type AllLessonsControlPros = {
  table: Table<Lesson>
  isFetching: boolean
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
}
export default function AllLessonsControl({
  isFetching,
  globalFilter,
  setGlobalFilter,
}: AllLessonsControlPros) {
  const queryClient = useQueryClient()
  const { currentLessonHolder } = useCurrentHolder()
  const [searchParams, setSearchParams] = useSearchParams()
  const [modalOpen, setModalOpen] = useState<'EXPORT' | undefined>()
  const yearsData = queryClient.getQueryData([
    'lesson-years',
    {
      holder: `${currentLessonHolder?.type}-${currentLessonHolder?.holder.id}`,
    },
  ]) as Array<{ entity_id: number; years: Array<number> }> | undefined

  let lessonYears = yearsData?.[0]?.years
  if (isDemoMode) {
    lessonYears = [new Date().getFullYear()]
  }
  const selectedYear = searchParams.get('year')
  const hasLessonYears = lessonYears?.length ? lessonYears.length > 0 : false

  function handleSelect(year: string) {
    setSearchParams({ year })
  }
  function closeModal() {
    setModalOpen(undefined)
  }

  if (!currentLessonHolder) return null
  return (
    <div className='mb-4 flex items-center justify-between gap-4 sm:items-start'>
      <div className='flex items-center justify-between'>
        <NavLink
          to={`/lessons/${currentLessonHolder.type}-${currentLessonHolder.holder.id}`}
          className='flex items-center gap-1 text-sm sm:text-base'
        >
          <ChevronLeft className='h-4 w-4 text-primary' />
          <span className='text-primary'>Zur Lektion</span>
        </NavLink>
      </div>
      <div className='items-center sm:flex sm:gap-4'>
        {hasLessonYears && (
          <Select
            disabled={isFetching}
            onValueChange={handleSelect}
            value={String(selectedYear)}
          >
            <SelectTrigger className='ml-auto w-fit'>
              <SelectValue placeholder='Jahr' />
            </SelectTrigger>
            <SelectContent>
              {lessonYears?.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button
          size='sm'
          variant='outline'
          onClick={() => setModalOpen('EXPORT')}
          disabled={!hasLessonYears || isFetching}
          className='hidden sm:flex'
        >
          <FileDown className='mr-2 h-4 w-4 text-primary' />
          Exportieren
        </Button>

        <SearchBar
          className='hidden sm:block'
          searchInput={globalFilter || ''}
          setSearchInput={(value) => setGlobalFilter(value)}
          disabled={!hasLessonYears || isFetching}
        />
      </div>
      <Dialog
        open={modalOpen === 'EXPORT'}
        onOpenChange={() => setModalOpen(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lektionsliste exportieren</DialogTitle>
          </DialogHeader>
          <ExportLessons
            onSuccess={closeModal}
            holderType={currentLessonHolder.type}
            holderId={currentLessonHolder.holder.id}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
