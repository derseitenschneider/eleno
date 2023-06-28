import { useEffect } from 'react'
import TodoList from '../../components/todos/todoList/TodoList.component'
import { useTodos } from '../../contexts/TodosContext'
import NoContent from '../../components/common/noContent/NoContent.component'
import { compareDateTodos } from '../../utils/sortTodos'
import TodoAddItem from '../../components/todos/todoAddItem/TodoAddItem.component'
import TodoDescription from '../../components/todos/todoDescription/TodoDescription.component'
import TodoItem from '../../components/todos/todoItem/TodoItem.component'

const TodosOpen = () => {
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
      <TodoAddItem />
      {openTodos.length > 0 ? (
        <>
          <TodoDescription />
          <ul>
            {sortedFilteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} type="open"></TodoItem>
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
