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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Student } from '@/types/types'
import { useQueryClient } from '@tanstack/react-query'
import type { RowSelectionState } from '@tanstack/react-table'
import {
  Archive,
  ChevronsUpDown,
  FileDown,
  History,
  Pencil,
} from 'lucide-react'
import { useState } from 'react'
import ResetStudents from '../../ResetStudents.component'
import UpdateStudents from '../../UpdateStudents.component'
import { useDeactivateStudents } from '../../useDeactivateStudents'
import BulkExportLessons from '@/components/features/lessons/BulkExportLessons.component'

type ActiveStudentsActionDropdownProps = {
  selected: RowSelectionState
  setSelected: React.Dispatch<React.SetStateAction<RowSelectionState>>
}

export function ActiveStudentsActionDropdown({
  selected,
  setSelected,
}: ActiveStudentsActionDropdownProps) {
  const queryClient = useQueryClient()
  const [openModal, setOpenModal] = useState<
    'EDIT' | 'EXPORT' | 'RESET' | null
  >(null)

  const students = queryClient.getQueryData(['students']) as Array<Student>
  const { deactivateStudents } = useDeactivateStudents()

  const isDisabledAction = Object.entries(selected).length === 0
  const selectedStudentIds = Object.keys(selected).map((id) => Number(id))

  function closeModal() {
    setSelected({})
    setOpenModal(null)
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
            onClick={() => setOpenModal('EDIT')}
            className='flex items-center gap-2'
          >
            <Pencil className='h-4 w-4 text-primary' />
            <span>Bearbeiten</span>
          </DropdownMenuItem>

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
            onClick={() => deactivateStudents(selectedStudentIds)}
            className='flex items-center gap-2'
          >
            <Archive className='h-4 w-4 text-primary' />
            <span>Archivieren</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openModal === 'EDIT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schüler:innen bearbeiten</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Schüler:innen bearbeiten
          </DialogDescription>
          <UpdateStudents
            studentIds={selectedStudentIds}
            onSuccess={closeModal}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'EXPORT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lektionslisten exportieren</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Schüler:innen bearbeiten
          </DialogDescription>
          <BulkExportLessons
            onSuccess={closeModal}
            holderIds={selectedStudentIds}
            holderType='s'
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'RESET'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unterrichtsdaten zurücksetzen</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Schüler:innen bearbeiten
          </DialogDescription>
          <ResetStudents
            selectedStudentIds={selectedStudentIds}
            onSuccess={closeModal}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
