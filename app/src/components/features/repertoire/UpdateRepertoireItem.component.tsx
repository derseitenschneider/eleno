import { Button } from '@/components/ui/button'
import ButtonRemove from '@/components/ui/buttonRemove'
import { DayPicker } from '@/components/ui/daypicker.component'
import { Input } from '@/components/ui/input'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { RepertoireItem } from '../../../types/types'
import { useUpdateRepertoireItem } from './useUpdateRepertoireItem'
import { DialogDescription } from '@/components/ui/dialog'
import CustomEditor from '@/components/ui/CustomEditor.component'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { Blocker } from '../subscription/Blocker'

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
  const isMobile = useIsMobileDevice()

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
    <div className='relative flex items-end gap-2 pb-10 sm:items-center md:min-w-[700px] lg:min-w-[800px]'>
      <Blocker variant='inline' />
      <div className='grid grow grid-cols-[auto_auto_1fr] items-center gap-y-2 rounded-md border border-hairline p-1 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-x-2 sm:pr-1'>
        <div className='relative col-span-4 grow sm:col-span-1 sm:w-auto sm:shrink'>
          <DialogDescription className='hidden'>
            Bearbeite den Song
          </DialogDescription>
          {isMobile ? (
            <Input
              placeholder='Song...'
              className='border-none'
              type='text'
              name='title'
              onChange={handleChangeTitle}
              value={item.title}
            />
          ) : (
            <CustomEditor
              type='mini'
              value={item.title}
              onChange={(e) => setItem((prev) => ({ ...prev, title: e }))}
            />
          )}
        </div>

        <div>
          <div className='relative mr-2 flex items-center sm:mr-0'>
            <DayPicker date={item.startDate} setDate={handleChangeStart} />
            {item.startDate && (
              <ButtonRemove
                disabled={isUpdating}
                className='translate-x-[-8px]'
                onRemove={() => handleChangeStart(undefined)}
              />
            )}
          </div>
        </div>
        <div className='relative flex items-center'>
          <DayPicker date={item.endDate} setDate={handleChangeEnd} />
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
          Speichern
        </Button>
      </div>
    </div>
  )
}

export default UpdateRepertoireItem
