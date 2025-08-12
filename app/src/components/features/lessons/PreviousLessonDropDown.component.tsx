import {
  DrawerOrDialog,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
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
import ShareHomework from './homework/ShareHomework.component'
import { useLatestLessons } from './lessonsQueries'

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
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className='size-4 text-primary'>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mr-3 md:mr-0'>
          <DropdownMenuItem onClick={() => setModalOpen('EDIT')}>
            <Pencil className='mr-2 h-4 w-4 text-primary' />
            <span>Lektion bearbeiten</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setModalOpen('SHARE')}>
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

      <DrawerOrDialog open={modalOpen === 'EDIT'} onOpenChange={closeModal}>
        <DrawerOrDialogContent>
          <DrawerOrDialogHeader>
            <DrawerOrDialogTitle>Lektion bearbeiten</DrawerOrDialogTitle>
          </DrawerOrDialogHeader>
          <DrawerOrDialogDescription className='hidden'>
            Bearbeite die ausgewählte Lektion.
          </DrawerOrDialogDescription>
          <EditLesson onCloseModal={closeModal} lessonId={currentLesson?.id} />
        </DrawerOrDialogContent>
      </DrawerOrDialog>

      <DrawerOrDialog open={modalOpen === 'SHARE'} onOpenChange={closeModal}>
        <DrawerOrDialogContent>
          <DrawerOrDialogHeader>
            <DrawerOrDialogTitle>Hausaufgaben teilen</DrawerOrDialogTitle>
          </DrawerOrDialogHeader>
          <DrawerOrDialogDescription className='hidden'>
            Teile die Hausaufgaben mit deinen Schüler:innen
          </DrawerOrDialogDescription>
          <ShareHomework lessonId={currentLesson?.id} />
        </DrawerOrDialogContent>
      </DrawerOrDialog>

      <DrawerOrDialog open={modalOpen === 'DELETE'} onOpenChange={closeModal}>
        <DrawerOrDialogContent>
          <DrawerOrDialogHeader>
            <DrawerOrDialogTitle>Lektion löschen</DrawerOrDialogTitle>
          </DrawerOrDialogHeader>
          <DeleteLesson onCloseModal={closeModal} lessonId={currentLesson.id} />
        </DrawerOrDialogContent>
      </DrawerOrDialog>
    </>
  )
}
