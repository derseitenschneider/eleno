import { ChevronLeft } from 'lucide-react'
import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import { CreatePlannedLessonForm } from './CreatePlannedLessonForm.component'

export type CreatePlannedLessonDrawerProps = {
  open: boolean
  onOpenChange: () => void
  onSuccess?: () => void
}

export function CreatePlannedLessonDrawer({
  open,
  onOpenChange,
  onSuccess,
}: CreatePlannedLessonDrawerProps) {
  const handleClose = () => {
    onSuccess?.()
    onOpenChange()
  }

  return (
    <DrawerOrDialog
      nested
      direction='right'
      open={open}
      onOpenChange={onOpenChange}
    >
      <DrawerOrDialogContent className='!w-screen max-w-[unset]'>
        <DrawerOrDialogClose>
          <ChevronLeft className='size-5' />
          <span className='sr-only'>Close</span>
        </DrawerOrDialogClose>
        <DrawerOrDialogHeader>
          <DrawerOrDialogTitle>Lektion planen</DrawerOrDialogTitle>
        </DrawerOrDialogHeader>
        <DrawerOrDialogDescription className='hidden'>
          Plane eine neue Lektion
        </DrawerOrDialogDescription>
        <div className='px-4'>
          <CreatePlannedLessonForm onClose={handleClose} />
        </div>
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}