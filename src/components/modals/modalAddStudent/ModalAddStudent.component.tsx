import './modalAddStudent.style.scss'
import { FunctionComponent, useState } from 'react'
import Modal from '../Modal.component'
import AddStudentRow from '../../addStudentRow/AddStudentRow'
import Button from '../../button/Button.component'
import { IoAddOutline } from 'react-icons/io5'
import { TStudent } from '../../../types/types'
import { useStudents } from '../../../contexts/StudentContext'
import { createNewStudentSupabase } from '../../../supabase/students/students.supabase'
import { useUser } from '../../../contexts/UserContext'
import { toast } from 'react-toastify'
import Loader from '../../loader/Loader'

interface ModalAddStudentProps {
  handlerClose: () => void
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

/* [ ] Warning for closing modal when data exists*/

const ModalAddStudent: FunctionComponent<ModalAddStudentProps> = ({
  handlerClose,
}) => {
  const [rows, setRows] = useState([rowData])
  const [numAddRows, setNumAddRows] = useState(1)
  const { setStudents } = useStudents()
  const { user } = useUser()
  const [isPending, setIsPending] = useState(false)
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

  const saveStudents = () => {
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
    // [ ] inputvalidation

    const postAndFetchStudent = async () => {
      setIsPending(true)
      const data = await createNewStudentSupabase(newStudents, user.id)
      setStudents((prev) => [...prev, ...data])
      setIsPending(false)
      handlerClose()
      toast('Schüler:in erstellt')
    }
    postAndFetchStudent()
  }

  return (
    <Modal
      heading="Neue Schüler:in erfassen"
      handlerClose={handlerClose}
      handlerOverlay={handlerClose}
      buttons={[]}
      className={'modal--add-student'}
    >
      <Loader loading={isPending} />
      {!isPending && (
        <>
          <div className="labels grid">
            <span className="label">Vorname *</span>
            <span className="label">Nachname *</span>
            <span className="label">Instrument *</span>
            <span className="label">Tag</span>
            <span className="label">Von</span>
            <span className="label">Bis</span>
            <span className="label">Dauer</span>
            <span className="label">Unterrichtsort</span>
          </div>
          <form action="" className="form">
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
                handler={saveStudents}
                disabled={disabled}
              />
            </div>
          </div>

          <div className="container--error">{error}</div>
        </>
      )}
    </Modal>
  )
}

export default ModalAddStudent
