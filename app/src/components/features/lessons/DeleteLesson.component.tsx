import { deleteLessonAPI } from "@/services/api/lessons.api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import MiniLoader from "@/components/ui/MiniLoader.component"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Lesson } from "@/types/types"
import { deleteLessonMutation } from "./lessonsMutations"

interface DeleteLessonProps {
  onCloseModal?: () => void
  lesson: Lesson
}

function DeleteLesson({ lesson, onCloseModal }: DeleteLessonProps) {
  const {
    mutate: handleDelete,
    isPending,
    error,
  } = deleteLessonMutation(lesson.id, onCloseModal)

  return (
    <div>
      <p>Möchtest du diese Lektion wirklich löschen?</p>
      <div className='flex justify-center gap-4 mt-4'>
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
