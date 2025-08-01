import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import CreateStudents from './CreateStudents.component'
import { X } from 'lucide-react'

export type CreateStudentDialogDrawerProps = {
  open: boolean
  onOpenChange: () => void
  onSuccess?: () => void
  title?: string
  description?: string
}

export function CreateStudentDialogDrawer({
  open,
  onOpenChange,
  onSuccess,
  title = 'Schüler:in erfassen',
  description = 'Erfasse neue Schüler:innen',
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
        <CreateStudents onSuccess={() => onSuccess?.()} />
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}
