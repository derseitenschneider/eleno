import { ChevronLeft } from 'lucide-react'
import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import CreateRepertoireItem from './CreateRepertoireItem.component'

export type CreateRepertoireItemDrawerProps = {
  open: boolean
  onOpenChange: () => void
  onSuccess?: () => void
}

export function CreateRepertoireItemDrawer({
  open,
  onOpenChange,
  onSuccess,
}: CreateRepertoireItemDrawerProps) {
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
          <DrawerOrDialogTitle>Song erfassen (Repertoire)</DrawerOrDialogTitle>
        </DrawerOrDialogHeader>
        <DrawerOrDialogDescription className='hidden'>
          Füge einen neuen Song zum Repertoire hinzu
        </DrawerOrDialogDescription>
        <div className='px-4'>
          <CreateRepertoireItem onCloseModal={handleClose} />
        </div>
      </DrawerOrDialogContent>
    </DrawerOrDialog>
  )
}