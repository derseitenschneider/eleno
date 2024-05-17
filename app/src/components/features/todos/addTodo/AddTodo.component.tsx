import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useTodos } from "../../../../services/context/TodosContext"
import { useUser } from "../../../../services/context/UserContext"
import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import type { Todo } from "../../../../types/types"
import TodoAddStudent from "../todoAddStudent/TodoAddStudent.component"
import { DayPicker } from "@/components/ui/daypicker.component"
import { Button } from "@/components/ui/button"
import StudentsCombobox from "../../students/StudentsCombobox.component"
import { Input } from "@/components/ui/input"

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
  const [currentStudentId, setCurrentStudentId] = useState<number>()
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
      userId: user?.id || "",
    }
    setIsPending(true)
    try {
      await saveTodo({
        ...newTodo,
        due: newTodo.due?.length ? newTodo.due : "",
      })
      toast("Todo erstellt")
      setInputTodo(todoData)
      onCloseModal?.()
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
      onCloseModal?.()
    }
  }

  return (
    <div className='w-full bg-background50 flex items-center justify-between'>
      <Input
        className='border-none w-[300px]'
        type='text'
        placeholder='Todo'
        name='text'
        value={inputTodo.text}
        required
        onChange={onChangeInputs}
        autoComplete='off'
      />

      <StudentsCombobox studentId={studentId} />
      <DayPicker className='border-none' />
      <Button size='sm'>Speichern</Button>
    </div>
  )
}

export default AddTodo
