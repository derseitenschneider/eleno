import { useState } from "react"
import { useLessons } from "../../../services/context/LessonsContext"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import MiniLoader from "@/components/ui/MiniLoader.component"
import fetchErrorToast from "@/hooks/fetchErrorToast"

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
      onCloseModal?.()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div>
      <p>Möchtest du diese Lektion wirklich löschen?</p>
      <div className='flex justify-end gap-4 mt-4'>
        <Button
          disabled={isPending}
          size='sm'
          variant='outline'
          onClick={onCloseModal}
        >
          Abbrechen
        </Button>
        <div className='flex items-center gap-2'>
          <Button
            disabled={isPending}
            size='sm'
            variant='destructive'
            onClick={handleDelete}
          >
            Löschen
          </Button>
          {isPending && <MiniLoader />}
        </div>
      </div>
    </div>
  )
}

export default DeleteLesson
