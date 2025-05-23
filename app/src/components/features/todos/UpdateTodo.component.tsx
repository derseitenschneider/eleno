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
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { Blocker } from '../subscription/Blocker'
import { useSubscription } from '@/services/context/SubscriptionContext'

type UpdateTodoProps = {
  id: number
  onSuccess: () => void
}
export default function UpdateTodo({ id, onSuccess }: UpdateTodoProps) {
  const isMobile = useIsMobileDevice()
  const { hasAccess } = useSubscription()
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
      newTodo.studentId = null
      newTodo.groupId = null
    }
    updateTodo(newTodo, {
      onSuccess,
    })
  }

  return (
    <div className={cn(!hasAccess && 'h-[150px]', 'md:w-[90vw] lg:w-[800px]')}>
      <Blocker />
      <form
        onSubmit={onSaveHandler}
        className={cn(
          'sm:border sm:pr-1 rounded-md border-hairline sm:flex-row sm:items-center',
          'md:gap-1 w-full flex flex-col justify-end',
        )}
      >
        <div className='grow rounded-md border border-hairline p-1 sm:flex sm:items-center sm:border-none'>
          <div className='shrink grow'>
            <Input
              autoFocus={!isMobile}
              className='mb-2 border-none sm:mb-0'
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
          <div className='flex items-end justify-between sm:items-center'>
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
        <div className='flex items-center gap-2'>
          <Button
            disabled={isUpdating || !text || !hasAccess}
            type='submit'
            onClick={onSaveHandler}
            size='sm'
            className={cn('sm:mt-0 sm:ml-0', ' mt-2 ml-auto')}
          >
            Speichern
          </Button>
          {isUpdating && <MiniLoader />}
        </div>
      </form>
    </div>
  )
}
