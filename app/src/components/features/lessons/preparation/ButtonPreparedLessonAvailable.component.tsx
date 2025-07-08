import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { InfoIcon } from 'lucide-react'
import useCurrentHolder from '../useCurrentHolder'
import { usePreparedLessonsQuery } from '../lessonsQueries'

type ButtonPreparedLessonAvailableProps = {
  date: Date
}

export function ButtonPreparedLessonAvailable({
  date,
}: ButtonPreparedLessonAvailableProps) {
  const { currentLessonHolder } = useCurrentHolder()
  const { data: preparedLessons } = usePreparedLessonsQuery()

  const fieldType = currentLessonHolder?.type === 's' ? 'studentId' : 'groupId'

  const currentHolderPrepLessons = preparedLessons?.filter(
    (lesson) => lesson[fieldType] === currentLessonHolder?.holder.id,
  )

  const currentDatePrepLessons = currentHolderPrepLessons?.find(
    (lesson) => lesson.date.toDateString() === date.toDateString(),
  )

  if (!currentDatePrepLessons) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='ml-4 flex items-center gap-1 text-sm text-primary'>
        <InfoIcon className='size-4' />
        Geplante Lektion
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Einfügen</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
