import './lessons.style.scss'

// React
import { useEffect } from 'react'

// Types

// Contexts
import { useStudents } from '../../contexts/StudentContext'
import { useLoading } from '../../contexts/LoadingContext'

// Functions

import { useNavigate } from 'react-router-dom'
import LessonHeader from '../../components/lessons/lessonHeader/LessonHeader'
import PreviousLessons from '../../components/lessons/previousLessons/PreviousLessons.component'
import Notes from '../../components/lessons/notes/Notes.component'
import NewLesson from '../../components/lessons/newLesson/NewLesson.component'
import LessonFooter from '../../components/lessons/lessonFooter/LessonFooter.component'

import NoContent from '../../components/common/noContent/NoContent.component'

const Lesson = () => {
  const { loading } = useLoading()
  const { currentStudentIndex, activeSortedStudentIds } = useStudents()

  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStudentIndex])

  if (activeSortedStudentIds.length && !loading)
    return (
      <div className="lessons">
        <LessonHeader />

        <main className="main">
          <PreviousLessons />
          <NewLesson />
        </main>

        <aside className="aside">
          <Notes />
        </aside>
        <LessonFooter />
      </div>
    )

  if (!activeSortedStudentIds.length && !loading)
    return (
      <NoContent
        heading="Keine aktiven Schüler:innen"
        buttons={[
          {
            label: 'Schüler:innen erfassen',
            handler: () => {
              navigate('/students')
            },
          },
          {
            label: 'Aus Archiv wiederherstellen',
            handler: () => {
              navigate('/students/archive')
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
