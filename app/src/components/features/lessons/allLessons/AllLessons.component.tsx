import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLessons } from '../../../../contexts/LessonsContext'
import { useStudents } from '../../../../contexts/StudentContext'
import { TLesson } from '../../../../types/types'
import Loader from '../../../common/loader/Loader'
import LessonRow from '../lessonrow/LessonRow.component'
import './allLessons.style.scss'

interface AllLessonsProps {
  studentId: number
}

function AllLessons({ studentId }: AllLessonsProps) {
  const { students } = useStudents()
  const [isPending, setIsPending] = useState(true)
  const { getAllLessons } = useLessons()
  const [allLessons, setAllLessons] = useState<TLesson[]>()
  const [errorMessage, setErrorMessage] = useState('')

  const { firstName, lastName } = students.find(
    (student) => student.id === studentId,
  )
  const studentName = `${firstName} ${lastName}`

  useEffect(() => {
    const fetchAllLessons = async () => {
      setErrorMessage('')
      try {
        const lessons = await getAllLessons(studentId)
        setAllLessons(lessons)
      } catch (error) {
        setErrorMessage(
          'Etwas ist schiefgelaufen. Versuchs nochmal oder lade die Seite neu...',
        )
      } finally {
        setIsPending(false)
      }
    }
    fetchAllLessons()
  }, [getAllLessons, studentId])

  return (
    <div className="all-lessons">
      <h2 className="heading-2">Lektionsliste {studentName}</h2>
      {isPending && <Loader loading={isPending} />}
      {!isPending && (
        <motion.div
          className="all-lessons__table"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="all-lessons__row">
            <p>Datum</p>
            <p>Lektion</p>
            <p>Hausaufgaben</p>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {allLessons?.map((lesson) => (
            <LessonRow lesson={lesson} key={lesson.id} />
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default AllLessons
