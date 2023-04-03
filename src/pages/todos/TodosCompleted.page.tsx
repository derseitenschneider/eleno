import { FunctionComponent } from 'react'
import StudentList from '../../components/studentlist/StudentList.component'
import TodoList from '../../components/todoList/TodoList.component'
import { useTodos } from '../../hooks/useTodos'
interface TodosCompletedProps {}

const TodosCompleted: FunctionComponent<TodosCompletedProps> = () => {
  const { todos, setTodos } = useTodos()

  const completedTodos = todos.filter((todo) => todo.completed)
  return <TodoList todos={completedTodos} listType={'completed'} />
}

export default TodosCompleted
