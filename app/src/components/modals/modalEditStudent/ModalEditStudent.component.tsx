import './modalEditStudent.style.scss'
import { FunctionComponent, useState } from 'react'
import { useStudents } from '../../../contexts/StudentContext'
import Modal from '../Modal.component'
import Button from '../../button/Button.component'
import { toast } from 'react-toastify'
import fetchErrorToast from '../../../hooks/fetchErrorToast'

interface ModalEditStudentProps {
  handlerClose: () => void
  studentId: number
}

const ModalEditStudent: FunctionComponent<ModalEditStudentProps> = ({
  handlerClose,
  studentId,
}) => {
  const { students, updateStudent } = useStudents()
  const [inputStudent, setInputStudent] = useState(
    students.find((student) => student.id === studentId)
  )
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)

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

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name
    const value = e.target.value

    setInputStudent((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const updateHandler = async () => {
    setError('')
    if (
      !inputStudent.firstName ||
      !inputStudent.lastName ||
      !inputStudent.instrument
    ) {
      setError('Einige Pfilchtfelder sind leer')
      return
    }
    setIsPending(true)
    try {
      await updateStudent(inputStudent)
      toast('Änderungen gespeichert')
      handlerClose()
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Modal
      heading="Schüler:in berabeiten"
      handlerClose={handlerClose}
      handlerOverlay={handlerClose}
      buttons={[]}
      className={`modal--edit-student ${isPending ? 'loading' : ''}`}
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
          onChange={onChangeHandler}
        />
        <input
          type="text"
          name="lastName"
          value={lastName}
          onChange={onChangeHandler}
        />
        <input
          type="text"
          name="instrument"
          value={instrument}
          onChange={onChangeHandler}
        />
        <select
          name="dayOfLesson"
          value={dayOfLesson}
          onChange={onChangeHandler}
        >
          <option style={{ display: 'none' }}></option>
          <option value="Montag">Montag</option>
          <option value="Dienstag">Dienstag</option>
          <option value="Mittwoch">Mittwoch</option>
          <option value="Donnerstag">Donnerstag</option>
          <option value="Freitag">Freitag</option>
          <option value="Samstag">Samstag</option>
          <option value="Sonntag">Sonntag</option>
          <option value={null}> - </option>
        </select>
        <input
          type="time"
          name="startOfLesson"
          value={startOfLesson}
          onChange={onChangeHandler}
        />
        <input
          type="time"
          name="endOfLesson"
          value={endOfLesson}
          onChange={onChangeHandler}
        />
        <input
          type="number"
          name="durationMinutes"
          value={durationMinutes}
          onChange={onChangeHandler}
        />
        <input
          type="text"
          name="location"
          onChange={onChangeHandler}
          value={location}
        />
      </form>
      <div className="container--buttons">
        <div className="container--error">{error}</div>
        <Button
          type="button"
          btnStyle="primary"
          label="Speichern"
          handler={updateHandler}
        />
      </div>
    </Modal>
  )
}

export default ModalEditStudent