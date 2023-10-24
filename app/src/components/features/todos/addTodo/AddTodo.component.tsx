import { FunctionComponent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useTodos } from '../../../../contexts/TodosContext'
import { useUser } from '../../../../contexts/UserContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import { TTodo } from '../../../../types/types'
import { formatDateToDatabase } from '../../../../utils/formateDate'
import Button from '../../../common/button/Button.component'
import DatePicker from '../../../common/datePicker/DatePicker.component'
import TodoAddStudent from '../todoAddStudent/TodoAddStudent.component'
import './addTodo.style.scss'

interface AddTodoProps {
  studentId?: number
  onCloseModal?: () => void
}

const todoData = {
  text: '',
  due: '',
  studentId: null,
  completed: false,
}

const AddTodo: FunctionComponent<AddTodoProps> = ({
  studentId,
  onCloseModal,
}) => {
  const { user } = useUser()
  const [inputTodo, setInputTodo] = useState(todoData)
  const [currentStudentId, setCurrentStudentId] = useState(null)
  const { saveTodo } = useTodos()
  const [isPending, setIsPending] = useState(false)

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
      onCloseModal?.()
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
      if (onCloseModal) onCloseModal
    }
  }

  return (
    <div
      className={`add-todo ${isPending ? 'loading' : ''}`}
      style={
        !onCloseModal
          ? {
              marginBottom: '4.2rem',
            }
          : {
              padding: '4.8rem',
              width: '80vw',
            }
      }
    >
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
          id="due-date"
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

export default AddTodo
