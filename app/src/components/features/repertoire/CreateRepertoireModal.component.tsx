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
import CreateRepertoireItem from './CreateRepertoireItem.component'

export type CreateRepertoireModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function CreateRepertoireModal({
  open,
  onOpenChange,
  onClose,
}: CreateRepertoireModalProps) {
  const { currentLessonHolder } = useCurrentHolder()

  let holderName = ''
  if (currentLessonHolder?.type === 's') {
    holderName = `${currentLessonHolder.holder.firstName} ${currentLessonHolder.holder.lastName}`
  } else if (currentLessonHolder?.type === 'g') {
    holderName = currentLessonHolder.holder.name
  }

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
          <DrawerOrDialogTitle>Song erfassen</DrawerOrDialogTitle>
        </DrawerOrDialogHeader>
        <DrawerOrDialogDescription>
          Erfasse einen Song für {holderName}
        </DrawerOrDialogDescription>
        <CreateRepertoireItem onCloseModal={onClose} />
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}