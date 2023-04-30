import { toast } from 'react-toastify'
import './modalEditLesson.style.scss'
import { FunctionComponent, useState } from 'react'
import { TLesson } from '../../../types/types'
import Modal from '../Modal.component'
import {
  formatDateToDisplay,
  formatDateToDatabase,
} from '../../../utils/formateDate'

import { useLessons } from '../../../contexts/LessonsContext'

interface ModalEditLessonProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  previousLessonsIds: number[]
  tabIndex: number
}

const ModalEditLesson: FunctionComponent<ModalEditLessonProps> = ({
  setModalOpen,
  previousLessonsIds,
  tabIndex,
}) => {
  const { lessons, updateLesson } = useLessons()
  const [input, setInput] = useState(
    lessons.find((lesson) => lesson.id === previousLessonsIds[tabIndex])
  )
  const [isPending, setIsPending] = useState(false)
  // Handler input fields
  const inputHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const name = e.target.name
    const value = e.target.value
    const newInput = { ...input, [name]: value }
    setInput(newInput)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  // Update Lesson
  const updateHandler = async () => {
    setIsPending(true)
    try {
      await updateLesson(input)
      toast('Änderungen gespeichert')
      closeModal()
    } catch (error) {
      toast('Etwas ist schiefgelaufen. Versuchs nochmal!', { type: 'error' })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Modal
      heading="Lektion bearbeiten"
      handlerOverlay={closeModal}
      handlerClose={closeModal}
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
          type="text"
          id="date"
          name="date"
          value={formatDateToDisplay(input.date)}
          onChange={inputHandler}
        />
      </div>
      <div className={`container--edit-lesson ${isPending ? 'loading' : ''}`}>
        <textarea
          className="input"
          name="lessonContent"
          value={input.lessonContent}
          onChange={inputHandler}
        />
        <textarea
          className="input"
          name="homework"
          value={input.homework}
          onChange={inputHandler}
        />
      </div>
    </Modal>
  )
}

export default ModalEditLesson
