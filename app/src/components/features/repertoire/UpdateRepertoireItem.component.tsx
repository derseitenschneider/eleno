import { Button } from '@/components/ui/button'
import ButtonRemove from '@/components/ui/buttonRemove'
import { DayPicker } from '@/components/ui/daypicker.component'
import { Input } from '@/components/ui/input'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { RepertoireItem } from '../../../types/types'
import { useUpdateRepertoireItem } from './useUpdateRepertoireItem'

interface UpdateRepertoireItemProps {
  itemId: number
  holder: string
  onCloseModal?: () => void
}

function UpdateRepertoireItem({
  itemId,
  holder,
  onCloseModal,
}: UpdateRepertoireItemProps) {
  const queryClient = useQueryClient()

  const { updateRepertoireItem, isUpdating } = useUpdateRepertoireItem()
  const repertoire = queryClient.getQueryData(['repertoire', { holder }]) as
    | Array<RepertoireItem>
    | undefined

  const itemToEdit = repertoire?.find((item) => item.id === itemId)

  if (!itemToEdit) return null
  const [item, setItem] = useState<RepertoireItem>(itemToEdit)

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem((prev) => ({ ...prev, title: e.target.value }))
  }

  const handleChangeStart = (date: Date | undefined) => {
    setItem((prev) => ({ ...prev, startDate: date }))
  }

  const handleChangeEnd = (date: Date | undefined) => {
    setItem((prev) => ({ ...prev, endDate: date }))
  }

  function handleSave() {
    updateRepertoireItem(item, {
      onSuccess: () => onCloseModal?.(),
    })
  }

  return (
    <div className='md:min-w-[700px] lg:min-w-[800px] flex gap-2 items-end sm:items-center'>
      <div className='grid sm:grid-cols-[1fr_auto_auto_auto] sm:gap-x-2 p-1 grid-cols-[auto_auto_1fr] rounded-md items-center sm:pr-1 border-hairline border gap-y-2 grow'>
        <div className='relative sm:col-span-1 col-span-4 sm:w-auto sm:shrink grow'>
          <Input
            autoFocus={window.innerWidth > 1024}
            placeholder='Song...'
            className='border-none'
            type='text'
            name='title'
            onChange={handleChangeTitle}
            value={item.title}
          />
        </div>

        <div>
          <div className='flex relative mr-2 sm:mr-0 items-center'>
            <DayPicker
              className='block'
              date={item.startDate}
              setDate={handleChangeStart}
            />
            {item.startDate && (
              <ButtonRemove
                disabled={isUpdating}
                className='translate-x-[-8px]'
                onRemove={() => handleChangeStart(undefined)}
              />
            )}
          </div>
        </div>
        <div className='flex items-center relative'>
          <DayPicker
            className='block'
            date={item.endDate}
            setDate={handleChangeEnd}
          />
          {item.endDate && (
            <ButtonRemove
              disabled={isUpdating}
              className='translate-x-[-8px]'
              onRemove={() => handleChangeEnd(undefined)}
            />
          )}
        </div>
        <Button
          className='ml-auto'
          onClick={handleSave}
          size='sm'
          disabled={isUpdating || !item.title}
        >
          Hinzufügen
        </Button>
      </div>
    </div>
  )
}

export default UpdateRepertoireItem
