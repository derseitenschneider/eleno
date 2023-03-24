import './modalviewLesosns.styles.scss'
import { useEffect, FunctionComponent, useState } from 'react'
import { fetchAllLessonsSupabase } from '../../../supabase/lessons/lessons.supabase'
import { TLesson } from '../../../types/types'
import Loader from '../../loader/Loader'
import Modal from '../Modal.component'
import LessonRow from '../../lessonrow/LessonRow.component'
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

  useEffect(() => {
    const fetchAllLessons = async () => {
      try {
        const lessons = await fetchAllLessonsSupabase(studentId)
        setAllLessons(lessons)
        setIsPending(false)
      } catch (error) {
        console.log(error)
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
          {allLessons.map((lesson) => (
            <LessonRow lesson={lesson} />
          ))}
        </div>
      )}
    </Modal>
  )
}

export default ModalViewLessons
