import { useEffect } from "react"

import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

import { useLoading } from "../services/context/LoadingContext"
import { useStudents } from "../services/context/StudentContext"

import LessonHeader from "../components/features/lessons/lessonHeader/LessonHeader"
import PreviousLessons from "../components/features/lessons/previousLessons/PreviousLessons.component"

import LessonFooter from "../components/features/lessons/lessonFooter/LessonFooter.component"
import NewLesson from "../components/features/lessons/newLesson/NewLesson.component"

import NoContent from "../components/ui/noContent/NoContent.component"
import NoteList from "../components/features/notes/noteList/NoteList.component"

function Lesson() {
  const { isLoading } = useLoading()
  const { activeSortedStudentIds } = useStudents()

  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (activeSortedStudentIds.length && !isLoading)
    return (
      <motion.div
        className='grid grid-cols-[1fr_400px] grid-rows-[auto_1fr]'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <LessonHeader />

        {/* <main className=''>
          <PreviousLessons />
          <NewLesson />
        </main>

        <aside className=''>
          <NoteList />
        </aside>
        <LessonFooter /> */}
      </motion.div>
    )

  if (!activeSortedStudentIds.length && !isLoading)
    return (
      <NoContent
        heading='Keine aktiven Schüler:innen'
        buttons={[
          {
            label: "Schüler:innen erfassen",
            handler: () => {
              navigate("/students")
            },
          },
          {
            label: "Aus Archiv wiederherstellen",
            handler: () => {
              navigate("/students/archive")
            },
          },
        ]}
      >
        <p>
          Um zu unterrichten bzw. Lektionen zu erfassen benötigst du aktive
          Schüler:innen. Erfasse neue Schüler:innen oder geh ins Archiv und
          wähle welche aus, die du wiederherstellen möchtest
        </p>
      </NoContent>
    )
}

export default Lesson
