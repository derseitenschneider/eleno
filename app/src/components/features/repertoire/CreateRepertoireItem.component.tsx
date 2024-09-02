import type { PartialRepertoireItem } from '../../../types/types'
import { Button } from '@/components/ui/button'
import { DayPicker } from '@/components/ui/daypicker.component'
import { Input } from '@/components/ui/input'
import ButtonRemove from '@/components/ui/buttonRemove'
import { useCreateRepertoireItem } from './useCreateRepertoireItem'
import { useState } from 'react'

interface AddRepertoireItemProps {
  holderId: number
  holderType: 's' | 'g'
}

function CreateRepertoireItem({
  holderId,
  holderType,
}: AddRepertoireItemProps) {
  const { createRepertoireItem, isCreating } = useCreateRepertoireItem()

  const fieldType = holderType === 's' ? 'studentId' : 'groupId'

  const defaultItem: PartialRepertoireItem = {
    [fieldType]: holderId,
    title: '',
    startDate: undefined,
    endDate: undefined,
  }

  const [item, setItem] = useState(defaultItem)

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem((prev) => ({ ...prev, title: e.target.value }))
  }

  const handleChangeStart = (date: Date | undefined) => {
    setItem((prev) => ({ ...prev, startDate: date }))
  }

  const handleChangeEnd = (date: Date | undefined) => {
    setItem((prev) => ({ ...prev, endDate: date }))
  }

  function resetFields() {
    setItem(defaultItem)
  }

  function handleSave() {
    createRepertoireItem(item, {
      onSuccess: () => resetFields(),
    })
  }
  return (
    <div className='flex gap-2 items-end sm:items-center sm:mb-12 mb-8 mt-6'>
      <div className='grid sm:grid-cols-[1fr_auto_auto_auto] sm:gap-x-2 p-1 grid-cols-[auto_auto_1fr] rounded-md items-center sm:pr-1 border-hairline border gap-y-2 grow'>
        <div className='relative sm:col-span-1 col-span-4 sm:w-auto sm:shrink grow'>
          <span className='hidden sm:block absolute left-1 top-[-26px] text-foreground/80 text-sm'>
            Song
          </span>
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
          <div className='flex mr-2 sm:mr-0 relative items-center'>
            <span className='absolute hidden sm:inline left-1 top-[-26px] text-foreground/80 text-sm'>
              Start
            </span>
            <DayPicker
              className='block'
              date={item.startDate}
              setDate={handleChangeStart}
            />
            {item.startDate && (
              <ButtonRemove
                disabled={isCreating}
                className='translate-x-[-8px]'
                onRemove={() => handleChangeStart(undefined)}
              />
            )}
          </div>
        </div>
        <div className='flex items-center relative'>
          <span className='hidden sm:inline absolute left-1 top-[-26px] text-foreground/80 text-sm'>
            Ende
          </span>
          <DayPicker
            className='block'
            date={item.endDate}
            setDate={handleChangeEnd}
          />
          {item.endDate && (
            <ButtonRemove
              disabled={isCreating}
              className='translate-x-[-8px]'
              onRemove={() => handleChangeEnd(undefined)}
            />
          )}
        </div>
        <Button
          className='ml-auto'
          onClick={handleSave}
          size='sm'
          disabled={isCreating || !item.title}
        >
          Hinzufügen
        </Button>
      </div>
    </div>
  )
}

export default CreateRepertoireItem
