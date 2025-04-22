import NoStudents from '@/components/features/lessons/NoStudents.component'
import useCurrentHolder from '@/components/features/lessons/useCurrentHolder'
import { useEffect, useRef } from 'react'
import CreateLesson from '../components/features/lessons/CreateLesson.component'
import PreviousLessons from '../components/features/lessons/PreviousLessons.component'
import NoteList from '../components/features/notes/NoteList.component'
import { useLoading } from '../services/context/LoadingContext'
import { cn } from '@/lib/utils'
import useHasBanner from '@/hooks/useHasBanner'

function Lesson() {
  const { isLoading } = useLoading()
  const hasBanner = useHasBanner()
  const { currentLessonHolder } = useCurrentHolder()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentLessonHolder && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [currentLessonHolder])

  if (isLoading) return <p>...loading</p>
  if (currentLessonHolder)
    return (
      <div
        ref={scrollRef}
        className={cn(
          'lg:grid lg:grid-cols-[2fr_minmax(0,380px)] overflow-scroll lg:overflow-hidden',
        )}
      >
        <main
          className={cn(
            hasBanner ? 'lg:h-[calc(100%-32px)]' : 'lg:h-full',
            'flex flex-col lg:overflow-hidden',
          )}
        >
          <CreateLesson />

          <PreviousLessons />
        </main>

        <aside className='border-l border-hairline lg:h-full'>
          <NoteList />
        </aside>
      </div>
    )

  return <NoStudents />
}

export default Lesson
