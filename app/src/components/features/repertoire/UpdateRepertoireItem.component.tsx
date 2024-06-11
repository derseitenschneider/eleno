import { Button } from "@/components/ui/button"
import ButtonRemove from "@/components/ui/buttonRemove/ButtonRemove"
import { DayPicker } from "@/components/ui/daypicker.component"
import { Input } from "@/components/ui/input"
import MiniLoader from "@/components/ui/MiniLoader.component"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import type { RepertoireItem } from "../../../types/types"
import { useUpdateRepertoireItem } from "./useUpdateRepertoireItem"

interface EditRepertoireItemProps {
  itemId: number
  studentId: number
  onCloseModal?: () => void
}

function EditRepertoireItem({
  itemId,
  studentId,
  onCloseModal,
}: EditRepertoireItemProps) {
  const queryClient = useQueryClient()

  const repertoire = queryClient.getQueryData(["repertoire", { studentId }]) as
    | Array<RepertoireItem>
    | undefined

  const itemToEdit = repertoire?.find((item) => item.id === itemId)

  const [item, setItem] = useState<RepertoireItem | undefined>(itemToEdit)

  const { updateRepertoireItem, isUpdating } = useUpdateRepertoireItem()

  if (!item) return null

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
    if (!item) return
    updateRepertoireItem(item, {
      onSuccess: () => onCloseModal?.(),
    })
  }

  return (
    <div className='flex gap-2 py-4'>
      <div className='flex bg-background50 gap-2 grow'>
        <div className='shrink grow'>
          <Input
            placeholder='Song'
            className='border-none min-w-[500px] '
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
                disabled={isUpdating}
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
              disabled={isUpdating}
              className='translate-x-[-8px]'
              onRemove={() => handleChangeEnd(undefined)}
            />
          )}
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button disabled={isUpdating} size='sm' onClick={handleSave}>
          Speichern
        </Button>
        {isUpdating && <MiniLoader />}
      </div>
    </div>
  )
}

export default EditRepertoireItem
