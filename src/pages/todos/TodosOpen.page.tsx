import { FunctionComponent } from 'react'
import TodoList from '../../components/todoList/TodoList.component'
import { TTodo } from '../../types/types'
import { useTodos } from '../../hooks/useTodos'
import NoContent from '../../components/noContent/NoContent.component'
import { compareDateString } from '../../utils/sortStudents'
import { compareDateTodos } from '../../utils/sortTodos'
interface TodosOpenProps {}

const TodosOpen: FunctionComponent<TodosOpenProps> = () => {
  const { todos } = useTodos()

  // [ ] check sorting todos
  const sortedFilteredTodos = todos
    .filter((todo) => !todo.completed)
    .sort(compareDateTodos)

  const openTodos = todos.filter((todo) => !todo.completed)
  return <TodoList todos={sortedFilteredTodos} listType={'open'} />
}

export default TodosOpen
