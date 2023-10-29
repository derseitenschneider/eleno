import { useEffect } from 'react'
import NoContent from '../../components/common/noContent/NoContent.component'
import AddTodo from '../../components/features/todos/addTodo/AddTodo.component'
import TodoDescription from '../../components/features/todos/todoDescription/TodoDescription.component'
import TodoItem from '../../components/features/todos/todoItem/TodoItem.component'
import TodoList from '../../components/features/todos/todoList/TodoList.component'
import { useTodos } from '../../contexts/TodosContext'
import compareDateTodos from '../../utils/sortTodos'

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
            {sortedFilteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} type="open" />
            ))}
          </ul>
        </>
      ) : (
        <NoContent heading="Aktuell keine offenen Todos" />
      )}
    </TodoList>
  )
}

export default TodosOpen
