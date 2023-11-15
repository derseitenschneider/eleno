import { useState } from 'react'
import { toast } from 'react-toastify'
import { useLessons } from '../../../../services/context/LessonsContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import Button from '../../../ui/button/Button.component'
import './deleteLesson.style.scss'

interface DeleteLessonProps {
  onCloseModal?: () => void
  lessonId: number
}

function DeleteLesson({ lessonId, onCloseModal }: DeleteLessonProps) {
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
        <Button
          type="button"
          btnStyle="secondary"
          handler={onCloseModal}
          label="Abbrechen"
        />
        <Button
          type="button"
          btnStyle="danger"
          handler={handleDelete}
          label="Löschen"
        />
      </div>
    </div>
  )
}

export default DeleteLesson
