import './modalEditTodo.style.scss'
import { FunctionComponent, useState } from 'react'
import { useStudents } from '../../../contexts/StudentContext'
import { useTodos } from '../../../hooks/useTodos'
import TodoAddStudent from '../../todoAddStudent/TodoAddStudent.component'
import { formatDateToDisplay } from '../../../utils/formateDate'
import Modal from '../Modal.component'
import Button from '../../button/Button.component'
import { updateTodoSupabase } from '../../../supabase/todos/todos.supabase'
import { toast } from 'react-toastify'
interface ModalEditTodoProps {
  closeModal: () => void
  todoId: number
}

const ModalEditTodo: FunctionComponent<ModalEditTodoProps> = ({
  closeModal,
  todoId,
}) => {
  const { todos, setTodos } = useTodos()
  const todo = todos.find((todo) => todo.id === todoId)

  const [currentTodo, setCurrentTodo] = useState(todo)
  // const currentTodo = todos.find((todo) => todo.id === todoId)
  // const [currentStudentId, setCurrentStudentId] = useState(
  //   currentTodo.studentId
  // )
  // const [due, setDue] = useState(currentTodo.due)

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

  const updateTodo = async () => {
    setTodos((prev) => {
      return prev.map((todo) =>
        todo.id === currentTodo.id ? currentTodo : todo
      )
    })
    closeModal()
    try {
      await updateTodoSupabase(currentTodo)
      toast('Änderungen gespeichert')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Modal
      heading="Todo berabeiten"
      handlerOverlay={closeModal}
      handlerClose={closeModal}
      className="modal--edit-todo"
    >
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
        {currentTodo.due ? (
          <p
            className="date"
            onClick={() =>
              setCurrentTodo((prev) => {
                return { ...prev, due: '' }
              })
            }
          >
            {formatDateToDisplay(currentTodo.due).slice(0, 6)}
          </p>
        ) : (
          <input
            type="date"
            name="due"
            className="datepicker"
            value={currentTodo.due}
            onChange={onChangeHandler}
          />
        )}
      </div>
      <div className="container--buttons">
        <Button
          label="Speichern"
          handler={updateTodo}
          type="button"
          btnStyle="primary"
        />
      </div>
    </Modal>
  )
}

export default ModalEditTodo
