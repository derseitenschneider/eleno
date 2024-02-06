import { SetStateAction, useEffect } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import Button from '../../../ui/button/Button.component'

import { TStudent } from '../../../../types/types'
import calcTimeDifference from '../../../../utils/calcTimeDifference'

export interface IRow extends TStudent {
  tempId: number
}
interface AddStudentRowProps {
  id: number
  rows: IRow[]
  setRows: React.Dispatch<SetStateAction<IRow[]>>
}

function AddStudentRow({ id, rows, setRows }: AddStudentRowProps) {
  const {
    firstName,
    lastName,
    instrument,
    dayOfLesson,
    startOfLesson,
    endOfLesson,
    durationMinutes,
    location,
  } = rows.find((row) => row.tempId === id)

  useEffect(() => {
    if (startOfLesson && endOfLesson) {
      const diffInMinutes = calcTimeDifference(startOfLesson, endOfLesson)
      setRows((prev) =>
        prev.map((row) =>
          row.tempId === id
            ? { ...row, durationMinutes: String(diffInMinutes) }
            : row,
        ),
      )
    }
  }, [startOfLesson, endOfLesson, setRows, id])

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    setRows((prevRows) => {
      const newRows = prevRows.map((row) =>
        row.tempId === id ? { ...row, [name]: value } : row,
      )
      return newRows
    })
  }

  const deleteRow = () => {
    setRows((prev) => prev.filter((row) => row.tempId !== id))
  }

  return (
    <div className="add-students__grid row">
      <input
        autoFocus={window.screen.width > 1000}
        type="text"
        autoComplete="off"
        placeholder="Vorname"
        name="firstName"
        value={firstName}
        onChange={handleInput}
      />
      <input
        type="text"
        autoComplete="off"
        placeholder="Nachname"
        name="lastName"
        value={lastName}
        onChange={handleInput}
      />
      <input
        type="text"
        placeholder="Instrument"
        name="instrument"
        value={instrument}
        onChange={handleInput}
      />
      <select
        name="dayOfLesson"
        value={dayOfLesson}
        onChange={handleInput}
        defaultValue=""
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
      <input
        type="time"
        placeholder="Von"
        name="startOfLesson"
        value={startOfLesson}
        onChange={handleInput}
      />
      <input
        type="time"
        placeholder="Bis"
        name="endOfLesson"
        value={endOfLesson}
        onChange={handleInput}
      />
      <input
        autoComplete="off"
        type="number"
        placeholder="Minuten"
        name="durationMinutes"
        value={durationMinutes}
        onChange={handleInput}
      />
      <input
        type="text"
        placeholder="Unterrichtsort"
        name="location"
        value={location}
        onChange={handleInput}
      />
      <Button
        type="button"
        btnStyle="icon-only"
        icon={<IoCloseOutline />}
        className="button--delete-row"
        handler={deleteRow}
        tabIndex={-1}
      />
    </div>
  )
}

export default AddStudentRow
