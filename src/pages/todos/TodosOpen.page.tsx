import { FunctionComponent } from 'react'
import TodoList from '../../components/todoList/TodoList.component'
import { TTodo } from '../../types/types'
import { useTodos } from '../../contexts/TodosContext'
import NoContent from '../../components/noContent/NoContent.component'
interface TodosOpenProps {}

const TodosOpen: FunctionComponent<TodosOpenProps> = () => {
  const { todos, setTodos } = useTodos()
  const openTodos = todos.filter((todo) => !todo.completed)
  return <TodoList todos={openTodos} listType={'open'} />
}

export default TodosOpen
