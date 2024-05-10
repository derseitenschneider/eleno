import "./deleteRepertoireItem.style.scss"
import { useState } from "react"
import { toast } from "react-toastify"
import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import { useRepertoire } from "../../../../services/context/RepertoireContext"

interface DeleteRepertoireItemProps {
  itemId: number
  onCloseModal?: () => void
}

function DeleteRepertoireItem({
  itemId,
  onCloseModal,
}: DeleteRepertoireItemProps) {
  const [isPending, setIsPending] = useState(false)
  const { repertoire, deleteRepertoireItem } = useRepertoire()
  const { title } = repertoire.find((item) => item.id === itemId)

  const handleDelete = async () => {
    setIsPending(true)
    try {
      await deleteRepertoireItem(itemId)
      toast("Song entfernt.")
      onCloseModal?.()
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }
  return (
    <div className={`delete-repertoire-item ${isPending ? "loading" : ""}`}>
      <h2 className='heading-2'>Song entfernen</h2>

      <p>
        Möchtest du den Song <b>«{title}»</b> wirklich aus dem Repertoire
        entfernen?
      </p>
      <div className='delete-repertoire-item__buttons'>
        <Button
          type='button'
          btnStyle='secondary'
          handler={onCloseModal}
          label='Abbrechen'
        />
        <Button
          type='button'
          btnStyle='danger'
          handler={handleDelete}
          label='Entfernen'
        />
      </div>
    </div>
  )
}

export default DeleteRepertoireItem
