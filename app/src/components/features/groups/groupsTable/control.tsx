import { Button } from '@/components/ui/button'
import SearchBar from '@/components/ui/SearchBar.component'
import type { Group } from '@/types/types'
import { File, Plus } from 'lucide-react'
import type { RowSelectionState } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GroupsActionDropdown } from './actionDropdown'
import CreateGroup from '../CreateGroup.component'
import ExportGroupList from '../ExportGroupList.component'
import { useSearchParams } from 'react-router-dom'

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
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const groups = queryClient.getQueryData(['groups']) as Array<Group>
  const activeGroups = groups.filter((group) => !group.archive)

  const [modalOpen, setModalOpen] = useState<'EXPORT' | 'CREATE' | null>()

  const hasActiveGroups = activeGroups.length > 0
  const isDisabledControls = activeGroups.length === 0 || isFetching

  useEffect(() => {
    if (searchParams.get('modal') === 'add-group' && modalOpen !== 'CREATE') {
      setModalOpen('CREATE')
    }
  }, [searchParams, modalOpen])

  function closeModal() {
    setModalOpen(null)
    searchParams.delete('modal')
    setSearchParams(searchParams)
  }

  return (
    <div className='flex items-end justify-between gap-4 mb-4'>
      <div className='mr-auto items-baseline hidden sm:flex gap-4'>
        <GroupsActionDropdown setSelected={setSelected} selected={selected} />
        {hasActiveGroups && (
          <p className='hidden lg:block text-sm'>
            Gruppen: <span>{activeGroups.length}</span>
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
            <ExportGroupList groups={groups} />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen === 'CREATE'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gruppe erstellen</DialogTitle>
            <CreateGroup onSuccess={closeModal} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
