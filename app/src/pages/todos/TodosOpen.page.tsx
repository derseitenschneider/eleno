import { useEffect } from 'react'
import NoContent from '../../components/ui/NoContent.component'
import CreateTodo from '../../components/features/todos/CreateTodo.component'
import TodoDescription from '../../components/features/todos/todoDescription/TodoDescription.component'
import TTodoItem from '../../components/features/todos/TodoItem.component'
import TodoList from '../../components/features/todos/todoList/TodoList.component'
import { useTodos } from '../../services/context/TodosContext'
import compareDateTodos from '../../utils/sortTodos'
import Modal from '../../components/ui/modal/Modal.component'
import Menus from '../../components/ui/menu/Menus.component'
import useTodosQuery from '@/components/features/todos/todosQuery'
import TodoItem from '../../components/features/todos/TodoItem.component'
import Empty from '@/components/ui/Empty.component'

function TodosOpen() {
  const { data: todos, isPending } = useTodosQuery()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const openTodos = todos?.filter((todo) => !todo.completed)

  const todosWithDue = openTodos?.filter((todo) => todo.due).sort()

  const todosWithoutDue = openTodos?.filter((todo) => !todo.due)

  const sortedFilteredTodos = [
    ...(todosWithDue ? todosWithDue : []),
    ...(todosWithoutDue ? todosWithoutDue : []),
  ]

  const grid =
    'grid items-center grid-cols-[30px_1fr_250px_150px_40px] p-[10px] '
  if (isPending) return <p>...loading</p>

  return (
    <div>
      <CreateTodo />
      {openTodos?.length > 0 ? (
        <>
          <TodoDescription grid={grid} />
          <ul>
            <Modal>
              <Menus>
                {sortedFilteredTodos.map((todo) => (
                  <TodoItem key={todo.id} grid={grid} todo={todo} type='open' />
                ))}
              </Menus>
            </Modal>
          </ul>
        </>
      ) : (
        <Empty emptyMessage='Keine offenen Todos vorhanden' />
      )}
    </div>
  )
}

export default TodosOpen
