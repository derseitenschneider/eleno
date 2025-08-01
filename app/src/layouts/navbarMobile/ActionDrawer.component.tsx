import { CreateStudentDialogDrawer } from '@/components/features/students/CreateStudentDialogDrawer.component'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { CheckSquare2, User, Users } from 'lucide-react'
import { useState } from 'react'
import { ActionItem } from './ActionItem.component'
import { CreateGroupDialogDrawer } from '@/components/features/groups/CreateGroupDialogDrawer.component'
import { Separator } from '@/components/ui/separator'
import { CreateTodoDialogDrawer } from '@/components/features/todos/CreateTodoDialogDrawer.component'

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
        <DrawerContent className=''>
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
              description='Erfasse eine:n Schüler:in'
            />

            <ActionItem
              onClick={() => {
                setModalOpen('CREATE_GROUP')
              }}
              icon={<Users />}
              title='Gruppe'
              description='Erfasse eine Gruppe'
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
              description='Erfasse eine Gruppe'
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
