import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useUser } from "../../../services/context/UserContext"
import type { RepertoireItem } from "../../../types/types"
import { Button } from "@/components/ui/button"
import { DayPicker } from "@/components/ui/daypicker.component"
import { Input } from "@/components/ui/input"
import ButtonRemove from "@/components/ui/buttonRemove/ButtonRemove"
import { createRepertoireItemMutation } from "./mutations/createRepertoireItemMutation"

interface AddRepertoireItemProps {
  studentId: number
}

function AddRepertoireItem({ studentId }: AddRepertoireItemProps) {
  const { user } = useUser()

  const defaultItem: RepertoireItem = {
    studentId,
    user_id: user?.id,
    title: "",
  }
  const [item, setItem] = useState<RepertoireItem>(defaultItem)

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
  const { mutate: handleSave, isPending } = createRepertoireItemMutation(
    item,
    resetFields,
  )

  return (
    <div className='flex  gap-1 mb-12 mt-6'>
      <div className='flex bg-background50 gap-4 grow'>
        <div className='shrink grow'>
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
                disabled={isPending}
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
              disabled={isPending}
              className='translate-x-[-8px]'
              onRemove={() => handleChangeEnd(undefined)}
            />
          )}
        </div>
      </div>
      <Button
        onClick={() => handleSave()}
        size='sm'
        disabled={isPending || !item.title}
      >
        Hinzufügen
      </Button>
    </div>
  )
}

export default AddRepertoireItem
