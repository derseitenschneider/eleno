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
import { appConfig } from '@/config'
import useNavigateToHolder from '@/hooks/useNavigateToHolder'
import {
  Archive,
  CheckSquare2,
  FileDown,
  GraduationCap,
  MoreVertical,
  Pencil,
  TableProperties,
  Users,
} from 'lucide-react'
import { type MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ExportLessons from '../../../lessons/ExportLessons.component'
import CreateTodo from '../../../todos/CreateTodo.component'
import ConvertStudentToGroup from '../../ConvertStudentToGroup.component'
import { UpdateStudentsDialogDrawer } from '../../UpdateStudentDialogDrawer.component'
import { useDeactivateStudents } from '../../useDeactivateStudents'

type StudentRowDropdownProps = {
  studentId: number
}

type Modals = 'EDIT' | 'TODO' | 'EXPORT' | 'TRANSFORM' | 'ARCHIVE' | null

export default function ActiveStudentRowDropdown({
  studentId,
}: StudentRowDropdownProps) {
  const navigate = useNavigate()
  const { navigateToHolder } = useNavigateToHolder()
  const [openModal, setOpenModal] = useState<Modals>(null)
  const { deactivateStudents } = useDeactivateStudents()

  function closeModal() {
    setOpenModal(null)
  }
  function handleDialogClick(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
  }

  function handleLessonNavigation(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    navigateToHolder(`s-${studentId}`)
  }
  function handleRepertoireNavigation(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    navigateToHolder(`s-${studentId}`, 'repertoire')
  }

  return (
    <>
      <div className='text-right'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-8 w-8 p-0'
              onClick={(e) => e.stopPropagation()}
            >
              <span className='sr-only'>Menü öffnen</span>
              <MoreVertical className='h-4 w-4 text-primary' />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='mr-3'>
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
              onClick={handleLessonNavigation}
              className='flex items-center gap-2'
            >
              <GraduationCap className='h-4 w-4 text-primary' />
              <span>Zum Unterrichtsblatt</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleRepertoireNavigation}
              className='flex items-center gap-2'
            >
              <TableProperties className='h-4 w-4 text-primary' />
              <span>Zum Repertoire</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {!appConfig.isDemoMode && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenModal('TRANSFORM')
                }}
                className='flex items-center gap-2'
              >
                <Users className='h-4 w-4 text-primary' />
                <span>In Gruppe umwandeln</span>
              </DropdownMenuItem>
            )}

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
      <UpdateStudentsDialogDrawer
        open={openModal === 'EDIT'}
        onOpenChange={closeModal}
        onDialogClick={handleDialogClick}
        onSuccess={closeModal}
        studentIds={[studentId]}
      />

      <Dialog open={openModal === 'TODO'} onOpenChange={closeModal}>
        <DialogContent onClick={handleDialogClick}>
          <DialogHeader>
            <DialogTitle>Neue Todo erfassen</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Todo erstellen
          </DialogDescription>
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
          <DialogDescription className='hidden'>
            Lektionsliste exportieren
          </DialogDescription>
          <ExportLessons
            onSuccess={closeModal}
            holderId={studentId}
            holderType='s'
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openModal === 'TRANSFORM'} onOpenChange={closeModal}>
        <DialogContent onClick={handleDialogClick}>
          <ConvertStudentToGroup
            onSuccess={() => {
              closeModal()
              navigate('groups')
            }}
            studentId={studentId}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
