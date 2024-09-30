import NoStudents from '@/components/features/lessons/NoStudents.component'
import useCurrentHolder from '@/components/features/lessons/useCurrentHolder'
import { useEffect } from 'react'
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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  if (isLoading) return <p>...loading</p>
  if (currentLessonHolder)
    return (
      <div
        className={cn(
          hasBanner
            ? 'min-[1200px]:h-[calc(100vh-120px)]'
            : 'min-[1200px]:h-[calc(100vh-88px)]',
          'md:grid lg:grid-cols-[2fr_minmax(0,380px)] overflow-hidden',
        )}
      >
        <main className='md:h-full lg:overflow-auto no-scrollbar'>
          <PreviousLessons key={currentLessonHolder.holder.id} />
          <CreateLesson />
        </main>

        <aside className='border-l h-full border-hairline'>
          <NoteList />
        </aside>
      </div>
    )

  return <NoStudents />
}

export default Lesson
