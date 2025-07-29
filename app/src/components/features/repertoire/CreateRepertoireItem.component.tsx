import type { PartialRepertoireItem } from '../../../types/types'
import { Button } from '@/components/ui/button'
import { DayPicker } from '@/components/ui/daypicker.component'
import { Input } from '@/components/ui/input'
import ButtonRemove from '@/components/ui/buttonRemove'
import { useCreateRepertoireItem } from './useCreateRepertoireItem'
import { useState } from 'react'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import CustomEditor from '@/components/ui/CustomEditor.component'
import { Blocker } from '../subscription/Blocker'
import { useSubscription } from '@/services/context/SubscriptionContext'
import useCurrentHolder from '../lessons/useCurrentHolder'
import { SaveAbortButtons } from '@/components/ui/SaveAbortButtonGroup'

type CreateRepertoireProps = {
  onCloseModal?: () => void
}

function CreateRepertoireItem({ onCloseModal }: CreateRepertoireProps) {
  const { hasAccess } = useSubscription()
  const { currentLessonHolder } = useCurrentHolder()
  const { createRepertoireItem, isCreating } = useCreateRepertoireItem()
  const isMobile = useIsMobileDevice()

  const fieldType = currentLessonHolder?.type === 's' ? 'studentId' : 'groupId'
  const holderId = currentLessonHolder?.holder.id || 0

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

  const handleChangeHTMLTitle = (e: string) => {
    setItem((prev) => ({ ...prev, title: e }))
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
      onSuccess: () => {
        onCloseModal?.()
        resetFields()
      },
    })
  }
  return (
    <div
      key={`${currentLessonHolder?.type}-${currentLessonHolder?.holder.id}`}
      className='relative mb-8 mt-6 flex items-end gap-2 sm:mb-12 sm:items-center'
    >
      <Blocker variant='inline' />
      <div className='grid grow grid-cols-[auto_auto_1fr] items-center gap-10 rounded-md border-hairline bg-background100 p-1 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-x-2 sm:gap-y-2 sm:border sm:pr-1'>
        <div className='relative col-span-5 grow sm:col-span-1 sm:w-auto sm:shrink'>
          <span className='absolute left-1 top-[-26px] text-sm text-foreground/80'>
            Song
          </span>
          {isMobile ? (
            <Input
              data-testid='input-create-repertoire'
              autoFocus={!isMobile}
              placeholder='Song...'
              className='sm:border-none'
              type='text'
              name='title'
              onChange={handleChangeTitle}
              value={item.title}
            />
          ) : (
            <CustomEditor
              type='mini'
              value={item.title}
              onChange={(e) => handleChangeHTMLTitle(e)}
            />
          )}
        </div>

        <div className='col-span-5 sm:col-span-1'>
          <div className='relative mr-2 flex items-center sm:mr-0'>
            <span className='absolute left-1 top-[-26px] inline text-sm text-foreground/80'>
              Start
            </span>
            <DayPicker date={item.startDate} setDate={handleChangeStart} />
            {item.startDate && (
              <ButtonRemove
                disabled={isCreating}
                className='translate-x-[-8px]'
                onRemove={() => handleChangeStart(undefined)}
              />
            )}
          </div>
        </div>
        <div className='relative col-span-5 flex items-center sm:col-span-1'>
          <span className='absolute left-1 top-[-26px] inline text-sm text-foreground/80 '>
            Ende
          </span>
          <DayPicker date={item.endDate} setDate={handleChangeEnd} />
          {item.endDate && (
            <ButtonRemove
              disabled={isCreating}
              className='translate-x-[-8px]'
              onRemove={() => handleChangeEnd(undefined)}
            />
          )}
        </div>
        {/* <Button */}
        {/*   className='col-span-5 ml-auto' */}
        {/*   onClick={handleSave} */}
        {/*   size='sm' */}
        {/*   disabled={isCreating || !item.title || !hasAccess} */}
        {/* > */}
        {/*   Hinzufügen */}
        {/* </Button> */}
        <div className='col-span-5'>
          <SaveAbortButtons
            isDisabledSaving={isCreating || !item.title || !hasAccess}
            isDisabledAborting={isCreating}
            isSaving={isCreating}
            onSave={handleSave}
            onAbort={onCloseModal}
          />
        </div>
      </div>
    </div>
  )
}

export default CreateRepertoireItem
