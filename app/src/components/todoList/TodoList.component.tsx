import './todoList.style.scss'

import { FunctionComponent, useRef, useState } from 'react'
import { TTodo } from '../../types/types'
import Button from '../button/Button.component'
import { useTodos } from '../../contexts/TodosContext'
import { toast } from 'react-toastify'

import Modal from '../modals/Modal.component'
import fetchErrorToast from '../../hooks/fetchErrorToast'
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
