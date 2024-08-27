import { Button } from '@/components/ui/button'
import ButtonRemove from '@/components/ui/buttonRemove'
import { DayPicker } from '@/components/ui/daypicker.component'
import { Input } from '@/components/ui/input'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { RepertoireItem } from '../../../types/types'
import { useUpdateRepertoireItem } from './useUpdateRepertoireItem'

interface EditRepertoireItemProps {
  itemId: number
  holder: string
  onCloseModal?: () => void
}

function EditRepertoireItem({
  itemId,
  holder,
  onCloseModal,
}: EditRepertoireItemProps) {
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
    <div className='flex gap-2 py-4'>
      <div className='grid grid-cols-[auto_auto_1fr] sm:gap-x-2 sm:grid-cols-[1fr_auto_auto_auto] gap-y-2 bg-background50 justify-between grow'>
        <div className='relative shrink grow col-span-4 sm:col-span-1'>
          <span className='hidden sm:inline absolute left-1 top-[-24px] text-foreground/80 text-sm'>
            Song
          </span>
          <Input
            placeholder='Song'
            className='border-none sm:min-w-[500px] '
            type='text'
            name='title'
            onChange={handleChangeTitle}
            value={item.title}
          />
        </div>

        <div className='flex relative items-center ml-2 sm:ml-0 mb-2 sm:mb-0'>
          <span className='hidden sm:inline absolute left-1 top-[-24px] text-foreground/80 text-sm'>
            Start
          </span>
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
        <div className='flex items-center relative mb-2 sm:mb-0'>
          <span className='hidden sm:inline absolute left-1 top-[-24px] text-foreground/80 text-sm'>
            Ende
          </span>
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
        <div className='flex items-center gap-2 mr-2 sm:mr-0 mb-2 sm:mb-0 ml-auto sm:ml-0'>
          <Button disabled={isUpdating} size='sm' onClick={handleSave}>
            Speichern
          </Button>
          {isUpdating && <MiniLoader />}
        </div>
      </div>
    </div>
  )
}

export default EditRepertoireItem
