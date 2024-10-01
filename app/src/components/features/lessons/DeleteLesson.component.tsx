import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { useDeleteLesson } from './useDeleteLesson'
import { DialogDescription } from '@/components/ui/dialog'

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
      <DialogDescription>
        Möchtest du diese Lektion wirklich löschen?
      </DialogDescription>
      <div className='flex justify-end gap-4 mt-4'>
        <Button
          disabled={isDeleting}
          size='sm'
          variant='outline'
          onClick={onCloseModal}
        >
          Abbrechen
        </Button>
        <div className='flex items-center gap-2'>
          <Button
            disabled={isDeleting}
            size='sm'
            variant='destructive'
            onClick={handleDelete}
          >
            Löschen
          </Button>
          {isDeleting && <MiniLoader />}
        </div>
      </div>
      {isError && (
        <p className='mt-4 text-center text-sm text-warning'>
          Es ist etwas schiefgelaufen. Versuch's nochmal.
        </p>
      )}
    </div>
  )
}

export default DeleteLesson
