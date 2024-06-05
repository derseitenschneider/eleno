/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useRepertoire } from "../../../../services/context/RepertoireContext"
import { useUser } from "../../../../services/context/UserContext"
import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import type { RepertoireItem } from "../../../../types/types"
import { formatDateToDatabase } from "../../../../utils/formateDate"
import "./addRepertoireItem.style.scss"
import { Button } from "@/components/ui/button"

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
    startDate: null,
    endDate: null,
  }
  const [item, setItem] = useState<RepertoireItem>(defaultItem)
  const [isPending, setIsPending] = useState(false)

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem((prev) => ({ ...prev, title: e.target.value }))
  }

  const handleChangeStart = (date: string) => {
    setItem((prev) => ({ ...prev, startDate: date }))
  }

  const handleChangeEnd = (date: string) => {
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
    <div className='repertoire-list__add'>
      <div
        className={`repertoire-list__inputs ${isPending ? "loading" : ""} ${isEditing ? "editing" : ""
          } `}
      >
        <span>Song</span>
        <span>Start</span>
        <span>Ende</span>

        <input
          type='text'
          name='title'
          onChange={handleChangeTitle}
          value={item.title}
          autoFocus={window.screen.width > 1366}
        />
        {/* <DatePicker */}
        {/*   selectedDate={ */}
        {/*     item.startDate */}
        {/*       ? new Date(formatDateToDatabase(item.startDate)) */}
        {/*       : null */}
        {/*   } */}
        {/*   setDate={handleChangeStart} */}
        {/*   id='start-date' */}
        {/* /> */}
        {/* <DatePicker */}
        {/*   selectedDate={ */}
        {/*     item.endDate ? new Date(formatDateToDatabase(item.endDate)) : null */}
        {/*   } */}
        {/*   setDate={handleChangeEnd} */}
        {/*   id='end-date' */}
        {/* /> */}
      </div>
      <Button
        type='button'
        className='btn-add'
        onClick={handleSave}
        disabled={isPending || isEditing || !item.title}
      >
        <span>Hinzufügen</span>
      </Button>
    </div>
  )
}

export default AddRepertoireItem
