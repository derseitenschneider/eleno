import { useState } from 'react'
import { toast } from 'react-toastify'
import { useLessons } from '../../../../contexts/LessonsContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import { TLesson } from '../../../../types/types'
import { formatDateToDatabase } from '../../../../utils/formateDate'
import Button from '../../../common/button/Button.component'
import CustomEditor from '../../../common/customEditor/CustomEditor.component'
import DatePicker from '../../../common/datePicker/DatePicker.component'
import './editLesson.style.scss'

interface EditLessonProps {
  lesson: TLesson
  onCloseModal?: () => void
}

function EditLesson({ lesson, onCloseModal }: EditLessonProps) {
  const { updateLesson } = useLessons()
  const { studentId, id } = lesson

  const [lessonContent, setLessonContent] = useState(lesson.lessonContent)
  const [homework, setHomework] = useState(lesson.homework)
  const [date, setDate] = useState(lesson.date)
  const [isPending, setIsPending] = useState(false)

  const handleLessonContent = (content: string) => {
    setLessonContent(content)
  }

  const handleHomework = (content: string) => {
    setHomework(content)
  }

  const handleUpdate = async () => {
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
      onCloseModal?.()
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="edit-lesson">
      <h2 className="heading-2">Lektion bearbeiten</h2>
      <div className="edit-lesson__date">
        <span>Datum</span>
        <DatePicker
          selectedDate={new Date(formatDateToDatabase(date))}
          hideRemoveBtn
          id="lesson-date"
          setDate={setDate}
        />
      </div>
      <div className={`edit-lesson__inputs ${isPending ? 'loading' : ''}`}>
        <div className="edit-lesson__lesson">
          <h5 className="heading-5">Lektion</h5>

          <div className="container--editor">
            <CustomEditor
              value={lessonContent}
              onChange={handleLessonContent}
            />
          </div>
        </div>

        <div className="edit-lesson__homework">
          <h5 className="heading-5">Hausaufgaben</h5>

          <div className="container--editor">
            <CustomEditor value={homework} onChange={handleHomework} />
          </div>
        </div>
      </div>
      <div className="edit-lesson__buttons">
        <Button
          type="button"
          btnStyle="secondary"
          handler={onCloseModal}
          label="Abbrechen"
        />
        <Button
          type="button"
          btnStyle="primary"
          handler={handleUpdate}
          label="Speichern"
        />
      </div>
    </div>
  )
}

export default EditLesson
