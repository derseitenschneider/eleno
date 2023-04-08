import { FunctionComponent, useState, useEffect } from 'react'
import './todoAddItem.style.scss'

import { sortStudents } from '../../utils/sortStudents'
import Button from '../button/Button.component'
import { TTodo } from '../../types/types'
import { useUser } from '../../contexts/UserContext'
import Select from 'react-select'
import { IoPeopleCircleOutline } from 'react-icons/io5'
import DropDown from '../dropdown/Dropdown.component'
import { formatDateToDisplay } from '../../utils/formateDate'
import TodoAddStudent from '../todoAddStudent/TodoAddStudent.component'
interface TodoAddItemProps {
  saveTodo: (todo: TTodo) => void
}

const todoData = {
  text: '',
  due: null,
  studentId: null,
  completed: false,
}

const TodoAddItem: FunctionComponent<TodoAddItemProps> = ({ saveTodo }) => {
  const { user } = useUser()
  const [inputTodo, setInputTodo] = useState(todoData)
  const [currentStudentId, setCurrentStudentId] = useState(null)

  const onChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value

    setInputTodo((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const onClickDate = () => {
    setInputTodo((prev) => {
      return { ...prev, due: null }
    })
  }

  const onSaveHandler = () => {
    const tempId = Math.floor(Math.random() * 1000000000)
    const newTodo: TTodo = {
      ...inputTodo,
      studentId: currentStudentId,
      id: tempId,
      userId: user.id,
    }
    saveTodo(newTodo)
    setInputTodo(todoData)
    setCurrentStudentId(null)
  }

  return (
    <div className="container--add">
      <div className="inputs">
        <input
          type="text"
          placeholder="Todo"
          name="text"
          value={inputTodo.text}
          required
          onChange={onChangeInputs}
          autoFocus={true}
        />
        <TodoAddStudent
          currentStudentId={currentStudentId}
          setCurrentStudentId={setCurrentStudentId}
        />

        {inputTodo.due ? (
          <p className="date" onClick={onClickDate}>
            {formatDateToDisplay(inputTodo.due).slice(0, 6)}
          </p>
        ) : (
          <input
            type="date"
            name="due"
            className="datepicker"
            value={inputTodo.due}
            onChange={onChangeInputs}
          />
        )}

        <Button
          label="Speichern"
          type="button"
          btnStyle="primary"
          handler={onSaveHandler}
        />
      </div>
    </div>
  )
}

export default TodoAddItem
