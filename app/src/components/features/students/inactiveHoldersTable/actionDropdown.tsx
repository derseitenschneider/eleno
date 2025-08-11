import { useReactivateGroups } from '@/components/features/groups/useReactivateGroups'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { useDeleteHolders } from '@/hooks/useDeleteHolders'
import type { Student } from '@/types/types'
import { useQueryClient } from '@tanstack/react-query'
import type { RowSelectionState } from '@tanstack/react-table'
import { ChevronsUpDown, Trash2, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import DeleteHolders from '../DeleteHolders.component'
import { useReactivateStudents } from '../useReactivateStudents'

type ActiveStudentsActionDropdownProps = {
  selected: RowSelectionState
  setSelected: React.Dispatch<React.SetStateAction<RowSelectionState>>
}

export function InactiveStudentsActionDropdown({
  selected,
  setSelected,
}: ActiveStudentsActionDropdownProps) {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
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
  const { dialogTitle: deleteDialogTitle, dialogBody: deleteDialogBody } =
    useDeleteHolders(selectedHolderIds)

  function closeModal() {
    setOpenModal(null)
    setSelected({})
  }
  async function handleReactivate(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
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
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            className='hidden sm:flex'
            size='sm'
            variant='outline'
            disabled={isDisabledAction}
          >
            <span className='mr-1 text-inherit'>Aktion</span>
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
            onClick={(e) => {
              e.stopPropagation()
              setOpenModal('DELETE')
            }}
            className='flex items-center gap-2'
          >
            <Trash2 className='h-4 w-4 text-warning' />
            <span>Löschen</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openModal === 'DELETE'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{deleteDialogTitle}</DialogTitle>
          </DialogHeader>
          <DialogDescription>{deleteDialogBody}</DialogDescription>
          <DeleteHolders holderIds={selectedHolderIds} onSuccess={closeModal} />
        </DialogContent>
      </Dialog>
    </>
  )
}
