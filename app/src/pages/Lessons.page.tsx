import { useEffect } from "react"

import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

import { useLoading } from "../services/context/LoadingContext"
import { useStudents } from "../services/context/StudentContext"

import LessonHeader from "../components/features/lessons/LessonHeader"
import PreviousLessons from "../components/features/lessons/PreviousLessons.component"

import LessonFooter from "../components/features/lessons/lessonFooter/LessonFooter.component"
import NewLesson from "../components/features/lessons/newLesson/NewLesson.component"

import NoContent from "../components/ui/NoContent.component"
import NoteList from "../components/features/notes/noteList/NoteList.component"
import NoStudents from "@/components/features/lessons/NoStudents.component"

function Lesson() {
  const { isLoading } = useLoading()
  const { activeSortedStudentIds } = useStudents()

  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (activeSortedStudentIds.length && !isLoading)
    return (
      <>
        <main>
          <PreviousLessons />
          <NewLesson />
        </main>

        <aside className='border-l border-hairline'>
          <NoteList />
        </aside>
        {/* <LessonFooter /> */}
      </>
    )

  return <NoStudents />
}

export default Lesson
