import './deleteLesson.style.scss'
import { toast } from 'react-toastify'
import { FC, useState } from 'react'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import Button from '../../common/button/Button.component'
import { useLessons } from '../../../contexts/LessonsContext'

interface DeleteLessonProps {
  onCloseModal?: () => void
  lessonId: number
}

const DeleteLesson: FC<DeleteLessonProps> = ({ lessonId, onCloseModal }) => {
  const [isPending, setIsPending] = useState(false)
  const { deleteLesson } = useLessons()

  const handleDelete = async () => {
    try {
      setIsPending(true)
      await deleteLesson(lessonId)
      toast('Lektion gelöscht')
      onCloseModal?.()
    } catch (err) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={`delete-lesson ${isPending ? 'loading' : ''}`}>
      <h2 className="heading-2">Lektion löschen</h2>
      <p>Möchtest du diese Lektion wirklich löschen?</p>
      <div className="delete-lesson__buttons">
        <Button btnStyle="secondary" handler={onCloseModal} label="Abbrechen" />
        <Button btnStyle="danger" handler={handleDelete} label="Löschen" />
      </div>
    </div>
  )
}

export default DeleteLesson
