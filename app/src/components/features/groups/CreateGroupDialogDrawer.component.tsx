import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import { ChevronLeft, X } from 'lucide-react'
import CreateGroup from './CreateGroup.component'

export type CreateStudentDialogDrawerProps = {
  open: boolean
  onOpenChange: () => void
  onSuccess: () => void
  title?: string
  description?: string
}

export function CreateGroupDialogDrawer({
  open,
  onOpenChange,
  onSuccess,
  title = 'Gruppe hinzufügen',
  description = 'Füge eine neue Gruppe hinzu',
}: CreateStudentDialogDrawerProps) {
  return (
    <DrawerOrDialog direction='right' open={open} onOpenChange={onOpenChange}>
      <DrawerOrDialogContent className='!w-screen max-w-[unset] sm:!w-auto'>
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
        <CreateGroup onSuccess={() => onSuccess()} />
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}
