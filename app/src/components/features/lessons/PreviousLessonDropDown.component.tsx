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
import { MessageSquareShare, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import DeleteLesson from './DeleteLesson.component'
import EditLesson from './UpdateLesson.component'
import { useLatestLessons } from './lessonsQueries'
import ShareHomework from './homework/ShareHomework.component'

type PreviousLessonDropDownProps = {
  lessonId: number
}
type ModalOpen = 'EDIT' | 'SHARE' | 'DELETE' | undefined

export default function PreviousLessonDropDown({
  lessonId,
}: PreviousLessonDropDownProps) {
  const lessons = useLatestLessons().data
  const [modalOpen, setModalOpen] = useState<ModalOpen>()

  function closeModal() {
    setModalOpen(undefined)
  }

  const currentLesson = lessons?.find((lesson) => lesson.id === lessonId)

  if (!currentLesson?.id) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='size-4 text-primary'>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mr-3 md:mr-0'>
          <DropdownMenuItem onClick={() => setModalOpen('EDIT')}>
            <Pencil className='mr-2 h-4 w-4 text-primary' />
            <span>Lektion bearbeiten</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='hidden md:flex'
            onClick={() => setModalOpen('SHARE')}
          >
            <MessageSquareShare className='mr-2 size-4 text-primary' />
            <span>Hausaufgaben teilen</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setModalOpen('DELETE')}>
            <Trash2 className='mr-2 h-4 w-4 text-warning' />
            <span>Lektion löschen</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={modalOpen === 'EDIT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lektion bearbeiten</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Bearbeite die ausgewählte Lektion.
          </DialogDescription>
          <EditLesson onCloseModal={closeModal} lessonId={currentLesson?.id} />
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen === 'SHARE'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hausaufgaben teilen</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Teile die Hausaufgaben mit deinen Schüler:innen
          </DialogDescription>
          <ShareHomework lessonId={currentLesson?.id} />
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen === 'DELETE'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lektion löschen</DialogTitle>
          </DialogHeader>
          <DeleteLesson onCloseModal={closeModal} lessonId={currentLesson.id} />
        </DialogContent>
      </Dialog>
    </>
  )
}
