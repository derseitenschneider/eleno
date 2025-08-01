import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import CreateGroup from './CreateGroup.component'
import { X } from 'lucide-react'

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
  title = 'Gruppe erfassen',
  description = 'Erfasse eine neue Gruppe',
}: CreateStudentDialogDrawerProps) {
  return (
    <DrawerOrDialog direction='right' open={open} onOpenChange={onOpenChange}>
      <DrawerOrDialogContent className='!w-screen max-w-[unset]'>
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
        <CreateGroup onSuccess={() => onSuccess()} />
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}
