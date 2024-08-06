import { useEffect, useState } from 'react'
import CreateTodo from '../../components/features/todos/CreateTodo.component'
import TodoDescription from '../../components/features/todos/TodoDescription.component'
import compareDateTodos from '../../utils/sortTodos'
import Modal from '../../components/ui/modal/Modal.component'
import Menus from '../../components/ui/menu/Menus.component'
import useTodosQuery from '@/components/features/todos/todosQuery'
import TodoItem from '../../components/features/todos/TodoItem.component'
import Empty from '@/components/ui/Empty.component'
import { Button } from '@/components/ui/button'
import { useDeleteTodos } from '@/components/features/todos/useDeleteTodos'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import DeleteTodos from '@/components/features/todos/DeleteTodos.component'

export default function TodosCompleted() {
  const { data: todos, isPending } = useTodosQuery()
  const { deleteTodos, isDeleting } = useDeleteTodos()
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

  const grid =
    'grid items-center grid-cols-[30px_1fr_250px_150px_40px] p-[10px] '
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
            <Modal>
              <Menus>
                {sortedFilteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    grid={grid}
                    todo={todo}
                    type='completed'
                  />
                ))}
              </Menus>
            </Modal>
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
          className='mt-[120px]'
          emptyMessage='Keine erledigten Todos vorhanden'
        />
      )}
    </div>
  )
}
