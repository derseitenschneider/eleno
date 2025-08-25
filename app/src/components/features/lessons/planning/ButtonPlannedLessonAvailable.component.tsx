import { InfoIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useDrafts } from '@/services/context/DraftsContext'
import { usePlannedLessonsQuery } from '../lessonsQueries'
import useCurrentHolder from '../useCurrentHolder'

type ButtonPlannedLessonAvailableProps = {
  date: Date
}

export function ButtonPlannedLessonAvailable({
  date,
}: ButtonPlannedLessonAvailableProps) {
  const { currentLessonHolder } = useCurrentHolder()
  const { drafts, setDrafts } = useDrafts()
  const { data: plannedLessons } = usePlannedLessonsQuery()

  const fieldType = currentLessonHolder?.type === 's' ? 'studentId' : 'groupId'

  const currentHolderPlannedLesson = plannedLessons?.filter(
    (lesson) => lesson[fieldType] === currentLessonHolder?.holder.id,
  )

  const currentDatePlannedLessons = currentHolderPlannedLesson?.find(
    (lesson) => lesson.date.toDateString() === date.toDateString(),
  )

  const currentDraft = drafts.find(
    (draft) => draft[fieldType] === currentLessonHolder?.holder.id,
  )

  const isUsing = currentDatePlannedLessons?.id === currentDraft?.id

  function insertLesson() {
    if (currentDatePlannedLessons) {
      if (!currentLessonHolder) return
      const fieldType =
        currentLessonHolder.type === 's' ? 'studentId' : 'groupId'
      setDrafts((prev) => {
        const filteredDrafts = prev.filter(
          (draft) => draft[fieldType] !== currentLessonHolder.holder.id,
        )
        return [...filteredDrafts, currentDatePlannedLessons]
      })
      toast.success('Geplante Lektion eingefügt.')
    }
  }

  if (!currentDatePlannedLessons) return null
  if (isUsing) return null

  return (
    <Button
      className='flex items-center gap-1 px-0 font-normal text-primary md:px-3'
      variant='ghost'
      size='sm'
      onClick={insertLesson}
    >
      <InfoIcon className='size-4 text-primary' />
      <span className='text-primary'>Geplante Lektion einsetzten</span>
    </Button>
  )
}
