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
    <div className='mb-20 flex h-[calc(100%-100px-env(safe-area-inset-bottom))] flex-col overflow-hidden p-4 px-5 py-6 sm:mb-10 sm:h-[calc(100%-40px)] sm:py-4 sm:pl-6 sm:pr-4'>
      <RepertoireTable
        repertoire={repertoire}
        isFetching={isFetching}
        isPending={isPending}
      />
    </div>
  )
}

export default Repertoire
