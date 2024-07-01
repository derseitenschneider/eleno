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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useStudents } from '@/services/context/StudentContext'
import {
  Archive,
  CheckSquare2,
  FileDown,
  GraduationCap,
  MoreVertical,
  Pencil,
  TableProperties,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ExportLessons from '../../../lessons/ExportLessons.component'
import AddTodo from '../../../todos/AddTodo.component'
import StudentForm from '../../StudentForm.component'
import UpdateStudents from '../../UpdateStudents.component'
import { useDeactivateStudents } from '../../useDeactivateStudents'

type StudentRowDropdownProps = {
  studentId: number
}

type Modals = 'EDIT' | 'TODO' | 'EXPORT' | 'ARCHIVE' | null

export default function ActiveStudentRowDropdown({
  studentId,
}: StudentRowDropdownProps) {
  const { activeSortedStudentIds, setCurrentStudentIndex } = useStudents()
  const [openModal, setOpenModal] = useState<Modals>(null)
  const { deactivateStudents, isDeactivating, isError } =
    useDeactivateStudents()
  const navigate = useNavigate()

  function closeModal() {
    setOpenModal(null)
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
              onClick={() => setOpenModal('EDIT')}
              className='flex items-center gap-2'
            >
              <Pencil className='h-4 w-4 text-primary' />
              <span>Bearbeiten</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setOpenModal('TODO')}
              className='flex items-center gap-2'
            >
              <CheckSquare2 className='h-4 w-4 text-primary' />
              <span>Todo erfassen</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setOpenModal('EXPORT')}
              className='flex items-center gap-2'
            >
              <FileDown className='h-4 w-4 text-primary' />
              <span>Lektionsliste exportieren</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                const newStudentIndex =
                  activeSortedStudentIds.indexOf(studentId)
                setCurrentStudentIndex(newStudentIndex)
                navigate(`/lessons/${studentId}`)
              }}
              className='flex items-center gap-2'
            >
              <GraduationCap className='h-4 w-4 text-primary' />
              <span>Zum Unterrichtsblatt</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                const newStudentIndex =
                  activeSortedStudentIds.indexOf(studentId)
                setCurrentStudentIndex(newStudentIndex)
                navigate(`/lessons/${studentId}/repertoire`)
              }}
              className='flex items-center gap-2'
            >
              <TableProperties className='h-4 w-4 text-primary' />
              <span>Zum Repertoire</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => deactivateStudents([studentId])}
              className='flex items-center gap-2'
            >
              <Archive className='h-4 w-4 text-primary' />
              <span>Archivieren</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={openModal === 'EDIT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>Schüler:in bearbeiten</DialogHeader>
          <UpdateStudents studentIds={[studentId]} onSuccess={closeModal} />
        </DialogContent>
      </Dialog>
      {/* <Sheet open={openModal === "EDIT"} onOpenChange={closeModal}> */}
      {/*   <SheetContent> */}
      {/*     <SheetHeader> */}
      {/*       <SheetTitle>Schüler:in bearbeiten</SheetTitle> */}
      {/*     </SheetHeader> */}
      {/*     <StudentForm */}
      {/*       onSuccess={() => { */}
      {/*         closeModal() */}
      {/*       }} */}
      {/*       studentId={studentId} */}
      {/*     /> */}
      {/*   </SheetContent> */}
      {/* </Sheet> */}

      <Dialog open={openModal === 'TODO'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Todo erstellen</DialogTitle>
          </DialogHeader>
          <AddTodo onCloseModal={closeModal} studentId={studentId} />
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'EXPORT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lektionsliste exportieren</DialogTitle>
          </DialogHeader>
          <ExportLessons studentId={studentId} />
        </DialogContent>
      </Dialog>
    </>
  )
}
