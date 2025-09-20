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
import useCurrentHolder from '../useCurrentHolder'
import { CreatePlannedLessonForm } from './CreatePlannedLessonForm.component'

export type CreatePlannedLessonModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

export function CreatePlannedLessonModal({
  open,
  onOpenChange,
  onClose,
}: CreatePlannedLessonModalProps) {
  const { currentLessonHolder } = useCurrentHolder()

  let holderName = ''
  if (currentLessonHolder?.type === 's') {
    holderName = `${currentLessonHolder.holder.firstName} ${currentLessonHolder.holder.lastName}`
  } else if (currentLessonHolder?.type === 'g') {
    holderName = currentLessonHolder.holder.name
  }

  return (
    <DrawerOrDialog open={open} onOpenChange={onOpenChange}>
      <DrawerOrDialogContent className='lg:overflow-hidden'>
        <DrawerOrDialogClose asChild>
          <Button
            variant='ghost'
            className='absolute right-4 top-4 text-foreground/70'
          >
            <X className='size-5' />
          </Button>
        </DrawerOrDialogClose>
        <DrawerOrDialogHeader>
          <DrawerOrDialogTitle>Lektionsplanung {holderName}</DrawerOrDialogTitle>
        </DrawerOrDialogHeader>
        <DrawerOrDialogDescription className='hidden'>
          Plane eine neue Lektion für {holderName}
        </DrawerOrDialogDescription>
        <div className='lg:w-[80vw]'>
          <CreatePlannedLessonForm onClose={onClose} />
        </div>
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}