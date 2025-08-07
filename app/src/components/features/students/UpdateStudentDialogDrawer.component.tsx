import type { MouseEvent } from 'react'
import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import UpdateStudents from './UpdateStudents.component'
import { X } from 'lucide-react'

export type UpdateStudentsDialogDrawerProps = {
  open: boolean
  onOpenChange: () => void
  studentIds: Array<number>
  onDialogClick?: (e: MouseEvent<HTMLDivElement>) => void
  onSuccess?: () => void
  title?: string
  description?: string
}
export function UpdateStudentsDialogDrawer({
  open,
  onOpenChange,
  onDialogClick,
  onSuccess,
  title = 'Schüler:in bearbeiten',
  description = 'Schüler:in bearbeiten',
  studentIds,
}: UpdateStudentsDialogDrawerProps) {
  return (
    <DrawerOrDialog
      nested
      direction='right'
      open={open}
      onOpenChange={onOpenChange}
    >
      <DrawerOrDialogContent
        className='!w-screen max-w-[unset] sm:!w-auto'
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
        <UpdateStudents studentIds={studentIds} onSuccess={onSuccess} />
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}
