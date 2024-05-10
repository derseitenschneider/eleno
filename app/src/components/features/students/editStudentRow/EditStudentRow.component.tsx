import "./editStudentRow.style.scss"
import { type SetStateAction, useEffect } from "react"
import type { Student } from "../../../../types/types"
import calcTimeDifference from "../../../../utils/calcTimeDifference"

interface EditStudentRowProps {
  student: Student
  setInputStudents: React.Dispatch<SetStateAction<Student[]>>
}

function EditStudentRow({ student, setInputStudents }: EditStudentRowProps) {
  const {
    firstName,
    lastName,
    instrument,
    dayOfLesson,
    startOfLesson,
    endOfLesson,
    durationMinutes,
    location,
    id,
  } = student

  useEffect(() => {
    if (startOfLesson && endOfLesson) {
      const diffInMinutes = calcTimeDifference(startOfLesson, endOfLesson)

      setInputStudents((prev) =>
        prev.map((stud) =>
          stud.id === id
            ? { ...stud, durationMinutes: String(diffInMinutes) }
            : stud,
        ),
      )
    }
  }, [startOfLesson, endOfLesson, setInputStudents, id])

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    setInputStudents((prev) => {
      const newStudents = prev.map((stud) => {
        if (stud.id === id) return { ...stud, [name]: value }
        return stud
      })
      return newStudents
    })
  }
  return (
    <div className='edit-student-row'>
      <div className='item'>
        <input
          id='firstName'
          type='text'
          name='firstName'
          value={firstName}
          onChange={handleOnChange}
        />
      </div>

      <div className='item'>
        <input
          id='lastName'
          type='text'
          name='lastName'
          value={lastName}
          onChange={handleOnChange}
        />
      </div>
      <div className='item'>
        <input
          id='instrument'
          type='text'
          name='instrument'
          value={instrument}
          onChange={handleOnChange}
        />
      </div>
      <div className='item'>
        <select
          id='dayOfLesson'
          name='dayOfLesson'
          value={dayOfLesson}
          onChange={handleOnChange}
        >
          <option style={{ display: "none" }} value=''>
            Wochentag
          </option>
          <option value='Montag'>Montag</option>
          <option value='Dienstag'>Dienstag</option>
          <option value='Mittwoch'>Mittwoch</option>
          <option value='Donnerstag'>Donnerstag</option>
          <option value='Freitag'>Freitag</option>
          <option value='Samstag'>Samstag</option>
          <option value='Sonntag'>Sonntag</option>
          <option value=''> - </option>
        </select>
      </div>

      <div className='item'>
        <input
          id='startOfLesson'
          type='time'
          name='startOfLesson'
          value={startOfLesson}
          onChange={handleOnChange}
        />
      </div>
      <div className='item'>
        <input
          id='endOfLesson'
          type='time'
          name='endOfLesson'
          value={endOfLesson}
          onChange={handleOnChange}
        />
      </div>
      <div className='item'>
        <input
          id='durationMinutes'
          type='number'
          name='durationMinutes'
          value={durationMinutes}
          onChange={handleOnChange}
        />
      </div>
      <div className='item'>
        <input
          id='location'
          type='text'
          name='location'
          onChange={handleOnChange}
          value={location}
        />
      </div>
    </div>
  )
}

export default EditStudentRow
