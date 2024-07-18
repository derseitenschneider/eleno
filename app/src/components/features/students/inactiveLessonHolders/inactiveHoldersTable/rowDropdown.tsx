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
import { useStudents } from '@/services/context/StudentContext'
import {
  FileDown,
  MoreVertical,
  TableProperties,
  Trash2,
  Undo2,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ExportLessons from '../../../lessons/ExportLessons.component'
import DeleteStudents from '../../deleteStudents/DeleteStudents.component'
import { useDeactivateStudents } from '../../useDeactivateStudents'
import { useReactivateStudents } from '../../useReactivateStudents'
import { useReactivateGroups } from '@/components/features/groups/useReactivateGroups'

type StudentRowDropdownProps = {
  holderId: string
}

type Modals = 'EXPORT' | 'DELETE' | null

export default function InactiveStudentRowDropdown({
  holderId,
}: StudentRowDropdownProps) {
  const { activeSortedStudentIds, setCurrentStudentIndex } = useStudents()
  const { reactivateStudents } = useReactivateStudents()
  const { reactivateGroups } = useReactivateGroups()
  const [openModal, setOpenModal] = useState<Modals>(null)
  const navigate = useNavigate()
  const isGroup = holderId.includes('g')
  const id = Number.parseInt(holderId.split('-').at(1) || '')

  function closeModal() {
    setOpenModal(null)
  }

  function reactivateHolder() {
    if (!isGroup) reactivateStudents([id])
    if (isGroup) reactivateGroups([id])
  }
  return (
    <>
      <div className='text-right'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Menü öffnen</span>
              <MoreVertical className='h-4 w-4 text-primary' />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={reactivateHolder}
              className='flex items-center gap-2'
            >
              <Undo2 className='size-4 text-primary' />
              <span>Wiederherstellen</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setOpenModal('EXPORT')}
              className='flex items-center gap-2'
            >
              <FileDown className='size-4 text-primary' />
              <span>Lektionsliste exportieren</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setOpenModal('DELETE')}
              className='flex items-center gap-2'
            >
              <Trash2 className='size-4 text-warning' />
              <span>Löschen</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={openModal === 'EXPORT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lektionsliste exportieren</DialogTitle>
          </DialogHeader>
          {/* <ExportLessons holderId={holderId} /> */}
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'DELETE'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schüler:in löschen</DialogTitle>
          </DialogHeader>
          {/* <DeleteStudents onSuccess={closeModal} studentIds={[studentId]} /> */}
        </DialogContent>
      </Dialog>
    </>
  )
}
