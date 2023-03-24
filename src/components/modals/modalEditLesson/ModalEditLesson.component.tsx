import './modalEditLesson.style.scss'
import { FunctionComponent, useState } from 'react'
import { TLesson } from '../../../types/types'
import Modal from '../Modal.component'
import {
  formatDateToDisplay,
  formatDateToDatabase,
} from '../../../utils/formateDate'

import { updateLessonSupabase } from '../../../supabase/lessons/lessons.supabase'
import { toast } from 'react-toastify'
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
  const { lessons, setLessons } = useLessons()
  const [input, setInput] = useState(
    lessons.find((lesson) => lesson.id === previousLessonsIds[tabIndex])
  )
  // Handler input fields
  const handlerInput = (
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
  const updateLesson = () => {
    const updateLesson = {
      ...input,
      date: formatDateToDatabase(input.date),
    }
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === updateLesson.id ? updateLesson : lesson
      )
    )
    const updateData = async () => {
      try {
        updateLessonSupabase(updateLesson)
      } catch (err) {
        console.log('etwas ist schiefgelaufen')
      }
    }
    updateData()
    closeModal()
    toast('Änderungen gespeichert')
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
          handler: updateLesson,
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
          onChange={handlerInput}
        />
      </div>
      <div className="container--edit-lesson">
        <textarea
          className="input"
          name="lessonContent"
          value={input.lessonContent}
          onChange={handlerInput}
        />
        <textarea
          className="input"
          name="homework"
          value={input.homework}
          onChange={handlerInput}
        />
      </div>
    </Modal>
  )
}

export default ModalEditLesson
