import './todoList.style.scss'

import { FunctionComponent } from 'react'

interface TodoListProps {
  children?: React.ReactNode
}

const TodoList: FunctionComponent<TodoListProps> = ({ children }) => {
  return (
    <div className="todo-list">
      <div className="todos">{children}</div>
    </div>
  )
}

export default TodoList
