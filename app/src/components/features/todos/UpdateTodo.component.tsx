import { Input } from '@/components/ui/input'
import AddHolderCombobox from '../students/AddHolderCombobox.component'
import { DayPicker } from '@/components/ui/daypicker.component'
import ButtonRemove from '@/components/ui/buttonRemove'
import { Button } from '@/components/ui/button'
import { useUpdateTodo } from './useUpdateTodo'
import { useQueryClient } from '@tanstack/react-query'
import type { TTodoItem } from '@/types/types'
import { useState } from 'react'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { cn } from '@/lib/utils'

type UpdateTodoProps = {
  id: number
  onSuccess: () => void
}
export default function UpdateTodo({ id, onSuccess }: UpdateTodoProps) {
  const queryClient = useQueryClient()
  const { updateTodo, isUpdating } = useUpdateTodo()
  const todos = queryClient.getQueryData(['todos']) as
    | Array<TTodoItem>
    | undefined

  const currentTodo = todos?.find((todo) => todo.id === id)
  const currentHolderId = currentTodo?.studentId
    ? `s-${currentTodo.studentId}`
    : currentTodo?.groupId
      ? `g-${currentTodo.groupId}`
      : ''

  const [text, setText] = useState(currentTodo?.text || '')
  const [selectedHolderId, setSelectedHolderId] = useState(currentHolderId)
  const [due, setDue] = useState(currentTodo?.due)

  async function onSaveHandler(e: React.FormEvent) {
    e.preventDefault()
    if (!currentTodo) return null

    const fieldName = selectedHolderId?.includes('s')
      ? 'studentId'
      : selectedHolderId.includes('g')
        ? 'groupId'
        : null

    const fieldId = Number(selectedHolderId?.split('-').at(1))
    const newTodo: TTodoItem = { ...currentTodo, text, due }
    if (fieldName) {
      newTodo[fieldName] = fieldId
    } else {
    }
    updateTodo(newTodo, {
      onSuccess,
    })
  }

  return (
    <div className='sm:min-w-[600px]'>
      <form
        onSubmit={onSaveHandler}
        className={cn(
          'sm:flex-row sm:items-center sm:bg-background50',
          'gap-1 w-full flex flex-col justify-end',
        )}
      >
        <div className='sm:flex bg-background50 grow'>
          <div className='shrink grow mb-4 sm:mb-0'>
            <Input
              autoFocus={window.innerWidth > 800}
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
              disabled={isUpdating}
            />
          </div>
          <div className='flex justify-between'>
            <AddHolderCombobox
              disabled={isUpdating}
              selectedHolderId={selectedHolderId}
              setSelectedHolderId={setSelectedHolderId}
            />
            <div className='flex items-center'>
              <DayPicker disabled={isUpdating} date={due} setDate={setDue} />
              {due && (
                <ButtonRemove
                  disabled={isUpdating}
                  className='translate-x-[-8px]'
                  onRemove={() => setDue(undefined)}
                />
              )}
            </div>
          </div>
        </div>
        <Button
          disabled={isUpdating}
          type='submit'
          onClick={onSaveHandler}
          size='sm'
          className={cn('sm:mt-0 sm:ml-0', ' mt-2 ml-auto')}
        >
          Speichern
        </Button>
        {isUpdating && <MiniLoader />}
      </form>
    </div>
  )
}
