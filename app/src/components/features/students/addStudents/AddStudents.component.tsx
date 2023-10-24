import './addStudents.style.scss'
import { FC, useState } from 'react'
import { TStudent } from '../../../../types/types'
import { toast } from 'react-toastify'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import AddStudentRow from '../addStudentRow/AddStudentRow'
import Button from '../../../common/button/Button.component'
import { IoAddOutline } from 'react-icons/io5'
import { useStudents } from '../../../../contexts/StudentContext'

interface AddStudentsProps {
  onCloseModal?: () => void
}

export interface IRow extends TStudent {
  tempId: number
}

const rowData: IRow = {
  firstName: '',
  lastName: '',
  instrument: '',
  dayOfLesson: '',
  startOfLesson: '',
  endOfLesson: '',
  durationMinutes: undefined,
  location: '',
  archive: false,
  tempId: 0,
}

const AddStudents: FC<AddStudentsProps> = ({ onCloseModal }) => {
  const [rows, setRows] = useState([rowData])
  const [numAddRows, setNumAddRows] = useState(1)
  const { saveNewStudents, isPending } = useStudents()
  const [error, setError] = useState('')
  const disabled = rows.length === 0

  const addRows = () => {
    const newRows = []
    for (let i = 0; i < numAddRows; i++) {
      newRows.push({ ...rowData, tempId: Math.floor(Math.random() * 1000000) })
    }
    setRows((prev) => [...prev, ...newRows])
    setNumAddRows(1)
  }

  const handlerSaveStudent = async () => {
    setError('')
    const emptyFirstName = rows.filter((row) => !row.firstName)
    const emptyLastName = rows.filter((row) => !row.lastName)
    const emptyInstrument = rows.filter((row) => !row.instrument)

    if (
      emptyFirstName.length ||
      emptyLastName.length ||
      emptyInstrument.length
    ) {
      setError('Einige Pfilchtfelder sind leer')
      return
    }
    const newStudents: TStudent[] = rows.map((row) => {
      const { tempId, ...newStudent } = row
      return newStudent
    })
    try {
      await saveNewStudents(newStudents)
      onCloseModal?.()
      toast('Schüler:in erstellt')
    } catch {
      fetchErrorToast()
    }
  }
  return (
    <div className="add-students">
      <h2 className="heading-2">Neue Schüler:innen erfassen</h2>

      <div className="add-students__grid labels">
        <span className="label">Vorname *</span>
        <span className="label">Nachname *</span>
        <span className="label">Instrument *</span>
        <span className="label">Tag</span>
        <span className="label">Von</span>
        <span className="label">Bis</span>
        <span className="label">Dauer</span>
        <span className="label">Unterrichtsort</span>
      </div>
      <form action="" className="add-students__form">
        {rows.map((row, index) => (
          <AddStudentRow
            key={row.tempId}
            id={row.tempId}
            rows={rows}
            setRows={setRows}
          />
        ))}
      </form>
      <div className="container--infos">
        <p>* Pflichtfelder</p>
      </div>
      <div className="container--buttons">
        <div className="add-rows">
          <input
            tabIndex={-1}
            type="number"
            value={numAddRows}
            onChange={(e) => {
              setNumAddRows(e.target.valueAsNumber)
            }}
            onKeyUp={(e) => {
              e.key === 'Enter' && addRows()
            }}
          />
          <Button
            type="button"
            btnStyle="icon-only"
            icon={<IoAddOutline />}
            handler={addRows}
            tabIndex={-1}
          />
        </div>
        <div className="save-rows">
          <Button
            type="button"
            btnStyle="primary"
            label={isPending ? '...wird gespeichert' : 'Speichern'}
            handler={handlerSaveStudent}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="container--error">{error}</div>
    </div>
  )
}

export default AddStudents
