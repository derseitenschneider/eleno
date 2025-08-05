import { useLatestLessons } from './lessonsQueries'
import Empty from '@/components/ui/Empty.component'
import useCurrentHolder from './useCurrentHolder'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LessonItem } from './LessonItem.component'
import { NavLink } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { LessonItemMobile } from './PreviousLessonItemMobile.component'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
type PreviousLessonsProps = {
  layout: 'regular' | 'reverse'
}
function PreviousLessons({ layout }: PreviousLessonsProps) {
  const { data: lessons } = useLatestLessons()
  const isMobile = useIsMobileDevice()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { currentLessonHolder } = useCurrentHolder()

  useEffect(() => {
    if (currentLessonHolder && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [currentLessonHolder])

  const lessonField =
    currentLessonHolder?.type === 's' ? 'studentId' : 'groupId'

  const previousLessonsSortedFiltered = lessons
    ?.sort((a, b) => {
      return +b.date - +a.date
    })
    ?.filter((lesson) => lesson.status === 'documented')
    .filter((lesson) => lesson[lessonField] === currentLessonHolder?.holder.id)
    ?.slice(0, 3)

  const newestLessonYear = lessons
    ?.filter(
      (lesson) => lesson?.[lessonField] === currentLessonHolder?.holder.id,
    )
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .at(0)
    ?.date.getFullYear()

  if (!previousLessonsSortedFiltered) return null

  return (
    <div>
      <div
        className={cn(
          layout === 'reverse' ? 'border-hairline border-b' : '',
          'special-min-height min-[1025px]:h-[290px] h-full overflow-hidden',
        )}
      >
        <div
          className={cn(
            layout === 'reverse' ? 'pt-6' : 'pb-4 pt-6 lg:py-4',
            'flex h-full flex-col px-5 sm:pl-6 lg:pr-4',
          )}
        >
          <div className='mb-3 flex items-baseline justify-between'>
            <h5>Vergangene Lektionen</h5>
            {previousLessonsSortedFiltered.length > 0 && (
              <NavLink to={`all?year=${newestLessonYear}`} end={true}>
                Alle anzeigen
              </NavLink>
            )}
          </div>
          <div className='overflow-hidden'>
            {previousLessonsSortedFiltered.length > 0 ? (
              <ScrollArea ref={scrollRef} className='h-full'>
                <div
                  className={cn(
                    layout === 'reverse' ? 'pb-6' : 'pb-12',
                    'space-y-4',
                  )}
                >
                  {previousLessonsSortedFiltered.map((lesson) => {
                    if (isMobile)
                      return (
                        <LessonItemMobile key={lesson.id} lesson={lesson} />
                      )
                    return <LessonItem key={lesson.id} lesson={lesson} />
                  })}
                </div>
              </ScrollArea>
            ) : (
              <Empty
                className='!bg-background100 !shadow-none'
                emptyMessage='Keine Lektionen erfasst.'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviousLessons
