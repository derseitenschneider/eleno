import { useEffect } from 'react'

import { useLoading } from '../services/context/LoadingContext'

import PreviousLessons from '../components/features/lessons/PreviousLessons.component'

import CreateLesson from '../components/features/lessons/CreateLesson.component'

import NoteList from '../components/features/notes/NoteList.component'
import NoStudents from '@/components/features/lessons/NoStudents.component'
import { useLessonHolders } from '@/services/context/LessonHolderContext'

function Lesson() {
  const { isLoading } = useLoading()
  const { activeSortedHolders: lessonHolders } = useLessonHolders()
  const activeLessonHolders = lessonHolders.filter(
    (lessonHolder) => !lessonHolder.holder.archive,
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (activeLessonHolders.length && !isLoading)
    return (
      <div className='md:grid md:grid-cols-[1fr_400px] md:h-[calc(100vh-88px)] overflow-hidden'>
        <main className='md:h-full'>
          <PreviousLessons />
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
