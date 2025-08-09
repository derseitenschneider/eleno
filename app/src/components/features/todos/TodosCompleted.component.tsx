import { useEffect, useState } from 'react'
import compareDateTodos from '../../../utils/sortTodos'
import useTodosQuery from '@/components/features/todos/todosQuery'
import TodoItem from './TodoItem.component'
import Empty from '@/components/ui/Empty.component'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { TodoMobileDrawer } from './TodoMobileDrawer.component'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import DeleteTodos from '@/components/features/todos/DeleteTodos.component'
import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import { X } from 'lucide-react'

export default function TodosCompleted() {
  const { data: todos, isPending } = useTodosQuery()
  const isMobile = useIsMobileDevice()
  const [openModal, setOpenModal] = useState<'DELETE_ALL'>()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const completedTodos = todos?.filter((todo) => todo.completed)

  const todosWithDue = completedTodos?.filter((todo) => todo.due).sort()

  const todosWithoutDue = completedTodos?.filter((todo) => !todo.due)

  const sortedFilteredTodos = [
    ...(todosWithDue ? todosWithDue : []),
    ...(todosWithoutDue ? todosWithoutDue : []),
  ].sort(compareDateTodos)

  if (isPending) return <p>...loading</p>

  function closeModal() {
    setOpenModal(undefined)
  }

  return (
    <div>
      {completedTodos && completedTodos?.length > 0 ? (
        <>
          <div className='flex sm:justify-end'>
            <Button
              className='w-full sm:w-auto'
              size='sm'
              variant='destructive'
              onClick={() => setOpenModal('DELETE_ALL')}
            >
              Alle löschen
            </Button>
          </div>
          <ul className='mt-4'>
            {isMobile
              ? sortedFilteredTodos.map((todo) => (
                  <TodoMobileDrawer
                    key={todo.id}
                    todo={todo}
                    type='completed'
                  />
                ))
              : sortedFilteredTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} type='completed' />
                ))}
          </ul>
          <DrawerOrDialog
            open={openModal === 'DELETE_ALL'}
            onOpenChange={closeModal}
          >
            <DrawerOrDialogContent>
              <DrawerOrDialogClose asChild>
                <Button
                  variant='ghost'
                  className='absolute right-4 top-4 text-foreground/70'
                >
                  <X className='size-5' />
                </Button>
              </DrawerOrDialogClose>
              <DrawerOrDialogHeader>
                <DrawerOrDialogTitle>Todos löschen</DrawerOrDialogTitle>
              </DrawerOrDialogHeader>
              <DeleteTodos
                todoIds={completedTodos.map((todo) => todo.id)}
                onCloseModal={closeModal}
              />
            </DrawerOrDialogContent>
          </DrawerOrDialog>
        </>
      ) : (
        <Empty
          className='mt-8'
          emptyMessage='Keine erledigten Todos vorhanden.'
        />
      )}
    </div>
  )
}
