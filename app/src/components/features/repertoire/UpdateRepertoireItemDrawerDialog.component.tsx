import { ChevronLeft, X } from 'lucide-react'
import type { MouseEvent } from 'react'
import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import useCurrentHolder from '../lessons/useCurrentHolder'
import UpdateRepertoireItem from './UpdateRepertoireItem.component'

export type UpdateRepertoireItemDrawerDialogProps = {
  open: boolean
  onOpenChange: () => void
  itemId: number
  onDialogClick?: (e: MouseEvent<HTMLDivElement>) => void
  onSuccess?: () => void
  title?: string
  description?: string
}
export function UpdateRepertoireItemDrawerDialog({
  open,
  onOpenChange,
  onDialogClick,
  title = 'Song bearbeiten',
  description = 'Bearbeite den Song',
  itemId,
}: UpdateRepertoireItemDrawerDialogProps) {
  const { currentLessonHolder } = useCurrentHolder()
  if (!currentLessonHolder) return

  let holder = ''
  if (currentLessonHolder.type === 's') {
    holder = `s-${currentLessonHolder.holder.id}`
  } else {
    holder = `g-${currentLessonHolder.holder.id}`
  }

  return (
    <DrawerOrDialog
      nested
      direction='right'
      open={open}
      onOpenChange={onOpenChange}
    >
      <DrawerOrDialogContent
        className='!w-screen max-w-[unset]'
        onClick={onDialogClick}
      >
        <DrawerOrDialogClose>
          <ChevronLeft className='size-5' />
          <span className='sr-only'>Close</span>
        </DrawerOrDialogClose>
        <DrawerOrDialogHeader>
          <DrawerOrDialogTitle>{title}</DrawerOrDialogTitle>
        </DrawerOrDialogHeader>
        <DrawerOrDialogDescription className='hidden'>
          {description}
        </DrawerOrDialogDescription>
        <UpdateRepertoireItem
          holder={holder}
          itemId={itemId}
          onCloseModal={onOpenChange}
        />
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}
