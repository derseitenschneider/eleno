import type { MouseEvent } from 'react'
import {
  DrawerOrDialog,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
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
    <DrawerOrDialog open={open} onOpenChange={onOpenChange}>
      <DrawerOrDialogContent onClick={onDialogClick}>
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
