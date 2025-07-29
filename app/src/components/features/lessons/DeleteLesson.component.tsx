import { useDeleteLesson } from './useDeleteLesson'
import { DialogDescription } from '@/components/ui/dialog'
import { DeleteAbortButtons } from '@/components/ui/DeleteAbortButtonGroup'

interface DeleteLessonProps {
  onCloseModal?: () => void
  lessonId: number
}

function DeleteLesson({ lessonId, onCloseModal }: DeleteLessonProps) {
  const { deleteLesson, isDeleting, isError } = useDeleteLesson()

  function handleDelete() {
    deleteLesson(lessonId, {
      onSuccess: () => onCloseModal?.(),
    })
  }
  return (
    <div>
      <DialogDescription className='mb-4'>
        Möchtest du diese Lektion wirklich löschen?
      </DialogDescription>
      <DeleteAbortButtons
        onDelete={handleDelete}
        onAbort={onCloseModal}
        isDisabled={isDeleting}
        isDeleting={isDeleting}
      />
      {isError && (
        <p className='mt-4 text-center text-sm text-warning'>
          Es ist etwas schiefgelaufen. Versuch's nochmal.
        </p>
      )}
    </div>
  )
}

export default DeleteLesson
