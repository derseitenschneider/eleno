import './editStudent.style.scss'
import { FC, useEffect, useState } from 'react'
import { calcTimeDifference } from '../../../utils/calcTimeDifference'
import { toast } from 'react-toastify'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import { useStudents } from '../../../contexts/StudentContext'
import Button from '../../common/button/Button.component'

interface EditStudentProps {
  studentId: number
  onCloseModal?: () => void
}

const EditStudent: FC<EditStudentProps> = ({ studentId, onCloseModal }) => {
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

  useEffect(() => {
    if (startOfLesson && endOfLesson) {
      const diffInMinutes = calcTimeDifference(startOfLesson, endOfLesson)
      setInputStudent((prev) => {
        return { ...prev, durationMinutes: diffInMinutes }
      })
    }
  }, [startOfLesson, endOfLesson])

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
      onCloseModal?.()
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="edit-student">
      <h2 className="heading-2">Schüler:in bearbeiten</h2>
      <form className={`grid ${isPending ? 'loading' : ''}`}>
        <div className="item">
          <label htmlFor="firstName">Vorname*</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={firstName}
            onChange={onChangeHandler}
          />
        </div>

        <div className="item">
          <label htmlFor="lastName">Nachname*</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={lastName}
            onChange={onChangeHandler}
          />
        </div>
        <div className="item">
          <label htmlFor="instrument">Instrument*</label>
          <input
            id="instrument"
            type="text"
            name="instrument"
            value={instrument}
            onChange={onChangeHandler}
          />
        </div>
        <div className="item">
          <label htmlFor="dayOfLesson">Tag</label>

          <select
            id="dayOfLesson"
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
            <option value={''}> - </option>
          </select>
        </div>

        <div className="item">
          <label htmlFor="startOfLesson">Von</label>
          <input
            id="startOfLesson"
            type="time"
            name="startOfLesson"
            value={startOfLesson}
            onChange={onChangeHandler}
          />
        </div>
        <div className="item">
          <label htmlFor="endOfLesson">Bis</label>
          <input
            id="endOfLesson"
            type="time"
            name="endOfLesson"
            value={endOfLesson}
            onChange={onChangeHandler}
          />
        </div>
        <div className="item">
          <label htmlFor="durationMinutes">Dauer</label>
          <input
            id="durationMinutes"
            type="number"
            name="durationMinutes"
            value={durationMinutes}
            onChange={onChangeHandler}
          />
        </div>
        <div className="item">
          <label htmlFor="location">Unterrichtsort</label>
          <input
            id="location"
            type="text"
            name="location"
            onChange={onChangeHandler}
            value={location}
          />
        </div>
      </form>
      <div className="edit-student__buttons">
        <div className="error-message">{error}</div>
        <Button
          type="button"
          btnStyle="secondary"
          label="Abbrechen"
          handler={onCloseModal}
          disabled={isPending}
        />
        <Button
          type="button"
          btnStyle="primary"
          label="Speichern"
          handler={updateHandler}
          disabled={isPending}
        />
      </div>
    </div>
  )
}

export default EditStudent