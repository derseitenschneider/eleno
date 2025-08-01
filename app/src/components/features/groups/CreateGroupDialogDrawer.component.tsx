import {
  DrawerOrDialog,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import CreateGroup from './CreateGroup.component'

export type CreateStudentDialogDrawerProps = {
  open: boolean
  onOpenChange: () => void
  onSuccess?: () => void
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
    <DrawerOrDialog open={open} onOpenChange={onOpenChange}>
      <DrawerOrDialogContent>
        <DrawerOrDialogHeader>
          <DrawerOrDialogTitle>{title}</DrawerOrDialogTitle>
        </DrawerOrDialogHeader>
        <DrawerOrDialogDescription className='hidden'>
          {description}
        </DrawerOrDialogDescription>
        <CreateGroup onSuccess={() => onSuccess?.()} />
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}
