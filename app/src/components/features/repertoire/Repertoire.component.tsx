import RepertoireTable from './repertoireTable/repertoireTable.component'
import useCurrentHolder from '../lessons/useCurrentHolder'
import { useRepertoireQuery } from './repertoireQueries'

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
  if (isError) return <p>ERROR</p>
  if (!repertoire) return null

  return (
    <RepertoireTable
      repertoire={repertoire}
      isFetching={isFetching}
      isPending={isPending}
    />
  )
}

export default Repertoire
