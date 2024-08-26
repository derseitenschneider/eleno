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
import {
  Archive,
  CheckSquare2,
  FileDown,
  GraduationCap,
  MoreVertical,
  Pencil,
  TableProperties,
} from 'lucide-react'
import { type MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ExportLessons from '../../../lessons/ExportLessons.component'
import CreateTodo from '../../../todos/CreateTodo.component'
import UpdateStudents from '../../UpdateStudents.component'
import { useDeactivateStudents } from '../../useDeactivateStudents'
import { useLessonHolders } from '@/services/context/LessonHolderContext'

type StudentRowDropdownProps = {
  studentId: number
}

type Modals = 'EDIT' | 'TODO' | 'EXPORT' | 'ARCHIVE' | null

export default function ActiveStudentRowDropdown({
  studentId,
}: StudentRowDropdownProps) {
  const { activeSortedHolders: lessonHolders, setCurrentLessonPointer } =
    useLessonHolders()
  const [openModal, setOpenModal] = useState<Modals>(null)
  const { deactivateStudents } = useDeactivateStudents()
  const navigate = useNavigate()
  const sortedStudentIds = lessonHolders
    .filter((holder) => holder.type === 's')
    .map((holder) => holder.holder.id)

  function closeModal() {
    setOpenModal(null)
  }
  function handleDialogClick(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
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
              onClick={(e) => {
                e.stopPropagation()
                setOpenModal('EDIT')
              }}
              className='flex items-center gap-2'
            >
              <Pencil className='h-4 w-4 text-primary' />
              <span>Bearbeiten</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                setOpenModal('TODO')
              }}
              className='flex items-center gap-2'
            >
              <CheckSquare2 className='h-4 w-4 text-primary' />
              <span>Todo erfassen</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                setOpenModal('EXPORT')
              }}
              className='flex items-center gap-2'
            >
              <FileDown className='h-4 w-4 text-primary' />
              <span>Lektionsliste exportieren</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                const newStudentIndex = sortedStudentIds.indexOf(studentId)
                setCurrentLessonPointer(newStudentIndex)
                navigate(`/lessons/s-${studentId}`)
              }}
              className='flex items-center gap-2'
            >
              <GraduationCap className='h-4 w-4 text-primary' />
              <span>Zum Unterrichtsblatt</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                const newStudentIndex = sortedStudentIds.indexOf(studentId)
                setCurrentLessonPointer(newStudentIndex)
                navigate(`/lessons/s-${studentId}/repertoire`)
              }}
              className='flex items-center gap-2'
            >
              <TableProperties className='h-4 w-4 text-primary' />
              <span>Zum Repertoire</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                deactivateStudents([studentId])
              }}
              className='flex items-center gap-2'
            >
              <Archive className='h-4 w-4 text-primary' />
              <span>Archivieren</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={openModal === 'EDIT'} onOpenChange={closeModal}>
        <DialogContent onClick={handleDialogClick}>
          <DialogHeader>Schüler:in bearbeiten</DialogHeader>
          <UpdateStudents studentIds={[studentId]} onSuccess={closeModal} />
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'TODO'} onOpenChange={closeModal}>
        <DialogContent onClick={handleDialogClick} className='w-[800px]'>
          <DialogHeader>
            <DialogTitle>Neue Todo erstellen</DialogTitle>
          </DialogHeader>
          <CreateTodo
            onCloseModal={closeModal}
            holderId={studentId}
            holderType={'s'}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'EXPORT'} onOpenChange={closeModal}>
        <DialogContent onClick={handleDialogClick}>
          <DialogHeader>
            <DialogTitle>Lektionsliste exportieren</DialogTitle>
          </DialogHeader>
          <ExportLessons
            onSuccess={closeModal}
            holderId={studentId}
            holderType='s'
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
