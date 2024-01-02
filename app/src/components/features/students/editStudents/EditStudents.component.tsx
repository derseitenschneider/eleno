import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useStudents } from '../../../../services/context/StudentContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import calcTimeDifference from '../../../../utils/calcTimeDifference'
import Button from '../../../ui/button/Button.component'
import './editStudent.style.scss'
import EditStudentRow from '../editStudentRow/EditStudentRow.component'

interface EditStudentsProps {
  studentIds: number[]
  onCloseModal?: () => void
}

function EditStudents({ studentIds, onCloseModal }: EditStudentsProps) {
  const { students, updateStudent } = useStudents()
  const [inputStudents, setInputStudents] = useState(
    students.filter((student) => studentIds.find((id) => id === student.id)),
  )
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)
  const grid = 'repeat(3, 1fr) 16rem repeat(2, 6.5rem) 7rem 1fr'

  // const {
  //   firstName,
  //   lastName,
  //   dayOfLesson,
  //   instrument,
  //   startOfLesson,
  //   endOfLesson,
  //   durationMinutes,
  //   location,
  // } = inputStudent

  // useEffect(() => {
  //   if (startOfLesson && endOfLesson) {
  //     const diffInMinutes = calcTimeDifference(startOfLesson, endOfLesson)
  //     setInputStudent((prev) => {
  //       return { ...prev, durationMinutes: diffInMinutes }
  //     })
  //   }
  // }, [startOfLesson, endOfLesson])

  // const onChangeHandler = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  // ) => {
  //   const { name, value } = e.target

  //   setInputStudent((prev) => {
  //     return { ...prev, [name]: value }
  //   })
  // }

  // const updateHandler = async () => {
  //   setError('')
  //   if (
  //     !inputStudent.firstName ||
  //     !inputStudent.lastName ||
  //     !inputStudent.instrument
  //   ) {
  //     setError('Einige Pfilchtfelder sind leer')
  //     return
  //   }
  //   setIsPending(true)
  //   try {
  //     await updateStudent(inputStudent)
  //     toast('Änderungen gespeichert')
  //     onCloseModal?.()
  //   } catch (err) {
  //     fetchErrorToast()
  //   } finally {
  //     setIsPending(false)
  //   }
  // }

  return (
    <div className="edit-student">
      <h2 className="heading-2">
        Schüler:in{studentIds.length > 1 ? 'nen' : ''} bearbeiten
      </h2>
      <div className="labels" style={{ gridTemplateColumns: grid }}>
        <span>Vorname*</span>
        <span>Nachname*</span>
        <span>Instrument*</span>
        <span>Tag</span>
        <span>Von</span>
        <span>Bis</span>
        <span>Dauer</span>
        <span>Ort</span>
      </div>

      {inputStudents.map((student) => (
        <EditStudentRow student={student} key={student.id} />
      ))}

      {/* <form className={`grid ${isPending ? 'loading' : ''}`}>
        <div className="item">
          <label htmlFor="firstName">
            Vorname*
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={firstName}
              onChange={onChangeHandler}
            />
          </label>
        </div>

        <div className="item">
          <label htmlFor="lastName">
            Nachname*
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={lastName}
              onChange={onChangeHandler}
            />
          </label>
        </div>
        <div className="item">
          <label htmlFor="instrument">
            Instrument*
            <input
              id="instrument"
              type="text"
              name="instrument"
              value={instrument}
              onChange={onChangeHandler}
            />
          </label>
        </div>
        <div className="item">
          <label htmlFor="dayOfLesson">
            Tag
            <select
              id="dayOfLesson"
              name="dayOfLesson"
              value={dayOfLesson}
              onChange={onChangeHandler}
            >
              <option style={{ display: 'none' }} value="">
                Wochentag
              </option>
              <option value="Montag">Montag</option>
              <option value="Dienstag">Dienstag</option>
              <option value="Mittwoch">Mittwoch</option>
              <option value="Donnerstag">Donnerstag</option>
              <option value="Freitag">Freitag</option>
              <option value="Samstag">Samstag</option>
              <option value="Sonntag">Sonntag</option>
              <option value=""> - </option>
            </select>
          </label>
        </div>

        <div className="item">
          <label htmlFor="startOfLesson">
            Von
            <input
              id="startOfLesson"
              type="time"
              name="startOfLesson"
              value={startOfLesson}
              onChange={onChangeHandler}
            />
          </label>
        </div>
        <div className="item">
          <label htmlFor="endOfLesson">
            Bis
            <input
              id="endOfLesson"
              type="time"
              name="endOfLesson"
              value={endOfLesson}
              onChange={onChangeHandler}
            />
          </label>
        </div>
        <div className="item">
          <label htmlFor="durationMinutes">
            Dauer
            <input
              id="durationMinutes"
              type="number"
              name="durationMinutes"
              value={durationMinutes}
              onChange={onChangeHandler}
            />
          </label>
        </div>
        <div className="item">
          <label htmlFor="location">
            Unterrichtsort
            <input
              id="location"
              type="text"
              name="location"
              onChange={onChangeHandler}
              value={location}
            />
          </label>
        </div>
      </form> */}
      <div className="edit-student__buttons">
        <div className="error-message">{error}</div>
        <Button
          type="button"
          btnStyle="secondary"
          label="Abbrechen"
          handler={onCloseModal}
          disabled={isPending}
        />
        {/* <Button
          type="button"
          btnStyle="primary"
          label="Speichern"
          handler={updateHandler}
          disabled={isPending}
        /> */}
      </div>
    </div>
  )
}

export default EditStudents
