import { FunctionComponent } from 'react'
import { useState } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import { TStudent } from '../../types/types'
import Button from '../button/Button.component'
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
  startOfLesson: '',
  endOfLesson: '',
  location: '',
  id: null,
}
// [ ] popup instead of new row but with bulk function to add multiple students

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
          <tbody>
            <tr className="student-row student-row--new">
              <td>
                <input
                  name="firstName"
                  className="input input--firstName"
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
                  className="input input--lastName"
                  onChange={changeHandler}
                  value={input.lastName}
                  required
                  type="text"
                  placeholder="Nachname"
                />
              </td>
              <td>
                <input
                  className="input input--instrument"
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
                  className="input input--dayOfLesson"
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
                  className="input input--time"
                  value={input.startOfLesson}
                  onChange={changeHandler}
                />
                <span> - </span>
                <input
                  name="endOfLesson"
                  type="text"
                  placeholder="bis"
                  className="input input--time"
                  value={input.endOfLesson}
                  onChange={changeHandler}
                />
              </td>
              <td>
                <input
                  name="durationMinutes"
                  type="text"
                  placeholder=""
                  className="input input--duration"
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
                  className="input input--location"
                  value={input.location}
                  onChange={changeHandler}
                />
              </td>
              <td>
                <div className="new-student-buttons">
                  <button
                    type="button"
                    title="Löschen"
                    className="btn-delete"
                    onClick={handlerCloseButton}
                  >
                    <IoCloseOutline className="icon icon-delete" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="container-btn">
          <Button type="submit" label="Speichern" btnStyle="primary" />
        </div>
      </form>
    </>
  )
}

export default NewStudentRow
