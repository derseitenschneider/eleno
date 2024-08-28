import { useRef, useState } from 'react'
import type { PartialTodoItem } from '../../../types/types'
import { DayPicker } from '@/components/ui/daypicker.component'
import { Button } from '@/components/ui/button'
import AddHolderCombobox from '../students/AddHolderCombobox.component'
import { Input } from '@/components/ui/input'
import ButtonRemove from '@/components/ui/buttonRemove'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { useCreateTodoItem } from './useCreateTodoItem'
import { cn } from '@/lib/utils'

interface AddTodoProps {
  onCloseModal?: () => void
  holderId?: number
  holderType?: 's' | 'g'
}

function CreateTodo({ onCloseModal, holderId, holderType }: AddTodoProps) {
  const { createTodoItem, isCreating } = useCreateTodoItem()
  const textField = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [text, setText] = useState('')
  const [due, setDue] = useState<Date>()
  const [selectedHolderId, setSelectedHolderId] = useState(
    holderId ? `${holderType}-${holderId}` : '',
  )

  function resetFields() {
    setText('')
    setDue(undefined)
    setSelectedHolderId('')
  }

  const onSaveHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text) return setError('Leere Todo kann nicht gespeichert werden.')
    const typeId = selectedHolderId.includes('s') ? 'studentId' : 'groupId'
    const holderId = Number(selectedHolderId.split('-').at(1)) || null
    const newTodo: PartialTodoItem = {
      text,
      due,
      [typeId]: holderId,
      completed: false,
    }
    createTodoItem(newTodo, {
      onSuccess: () => {
        resetFields()
        setTimeout(() => {
          if (window.innerWidth > 800) textField.current?.focus()
        }, 200)
        onCloseModal?.()
      },
    })
  }

  return (
    <div>
      <form
        onSubmit={onSaveHandler}
        className={cn(
          'sm:border border-hairline pr-1 rounded-md sm:flex-row sm:items-center',
          'gap-1 w-full flex flex-col justify-end',
        )}
      >
        <div className='sm:flex sm:border-none border border-hairline rounded-md grow items-center'>
          <div className='shrink grow'>
            <Input
              autoFocus={window.innerWidth > 800}
              ref={textField}
              className={cn(
                'border-none',
                error && 'border-solid border-warning',
              )}
              type='text'
              placeholder='Todo...'
              name='text'
              value={text}
              required
              onChange={(e) => {
                setError('')
                setText(e.target.value)
              }}
              autoComplete='off'
              disabled={isCreating}
            />
          </div>
          <div className='flex justify-between'>
            <AddHolderCombobox
              disabled={isCreating}
              selectedHolderId={selectedHolderId}
              setSelectedHolderId={setSelectedHolderId}
            />
            <div className='flex mr-2 items-center'>
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
        </div>
        <Button
          disabled={isCreating || !text}
          type='submit'
          onClick={onSaveHandler}
          size='sm'
          className={cn('sm:mt-0 sm:ml-0', ' mt-2 ml-auto')}
        >
          Speichern
        </Button>
        {isCreating && <MiniLoader />}
      </form>
      <p className='text-sm text-warning pl-2 pt-1'>{error || ''}</p>
    </div>
  )
}

export default CreateTodo
