import AllLessonsSkeleton from '@/components/ui/skeletons/lessons/AllLessonsSkeleton.component'
import ErrorPage from '@/pages/Error'
import { useSearchParams } from 'react-router-dom'
import { useAllLessonsPerYear, useLessonYears } from '../lessonsQueries'
import useCurrentHolder from '../useCurrentHolder'
import AllLessonsTable from './allLessonsTable'

export default function AllLessons() {
  const [searchParams] = useSearchParams()
  const selectedYear = searchParams.get('year')
  const { currentLessonHolder } = useCurrentHolder()
  const { isPending: isPendingYears, isError: isErrorYears } = useLessonYears(
    currentLessonHolder?.holder.id || 0,
    currentLessonHolder?.type || 's',
  )

  const {
    data: lessons,
    isPending: isPendingLessons,
    isError: isErrorLessons,
    isFetching,
  } = useAllLessonsPerYear(
    Number(selectedYear) || 0,
    currentLessonHolder?.holder.id || 0,
    currentLessonHolder?.type || 's',
  )

  if (isPendingLessons || isPendingYears) return <AllLessonsSkeleton />
  if (isErrorLessons || isErrorYears) return <ErrorPage />

  if (!lessons) return null
  return <AllLessonsTable lessons={lessons} isFetching={isFetching} />
}
