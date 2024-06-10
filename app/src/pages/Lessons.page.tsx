import { useEffect } from "react"

import { useLoading } from "../services/context/LoadingContext"
import { useStudents } from "../services/context/StudentContext"

import PreviousLessons from "../components/features/lessons/PreviousLessons.component"

import CreateLesson from "../components/features/lessons/CreateLesson.component"

import NoteList from "../components/features/notes/NoteList.component"
import NoStudents from "@/components/features/lessons/NoStudents.component"

function Lesson() {
  const { isLoading } = useLoading()
  const { activeSortedStudentIds } = useStudents()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (activeSortedStudentIds.length && !isLoading)
    return (
      <div className='grid grid-cols-[1fr_400px] min-h-[calc(100vh-88px)]'>
        <main>
          <PreviousLessons />
          <CreateLesson />
        </main>

        <aside className='border-l border-hairline'>
          <NoteList />
        </aside>
      </div>
    )

  return <NoStudents />
}

export default Lesson
