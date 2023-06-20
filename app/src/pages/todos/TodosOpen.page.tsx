import { FunctionComponent } from 'react'
import TodoList from '../../components/todoList/TodoList.component'
import { useTodos } from '../../contexts/TodosContext'
import NoContent from '../../components/noContent/NoContent.component'
import { compareDateTodos } from '../../utils/sortTodos'
import TodoAddItem from '../../components/todoAddItem/TodoAddItem.component'
import TodoDescription from '../../components/todoDescription/TodoDescription.component'
import TodoItem from '../../components/todoItem/TodoItem.component'
interface TodosOpenProps {}

const TodosOpen: FunctionComponent<TodosOpenProps> = () => {
  const { todos } = useTodos()

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
