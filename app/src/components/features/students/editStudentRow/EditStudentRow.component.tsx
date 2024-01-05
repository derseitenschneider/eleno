import './editStudentRow.style.scss'
import { SetStateAction, useEffect, useState } from 'react'
import { TStudent } from '../../../../types/types'
import calcTimeDifference from '../../../../utils/calcTimeDifference'

interface EditStudentRowProps {
  student: TStudent
  setInputStudents: React.Dispatch<SetStateAction<TStudent[]>>
}

function EditStudentRow({ student, setInputStudents }: EditStudentRowProps) {
  const [input, setInput] = useState(student)
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
  } = input

  useEffect(() => {
    if (startOfLesson && endOfLesson && durationMinutes === 0) {
      console.log('test')
      const diffInMinutes = calcTimeDifference(startOfLesson, endOfLesson)
      setInput((prev) => {
        return { ...prev, durationMinutes: diffInMinutes }
      })

      setInputStudents((prev) =>
        prev.map((stud) =>
          stud.id === id
            ? { ...student, durationMinutes: diffInMinutes }
            : student,
        ),
      )
    }
  }, [
    startOfLesson,
    endOfLesson,
    setInputStudents,
    id,
    student,
    durationMinutes,
  ])

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    setInput((prev) => {
      return { ...prev, [name]: value }
    })

    setInputStudents((prev) => {
      const newStudents = prev.map((stud) => {
        if (stud.id === id) return { ...stud, [name]: value }
        return stud
      })
      return newStudents
    })
  }
  return (
    <div className="edit-student-row">
      <div className="item">
        <input
          id="firstName"
          type="text"
          name="firstName"
          value={firstName}
          onChange={handleOnChange}
        />
      </div>

      <div className="item">
        <input
          id="lastName"
          type="text"
          name="lastName"
          value={lastName}
          onChange={handleOnChange}
        />
      </div>
      <div className="item">
        <input
          id="instrument"
          type="text"
          name="instrument"
          value={instrument}
          onChange={handleOnChange}
        />
      </div>
      <div className="item">
        <select
          id="dayOfLesson"
          name="dayOfLesson"
          value={dayOfLesson}
          onChange={handleOnChange}
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
      </div>

      <div className="item">
        <input
          id="startOfLesson"
          type="time"
          name="startOfLesson"
          value={startOfLesson}
          onChange={handleOnChange}
        />
      </div>
      <div className="item">
        <input
          id="endOfLesson"
          type="time"
          name="endOfLesson"
          value={endOfLesson}
          onChange={handleOnChange}
        />
      </div>
      <div className="item">
        <input
          id="durationMinutes"
          type="number"
          name="durationMinutes"
          value={durationMinutes}
          onChange={handleOnChange}
        />
      </div>
      <div className="item">
        <input
          id="location"
          type="text"
          name="location"
          onChange={handleOnChange}
          value={location}
        />
      </div>
    </div>
  )
}

export default EditStudentRow
