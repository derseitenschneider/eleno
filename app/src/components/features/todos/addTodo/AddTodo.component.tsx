import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useTodos } from "../../../../services/context/TodosContext"
import { useUser } from "../../../../services/context/UserContext"
import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import type { Todo } from "../../../../types/types"
import { DayPicker } from "@/components/ui/daypicker.component"
import { Button } from "@/components/ui/button"
import StudentsCombobox from "../../students/StudentsCombobox.component"
import { Input } from "@/components/ui/input"
import ButtonRemove from "@/components/ui/buttonRemove/ButtonRemove"
import MiniLoader from "@/components/ui/MiniLoader.component"

interface AddTodoProps {
  currentStudentId?: number
  onCloseModal?: () => void
}

function AddTodo({ currentStudentId, onCloseModal }: AddTodoProps) {
  const { user } = useUser()
  const { saveTodo } = useTodos()
  const [errorMessage, setErrorMessage] = useState("")
  const [text, setText] = useState("")
  const [due, setDue] = useState<Date>()
  const [studentId, setStudentId] = useState<number>()
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (currentStudentId) setStudentId(currentStudentId)
  }, [currentStudentId])

  const onSaveHandler = async () => {
    if (!text) {
      setErrorMessage("Text fehlt.")
      return
    }
    setIsPending(true)
    const newTodo: Todo = {
      text,
      due,
      studentId,
      userId: user?.id || "",
      completed: false,
    }
    try {
      await saveTodo(newTodo)
      toast("Todo erstellt")
      setText("")
      setDue(undefined)
      setStudentId(undefined)
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
      <div className='w-[800px] bg-background50 flex items-center justify-stretch'>
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
        <StudentsCombobox disabled={isPending} studentId={studentId} />
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
        <Button disabled={isPending} onClick={onSaveHandler} size='sm'>
          Speichern
        </Button>
        {isPending && <MiniLoader />}
      </div>
      {errorMessage && (
        <p className='text-sm text-warning p-2'>{errorMessage}</p>
      )}
    </div>
  )
}

export default AddTodo
