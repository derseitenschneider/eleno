import {
  DrawerOrDialog,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import CreateStudents from './CreateStudents.component'

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
    <DrawerOrDialog open={open} onOpenChange={onOpenChange}>
      <DrawerOrDialogContent>
        <DrawerOrDialogHeader>
          <DrawerOrDialogTitle>{title}</DrawerOrDialogTitle>
        </DrawerOrDialogHeader>
        <DrawerOrDialogDescription className='hidden'>
          {description}
        </DrawerOrDialogDescription>
        <CreateStudents onSuccess={() => onSuccess?.()} />
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}
