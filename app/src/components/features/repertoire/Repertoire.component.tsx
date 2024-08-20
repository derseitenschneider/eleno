import { RepertoireProvider } from '../../../services/context/RepertoireContext'
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
    <RepertoireProvider>
      <RepertoireTable
        repertoire={repertoire}
        isFetching={isFetching}
        isPending={isPending}
      />
    </RepertoireProvider>
  )
}

export default Repertoire
