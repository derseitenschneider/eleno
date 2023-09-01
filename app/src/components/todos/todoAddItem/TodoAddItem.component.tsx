import { FunctionComponent, useState, useEffect } from 'react'
import './todoAddItem.style.scss'
import Button from '../../common/button/Button.component'
import { TTodo } from '../../../types/types'
import { useUser } from '../../../contexts/UserContext'
import {
  formatDateToDatabase,
  formatDateToDisplay,
} from '../../../utils/formateDate'
import TodoAddStudent from '../todoAddStudent/TodoAddStudent.component'
import { toast } from 'react-toastify'
import { useTodos } from '../../../contexts/TodosContext'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import DatePicker from '../../common/datePicker/DatePicker.component'

interface TodoAddItemProps {
  studentId?: number
  onSave?: () => void
}

// [ ] create same functionality with date like in new lesson component

const todoData = {
  text: '',
  due: '',
  studentId: null,
  completed: false,
}

const TodoAddItem: FunctionComponent<TodoAddItemProps> = ({
  studentId,
  onSave,
}) => {
  const { user } = useUser()
  const [inputTodo, setInputTodo] = useState(todoData)
  const [currentStudentId, setCurrentStudentId] = useState(null)
  const { saveTodo } = useTodos()
  const [isPending, setIsPending] = useState(false)

  const windowWidth = window.innerWidth

  useEffect(() => {
    if (studentId) setCurrentStudentId(studentId)
  }, [])

  const onChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value

    setInputTodo((prev) => {
      return { ...prev, [name]: value }
    })
  }
  const setDate = (date: string) => {
    setInputTodo((prev) => ({
      ...prev,
      due: date,
    }))
  }

  const onSaveHandler = async () => {
    if (!inputTodo.text) {
      toast('Leere Todo kann nicht gespeichert werden', { type: 'error' })
      return
    }
    const newTodo: TTodo = {
      ...inputTodo,
      studentId: currentStudentId,
      userId: user.id,
    }
    setIsPending(true)
    try {
      await saveTodo({
        ...newTodo,
        due: newTodo.due.length ? newTodo.due : null,
      })
      toast('Todo erstellt')
      setInputTodo(todoData)
      setCurrentStudentId(null)
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
      if (onSave) onSave()
    }
  }

  return (
    <div className={`container--add ${isPending ? 'loading' : ''}`}>
      <div className="inputs">
        <input
          type="text"
          placeholder="Todo"
          name="text"
          value={inputTodo.text}
          required
          onChange={onChangeInputs}
          autoFocus={window.screen.width > 1000 ? true : false}
          autoComplete="off"
        />
        <TodoAddStudent
          currentStudentId={currentStudentId}
          setCurrentStudentId={setCurrentStudentId}
        />

        <DatePicker
          selectedDate={
            inputTodo.due ? new Date(formatDateToDatabase(inputTodo.due)) : null
          }
          setDate={setDate}
          display={innerWidth > 480 ? 'left' : 'right'}
        />

        <Button
          label="Speichern"
          type="button"
          btnStyle="primary"
          handler={onSaveHandler}
          className="btn-save"
        />
      </div>
    </div>
  )
}

export default TodoAddItem
