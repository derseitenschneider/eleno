import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import CreateNote from './CreateNote.component'

export type CreateNoteDrawerProps = {
  open: boolean
  onOpenChange: () => void
  onSuccess?: () => void
  holderId: number
  holderType: 's' | 'g'
}

export function CreateNoteDrawer({
  open,
  onOpenChange,
  onSuccess,
  holderId,
  holderType,
}: CreateNoteDrawerProps) {
  const handleSuccess = () => {
    onSuccess?.()
    onOpenChange()
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85dvh]">
        <DrawerClose asChild>
          <Button
            variant='ghost'
            className='absolute right-4 top-4 text-foreground/70'
          >
            <X className='size-5' />
          </Button>
        </DrawerClose>
        <DrawerHeader>
          <DrawerTitle>Notiz erfassen</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className='hidden'>
          Erfasse eine neue Notiz
        </DrawerDescription>
        <div className="overflow-y-auto px-4 pb-4">
          <CreateNote 
            onCloseModal={handleSuccess} 
            holderId={holderId}
            holderType={holderType}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}