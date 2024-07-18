import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
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
import DeleteHolders from '../../DeleteHolders.component'
import { useReactivateStudents } from '../../useReactivateStudents'

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
  const [openModal, setOpenModal] = useState<'DELETE' | null>(null)
  const students = queryClient.getQueryData(['students']) as Array<Student>

  const isDisabledAction = Object.entries(selected).length === 0
  const selectedStudentIds = Object.keys(selected).map((id) => Number(id))

  function closeModal() {
    setOpenModal(null)
    setSelected({})
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
            onClick={() => reactivateStudents(selectedStudentIds)}
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
          <DialogTitle>Schüler:innen löschen</DialogTitle>
          <DeleteHolders
            studentIds={selectedStudentIds}
            onSuccess={closeModal}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
