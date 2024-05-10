import { useState } from "react"
import { toast } from "react-toastify"
import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import { useRepertoire } from "../../../../services/context/RepertoireContext"
import type { RepertoireItem } from "../../../../types/types"
import { formatDateToDatabase } from "../../../../utils/formateDate"
import "./editRepertoireItem.style.scss"

interface EditRepertoireItemProps {
  itemId: number
  onCloseModal?: () => void
}

function EditRepertoireItem({ itemId, onCloseModal }: EditRepertoireItemProps) {
  const { repertoire, updateRepertoireItem } = useRepertoire()
  const [isPending, setIsPending] = useState(false)
  const currentItem = repertoire.find((item) => item.id === itemId)
  const [input, setInput] = useState<RepertoireItem>(currentItem)

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setInput((prev) => ({ ...prev, title }))
  }

  const handleStartDate = (date: string) => {
    setInput((prev) => ({ ...prev, startDate: date }))
  }

  const handleEndDate = (date: string) => {
    setInput((prev) => ({ ...prev, endDate: date }))
  }

  const handleSave = async () => {
    setIsPending(true)
    try {
      await updateRepertoireItem(input)
      onCloseModal?.()
      toast("Änderungen gespeichert.")
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={`edit-repertoire-item${isPending ? " loading" : ""}`}>
      <h2 className='heading-2'>Song bearbeiten</h2>
      <div className='edit-repertoire-item__row labels'>
        <span>Titel</span>
        <span>Startdatum</span>
        <span>Enddatum</span>
      </div>
      <div className='edit-repertoire-item__row'>
        <input type='text' value={input.title} onChange={handleTitle} />
        <DatePicker
          setDate={handleStartDate}
          id='start-time'
          selectedDate={
            input.startDate
              ? new Date(formatDateToDatabase(input.startDate))
              : null
          }
        />
        <DatePicker
          setDate={handleEndDate}
          id='start-time'
          selectedDate={
            input.endDate ? new Date(formatDateToDatabase(input.endDate)) : null
          }
        />
      </div>
      <div className='edit-repertoire-item__buttons'>
        <Button type='button' btnStyle='secondary' onClick={onCloseModal}>
          Abbrechen
        </Button>
        <Button type='button' btnStyle='primary' onClick={handleSave}>
          Speichern
        </Button>
      </div>
    </div>
  )
}

export default EditRepertoireItem
