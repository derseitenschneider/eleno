import { Button } from '@/components/ui/button'
import ButtonRemove from '@/components/ui/buttonRemove'
import { DayPicker } from '@/components/ui/daypicker.component'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { RepertoireItem } from '../../../types/types'
import { useUpdateRepertoireItem } from './useUpdateRepertoireItem'
import CustomEditor from '@/components/ui/CustomEditor.component'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { Blocker } from '../subscription/Blocker'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { Separator } from '@/components/ui/separator'

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
      <div className='grid grow grid-cols-[auto_auto_1fr] items-center gap-y-16 rounded-md border-hairline p-1 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-x-2 sm:gap-y-2 sm:border sm:pr-1'>
        <div className='relative col-span-5 grow sm:col-span-1 sm:w-auto sm:shrink'>
          <span className='absolute left-1 top-[-26px] text-sm text-foreground/80'>
            Titel
          </span>
          <CustomEditor
            type='mini'
            value={item.title}
            onChange={(e) => setItem((prev) => ({ ...prev, title: e }))}
          />
        </div>

        <div className='col-span-5 sm:col-span-1'>
          <div className='relative flex items-center gap-1 sm:gap-0 '>
            <span className='absolute left-1 top-[-26px] inline text-sm text-foreground/80'>
              Start
            </span>
            <DayPicker
              className='w-full'
              date={item.startDate}
              setDate={handleChangeStart}
            />
            {item.startDate && (
              <ButtonRemove
                disabled={isUpdating}
                className='sm:translate-x-[-8px]'
                onRemove={() => handleChangeStart(undefined)}
              />
            )}
          </div>
        </div>
        <div className='col-span-5 sm:col-span-1'>
          <div className='relative flex items-center gap-1 sm:gap-0 '>
            <span className='absolute left-1 top-[-26px] inline text-sm text-foreground/80'>
              Ende
            </span>
            <DayPicker
              className='w-full'
              date={item.endDate}
              setDate={handleChangeEnd}
            />
            {item.endDate && (
              <ButtonRemove
                disabled={isUpdating}
                className='sm:translate-x-[-8px]'
                onRemove={() => handleChangeEnd(undefined)}
              />
            )}
          </div>
        </div>
        <div className='relative col-span-5 mt-[-24px] flex w-full flex-col items-center gap-3 sm:col-span-1 sm:mt-0 sm:w-auto sm:flex-row'>
          <Separator className='absolute top-[-20px] w-full sm:hidden' />
          <Button
            className='ml-auto w-full'
            onClick={handleSave}
            size='sm'
            disabled={isUpdating || !item.title}
          >
            Speichern
          </Button>
          {isUpdating && <MiniLoader />}
          {isMobile && onCloseModal && (
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={onCloseModal}
              className='w-full'
            >
              Abbrechen
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default UpdateRepertoireItem
