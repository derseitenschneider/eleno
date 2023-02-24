import { FunctionComponent, useEffect, useState } from 'react'
import { TStudent, TLesson } from '../../types/types'
import { useStudents } from '../../contexts/StudentContext'
import { useLessons } from '../../contexts/LessonsContext'
import Button from '../../components/button/Button.component'

interface LessonProps {}

const Lesson: FunctionComponent<LessonProps> = () => {
  const { lessons, setLessons } = useLessons()
  const { students } = useStudents()
  const [activeStudents, setActiveStudents] = useState<TStudent[]>(students)
  const [studentIndex, setStudentIndex] = useState(0)

  const [currentStudent, setCurrentStudent] = useState<TStudent>(null)
  const [currentLessons, setCurrentLessons] = useState<TLesson[]>([])

  useEffect(() => {
    setActiveStudents(students?.filter((student) => !student.archive))
    console.log(activeStudents)
  }, [students])

  useEffect(() => {
    setCurrentStudent(activeStudents[studentIndex])
  }, [activeStudents, studentIndex])

  useEffect(() => {
    const currentLessons = lessons?.filter(
      (lesson) => lesson?.studentId === currentStudent?.id
    )
    setCurrentLessons(currentLessons)
  }, [currentStudent])

  const handlerNextStudent = () => {
    studentIndex < activeStudents.length - 1
      ? setStudentIndex(studentIndex + 1)
      : setStudentIndex(0)
  }

  const handlerPreviousStudent = () => {
    studentIndex > 0
      ? setStudentIndex(studentIndex - 1)
      : setStudentIndex(activeStudents.length - 1)
  }

  return (
    <>
      {currentStudent ? (
        <h1>
          Unterrichtsblatt für {currentStudent.firstName}{' '}
          {currentStudent.lastName}
        </h1>
      ) : null}
      {currentLessons
        ? currentLessons.map((lesson) => (
            <>
              <h4>Datum: {lesson.date}</h4>
              <p>Lektionsinhalt: {lesson.lessonContent}</p>
              <p>Hausaufgaben: {lesson.homework}</p>
            </>
          ))
        : null}

      <Button
        type="button"
        btnStyle="primary"
        handler={handlerPreviousStudent}
        label="Vorheriger Schüler:in"
      />
      <Button
        type="button"
        btnStyle="primary"
        handler={handlerNextStudent}
        label="Nächste:r Schüler:in"
      />
    </>
  )
}

export default Lesson
