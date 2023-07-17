import './modalviewLesosns.styles.scss'
import { useEffect, FunctionComponent, useState } from 'react'

import { TLesson } from '../../../types/types'
import Loader from '../../common/loader/Loader'
import Modal from '../Modal.component'
import LessonRow from '../../lessons/lessonrow/LessonRow.component'
import { toast } from 'react-toastify'
import { useStudents } from '../../../contexts/StudentContext'
import { useLessons } from '../../../contexts/LessonsContext'
interface ModalViewLessonsProps {
  handlerClose: () => void
  studentId: number
}

const ModalViewLessons: FunctionComponent<ModalViewLessonsProps> = ({
  handlerClose,
  studentId,
}) => {
  const { students } = useStudents()
  const [isPending, setIsPending] = useState(true)
  const { getAllLessons } = useLessons()
  const [allLessons, setAllLessons] = useState<TLesson[]>()
  const [errorMessage, setErrorMessage] = useState('')

  const studentName =
    students.find((student) => student.id === studentId).firstName +
    ' ' +
    students.find((student) => student.id === studentId).lastName

  useEffect(() => {
    const fetchAllLessons = async () => {
      setErrorMessage('')
      try {
        const lessons = await getAllLessons(studentId)
        setAllLessons(lessons)
      } catch (error) {
        setErrorMessage(
          'Etwas ist schiefgelaufen. Versuchs nochmal oder lade die Seite neu...'
        )
      } finally {
        setIsPending(false)
      }
    }
    fetchAllLessons()
  }, [studentId])

  return (
    <Modal
      heading={`Lektionsliste ${studentName}`}
      handlerClose={handlerClose}
      handlerOverlay={handlerClose}
      className="view-lessons"
    >
      {isPending && <Loader loading={isPending} />}
      {!isPending && (
        <div className="lesson-grid">
          <div className="lesson-row">
            <p>Datum</p>
            <p>Lektion</p>
            <p>Hausaufgaben</p>
          </div>
          {errorMessage && <p className="error--message">{errorMessage}</p>}
          {allLessons?.map((lesson) => (
            <LessonRow lesson={lesson} key={lesson.id} />
          ))}
        </div>
      )}
    </Modal>
  )
}

export default ModalViewLessons
