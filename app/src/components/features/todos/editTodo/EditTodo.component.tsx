import { toast } from 'react-toastify'
import { useTodos } from '../../../../contexts/TodosContext'
import './editTodo.style.scss'
import { FC, useState } from 'react'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import TodoAddStudent from '../todoAddStudent/TodoAddStudent.component'
import DatePicker from '../../../common/datePicker/DatePicker.component'
import { formatDateToDatabase } from '../../../../utils/formateDate'
import Button from '../../../common/button/Button.component'

interface EditTodoProps {
  todoId: number
  onCloseModal?: () => void
}

const EditTodo: FC<EditTodoProps> = ({ onCloseModal, todoId }) => {
  const { todos, updateTodo } = useTodos()
  const todo = todos.find((todo) => todo.id === todoId)
  const [currentTodo, setCurrentTodo] = useState(todo)
  const [isPending, setIsPending] = useState(false)

  const setStudent = (studentId: number) => {
    setCurrentTodo((prev) => {
      return { ...prev, studentId }
    })
  }

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value

    setCurrentTodo((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const setDate = (date: string) => {
    setCurrentTodo((prev) => ({ ...prev, due: date }))
  }

  const handleSave = async () => {
    setIsPending(true)
    try {
      await updateTodo({
        ...currentTodo,
        due: currentTodo.due || null,
      })
      onCloseModal?.()
      toast('Änderungen gespeichert.')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }
  return (
    <div className={`edit-todo${isPending ? ' loading' : ''}`}>
      <h2 className="heading-2">Todo bearbeiten</h2>
      <div className="edit-todo__inputs">
        <input
          type="text"
          name="text"
          value={currentTodo.text}
          onChange={onChangeHandler}
        />
        <TodoAddStudent
          currentStudentId={currentTodo.studentId}
          setCurrentStudentId={setStudent}
        />
        <DatePicker
          id="todo-due-date"
          selectedDate={
            currentTodo.due
              ? new Date(formatDateToDatabase(currentTodo.due))
              : null
          }
          setDate={setDate}
        />
      </div>
      <div className="edit-todo__buttons">
        <Button btnStyle="secondary" onClick={onCloseModal}>
          Abbrechen
        </Button>
        <Button btnStyle="primary" onClick={handleSave}>
          Speichern
        </Button>
      </div>
    </div>
  )
}

export default EditTodo
