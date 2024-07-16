import { Button } from '@/components/ui/button'
import SearchBar from '@/components/ui/SearchBar.component'
import type { Group, Student } from '@/types/types'
import { File, Plus } from 'lucide-react'
import type { RowSelectionState } from '@tanstack/react-table'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GroupsActionDropdown } from './actionDropdown'
import CreateGroup from '../CreateGroup.component'

type StudentsControlProps = {
  isFetching: boolean
  globalFilter: string
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
  selected: RowSelectionState
  setSelected: React.Dispatch<React.SetStateAction<RowSelectionState>>
}
export default function GroupsControl({
  globalFilter,
  setGlobalFilter,
  isFetching,
  selected,
  setSelected,
}: StudentsControlProps) {
  const queryClient = useQueryClient()
  const groups = queryClient.getQueryData(['groups']) as Array<Group>
  const activeGroups = groups.filter((group) => !group.archive)

  const [modalOpen, setModalOpen] = useState<'EXPORT' | 'CREATE' | null>()

  const hasActiveGroups = activeGroups.length > 0
  const isDisabledControls = activeGroups.length === 0 || isFetching

  function closeModal() {
    setModalOpen(null)
  }

  return (
    <div className='flex items-end gap-4 mb-4'>
      <div className='mr-auto items-baseline flex gap-4'>
        <GroupsActionDropdown setSelected={setSelected} selected={selected} />
        {hasActiveGroups && (
          <p className='text-sm'>
            Aktive Gruppen: <span>{activeGroups.length}</span>
          </p>
        )}
      </div>
      <Button
        size='sm'
        variant='outline'
        onClick={() => setModalOpen('EXPORT')}
        disabled={isDisabledControls}
      >
        <File className='h-4 w-4 text-primary mr-1' />
        Exportieren
      </Button>
      <SearchBar
        searchInput={globalFilter}
        setSearchInput={(input) => setGlobalFilter(input)}
        disabled={isDisabledControls}
      />
      <Button
        disabled={isFetching}
        size='sm'
        onClick={() => setModalOpen('CREATE')}
      >
        <Plus className='size-4 mr-1' />
        <span className='text-white'>Neu</span>
      </Button>

      <Dialog open={modalOpen === 'EXPORT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gruppenliste exportieren</DialogTitle>
            {/* <ExportStudentList students={activeGroups} /> */}
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen === 'CREATE'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gruppe erstellen</DialogTitle>
            <CreateGroup onSuccess={closeModal} />
            {/* <CreateStudents onSuccess={closeModal} /> */}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
