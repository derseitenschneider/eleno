import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useTodos } from '../../../services/context/TodosContext'
import { useUser } from '../../../services/context/UserContext'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import type { TodoItem } from '../../../types/types'
import { DayPicker } from '@/components/ui/daypicker.component'
import { Button } from '@/components/ui/button'
import AddHolderCombobox from '../students/AddHolderCombobox.component'
import { Input } from '@/components/ui/input'
import ButtonRemove from '@/components/ui/buttonRemove/ButtonRemove'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { useCreateTodoItem } from './useCreateTodoItem'

interface AddTodoProps {
  onCloseModal?: () => void
  holderId?: number
  holderType?: 's' | 'g'
}

function AddTodo({ onCloseModal, holderId, holderType }: AddTodoProps) {
  const { createTodoItem, isCreating } = useCreateTodoItem()
  const { saveTodo } = useTodos()
  const [errorMessage, setErrorMessage] = useState('')
  const [text, setText] = useState('')
  const [due, setDue] = useState<Date>()
  const [selectedHolderId, setSelectedHolderId] = useState<string>()
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    holderId && setSelectedHolderId(`${holderType}-${holderId}`)
  }, [holderType, holderId])

  const onSaveHandler = async () => { }

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
                setErrorMessage('')
              }}
              autoComplete='off'
              disabled={isPending}
            />
          </div>
          <AddHolderCombobox
            disabled={isPending}
            studentId={selectedHolderId}
          />
          <div className='flex items-center'>
            <DayPicker disabled={isPending} date={due} setDate={setDue} />
            {due && (
              <ButtonRemove
                disabled={isPending}
                className='translate-x-[-8px]'
                onRemove={() => setDue(undefined)}
              />
            )}
          </div>
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
