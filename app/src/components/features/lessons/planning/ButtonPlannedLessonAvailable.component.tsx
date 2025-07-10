import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { InfoIcon } from 'lucide-react'
import useCurrentHolder from '../useCurrentHolder'
import { usePlannedLessonsQuery } from '../lessonsQueries'
import { useDrafts } from '@/services/context/DraftsContext'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

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
      setDrafts((prev) => [...prev, currentDatePlannedLessons])
      toast('Geplante Lektion eingefügt.')
    }
  }

  if (!currentDatePlannedLessons) return null
  if (isUsing) return null

  return (
    <Button
      className='flex items-center gap-1 font-normal text-primary'
      variant='ghost'
      size='sm'
      onClick={insertLesson}
    >
      <InfoIcon className='size-4 text-primary' />
      <span className='text-primary'>Geplante Lektion einsetzten</span>
    </Button>
  )
}
