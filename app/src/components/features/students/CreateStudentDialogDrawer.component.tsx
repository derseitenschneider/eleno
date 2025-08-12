import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
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
  title = 'Schüler:in hinzufügen',
  description = 'Füge neue Schüler:innen hinzu',
}: CreateStudentDialogDrawerProps) {
  return (
    <DrawerOrDialog direction='right' open={open} onOpenChange={onOpenChange}>
      <DrawerOrDialogContent className='!w-screen max-w-[unset] sm:!w-auto'>
        <DrawerOrDialogClose asChild>
          <Button variant='ghost' size='icon'>
            <ChevronLeft className='size-5' />
            <span className='sr-only'>Close</span>
          </Button>
        </DrawerOrDialogClose>
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
