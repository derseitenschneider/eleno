import { useEffect, useState } from 'react'

import { useUserLocale } from '@/services/context/UserLocaleContext'
import { useLatestLessons } from './lessonsQueries'
import Empty from '@/components/ui/Empty.component'
import useCurrentHolder from './useCurrentHolder'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { PreviousLessonItem } from './PreviousLessonItem.component'

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

  return (
    <div className='h-full'>
      <div className='h-full px-5 pb-4 pt-6 sm:pl-6 lg:py-4 lg:pr-4'>
        {previousLessonsIds.length > 0 ? (
          <>
            <h5 className='m-0 mb-2'>Vergangene Lektionen</h5>
            <div className='h-full space-y-4 overflow-scroll'>
              {previousLessonsIds.map((lessonId) => (
                <PreviousLessonItem key={lessonId} lessonId={lessonId} />
              ))}
            </div>
          </>
        ) : (
          <Empty
            className='!bg-background100 !shadow-none'
            emptyMessage='Keine Lektionen erfasst.'
          />
        )}
      </div>
    </div>
  )
}

export default PreviousLessons
