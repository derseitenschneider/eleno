import { CreateGroupDialogDrawer } from '@/components/features/groups/CreateGroupDialogDrawer.component'
import { CreateStudentDialogDrawer } from '@/components/features/students/CreateStudentDialogDrawer.component'
import { CreateTodoDialogDrawer } from '@/components/features/todos/CreateTodoDialogDrawer.component'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { CheckSquare2, User, Users, X } from 'lucide-react'
import { useState } from 'react'
import { ActionItem } from './ActionItem.component'

export type ActionDrawerProps = {
  open: boolean
  onOpenChange: () => void
}

export function ActionDrawer({ open, onOpenChange }: ActionDrawerProps) {
  const [modalOpen, setModalOpen] = useState<
    'CREATE_STUDENT' | 'CREATE_GROUP' | 'CREATE_TODO' | null
  >(null)

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerClose asChild>
            <Button
              variant='ghost'
              className='absolute right-4 top-4 text-foreground/70'
            >
              <X className='size-5' />
            </Button>
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle>Erstellen</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className='hidden'>Erstellen</DrawerDescription>
          <div className='space-y-6'>
            <ActionItem
              onClick={() => {
                setModalOpen('CREATE_STUDENT')
              }}
              icon={<User />}
              title='Schüler:in'
              description='Füge eine neue Schüler:in hinzu.'
            />

            <ActionItem
              onClick={() => {
                setModalOpen('CREATE_GROUP')
              }}
              icon={<Users />}
              title='Gruppe'
              description='Füge eine neue Gruppe hinzu.'
            />
          </div>
          <Separator className='my-4' />
          <div className='space-y-6'>
            <ActionItem
              onClick={() => {
                setModalOpen('CREATE_TODO')
              }}
              icon={<CheckSquare2 />}
              title='Todo'
              description='Erfasse eine neue Todo.'
            />
          </div>
        </DrawerContent>
      </Drawer>

      <CreateStudentDialogDrawer
        onSuccess={() => setModalOpen(null)}
        open={modalOpen === 'CREATE_STUDENT'}
        onOpenChange={() => setModalOpen(null)}
      />

      <CreateGroupDialogDrawer
        onSuccess={() => setModalOpen(null)}
        open={modalOpen === 'CREATE_GROUP'}
        onOpenChange={() => setModalOpen(null)}
      />

      <CreateTodoDialogDrawer
        onSuccess={() => setModalOpen(null)}
        open={modalOpen === 'CREATE_TODO'}
        onOpenChange={() => setModalOpen(null)}
      />
    </>
  )
}
