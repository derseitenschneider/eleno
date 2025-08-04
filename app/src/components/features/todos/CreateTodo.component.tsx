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
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { Blocker } from '../subscription/Blocker'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { Separator } from '@/components/ui/separator'

interface AddTodoProps {
  onCloseModal?: () => void
  holderId?: number
  holderType?: 's' | 'g'
}

function CreateTodo({ onCloseModal, holderId, holderType }: AddTodoProps) {
  const isMobile = useIsMobileDevice()
  const { hasAccess } = useSubscription()
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
          if (!isMobile) textField.current?.focus()
        }, 200)
        onCloseModal?.()
      },
    })
  }

  return (
    <div className='relative'>
      <Blocker variant='inline' />
      <form
        onSubmit={onSaveHandler}
        className={cn(
          'sm:border sm:flex-row sm:items-center',
          'gap-1 w-full border-hairline sm:pr-1 rounded-md flex flex-col justify-end',
          onCloseModal && 'md:w-[90vw] lg:w-[800px]',
        )}
      >
        <div className='grow items-center rounded-md border border-hairline p-1 px-[3px] sm:flex sm:border-none sm:py-[2px]'>
          <div className='mb-2 shrink grow sm:mb-0'>
            <Input
              data-testid='input-create-todo'
              id='create-todo'
              autoFocus={!isMobile && hasAccess}
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
          <div className='flex items-end justify-between sm:items-center'>
            <AddHolderCombobox
              disabled={isCreating}
              selectedHolderId={selectedHolderId}
              setSelectedHolderId={setSelectedHolderId}
            />
            <div className='flex items-center gap-1 sm:mr-2 sm:gap-0'>
              <DayPicker disabled={isCreating} date={due} setDate={setDue} />
              {due && (
                <ButtonRemove
                  disabled={isCreating}
                  className='sm:translate-x-[-8px]'
                  onRemove={() => setDue(undefined)}
                />
              )}
            </div>
          </div>
        </div>

        <div className='mt-6 flex w-full flex-col items-center justify-end gap-3 sm:mt-0 sm:w-auto sm:flex-row'>
          <div className='flex w-full items-center gap-2 sm:w-auto'>
            <Button
              disabled={isCreating || !text || !hasAccess}
              type='submit'
              onClick={onSaveHandler}
              size='sm'
              className='w-full sm:ml-0 sm:w-auto'
            >
              Speichern
            </Button>
            {isCreating && <MiniLoader />}
          </div>

          <Button
            type='button'
            disabled={isCreating}
            className='w-full sm:w-auto'
            size='sm'
            variant='outline'
            onClick={() => onCloseModal?.()}
          >
            Abbrechen
          </Button>
        </div>
      </form>
      <p className='pl-2 pt-1 text-sm text-warning'>{error || ''}</p>
    </div>
  )
}

export default CreateTodo
