import { Button } from '@/components/ui/button'
import SearchBar from '@/components/ui/SearchBar.component'
import type { Student } from '@/types/types'
import { FileDown, Plus } from 'lucide-react'
import type { RowSelectionState } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ActiveStudentsActionDropdown } from './actionDropdown'
import ExportStudentList from '../../ExportStudentList.component'
import CreateStudents from '../../CreateStudents.component'
import { useSearchParams } from 'react-router-dom'
import { Blocker } from '@/components/features/subscription/Blocker'

type StudentsControlProps = {
  isFetching: boolean
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
  selected: RowSelectionState
  setSelected: React.Dispatch<React.SetStateAction<RowSelectionState>>
}
export default function StudentsControl({
  globalFilter,
  setGlobalFilter,
  isFetching,
  selected,
  setSelected,
}: StudentsControlProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const students = queryClient.getQueryData(['students']) as Array<Student>
  const activeStudents = students.filter((student) => !student.archive)

  const [modalOpen, setModalOpen] = useState<'EXPORT' | 'CREATE' | null>()

  const hasActiveStudents = activeStudents.length > 0
  const isDisabledControls = activeStudents.length === 0 || isFetching

  useEffect(() => {
    if (
      searchParams.get('modal') === 'add-students' &&
      modalOpen !== 'CREATE'
    ) {
      setModalOpen('CREATE')
    }
  }, [searchParams, modalOpen])

  function closeModal() {
    setModalOpen(null)
    searchParams.delete('modal')
    setSearchParams(searchParams)
  }

  return (
    <div className='mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row'>
      <div className='mr-auto hidden items-baseline gap-4 sm:flex'>
        <ActiveStudentsActionDropdown
          setSelected={setSelected}
          selected={selected}
        />
        {hasActiveStudents && (
          <p className='hidden text-sm lg:block'>
            Schüler:innen: <span>{activeStudents.length}</span>
          </p>
        )}
      </div>
      <Button
        className='hidden sm:flex'
        size='sm'
        variant='outline'
        onClick={() => setModalOpen('EXPORT')}
        disabled={isDisabledControls}
      >
        <FileDown className='mr-1 h-4 w-4 text-primary' />
        Exportieren
      </Button>
      <SearchBar
        className='w-full'
        searchInput={globalFilter}
        setSearchInput={(input) => setGlobalFilter(input)}
        disabled={isDisabledControls}
      />
      <Button
        className='w-full sm:w-auto'
        data-testid='active-students-control-create'
        disabled={isFetching}
        size='sm'
        onClick={() => setModalOpen('CREATE')}
      >
        <Plus className='mr-1 size-4' />
        <span className='text-white'>Neu</span>
      </Button>

      <Dialog open={modalOpen === 'EXPORT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schülerliste exportieren</DialogTitle>
          </DialogHeader>
          <ExportStudentList students={activeStudents} />
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen === 'CREATE'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schüler:innen erfassen</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Erfasse neue Schüler:innen
          </DialogDescription>
          <Blocker />
          <CreateStudents onSuccess={closeModal} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
