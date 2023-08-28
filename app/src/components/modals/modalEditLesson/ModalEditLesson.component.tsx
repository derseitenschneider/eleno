import { toast } from 'react-toastify'
import './modalEditLesson.style.scss'
import { FunctionComponent, useState } from 'react'
import Modal from '../Modal.component'

import { useLessons } from '../../../contexts/LessonsContext'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import CustomEditor from '../../common/customEditor/CustomEditor.component'
import { TLesson } from '../../../types/types'

interface ModalEditLessonProps {
  previousLessonsIds: number[]
  tabIndex: number
  handleClose: () => void
}

const ModalEditLesson: FunctionComponent<ModalEditLessonProps> = ({
  previousLessonsIds,
  tabIndex,
  handleClose,
}) => {
  const { lessons, updateLesson } = useLessons()
  const currentLesson = lessons.find(
    (lesson) => lesson.id === previousLessonsIds[tabIndex]
  )

  const studentId = currentLesson.studentId
  const id = currentLesson.id

  const [lessonContent, setLessonContent] = useState(
    currentLesson.lessonContent
  )
  const [homework, setHomework] = useState(currentLesson.homework)
  const [date, setDate] = useState(currentLesson.date)
  const [isPending, setIsPending] = useState(false)

  const handleLessonContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLessonContent(e.target.value)
  }

  const handleHomework = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHomework(e.target.value)
  }

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
  }

  const handlerShowPicker = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.showPicker()
  }

  // Update Lesson
  const updateHandler = async () => {
    setIsPending(true)
    try {
      const newLesson: TLesson = {
        lessonContent,
        homework,
        date,
        studentId,
        id,
      }
      await updateLesson(newLesson)
      toast('Änderungen gespeichert')
      handleClose()
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Modal
      heading="Lektion bearbeiten"
      handlerClose={handleClose}
      className="modal--edit-lesson"
      buttons={[
        {
          label: 'Speichern',
          btnStyle: 'primary',
          handler: updateHandler,
        },
      ]}
    >
      <div className="container-date">
        <label htmlFor="date">Datum</label>
        <input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={handleDate}
          onFocus={handlerShowPicker}
        />
      </div>
      <div className={`container--edit-lesson ${isPending ? 'loading' : ''}`}>
        <div className="container--left">
          <h5 className="heading-5">Lektion</h5>

          <div className="container--editor">
            <CustomEditor
              value={lessonContent}
              onChange={handleLessonContent}
            />
          </div>
        </div>

        <div className="container--right">
          <h5 className="heading-5">Hausaufgaben</h5>

          <div className="container--editor">
            <CustomEditor value={homework} onChange={handleHomework} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalEditLesson
