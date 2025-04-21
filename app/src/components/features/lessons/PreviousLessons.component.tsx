import { useLatestLessons } from './lessonsQueries'
import Empty from '@/components/ui/Empty.component'
import useCurrentHolder from './useCurrentHolder'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PreviousLessonItem } from './PreviousLessonItem.component'
import { NavLink } from 'react-router-dom'

function PreviousLessons() {
  const { data: lessons } = useLatestLessons()
  const { currentLessonHolder } = useCurrentHolder()

  const lessonField =
    currentLessonHolder?.type === 's' ? 'studentId' : 'groupId'

  const previousLessonsIds =
    lessons
      ?.sort((a, b) => {
        return +b.date - +a.date
      })
      .filter(
        (lesson) => lesson[lessonField] === currentLessonHolder?.holder.id,
      )
      ?.slice(0, 3)
      .map((lesson) => lesson.id) || []

  const newestLessonYear = lessons
    ?.filter(
      (lesson) => lesson?.[lessonField] === currentLessonHolder?.holder.id,
    )
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .at(0)
    ?.date.getFullYear()

  return (
    <div className='h-full overflow-hidden'>
      <div className='flex h-full flex-col px-5 pb-4 pt-6 sm:pl-6 lg:py-4 lg:pr-4'>
        <>
          <div className='mb-3 flex items-center justify-between'>
            <h5>Vergangene Lektionen</h5>
            {previousLessonsIds.length > 0 && (
              <NavLink to={`all?year=${newestLessonYear}`} end={true}>
                Alle anzeigen
              </NavLink>
            )}
          </div>
          <div className='overflow-hidden'>
            {previousLessonsIds.length > 0 ? (
              <ScrollArea className='h-full'>
                <div className='space-y-4 pb-12'>
                  {previousLessonsIds.map((lessonId) => (
                    <PreviousLessonItem key={lessonId} lessonId={lessonId} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <Empty
                className='!bg-background100 !shadow-none'
                emptyMessage='Keine Lektionen erfasst.'
              />
            )}
          </div>
        </>
      </div>
    </div>
  )
}

export default PreviousLessons
