import './modalEditLesson.style.scss'
import { FunctionComponent, useState } from 'react'
import { TLesson } from '../../../types/types'
import Modal from '../Modal.component'
import {
  formatDateToDisplay,
  formatDateToDatabase,
} from '../../../utils/formateDate'

import {
  updateLessonSupabase,
  deleteLessonSupabase,
} from '../../../supabase/lessons/lessons.supabase'
import { toast } from 'react-toastify'

interface ModalEditLessonProps {
  toggleModalEdit: () => void
  input: TLesson
  setInput: React.Dispatch<React.SetStateAction<TLesson>>
  setCurrentLessons: React.Dispatch<React.SetStateAction<TLesson[]>>
  lessons: TLesson[]
  setLessons: React.Dispatch<React.SetStateAction<TLesson[]>>
}

const ModalEditLesson: FunctionComponent<ModalEditLessonProps> = ({
  toggleModalEdit,
  input,
  setInput,
  setCurrentLessons,
  lessons,
  setLessons,
}) => {
  // Handler input fields
  const handlerInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const name = e.target.name
    const value = e.target.value
    const newInput = { ...input, [name]: value }
    setInput(newInput)
  }

  // Update Lesson
  const updateLesson = () => {
    const updateLesson = {
      ...input,
      date: formatDateToDatabase(input.date),
    }
    setCurrentLessons((prev) =>
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
    toggleModalEdit()
    toast('Anpassungen erfolgreich')
  }

  // Delete Lesson
  const deleteLesson = () => {
    const lessonId = input.id
    const newLessons = lessons.filter((lesson) => lesson.id !== lessonId)
    setLessons(newLessons)
    deleteLessonSupabase(lessonId)
    toggleModalEdit()
    toast('Lektion gelöscht')
  }

  return (
    <Modal
      heading="Lektion bearbeiten"
      handlerOverlay={toggleModalEdit}
      handlerClose={toggleModalEdit}
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
