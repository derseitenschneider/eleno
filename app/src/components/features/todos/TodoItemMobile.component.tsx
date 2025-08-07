import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import TodoItem, { type TodoItemProps } from './TodoItem.component'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { useState } from 'react'

export function TodoItemMobile(props: TodoItemProps) {
  const [modalOpen, setModalOpen] = useState<'EDIT' | 'DELETE' | null>(null)

  return (
    <>
      <Drawer>
        <DrawerTrigger className='w-full text-left'>
          <TodoItem {...props} />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Todo</DrawerTitle>
            <DrawerDescription className='text-base'>
              <p>{props.todo.text}</p>
            </DrawerDescription>
          </DrawerHeader>
          {props.type === 'open' && (
            <Button
              size='sm'
              onClick={() => setModalOpen('EDIT')}
              className='flex gap-2'
            >
              <Pencil className='size-4' />
              Bearbeiten
            </Button>
          )}
          {props.type === 'completed' && <Button size='sm'>Bearbeiten</Button>}
        </DrawerContent>
      </Drawer>

      <Drawer
        open={modalOpen === 'EDIT'}
        onOpenChange={() => setModalOpen(null)}
      >
        <DrawerContent>
          <DrawerTitle>Todo bearbeiten</DrawerTitle>
        </DrawerContent>
      </Drawer>
    </>
  )
}
