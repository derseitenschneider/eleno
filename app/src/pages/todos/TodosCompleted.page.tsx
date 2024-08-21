import { useEffect, useState } from 'react'
import compareDateTodos from '../../utils/sortTodos'
import useTodosQuery from '@/components/features/todos/todosQuery'
import TodoItem from '../../components/features/todos/TodoItem.component'
import Empty from '@/components/ui/Empty.component'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import DeleteTodos from '@/components/features/todos/DeleteTodos.component'

export default function TodosCompleted() {
  const { data: todos, isPending } = useTodosQuery()
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
          <div className='flex justify-end'>
            <Button
              size='sm'
              variant='destructive'
              onClick={() => setOpenModal('DELETE_ALL')}
            >
              Alle löschen
            </Button>
          </div>
          <ul className='mt-4'>
            {sortedFilteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} type='completed' />
            ))}
          </ul>
          <Dialog open={openModal === 'DELETE_ALL'} onOpenChange={closeModal}>
            <DialogContent>
              <DeleteTodos
                todoIds={completedTodos.map((todo) => todo.id)}
                onCloseModal={closeModal}
              />
            </DialogContent>
          </Dialog>
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
