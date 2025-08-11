import { CheckSquare2, FileDown, MoreVertical, Pencil } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'

import UpdateGroup from '../groups/UpdateGroup.component'
import UpdateStudents from '../students/UpdateStudents.component'
import CreateTodo from '../todos/CreateTodo.component'
import ExportLessons from './ExportLessons.component'
import useCurrentHolder from './useCurrentHolder'

type Modals = 'EDIT' | 'TODO' | 'EXPORT' | null

export default function HolderDropdownLesson() {
  const { currentLessonHolder } = useCurrentHolder()
  const [openModal, setOpenModal] = useState<Modals>(null)

  function closeModal() {
    setOpenModal(null)
  }

  if (!currentLessonHolder) return null

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className='hidden h-4 text-primary md:block'>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className='flex items-center gap-2'
            onClick={(e) => {
              e.stopPropagation()
              setOpenModal('EDIT')
            }}
          >
            <Pencil className='h-4 w-4 text-primary' />
            <span>Bearbeiten</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='flex items-center gap-2'
            onClick={(e) => {
              e.stopPropagation()
              setOpenModal('TODO')
            }}
          >
            <CheckSquare2 className='h-4 w-4 text-primary' />
            <span>Todo erfassen</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='flex items-center gap-2'
            onClick={(e) => {
              e.stopPropagation()
              setOpenModal('EXPORT')
            }}
          >
            <FileDown className='h-4 w-4 text-primary' />
            <span>Lektionsliste exportieren</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openModal === 'EDIT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentLessonHolder?.type === 's'
                ? 'Schüler:in bearbeiten'
                : 'Gruppe bearbeiten'}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Bearbeite den:die Schüler:in oder die Gruppe
          </DialogDescription>
          {currentLessonHolder?.type === 's' ? (
            <UpdateStudents
              studentIds={[currentLessonHolder.holder.id]}
              onSuccess={closeModal}
            />
          ) : (
            <UpdateGroup
              groupId={currentLessonHolder?.holder.id || 0}
              onSuccess={closeModal}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'TODO'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Todo erstellen</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Erstelle eine Todo.
          </DialogDescription>
          <CreateTodo
            holderId={currentLessonHolder?.holder.id}
            holderType={currentLessonHolder?.type}
            onCloseModal={closeModal}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'EXPORT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lektionsliste exportieren</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Exportiere die Lektionsliste.
          </DialogDescription>
          <ExportLessons
            holderType={currentLessonHolder?.type}
            holderId={currentLessonHolder?.holder.id}
            onSuccess={closeModal}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
