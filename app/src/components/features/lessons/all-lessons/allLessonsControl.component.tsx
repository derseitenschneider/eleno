import { Button } from '@/components/ui/button'
import SearchBar from '@/components/ui/SearchBar.component'
import type { Lesson } from '@/types/types'
import { ChevronLeft, File } from 'lucide-react'
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
  const hasLessonYears = lessonYears?.length ? lessonYears.length > 0 : false

  function handleSelect(year: string) {
    setSearchParams({ year })
  }

  if (!currentLessonHolder) return null
  return (
    <div className='flex items-center justify-between mb-4'>
      <div className='flex items-center justify-between mb-4'>
        <NavLink
          to={`/lessons/${currentLessonHolder.type}-${currentLessonHolder.holder.id}`}
          className='flex items-center gap-2'
        >
          <ChevronLeft className='h-4 w-4 text-primary' />
          <span>Zur Lektion</span>
        </NavLink>
      </div>
      {hasLessonYears && (
        <Select
          disabled={isFetching}
          onValueChange={handleSelect}
          defaultValue={String(selectedYear)}
        >
          <SelectTrigger className='w-fit'>
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
      <div className='flex items-center gap-4'>
        <Button
          size='sm'
          variant='outline'
          onClick={() => setModalOpen('EXPORT')}
          disabled={!hasLessonYears || isFetching}
        >
          <File className='h-4 w-4 text-primary mr-2' />
          Exportieren
        </Button>

        <SearchBar
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
            <ExportLessons holderId={currentLessonHolder.holder.id} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
