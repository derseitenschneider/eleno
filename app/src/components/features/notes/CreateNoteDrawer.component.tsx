import { ChevronLeft } from 'lucide-react'
import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import useCurrentHolder from '../lessons/useCurrentHolder'
import CreateNote from './CreateNote.component'

export type CreateNoteDrawerProps = {
  open: boolean
  onOpenChange: () => void
  onSuccess?: () => void
}

export function CreateNoteDrawer({
  open,
  onOpenChange,
  onSuccess,
}: CreateNoteDrawerProps) {
  const { currentLessonHolder } = useCurrentHolder()
  
  if (!currentLessonHolder) return null

  const handleClose = () => {
    onSuccess?.()
    onOpenChange()
  }

  return (
    <DrawerOrDialog
      nested
      direction='right'
      open={open}
      onOpenChange={onOpenChange}
    >
      <DrawerOrDialogContent className='!w-screen max-w-[unset]'>
        <DrawerOrDialogClose>
          <ChevronLeft className='size-5' />
          <span className='sr-only'>Close</span>
        </DrawerOrDialogClose>
        <DrawerOrDialogHeader>
          <DrawerOrDialogTitle>Notiz erfassen</DrawerOrDialogTitle>
        </DrawerOrDialogHeader>
        <DrawerOrDialogDescription className='hidden'>
          Erfasse eine neue Notiz
        </DrawerOrDialogDescription>
        <div className='px-4'>
          <CreateNote
            holderType={currentLessonHolder.type}
            holderId={currentLessonHolder.holder.id}
            onCloseModal={handleClose}
          />
        </div>
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}