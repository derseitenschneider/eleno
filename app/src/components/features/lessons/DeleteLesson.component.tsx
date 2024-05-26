import { useState } from "react"
import { useLessons } from "../../../services/context/LessonsContext"
import fetchErrorToast from "../../../hooks/fetchErrorToast"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"

interface DeleteLessonProps {
  onCloseModal?: () => void
  lessonId: number
}

function DeleteLesson({ lessonId, onCloseModal }: DeleteLessonProps) {
  const [isPending, setIsPending] = useState(false)
  const { deleteLesson } = useLessons()

  const handleDelete = async () => {
    try {
      setIsPending(true)
      await deleteLesson(lessonId)
      toast.success("Lektion gelöscht.")
      onCloseModal?.()
    } catch (err) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div>
      <p>Möchtest du diese Lektion wirklich löschen?</p>
      <div className='flex justify-end gap-4 mt-4'>
        <Button size='sm' variant='outline' onClick={onCloseModal}>
          Abbrechen
        </Button>
        <Button size='sm' variant='destructive' onClick={handleDelete}>
          Löschen
        </Button>
      </div>
    </div>
  )
}

export default DeleteLesson
