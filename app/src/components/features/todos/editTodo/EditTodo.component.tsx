import { useState } from 'react'
import { toast } from 'react-toastify'
import { useTodos } from '../../../../services/context/TodosContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import { formatDateToDatabase } from '../../../../utils/formateDate'
import Button from '../../../ui/button/Button.component'
import DatePicker from '../../../ui/datePicker/DatePicker.component'
import TodoAddStudent from '../todoAddStudent/TodoAddStudent.component'
import './editTodo.style.scss'

interface EditTodoProps {
  todoId: number
  onCloseModal?: () => void
}

function EditTodo({ onCloseModal, todoId }: EditTodoProps) {
  const { todos, updateTodo } = useTodos()
  const todo = todos.find((currentTodo) => currentTodo.id === todoId)
  const [currentTodo, setCurrentTodo] = useState(todo)
  const [isPending, setIsPending] = useState(false)

  const setStudent = (studentId: number) => {
    setCurrentTodo((prev) => {
      return { ...prev, studentId }
    })
  }

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
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
        <Button type="button" btnStyle="secondary" onClick={onCloseModal}>
          Abbrechen
        </Button>
        <Button type="button" btnStyle="primary" onClick={handleSave}>
          Speichern
        </Button>
      </div>
    </div>
  )
}

export default EditTodo
