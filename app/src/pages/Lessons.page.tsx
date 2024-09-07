import NoStudents from '@/components/features/lessons/NoStudents.component'
import useCurrentHolder from '@/components/features/lessons/useCurrentHolder'
import { useEffect } from 'react'
import CreateLesson from '../components/features/lessons/CreateLesson.component'
import PreviousLessons from '../components/features/lessons/PreviousLessons.component'
import NoteList from '../components/features/notes/NoteList.component'
import { useLoading } from '../services/context/LoadingContext'
import { ScrollArea } from '@/components/ui/scroll-area'

function Lesson() {
  const { isLoading } = useLoading()
  const { currentLessonHolder } = useCurrentHolder()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  if (isLoading) return <p>...loading</p>
  if (currentLessonHolder)
    return (
      <div className='md:grid lg:grid-cols-[1fr_400px] lg:h-[calc(100vh-88px)] overflow-hidden'>
        <main className='md:h-full'>
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
