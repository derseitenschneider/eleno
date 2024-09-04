import RepertoireTable from './repertoireTable/repertoireTable.component'
import useCurrentHolder from '../lessons/useCurrentHolder'
import { useRepertoireQuery } from './repertoireQueries'
import ErrorPage from '@/pages/Error'
import RepertoireSkeleton from '@/components/ui/skeletons/lessons/RepertoireSkeleton.component'

function Repertoire() {
  const { currentLessonHolder } = useCurrentHolder()
  const {
    data: repertoire,
    isPending,
    isError,
    isFetching,
  } = useRepertoireQuery(
    currentLessonHolder?.holder?.id || 0,
    currentLessonHolder?.type || 's',
  )

  if (isError) return <ErrorPage />
  if (isPending) return <RepertoireSkeleton />

  return (
    <RepertoireTable
      repertoire={repertoire}
      isFetching={isFetching}
      isPending={isPending}
    />
  )
}

export default Repertoire
