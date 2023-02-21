import { FunctionComponent } from 'react'
import { useState } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import { SubmitFunction } from 'react-router-dom'
import { TStudent } from '../../types/Students.type'
import './newstudentrow.style.scss'

interface NewStudentRowProps {
  handlerSubmit: (input: TStudent) => void
  handlerCloseButton: () => void
}

const studentData: TStudent = {
  firstName: '',
  lastName: '',
  instrument: '',
  durationMinutes: 0,
  archive: false,
  dayOfLesson: 'Montag',
  location: '',
  id: null,
}

const NewStudentRow: FunctionComponent<NewStudentRowProps> = ({
  handlerSubmit,
  handlerCloseButton,
}) => {
  const [input, setInput] = useState(studentData)

  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handlerSubmit(input)
        }}
      >
        <table className="student-list-table add-new">
          <tr className="new-student-row">
            <td>
              <input
                name="firstName"
                value={input.firstName}
                onChange={changeHandler}
                required
                type="text"
                placeholder="Vorname"
                autoFocus
              />
            </td>
            <td>
              <input
                name="lastName"
                onChange={changeHandler}
                value={input.lastName}
                required
                type="text"
                placeholder="Nachname"
              />
            </td>
            <td>
              <input
                name="instrument"
                value={input.instrument}
                onChange={changeHandler}
                required
                type="text"
                placeholder="Instrument"
              />
            </td>
            <td>
              <select
                name="dayOfLesson"
                id=""
                value={input.dayOfLesson}
                onChange={changeHandler}
              >
                <option selected disabled hidden>
                  Tag
                </option>
                <option value="Montag">Montag</option>
                <option value="Dienstag">Dienstag</option>
                <option value="Mittwoch">Mittwoch</option>
                <option value="Donnerstag">Donnerstag</option>
                <option value="Freitag">Freitag</option>
              </select>
            </td>
            <td>
              <input
                name="startOfLesson"
                type="text"
                placeholder="von"
                className="input-time"
                value={input.startOfLesson}
                onChange={changeHandler}
              />
              <span> - </span>
              <input
                name="endOfLesson"
                type="text"
                placeholder="bis"
                className="input-time"
                value={input.endOfLesson}
                onChange={changeHandler}
              />
            </td>
            <td>
              <input
                name="durationMinutes"
                type="text"
                placeholder=""
                className="input-duration"
                value={input.durationMinutes}
                onChange={changeHandler}
              />
              <span>min</span>
            </td>
            <td>
              <input
                name="location"
                type="text"
                placeholder="Ort"
                className="input-location"
                value={input.location}
                onChange={changeHandler}
              />
            </td>
            <td>
              <div className="new-student-buttons">
                <button
                  title="Löschen"
                  className="btn-delete"
                  onClick={handlerCloseButton}
                >
                  <IoCloseOutline className="icon icon-delete" />
                </button>
              </div>
            </td>
          </tr>
        </table>
        <button type="submit" title="Speichern" className="btn-save">
          Speichern
        </button>
      </form>
    </>
  )
}

export default NewStudentRow
