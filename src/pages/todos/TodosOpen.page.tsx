import { FunctionComponent } from 'react'
import TodoList from '../../components/todoList/TodoList.component'
import { TTodo } from '../../types/types'
import { useTodos } from '../../contexts/TodosContext'
import NoContent from '../../components/noStudents/NoContent'
interface TodosOpenProps {}

const TodosOpen: FunctionComponent<TodosOpenProps> = () => {
  const { todos, setTodos } = useTodos()
  const openTodos = todos.filter((todo) => !todo.completed)
  return (
    <>
      {openTodos.length ? (
        <TodoList todos={openTodos} />
      ) : (
        <NoContent
          heading="Aktuell keine offenen Todos"
          buttons={[{ label: 'Neue Todo erfassen', handler: () => {} }]}
        />
      )}
    </>
  )
}

export default TodosOpen
