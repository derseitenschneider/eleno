import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useTodos } from '../../../services/context/TodosContext'
import { useUser } from '../../../services/context/UserContext'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import type { PartialTodoItem, TTodoItem } from '../../../types/types'
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

function CreateTodo({ onCloseModal, holderId, holderType }: AddTodoProps) {
  const { createTodoItem, isCreating } = useCreateTodoItem()
  const [text, setText] = useState('')
  const [due, setDue] = useState<Date>()
  const [selectedHolderId, setSelectedHolderId] = useState(
    holderId ? `${holderType}-${holderId}` : '',
  )

  const onSaveHandler = async () => {
    const typeId = selectedHolderId.includes('s') ? 'studentId' : 'groupId'
    const holderId = Number(selectedHolderId.split('-').at(1)) || 0
    const newTodo: PartialTodoItem = {
      text,
      due,
      [typeId]: holderId,
      completed: false,
    }
    createTodoItem(newTodo, {
      onSuccess: () => onCloseModal?.(),
    })
  }

  return (
    <div>
      <form onSubmit={onSaveHandler} className='gap-1 w-full flex items-center'>
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
              }}
              autoComplete='off'
              disabled={isCreating}
            />
          </div>
          <AddHolderCombobox
            disabled={isCreating}
            selectedHolderId={selectedHolderId}
            setSelectedHolderId={setSelectedHolderId}
          />
          <div className='flex items-center'>
            <DayPicker disabled={isCreating} date={due} setDate={setDue} />
            {due && (
              <ButtonRemove
                disabled={isCreating}
                className='translate-x-[-8px]'
                onRemove={() => setDue(undefined)}
              />
            )}
          </div>
        </div>
        <Button
          disabled={isCreating}
          type='submit'
          onClick={onSaveHandler}
          size='sm'
        >
          Speichern
        </Button>
        {isCreating && <MiniLoader />}
      </form>
    </div>
  )
}

export default CreateTodo
