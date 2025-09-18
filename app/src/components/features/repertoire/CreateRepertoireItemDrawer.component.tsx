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
          <DrawerTitle>Song erfassen (Repertoire)</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className='hidden'>
          Füge einen neuen Song zum Repertoire hinzu
        </DrawerDescription>
        <div className="overflow-y-auto px-4 pb-4">
          <CreateRepertoireItem onCloseModal={handleSuccess} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}