import './todoList.style.scss'
import { FunctionComponent } from 'react'
import { TTodo } from '../../types/types'
import TodoItem from '../todoItem/TodoItem.component'
interface TodoListProps {
  todos: TTodo[]
}

const TodoList: FunctionComponent<TodoListProps> = ({ todos }) => {
  return (
    <div className="todos">
      <div className="description">
        <p>x</p>
        <p>was</p>
        <h5 className="heading-5">fällig</h5>
        <h5 className="heading-5">Schüler:in</h5>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  )
}

export default TodoList
