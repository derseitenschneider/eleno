import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import { ChevronLeft, X } from 'lucide-react'
import type { MouseEvent } from 'react'
import UpdateGroup from './UpdateGroup.component'

export type UpdateGroupDialogDrawerProps = {
  open: boolean
  onOpenChange: () => void
  groupId: number
  onDialogClick?: (e: MouseEvent<HTMLDivElement>) => void
  onSuccess?: () => void
  title?: string
  description?: string
}
export function UpdateGroupDialogDrawer({
  open,
  onOpenChange,
  onDialogClick,
  onSuccess,
  title = 'Gruppe bearbeiten',
  description = 'Gruppe bearbeiten',
  groupId,
}: UpdateGroupDialogDrawerProps) {
  return (
    <DrawerOrDialog direction='right' open={open} onOpenChange={onOpenChange}>
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
        <UpdateGroup groupId={groupId} onSuccess={onSuccess} />
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}
