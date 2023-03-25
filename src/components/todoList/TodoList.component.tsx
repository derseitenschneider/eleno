import './todoList.style.scss'
import { FunctionComponent, useState } from 'react'
import { TTodo } from '../../types/types'
import TodoItem from '../todoItem/TodoItem.component'
import { useStudents } from '../../contexts/StudentContext'
import { sortStudents } from '../../utils/sortStudents'
import Button from '../button/Button.component'
import TodoAddItem from '../todoAddItem/TodoAddItem.component'
interface TodoListProps {
  todos: TTodo[]
}

const TodoList: FunctionComponent<TodoListProps> = ({ todos }) => {
  const { students } = useStudents()

  return (
    <div className="todos">
      <TodoAddItem />
      <div className="description">
        <div></div>
        <div></div>
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
