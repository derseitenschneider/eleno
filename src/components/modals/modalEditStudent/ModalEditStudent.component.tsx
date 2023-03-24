import './modalEditStudent.style.scss'
import { FunctionComponent, useState } from 'react'
import { useStudents } from '../../../contexts/StudentContext'
import Modal from '../Modal.component'
import Button from '../../button/Button.component'
import { TStudent } from '../../../types/types'
import { updateLessonSupabase } from '../../../supabase/lessons/lessons.supabase'
import { updateStudentSupabase } from '../../../supabase/students/students.supabase'
import { toast } from 'react-toastify'

interface ModalEditStudentProps {
  handlerClose: () => void
  studentId: number
}

const ModalEditStudent: FunctionComponent<ModalEditStudentProps> = ({
  handlerClose,
  studentId,
}) => {
  const { students, setStudents } = useStudents()
  const [inputStudent, setInputStudent] = useState(
    students.find((student) => student.id === studentId)
  )
  const [error, setError] = useState('')

  const {
    firstName,
    lastName,
    dayOfLesson,
    instrument,
    startOfLesson,
    endOfLesson,
    durationMinutes,
    location,
  } = inputStudent

  const handlerOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name
    const value = e.target.value

    setInputStudent((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const saveEdit = async () => {
    setError('')
    if (
      !inputStudent.firstName ||
      !inputStudent.lastName ||
      !inputStudent.instrument
    ) {
      setError('Einige Pfilchtfelder sind leer')
      return
    }
    setStudents((prev) =>
      prev.map((student) => (student.id === studentId ? inputStudent : student))
    )
    try {
      await updateStudentSupabase(inputStudent)
    } catch (err) {
      console.log({ err })
    }
    handlerClose()
    toast('Änderungen gespeichert')
  }

  return (
    <Modal
      heading="Schüler:in berabeiten"
      handlerClose={handlerClose}
      handlerOverlay={handlerClose}
      buttons={[]}
      className="modal--edit-student"
    >
      <div className="labels grid">
        <span>Vorname*</span>
        <span>Nachname*</span>
        <span>Instrument*</span>
        <span>Tag</span>
        <span>Von</span>
        <span>Bis</span>
        <span>Dauer</span>
        <span>Unterrichtsort</span>
      </div>
      <form className="grid">
        <input
          type="text"
          name="firstName"
          value={firstName}
          onChange={handlerOnChange}
        />
        <input
          type="text"
          name="lastName"
          value={lastName}
          onChange={handlerOnChange}
        />
        <input
          type="text"
          name="instrument"
          value={instrument}
          onChange={handlerOnChange}
        />
        <select
          name="dayOfLesson"
          value={dayOfLesson}
          onChange={handlerOnChange}
        >
          <option value="Montag">Montag</option>
          <option value="Dienstag">Dienstag</option>
          <option value="Mittwoch">Mittwoch</option>
          <option value="Donnerstag">Donnerstag</option>
          <option value="Freitag">Freitag</option>
          <option value="Samstag">Samstag</option>
          <option value="Sonntag">Sonntag</option>
        </select>
        <input
          type="time"
          name="startOfLesson"
          value={startOfLesson}
          onChange={handlerOnChange}
        />
        <input
          type="time"
          name="endOflesson"
          value={endOfLesson}
          onChange={handlerOnChange}
        />
        <input
          type="number"
          name="durationMinutes"
          value={durationMinutes}
          onChange={handlerOnChange}
        />
        <input
          type="text"
          name="location"
          onChange={handlerOnChange}
          value={location}
        />
      </form>
      <div className="container--buttons">
        <div className="container--error">{error}</div>
        <Button
          type="button"
          btnStyle="primary"
          label="Speichern"
          handler={saveEdit}
        />
      </div>
    </Modal>
  )
}

export default ModalEditStudent
