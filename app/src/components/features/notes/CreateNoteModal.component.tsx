import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import useCurrentHolder from '../lessons/useCurrentHolder'
import { Blocker } from '../subscription/Blocker'
import CreateNote from './CreateNote.component'

export type CreateNoteModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function CreateNoteModal({
  open,
  onOpenChange,
  onClose,
}: CreateNoteModalProps) {
  const { currentLessonHolder } = useCurrentHolder()

  if (!currentLessonHolder) return null

  return (
    <DrawerOrDialog open={open} onOpenChange={onOpenChange}>
      <DrawerOrDialogContent>
        <DrawerOrDialogClose asChild>
          <Button
            variant='ghost'
            className='absolute right-4 top-4 text-foreground/70'
          >
            <X className='size-5' />
          </Button>
        </DrawerOrDialogClose>
        <DrawerOrDialogHeader>
          <DrawerOrDialogTitle>Neue Notiz erstellen</DrawerOrDialogTitle>
        </DrawerOrDialogHeader>
        <DrawerOrDialogDescription className='hidden'>
          Neue Notiz erstellen
        </DrawerOrDialogDescription>
        <Blocker blockerId='createNote' />
        <CreateNote
          holderType={currentLessonHolder.type}
          holderId={currentLessonHolder.holder.id}
          onCloseModal={onClose}
        />
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}