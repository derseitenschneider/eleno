import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Student } from '@/types/types'
import { useQueryClient } from '@tanstack/react-query'
import type { RowSelectionState } from '@tanstack/react-table'
import { ChevronsUpDown, Trash2, Undo2 } from 'lucide-react'
import { useState } from 'react'
import DeleteHolders from '../DeleteHolders.component'
import { useReactivateStudents } from '../useReactivateStudents'
import { useReactivateGroups } from '@/components/features/groups/useReactivateGroups'
import fetchErrorToast from '@/hooks/fetchErrorToast'
import { toast } from 'sonner'

type ActiveStudentsActionDropdownProps = {
  selected: RowSelectionState
  setSelected: React.Dispatch<React.SetStateAction<RowSelectionState>>
}

export function InactiveStudentsActionDropdown({
  selected,
  setSelected,
}: ActiveStudentsActionDropdownProps) {
  const queryClient = useQueryClient()
  const { reactivateStudents } = useReactivateStudents()
  const { reactivateGroups } = useReactivateGroups()
  const [openModal, setOpenModal] = useState<'DELETE' | null>(null)
  const students = queryClient.getQueryData(['students']) as Array<Student>

  const selectedHolderIds = Object.keys(selected)
  const selectedStudentIds = selectedHolderIds
    .filter((holderId) => holderId.includes('s'))
    .map((id) => Number(id.split('-').at(1)))

  const selectedGroupIds = selectedHolderIds
    .filter((holderId) => holderId.includes('g'))
    .map((id) => Number(id.split('-').at(1)))

  const isDisabledAction = Object.entries(selected).length === 0

  function closeModal() {
    setOpenModal(null)
    setSelected({})
  }
  async function handleReactivate() {
    try {
      await Promise.all([
        reactivateStudents(selectedStudentIds),
        reactivateGroups(selectedGroupIds),
      ])
      toast.success('Wiederhergestellt.')
    } catch (e) {
      fetchErrorToast()
    }
  }

  if (!students) return null

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
            onClick={handleReactivate}
            className='flex items-center gap-2'
          >
            <Undo2 className='h-4 w-4 text-primary' />
            <span>Wiederherstellen</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOpenModal('DELETE')}
            className='flex items-center gap-2'
          >
            <Trash2 className='h-4 w-4 text-warning' />
            <span>Löschen</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openModal === 'DELETE'} onOpenChange={closeModal}>
        <DialogContent>
          <DeleteHolders holderIds={selectedHolderIds} onSuccess={closeModal} />
        </DialogContent>
      </Dialog>
    </>
  )
}
