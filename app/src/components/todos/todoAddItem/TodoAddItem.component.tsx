import { FunctionComponent, useState, useEffect } from 'react'
import './todoAddItem.style.scss'
import Button from '../../common/button/Button.component'
import { TTodo } from '../../../types/types'
import { useUser } from '../../../contexts/UserContext'
import { formatDateToDisplay } from '../../../utils/formateDate'
import TodoAddStudent from '../todoAddStudent/TodoAddStudent.component'
import { toast } from 'react-toastify'
import { useTodos } from '../../../contexts/TodosContext'
import fetchErrorToast from '../../../hooks/fetchErrorToast'

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
  const onClickDate = () => {
    setInputTodo((prev) => {
      return { ...prev, due: null }
    })
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

        {inputTodo.due ? (
          <span className="date" onClick={onClickDate}>
            {formatDateToDisplay(inputTodo.due).slice(0, 6)}
          </span>
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