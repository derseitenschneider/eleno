import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { User } from 'lucide-react'

export type ActionDrawerProps = {
  open: boolean
  onOpenChange: () => void
}

export function ActionDrawer({ open, onOpenChange }: ActionDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className='!w-screen p-4'>
        <DrawerHeader>
          <DrawerTitle>Erstellen</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className='hidden'>Erstellen</DrawerDescription>
        <button
          type='button'
          className='flex w-full items-center gap-2 bg-teal-500 p-2'
        >
          <div className='rounded-lg bg-primary p-2'>
            <User className='size-4' />
          </div>
          <div className='flex flex-col items-start'>
            <span className='text-lg'>Schüler:in</span>
            <span>Erstelle eine Schüler:in</span>
          </div>
        </button>
      </DrawerContent>
    </Drawer>
  )
}
