import type { MouseEvent } from 'react'
import {
  DrawerOrDialog,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import UpdateStudents from './UpdateStudents.component'

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
    <DrawerOrDialog open={open} onOpenChange={onOpenChange}>
      <DrawerOrDialogContent onClick={onDialogClick}>
        <DrawerOrDialogHeader>
          <DrawerOrDialogTitle>{title}</DrawerOrDialogTitle>
        </DrawerOrDialogHeader>
        <DrawerOrDialogDescription className='hidden'>
          {description}
        </DrawerOrDialogDescription>
        <UpdateStudents studentIds={studentIds} onSuccess={onSuccess} />
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}
