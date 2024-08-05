import { CheckSquare2, FileDown, MoreVertical, Pencil } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'

import useCurrentHolder from './useCurrentHolder'
import UpdateStudents from '../students/UpdateStudents.component'
import UpdateGroup from '../groups/UpdateGroup.component'
import CreateTodo from '../todos/CreateTodo.component'
import ExportLessons from './ExportLessons.component'

type Modals = 'EDIT' | 'TODO' | 'EXPORT' | null

export default function HolderDropdownLesson() {
  const { currentLessonHolder } = useCurrentHolder()
  const [openModal, setOpenModal] = useState<Modals>(null)

  const closeModal = () => setOpenModal(null)
  if (!currentLessonHolder) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='text-primary h-4'>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className='flex items-center gap-2'
            onClick={() => {
              setOpenModal('EDIT')
            }}
          >
            <Pencil className='text-primary h-4 w-4' />
            <span>Bearbeiten</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='flex items-center gap-2'
            onClick={() => {
              setOpenModal('TODO')
            }}
          >
            <CheckSquare2 className='text-primary h-4 w-4' />
            <span>Todo erfassen</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className='flex items-center gap-2'
            onClick={() => setOpenModal('EXPORT')}
          >
            <FileDown className='text-primary h-4 w-4' />
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
        <DialogContent className='w-[800px]'>
          <DialogHeader>
            <DialogTitle>Neue Todo erstellen</DialogTitle>
          </DialogHeader>
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
