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
          <DrawerTitle>Lektion planen</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className='hidden'>
          Plane eine neue Lektion
        </DrawerDescription>
        <div className="overflow-y-auto px-4 pb-4">
          <CreatePlannedLessonForm onClose={handleSuccess} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}