import parse from 'html-react-parser'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import PreviousLessonDropDown from './PreviousLessonDropDown.component'
import { useLatestLessons } from './lessonsQueries'
import Empty from '@/components/ui/Empty.component'
import useCurrentHolder from './useCurrentHolder'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import ButtonShareHomework from './ButtonShareHomework.component'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'

function PreviousLessons() {
  const { data: lessons } = useLatestLessons()
  const { userLocale } = useUserLocale()
  const { currentLessonHolder } = useCurrentHolder()

  const [tabIndex, setTabIndex] = useState(0)

  // Sets tabindex to 0 when new lesson is created.
  useEffect(() => {
    if (lessons) {
      setTabIndex(0)
    }
  }, [lessons])

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

  return (
    <div className='lg:pr-4 px-5 pt-6 pb-4 sm:pl-6 lg:py-4 border-b border-hairline sm:h-[350px] md:h-[300px] relative'>
      {previousLessonsIds.length > 0 ? (
        <div className='flex h-fit items-baseline gap-x-3 gap-y-3 mb-5'>
          <>
            {previousLessonsIds.map((prev, index) => (
              <button
                type='button'
                className={cn(
                  'py-2 z-2 px-3 rounded-sm text-sm bg-background50 text-foreground relative hover:bg-background200/50',
                  index === tabIndex && 'text-primary !bg-primary/10 ',
                )}
                onClick={() => {
                  setTabIndex(index)
                }}
                key={prev}
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
              className='ml-auto px-3 py-2 rounded-sm hover:no-underline hover:bg-background200/50 sm:ml-3 text-sm 
            bg-background50 text-foreground'
              to={`all?year=${newestLessonYear}`}
              end={true}
            >
              Alle
            </NavLink>
          </>
        </div>
      ) : null}
      {previousLessonsIds.length > 0 ? (
        <div className='pb-4' key={previousLessonsIds[tabIndex]}>
          <div
            className={cn(
              'h-[250px] md:h-auto overflow-auto sm:overflow-hidden grid md:grid-cols-2 gap-6',
            )}
          >
            <div className=''>
              <p className='text-foreground/70'>Lektion</p>
              <ScrollArea type='auto' className='h-auto sm:h-[160px]'>
                <ScrollBar orientation='vertical' />
                <div className='[&_ul]:list-disc [&_ul]:ml-[16px] [&_a:link]:underline text-sm [&_ol]:list-decimal [&_ol]:ml-[16px] text-foreground'>
                  {parse(
                    removeHTMLAttributes(currentLesson?.lessonContent || ''),
                  )}
                </div>
              </ScrollArea>
            </div>
            <div>
              <p className='text-foreground/70'>Hausaufgaben</p>
              <ScrollArea type='auto' className='h-auto sm:h-[160px]'>
                <ScrollBar orientation='vertical' />
                <div className='[&_ul]:list-disc [&_ul]:ml-[16px] text-sm [&_ol]:list-decimal [&_ol]:ml-[16px] text-foreground'>
                  {parse(
                    removeHTMLAttributes(
                      lessons?.find(
                        (lesson) => lesson.id === previousLessonsIds[tabIndex],
                      )?.homework || '',
                    ),
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
          <div className='absolute items-center bottom-4 right-5 flex gap-6 md:gap-4'>
            <ButtonShareHomework lessonId={currentLesson?.id || 0} />
            <PreviousLessonDropDown
              lessonId={previousLessonsIds[tabIndex] || 0}
            />
          </div>
        </div>
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
