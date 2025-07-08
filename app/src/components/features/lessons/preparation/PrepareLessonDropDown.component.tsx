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
import {
  BetweenHorizonalStart,
  MessageSquareShare,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { usePreparedLessonsQuery } from '../lessonsQueries'
import { usePrepLessons } from '@/services/context/LessonPrepContext'
import DeleteLesson from '../DeleteLesson.component'

type PreviousLessonDropDownProps = {
  lessonId: number
  onClose?: () => void
}
type ModalOpen = 'DELETE' | undefined

export default function PrepareLessonDropDown({
  lessonId,
  onClose,
}: PreviousLessonDropDownProps) {
  const { data: preparedLessons } = usePreparedLessonsQuery()
  const { setSelectedForUsing, setSelectedForUpdating } = usePrepLessons()
  const [modalOpen, setModalOpen] = useState<ModalOpen>()

  function closeModal() {
    setModalOpen(undefined)
  }

  const currentLesson = preparedLessons?.find(
    (lesson) => lesson.id === lessonId,
  )

  if (!currentLesson?.id) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='size-4 text-primary'>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='z-[200] mr-3 md:mr-0'>
          <DropdownMenuItem
            onSelect={() => {
              setSelectedForUsing(currentLesson)
              onClose?.()
            }}
          >
            <BetweenHorizonalStart className='mr-2 h-4 w-4 text-primary' />
            <span>Einfügen</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setSelectedForUpdating(currentLesson)}
          >
            <Pencil className='mr-2 h-4 w-4 text-primary' />
            <span>Bearbeiten</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setModalOpen('DELETE')}>
            <Trash2 className='mr-2 h-4 w-4 text-warning' />
            <span>Löschen</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
