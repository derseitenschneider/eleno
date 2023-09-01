import './modalEditTodo.style.scss'
import { FunctionComponent, useState } from 'react'
import { useTodos } from '../../../contexts/TodosContext'
import TodoAddStudent from '../../todos/todoAddStudent/TodoAddStudent.component'
import {
  formatDateToDatabase,
  formatDateToDisplay,
} from '../../../utils/formateDate'
import Modal from '../Modal.component'
import Button from '../../common/button/Button.component'
import { toast } from 'react-toastify'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import DatePicker from '../../common/datePicker/DatePicker.component'

interface ModalEditTodoProps {
  closeModal: () => void
  todoId: number
}

const ModalEditTodo: FunctionComponent<ModalEditTodoProps> = ({
  closeModal,
  todoId,
}) => {
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

  const handlerEditTodo = async () => {
    setIsPending(true)
    try {
      await updateTodo({
        ...currentTodo,
        due: currentTodo.due || null,
      })
      closeModal()
      toast('Änderungen gespeichert.')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Modal
      heading="Todo berabeiten"
      handlerClose={closeModal}
      className={`modal--edit-todo ${isPending ? 'loading' : ''}`}
    >
      <div className="container--add">
        <div className="inputs">
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
            selectedDate={
              currentTodo.due
                ? new Date(formatDateToDatabase(currentTodo.due))
                : null
            }
            setDate={setDate}
          />
        </div>
      </div>
      <div className="container--buttons">
        <Button
          label="Speichern"
          handler={handlerEditTodo}
          type="button"
          btnStyle="primary"
        />
      </div>
    </Modal>
  )
}

export default ModalEditTodo
