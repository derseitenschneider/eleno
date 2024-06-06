/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useRepertoire } from "../../../../services/context/RepertoireContext"
import { useUser } from "../../../../services/context/UserContext"
import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import type { RepertoireItem } from "../../../../types/types"
import { formatDateToDatabase } from "../../../../utils/formateDate"
import { Button } from "@/components/ui/button"
import { DayPicker } from "@/components/ui/daypicker.component"
import { Input } from "@/components/ui/input"

interface AddRepertoireItemProps {
  studentId: number
}

function AddRepertoireItem({ studentId }: AddRepertoireItemProps) {
  const { addRepertoireItem } = useRepertoire()
  const { user } = useUser()

  const [searchParams] = useSearchParams()

  const isEditing = !!searchParams.get("edit")

  const defaultItem: RepertoireItem = {
    studentId,
    user_id: user?.id,
    title: "",
  }
  const [item, setItem] = useState<RepertoireItem>(defaultItem)
  const [isPending, setIsPending] = useState(false)

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem((prev) => ({ ...prev, title: e.target.value }))
  }

  const handleChangeStart = (date: Date | undefined) => {
    setItem((prev) => ({ ...prev, startDate: date }))
  }

  const handleChangeEnd = (date: Date | undefined) => {
    setItem((prev) => ({ ...prev, endDate: date }))
  }

  const handleSave = async () => {
    try {
      setIsPending(true)
      await addRepertoireItem(item)
      setItem(defaultItem)
      toast("Song hinzugefügt")
    } catch (err) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className='flex items-end gap-5 mb-12'>
      <div className='grid  grid-cols-[1fr_auto_auto] flex-1'>
        <div>
          <span className='text-sm'>Song</span>
          <Input
            type='text'
            name='title'
            onChange={handleChangeTitle}
            value={item.title}
          />
        </div>

        <div>
          <span className='text-sm'>Start</span>
          <DayPicker
            className='block'
            date={item.startDate}
            setDate={handleChangeStart}
          />
        </div>
        <div>
          <span>Ende</span>
          <DayPicker
            className='block'
            date={item.endDate}
            setDate={handleChangeEnd}
          />
        </div>
      </div>
      <Button
        onClick={handleSave}
        size='sm'
        disabled={isPending || isEditing || !item.title}
      >
        Hinzufügen
      </Button>
    </div>
  )
}

export default AddRepertoireItem
