import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useTodos } from "../../../services/context/TodosContext"
import { useUser } from "../../../services/context/UserContext"
import fetchErrorToast from "../../../hooks/fetchErrorToast"
import type { Todo } from "../../../types/types"
import { DayPicker } from "@/components/ui/daypicker.component"
import { Button } from "@/components/ui/button"
import StudentsCombobox from "../students/StudentsCombobox.component"
import { Input } from "@/components/ui/input"
import ButtonRemove from "@/components/ui/buttonRemove/ButtonRemove"
import MiniLoader from "@/components/ui/MiniLoader.component"
import { useParams } from "react-router-dom"

interface AddTodoProps {
  onCloseModal?: () => void
}

function AddTodo({ onCloseModal }: AddTodoProps) {
  const { user } = useUser()
  const { saveTodo } = useTodos()
  const [errorMessage, setErrorMessage] = useState("")
  const [text, setText] = useState("")
  const [due, setDue] = useState<Date>()
  const [selectedStudentId, setSelectedStudentId] = useState<number>()
  const [isPending, setIsPending] = useState(false)
  const { studentId } = useParams()

  useEffect(() => {
    studentId && setSelectedStudentId(Number(studentId))
  }, [studentId])

  const onSaveHandler = async () => {
    if (!text) {
      setErrorMessage("Text fehlt.")
      return
    }
    setIsPending(true)
    const newTodo: Todo = {
      text,
      due,
      studentId: selectedStudentId,
      userId: user?.id || "",
      completed: false,
    }
    try {
      await saveTodo(newTodo)
      toast("Todo erstellt")
      setText("")
      setDue(undefined)
      setSelectedStudentId(undefined)
      toast.success("Änderungen gespeichert.")
      onCloseModal?.()
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
      onCloseModal?.()
    }
  }

  return (
    <div>
      <form
        onSubmit={onSaveHandler}
        className='gap-1 w-[800px] flex items-center'
      >
        <div className='flex bg-background50 grow'>
          <div className='shrink grow'>
            <Input
              className='border-none'
              type='text'
              placeholder='Todo'
              name='text'
              value={text}
              required
              onChange={(e) => {
                setText(e.target.value)
                setErrorMessage("")
              }}
              autoComplete='off'
              disabled={isPending}
            />
          </div>
          <StudentsCombobox
            disabled={isPending}
            studentId={selectedStudentId}
          />
          <DayPicker
            disabled={isPending}
            className='border-none'
            date={due}
            setDate={setDue}
          />
          {due && (
            <ButtonRemove
              disabled={isPending}
              className='translate-x-[-8px]'
              onRemove={() => setDue(undefined)}
            />
          )}
        </div>
        <Button
          disabled={isPending}
          type='submit'
          onClick={onSaveHandler}
          size='sm'
        >
          Speichern
        </Button>
        {isPending && <MiniLoader />}
      </form>
      {errorMessage && (
        <p className='text-sm text-warning p-2'>{errorMessage}</p>
      )}
    </div>
  )
}

export default AddTodo
