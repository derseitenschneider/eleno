import { useEffect } from 'react'
import NoContent from '../../components/ui/noContent/NoContent.component'
import AddTodo from '../../components/features/todos/addTodo/AddTodo.component'
import TodoDescription from '../../components/features/todos/todoDescription/TodoDescription.component'
import TodoItem from '../../components/features/todos/todoItem/TodoItem.component'
import TodoList from '../../components/features/todos/todoList/TodoList.component'
import { useTodos } from '../../services/context/TodosContext'
import compareDateTodos from '../../utils/sortTodos'
import Modal from '../../components/ui/modal/Modal.component'
import Menus from '../../components/ui/menu/Menus.component'

function TodosOpen() {
  const { todos } = useTodos()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const openTodos = todos.filter((todo) => !todo.completed)

  const todosWithDue = openTodos
    .filter((todo) => todo.due)
    .sort(compareDateTodos)

  const todosWithoutDue = openTodos.filter((todo) => !todo.due)

  const sortedFilteredTodos = [...todosWithDue, ...todosWithoutDue]

  return (
    <TodoList>
      <AddTodo />
      {openTodos.length > 0 ? (
        <>
          <TodoDescription />
          <ul>
            <Modal>
              <Menus>
                {sortedFilteredTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} type="open" />
                ))}
              </Menus>
            </Modal>
          </ul>
        </>
      ) : (
        <NoContent heading="Aktuell keine offenen Todos" />
      )}
    </TodoList>
  )
}

export default TodosOpen
