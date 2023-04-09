// Icons
import { IoSearchOutline } from 'react-icons/io5'

// Hooks
import { useStudents } from '../../../contexts/StudentContext'
import Button from '../../../components/button/Button.component'
// Components
import StudentRow from '../../../components/studentRow/StudentRow'
import { useState } from 'react'
import { TStudent } from '../../../types/types'
import Loader from '../../../components/loader/Loader'
import StudentList from '../../../components/studentlist/StudentList.component'

import Modal from '../../../components/modals/Modal.component'
import NoStudents from '../../../components/noContent/NoContent.component'
import NoContent from '../../../components/noContent/NoContent.component'

function StudentsArchive() {
  const { students, reactivateStudents, deleteStudents, archivedStudents } =
    useStudents()
  const [isSelected, setIsSelected] = useState<number[]>([])
  const [inputAction, setInputAction] = useState<number>(0)
  const [searchInput, setSearchInput] = useState('')

  const [modalOpen, setModalOpen] = useState(false)

  const filteredStudents = archivedStudents?.filter(
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
      reactivateStudents(isSelected)
      setInputAction(0)
      setIsSelected([])
    }

    if (inputAction === 2) {
      setModalOpen(true)
      setInputAction(0)
    }
  }

  const handlerDelete = async () => {
    deleteStudents(isSelected)
    setModalOpen(false)
    setIsSelected([])
  }

  return (
    <>
      <div className="students">
        {archivedStudents.length ? (
          <>
            <div className="header">
              <div className="container--heading">
                <span>
                  Archivierte Schüler:innen: {archivedStudents.length}
                </span>
              </div>
              <div className="container--controls">
                <select
                  // defaultValue="Aktion"
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
          <NoContent heading="Dein Archiv ist zurzeit leer"></NoContent>
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
              handler: handlerDelete,
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
