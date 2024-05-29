import { useEffect } from "react"

import { useLoading } from "../services/context/LoadingContext"
import { useStudents } from "../services/context/StudentContext"

import PreviousLessons from "../components/features/lessons/PreviousLessons.component"

import LessonFooter from "../components/features/lessons/LessonFooter.component"
import NewLesson from "../components/features/lessons/newLesson/NewLesson.component"

import NoteList from "../components/features/notes/noteList/NoteList.component"
import NoStudents from "@/components/features/lessons/NoStudents.component"

function Lesson() {
  const { isLoading } = useLoading()
  const { activeSortedStudentIds } = useStudents()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (activeSortedStudentIds.length && !isLoading)
    return (
      <div className='grid grid-cols-[1fr_400px]'>
        <main>
          <PreviousLessons />
          <NewLesson />
        </main>

        <aside className='border-l border-hairline'>
          <NoteList />
        </aside>
        <LessonFooter />
      </div>
    )

  return <NoStudents />
}

export default Lesson
