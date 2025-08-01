import { Button } from '@/components/ui/button'
import SearchBar from '@/components/ui/SearchBar.component'
import type { Group } from '@/types/types'
import { FileDown, Plus } from 'lucide-react'
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
import ExportGroupList from '../ExportGroupList.component'
import { useSearchParams } from 'react-router-dom'
import { CreateGroupDialogDrawer } from '../CreateGroupDialogDrawer.component'

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
    <div className='mb-4 flex flex-col items-end justify-between gap-4 sm:flex-row'>
      <div className='mr-auto hidden items-baseline gap-4 sm:flex'>
        <GroupsActionDropdown setSelected={setSelected} selected={selected} />
        {hasActiveGroups && (
          <p className='hidden text-sm lg:block'>
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
        <FileDown className='mr-1 h-4 w-4 text-primary' />
        Exportieren
      </Button>
      <SearchBar
        searchInput={globalFilter}
        setSearchInput={(input) => setGlobalFilter(input)}
        disabled={isDisabledControls}
      />
      <Button
        disabled={isFetching}
        className='w-full sm:w-auto'
        size='sm'
        onClick={() => setModalOpen('CREATE')}
      >
        <Plus className='mr-1 size-4' />
        <span className='text-white'>Neu</span>
      </Button>

      <Dialog open={modalOpen === 'EXPORT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gruppenliste exportieren</DialogTitle>
          </DialogHeader>
          <ExportGroupList activeGroups={activeGroups} />
        </DialogContent>
      </Dialog>

      <CreateGroupDialogDrawer
        open={modalOpen === 'CREATE'}
        onOpenChange={closeModal}
        onSuccess={closeModal}
      />
    </div>
  )
}
