import './lessons.style.scss'

// React
import { FunctionComponent, useEffect } from 'react'

// Types

// Contexts
import { useStudents } from '../../contexts/StudentContext'
import { useLoading } from '../../contexts/LoadingContext'

// Functions

import { sortStudentsDateTime } from '../../utils/sortStudents'

import { useNavigate } from 'react-router-dom'
import LessonHeader from '../../components/lessons/lessonHeader/LessonHeader'
import PreviousLessons from '../../components/lessons/previousLessons/PreviousLessons.component'
import Notes from '../../components/lessons/notes/Notes.component'
import NewLesson from '../../components/lessons/newLesson/NewLesson.component'
import LessonFooter from '../../components/lessons/lessonFooter/LessonFooter.component'
import { useLessons } from '../../contexts/LessonsContext'
import NoContent from '../../components/_reusables/noContent/NoContent.component'

const Lesson: FunctionComponent = () => {
  const { loading } = useLoading()
  const { students, studentIndex, setStudentIndex } = useStudents()
  const { lessons } = useLessons()

  const navigate = useNavigate()

  useEffect(() => {
    if (window.innerWidth > 480) return
    window.scrollTo(0, 0)
  }, [studentIndex])

  const activeStudentsIds: number[] = sortStudentsDateTime(
    students.filter((student) => !student.archive)
  ).map((student) => student.id)

  const currentStudentId = activeStudentsIds[studentIndex]

  const previousLessonsIds = lessons
    .filter((lesson) => lesson.studentId === currentStudentId)
    ?.slice(-3)
    .map((lesson) => lesson.id)
    .reverse()

  return (
    <>
      {!loading && activeStudentsIds.length ? (
        <div className="lessons">
          <LessonHeader currentStudentId={currentStudentId} />

          <main className="main">
            <PreviousLessons
              currentStudentId={currentStudentId}
              previousLessonsIds={previousLessonsIds}
            />
            <NewLesson studentId={currentStudentId} />
          </main>

          <aside className="aside">
            <Notes currentStudentId={currentStudentId} />
          </aside>
          <LessonFooter
            studentIndex={studentIndex}
            setStudentIndex={setStudentIndex}
            activeStudentsIds={activeStudentsIds}
          />
        </div>
      ) : (
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
      )}
    </>
  )
}

export default Lesson
