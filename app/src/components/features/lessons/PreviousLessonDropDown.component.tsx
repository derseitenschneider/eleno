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
  MessageSquareShare,
  MoreVertical,
  Pencil,
  Share,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import DeleteLesson from './DeleteLesson.component'
import EditLesson from './UpdateLesson.component'
import { useLatestLessons } from './lessonsQueries'
import ShareHomework from './ShareHomework.component'

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
        <DropdownMenuTrigger className='h-4 w-4 text-primary'>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setModalOpen('EDIT')}>
            <Pencil className='h-4 w-4 text-primary mr-2' />
            <span>Lektion bearbeiten</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setModalOpen('SHARE')}>
            <MessageSquareShare className='size-4 text-primary mr-2' />
            <span>Hausaufgaben teilen</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setModalOpen('DELETE')}>
            <Trash2 className='h-4 w-4 text-warning mr-2' />
            <span>Lektion löschen</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={modalOpen === 'EDIT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lektion bearbeiten</DialogTitle>
          </DialogHeader>
          <EditLesson onCloseModal={closeModal} lessonId={currentLesson?.id} />
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen === 'SHARE'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hausaufgaben teilen</DialogTitle>
          </DialogHeader>
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
