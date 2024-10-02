import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Group } from '@/types/types'
import { useQueryClient } from '@tanstack/react-query'
import type { RowSelectionState } from '@tanstack/react-table'
import { Archive, ChevronsUpDown, FileDown, History } from 'lucide-react'
import { useState } from 'react'
import BulkExportLessons from '../../lessons/BulkExportLessons.component'
import { useDeactivateGroups } from '../useDeactivateGroups'
import ResetGroups from '../ResetGroups.component'

type ActiveStudentsActionDropdownProps = {
  selected: RowSelectionState
  setSelected: React.Dispatch<React.SetStateAction<RowSelectionState>>
}

export function GroupsActionDropdown({
  selected,
  setSelected,
}: ActiveStudentsActionDropdownProps) {
  const queryClient = useQueryClient()
  const [openModal, setOpenModal] = useState<
    'EDIT' | 'EXPORT' | 'RESET' | null
  >(null)

  const groups = queryClient.getQueryData(['groups']) as Array<Group>
  const { deactivateGroups } = useDeactivateGroups()

  const isDisabledAction = Object.entries(selected).length === 0
  const selectedGroupIds = Object.keys(selected).map((id) => Number(id))

  function closeModal() {
    setSelected({})
    setOpenModal(null)
  }
  if (!groups) return null
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='sm' variant='outline' disabled={isDisabledAction}>
            <span className='text-inherit mr-1'>Aktion</span>
            <ChevronsUpDown className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setOpenModal('EXPORT')}
            className='flex items-center gap-2'
          >
            <FileDown className='h-4 w-4 text-primary' />
            <span>Lektionslisten exportieren</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpenModal('RESET')}
            className='flex items-center gap-2'
          >
            <History className='h-4 w-4 text-primary' />
            <span>Zurücksetzten</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              deactivateGroups(selectedGroupIds)
            }}
            className='flex items-center gap-2'
          >
            <Archive className='h-4 w-4 text-primary' />
            <span>Archivieren</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openModal === 'EXPORT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lektionslisten exportieren</DialogTitle>
          </DialogHeader>
          <BulkExportLessons
            holderIds={selectedGroupIds}
            holderType='g'
            onSuccess={closeModal}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'RESET'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogTitle>Unterrichtsdaten zurücksetzen</DialogTitle>
          <ResetGroups
            selectedGroupIds={selectedGroupIds}
            onSuccess={closeModal}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
