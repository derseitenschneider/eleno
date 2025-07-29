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
      <div className='mt-4 flex flex-col-reverse justify-end gap-4 sm:flex-row'>
        <Button
          disabled={isDeleting}
          size='sm'
          variant='outline'
          onClick={onCloseModal}
        >
          Abbrechen
        </Button>
        <div className='flex w-full items-center gap-2 sm:w-auto'>
          <Button
            className='w-full'
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
