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
    <div className='flex  gap-2 mb-12 mt-6'>
      <div className='flex rounded-md items-center pr-1 bg-background50 gap-2 grow'>
        <div className='relative shrink grow'>
          <span className='absolute left-1 top-[-24px] text-foreground/80 text-sm'>
            Song
          </span>
          <Input
            placeholder='Song'
            className='border-none'
            type='text'
            name='title'
            onChange={handleChangeTitle}
            value={item.title}
          />
        </div>

        <div>
          <div className='flex relative items-center'>
            <span className='absolute left-1 top-[-24px] text-foreground/80 text-sm'>
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
          <span className='absolute left-1 top-[-24px] text-foreground/80 text-sm'>
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
      </div>
      <Button
        onClick={handleSave}
        size='sm'
        disabled={isCreating || !item.title}
      >
        Hinzufügen
      </Button>
    </div>
  )
}

export default CreateRepertoireItem
