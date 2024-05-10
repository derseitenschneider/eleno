import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useTodos } from "../../../../services/context/TodosContext"
import { useUser } from "../../../../services/context/UserContext"
import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import type { Todo } from "../../../../types/types"
import { formatDateToDatabase } from "../../../../utils/formateDate"
import TodoAddStudent from "../todoAddStudent/TodoAddStudent.component"
import "./addTodo.style.scss"

interface AddTodoProps {
  studentId?: number
  onCloseModal?: () => void
}

const todoData = {
  text: "",
  due: "",
  studentId: null,
  completed: false,
}

function AddTodo({ studentId, onCloseModal }: AddTodoProps) {
  const { user } = useUser()
  const [inputTodo, setInputTodo] = useState(todoData)
  const [currentStudentId, setCurrentStudentId] = useState(null)
  const { saveTodo } = useTodos()
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (studentId) setCurrentStudentId(studentId)
  }, [studentId])

  const onChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

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
      toast("Leere Todo kann nicht gespeichert werden", { type: "error" })
      return
    }
    const newTodo: Todo = {
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
      toast("Todo erstellt")
      setInputTodo(todoData)
      setCurrentStudentId(null)
      onCloseModal?.()
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
      onCloseModal?.()
    }
  }

  return (
    <div
      className={`add-todo ${isPending ? "loading" : ""}`}
      style={
        !onCloseModal
          ? {
              marginBottom: "4.2rem",
            }
          : {
              padding: "4.8rem",
              width: "80vw",
            }
      }
    >
      <div className='inputs'>
        <input
          type='text'
          placeholder='Todo'
          name='text'
          value={inputTodo.text}
          required
          onChange={onChangeInputs}
          autoFocus={window.screen.width > 1366}
          autoComplete='off'
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
          id='due-date'
        />

        <Button
          label='Speichern'
          type='button'
          btnStyle='primary'
          handler={onSaveHandler}
          className='btn-save'
        />
      </div>
    </div>
  )
}

export default AddTodo
