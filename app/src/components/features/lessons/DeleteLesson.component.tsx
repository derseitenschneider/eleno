import { Button } from "@/components/ui/button"
import MiniLoader from "@/components/ui/MiniLoader.component"
import { deleteLessonMutation } from "./mutations/deleteLessonMutation"

interface DeleteLessonProps {
  onCloseModal?: () => void
  lessonId: number
}

function DeleteLesson({ lessonId, onCloseModal }: DeleteLessonProps) {
  const {
    mutate: handleDelete,
    isPending,
    error,
  } = deleteLessonMutation(lessonId, onCloseModal)

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
            onClick={() => handleDelete()}
          >
            Löschen
          </Button>
          {isPending && <MiniLoader />}
        </div>
      </div>
      {error && (
        <p className='mt-4 text-center text-sm text-warning'>
          Es ist etwas schiefgelaufen. Versuch's nochmal.
        </p>
      )}
    </div>
  )
}

export default DeleteLesson
