import './lessons.style.scss'

// React
import { FunctionComponent, useEffect, useState } from 'react'

// Types

// Contexts
import { useStudents } from '../../contexts/StudentContext'
import { useLoading } from '../../contexts/LoadingContext'

// Components

// Functions

import { sortStudentsDateTime } from '../../utils/sortStudents'

import { useClosestStudent } from '../../contexts/ClosestStudentContext'
import { useNavigate } from 'react-router-dom'
import LessonHeader from '../../components/lessons/lessonHeader/LessonHeader'
import PreviousLessons from '../../components/lessons/previousLessons/PreviousLessons.component'
import Notes from '../../components/lessons/notes/Notes.component'
import NewLesson from '../../components/lessons/newLesson/NewLesson.component'
import LessonFooter from '../../components/lessons/lessonFooter/LessonFooter.component'
import { useLessons } from '../../contexts/LessonsContext'

const Lesson: FunctionComponent = () => {
  const { loading } = useLoading()
  const { students } = useStudents()
  const { lessons } = useLessons()

  const { closestStudentIndex } = useClosestStudent()
  const [studentIndex, setStudentIndex] = useState(0)

  //EFFECTS

  // Close dropdown on click anywhere else

  useEffect(() => {
    setStudentIndex(closestStudentIndex)
  }, [closestStudentIndex])

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
        <div className="container">
          {/* [ ] Handle empty students here */}
          {/* <NoActiveStudent handler={navigateToStudents} /> */}
        </div>
      )}
    </>
  )
}

export default Lesson
