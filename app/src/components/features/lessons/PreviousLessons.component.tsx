import parse from 'html-react-parser'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import PreviousLessonDropDown from './PreviousLessonDropDown.component'
import { useLatestLessons } from './lessonsQueries'
import Empty from '@/components/ui/Empty.component'
import useCurrentHolder from './useCurrentHolder'

function PreviousLessons() {
  const { data: lessons } = useLatestLessons()
  const { userLocale } = useUserLocale()
  const { currentLessonHolder } = useCurrentHolder()

  const [tabIndex, setTabIndex] = useState(0)

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

  const currentLesson = lessons?.find(
    (lesson) => lesson.id === previousLessonsIds[tabIndex],
  )
  const newestLessonYear = lessons
    ?.filter(
      (lesson) => lesson?.[lessonField] === currentLessonHolder?.holder.id,
    )
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .at(0)
    ?.date.getFullYear()

  useEffect(() => {
    setTabIndex(0)
  }, [])

  return (
    <div className='sm:pr-3 px-4 py-6 pb-14 sm:pl-8 sm:py-4 border-b border-hairline md:h-[300px] relative'>
      <div className='flex flex-wrap items-baseline gap-5 mb-5'>
        {previousLessonsIds.length > 0 ? (
          <>
            {previousLessonsIds.map((prev, index) => (
              <button
                type='button'
                className={cn(
                  'px-2 py-1 pr-3 text-sm bg-background200 border-background200 border-l-4 text-foreground hover:bg-background200/80',
                  index === tabIndex &&
                  'bg-background50 border-primary/80 hover:bg-background50',
                )}
                onClick={() => {
                  setTabIndex(index)
                }}
                key={prev || Math.trunc(Math.random() * 1_000_000)}
              >
                {lessons
                  ?.find((lesson) => lesson?.id === prev)
                  ?.date.toLocaleDateString(userLocale, {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  }) || ''}
              </button>
            ))}
            <NavLink
              className='px-2 hover:no-underline py-1 pr-3 text-sm bg-background200 border-background200 border-l-4 text-foreground hover:bg-background200/80'
              to={`all?year=${newestLessonYear}`}
              end={true}
            >
              Alle
            </NavLink>
          </>
        ) : null}
      </div>
      {previousLessonsIds.length > 0 ? (
        <>
          <div className={cn('grid md:grid-cols-2 gap-6')}>
            <div>
              <p className='text-foreground/70'>Lektion</p>
              <div className='[&_ul]:list-disc [&_ul]:ml-[14px] text-sm [&_ol]:list-decimal [&_ol]:ml-[12px] text-foreground'>
                {parse(currentLesson?.lessonContent || '')}
              </div>
            </div>
            <div>
              <p className='text-foreground/70'>Hausaufgaben</p>
              <div className='[&_ul]:list-disc [&_ul]:ml-[14px] text-sm [&_ol]:list-decimal [&_ol]:ml-[12px] text-foreground'>
                {parse(
                  lessons?.find(
                    (lesson) => lesson.id === previousLessonsIds[tabIndex],
                  )?.homework || '',
                )}
              </div>
            </div>
          </div>

          <div className='absolute bottom-4 right-5 flex gap-2'>
            <PreviousLessonDropDown
              lessonId={previousLessonsIds[tabIndex] || 0}
            />
          </div>
        </>
      ) : (
        <Empty
          className='!bg-background100 !shadow-none'
          emptyMessage='Keine Lektionen erfasst.'
        />
      )}
    </div>
  )
}

export default PreviousLessons