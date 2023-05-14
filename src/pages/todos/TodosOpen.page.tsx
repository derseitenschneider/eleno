import { FunctionComponent } from 'react'
import TodoList from '../../components/todoList/TodoList.component'
import { TTodo } from '../../types/types'
import { useTodos } from '../../contexts/TodosContext'
import NoContent from '../../components/noContent/NoContent.component'
import { compareDateTodos } from '../../utils/sortTodos'
interface TodosOpenProps {}

const TodosOpen: FunctionComponent<TodosOpenProps> = () => {
  const { todos } = useTodos()

  const openTodos = todos.filter((todo) => !todo.completed)

  const todosWithDue = openTodos
    .filter((todo) => todo.due)
    .sort(compareDateTodos)

  const todosWithoutDue = openTodos.filter((todo) => !todo.due)

  const sortedFilteredTodos = [...todosWithDue, ...todosWithoutDue]

  return <TodoList todos={sortedFilteredTodos} listType={'open'} />
}

export default TodosOpen
