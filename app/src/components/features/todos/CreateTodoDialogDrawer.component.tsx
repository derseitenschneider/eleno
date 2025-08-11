import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import CreateTodo from './CreateTodo.component'

export type CreateStudentDialogDrawerProps = {
  open: boolean
  onOpenChange: () => void
  onSuccess?: () => void
  title?: string
  description?: string
}

export function CreateTodoDialogDrawer({
  open,
  onOpenChange,
  onSuccess,
  title = 'Todo erfassen',
  description = 'Erfasse eine neue Todo',
}: CreateStudentDialogDrawerProps) {
  return (
    <DrawerOrDialog nested={true} open={open} onOpenChange={onOpenChange}>
      <DrawerOrDialogContent>
        <DrawerOrDialogClose asChild>
          <Button
            variant='ghost'
            className='absolute right-4 top-4 text-foreground/70'
          >
            <X className='size-5' />
          </Button>
        </DrawerOrDialogClose>
        <DrawerOrDialogHeader>
          <DrawerOrDialogTitle>{title}</DrawerOrDialogTitle>
        </DrawerOrDialogHeader>
        <DrawerOrDialogDescription className='hidden'>
          {description}
        </DrawerOrDialogDescription>
        <CreateTodo onCloseModal={() => onSuccess?.()} />
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}
