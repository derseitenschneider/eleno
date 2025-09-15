import { useQueryClient } from '@tanstack/react-query'
import type { Table } from '@tanstack/react-table'
import { ChevronLeft, FileDown } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import SearchBar from '@/components/ui/SearchBar.component'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Lesson } from '@/types/types'
import ExportLessonsSkeleton from '../ExportLessonsSkeleton.component'
import useCurrentHolder from '../useCurrentHolder'

const ExportLessons = lazy(() => import('../ExportLessons.component'))

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

  const lessonYears = yearsData?.[0]?.years
  const selectedYear = searchParams.get('year')
  const selectedAttendance = searchParams.get('attendance') || 'all'
  const hasLessonYears = lessonYears?.length ? lessonYears.length > 0 : false

  function handleSelect(year: string) {
    if (year !== selectedYear) {
      setSearchParams((prev) => ({ ...Object.fromEntries(prev), year }))
    }
  }
  function handleAttendanceFilterChange(value: string) {
    if (value !== selectedAttendance) {
      setSearchParams((prev) => ({
        ...Object.fromEntries(prev),
        attendance: value,
      }))
    }
  }
  function closeModal() {
    setModalOpen(undefined)
  }

  if (!currentLessonHolder) return null
  return (
    <div className='mb-4 flex flex-col items-stretch justify-between gap-4 sm:flex-row'>
      <div className='flex items-center justify-between'>
        <NavLink
          to={`/lessons/${currentLessonHolder.type}-${currentLessonHolder.holder.id}`}
          className='flex items-center gap-1'
        >
          <ChevronLeft className='h-4 w-4 text-primary' />
          <span className='text-primary'>Zur Lektion</span>
        </NavLink>
      </div>
      <div className='flex flex-col-reverse items-center justify-between gap-2 sm:flex-row sm:gap-4'>
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

        <Select
          disabled={isFetching}
          onValueChange={handleAttendanceFilterChange}
          value={selectedAttendance}
        >
          <SelectTrigger className='hidden w-fit sm:flex'>
            <SelectValue placeholder='Filter' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Alle Lektionen</SelectItem>
            <SelectItem value='attended'>Nur gehaltene Lektionen</SelectItem>
            <SelectItem value='absences'>Nur Absenzen</SelectItem>
          </SelectContent>
        </Select>
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
          <Suspense fallback={<ExportLessonsSkeleton />}>
            <ExportLessons
              onSuccess={closeModal}
              holderType={currentLessonHolder.type}
              holderId={currentLessonHolder.holder.id}
            />
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  )
}
