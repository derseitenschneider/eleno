import type { MouseEvent } from 'react'
import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import { X } from 'lucide-react'
import UpdateRepertoireItem from './UpdateRepertoireItem.component'
import useCurrentHolder from '../lessons/useCurrentHolder'

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
  onSuccess,
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
        <DrawerOrDialogHeader>
          <DrawerOrDialogTitle>{title}</DrawerOrDialogTitle>
        </DrawerOrDialogHeader>
        <DrawerOrDialogDescription className='hidden'>
          {description}
        </DrawerOrDialogDescription>
        <DrawerOrDialogClose>
          <X className='size-5' />
          <span className='sr-only'>Close</span>
        </DrawerOrDialogClose>
        <UpdateRepertoireItem
          holder={holder}
          itemId={itemId}
          onCloseModal={onOpenChange}
        />
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}
