import './modalviewLesosns.styles.scss'
import { useEffect, FunctionComponent, useState } from 'react'
import { fetchAllLessonsSupabase } from '../../../supabase/lessons/lessons.supabase'
import { TLesson } from '../../../types/types'
import Loader from '../../loader/Loader'
import Modal from '../Modal.component'
import LessonRow from '../../lessonrow/LessonRow.component'
import { toast } from 'react-toastify'
interface ModalViewLessonsProps {
  handlerClose: () => void
  studentId: number
}

const ModalViewLessons: FunctionComponent<ModalViewLessonsProps> = ({
  handlerClose,
  studentId,
}) => {
  const [isPending, setIsPending] = useState(true)
  const [allLessons, setAllLessons] = useState<TLesson[]>()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchAllLessons = async () => {
      setErrorMessage('')
      try {
        const lessons = await fetchAllLessonsSupabase(studentId)
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
  }, [])

  return (
    <Modal
      heading="Komplette Lektionsliste"
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
