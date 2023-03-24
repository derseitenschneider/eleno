// Icons
import { IoSearchOutline } from 'react-icons/io5'

// Hooks
import { useStudents } from '../../../contexts/StudentContext'
import Button from '../../../components/button/Button.component'
// Components
import StudentRow from '../../../components/studentRow/StudentRow'
import { useState } from 'react'
import { TStudent } from '../../../types/types'
import { toast } from 'react-toastify'
import { useLoading } from '../../../contexts/LoadingContext'
import Loader from '../../../components/loader/Loader'
import StudentList from '../../../components/studentlist/StudentList.component'
import {
  deleteStudentSupabase,
  reactivateStudentSupabase,
} from '../../../supabase/students/students.supabase'
import Modal from '../../../components/modals/Modal.component'
import NoStudents from '../../../components/noStudents/NoStudents'

function StudentsArchive() {
  const { students, setStudents } = useStudents()
  const { loading } = useLoading()
  const [isSelected, setIsSelected] = useState<number[]>([])
  const [inputAction, setInputAction] = useState<number>(null)
  const [searchInput, setSearchInput] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [currentStudentIdDelete, setcurrentStudentIdDelete] =
    useState<TStudent | null>(null)

  const archiveStudents = students.filter((student) => student.archive)
  const filteredStudents = archiveStudents?.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchInput) ||
      student.lastName.toLocaleLowerCase().includes(searchInput) ||
      student.instrument.toLocaleLowerCase().includes(searchInput) ||
      student.location.toLocaleLowerCase().includes(searchInput) ||
      student.dayOfLesson.toLocaleLowerCase().includes(searchInput)
  )

  const onChangeAction = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputAction(+e.target.value)
  }

  const handlerAction = async () => {
    if (inputAction === 1) {
      const newStudents = students.map((student) =>
        isSelected.includes(student.id)
          ? { ...student, archive: false }
          : student
      )
      setStudents(newStudents)
      setInputAction(0)
      try {
        await reactivateStudentSupabase(isSelected)
        setIsSelected([])
        toast('Schüler:innen wiederhergestellt')
      } catch (err) {
        console.log(err)
      }
      setIsSelected([])
    }

    if (inputAction === 2) {
      setModalOpen(true)
      setInputAction(0)
    }
  }

  const deleteStudents = async () => {
    const newStudents = students.filter(
      (student) => !isSelected.includes(student.id)
    )
    setStudents(newStudents)
    setModalOpen((prev) => !prev)
    try {
      await deleteStudentSupabase(isSelected)
      toast('Schüler:innen gelöscht')
    } catch (err) {
      console.log(err)
    }
    setIsSelected([])
  }

  return (
    <>
      <Loader loading={loading} />
      <div className="students">
        {!loading && archiveStudents.length ? (
          <>
            <div className="header">
              <div className="container--heading">
                <h1 className="heading-1">Archiv</h1>
                <span>Archivierte Schüler:innen: {archiveStudents.length}</span>
              </div>
              <div className="container--controls">
                <select
                  defaultValue="Aktion"
                  className="select-action"
                  onChange={onChangeAction}
                  value={inputAction}
                  disabled={isSelected.length === 0}
                >
                  <option disabled hidden value={0}>
                    Aktion
                  </option>
                  <option value={1}>Wiederherstellen</option>
                  <option value={2}>Löschen</option>
                </select>
                {inputAction && isSelected.length ? (
                  <Button
                    label="Anwenden"
                    btnStyle="primary"
                    type="button"
                    handler={handlerAction}
                  />
                ) : null}

                <div className="container-right">
                  <IoSearchOutline className="icon icon-search" />
                  <input
                    className="input input--search"
                    type="search"
                    placeholder="suchen"
                    value={searchInput}
                    onChange={(e) =>
                      setSearchInput(e.target.value.toLowerCase())
                    }
                  />
                </div>
              </div>
            </div>

            <StudentList
              students={filteredStudents}
              isArchive={true}
              isSelected={isSelected}
              setIsSelected={setIsSelected}
            />
          </>
        ) : (
          <NoStudents heading="Dein Archiv ist zurzeit leer"></NoStudents>
        )}
      </div>
      {modalOpen && (
        <Modal
          heading="Ausgewählte Schüler:innen löschen?"
          handlerClose={() => setModalOpen((prev) => !prev)}
          handlerOverlay={() => setModalOpen((prev) => !prev)}
          buttons={[
            {
              label: 'Abbrechen',
              btnStyle: 'primary',
              handler: () => {
                setModalOpen((prev) => !prev)
              },
            },
            {
              label: 'Löschen',
              btnStyle: 'danger',
              handler: deleteStudents,
            },
          ]}
        >
          Möchtest du die ausgewählten Schüler:innen und alle zugehörigen Daten
          endgültig löschen?
        </Modal>
      )}
    </>
  )
}

export default StudentsArchive
