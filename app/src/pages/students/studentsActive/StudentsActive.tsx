import './studentsActive.style.scss'

// Types
import {
  TModalsActiveStudents,
  TSorting,
  TSortingMethods,
} from '../../../types/types'

// Icons
import { IoSearchOutline, IoAddOutline } from 'react-icons/io5'

// Hooks
import { useEffect, useState } from 'react'
import { useStudents } from '../../../contexts/StudentContext'

// Functions

import { sortStudents } from '../../../utils/sortStudents'
import { toast } from 'react-toastify'

// Components
import Button from '../../../components/common/button/Button.component'

import StudentList from '../../../components/students/studentlist/StudentList.component'
import ModalAddStudent from '../../../components/modals/modalAddStudent/ModalAddStudent.component'

import Modal from '../../../components/modals/Modal.component'
import { useNavigate, useSearchParams } from 'react-router-dom'
import NoContent from '../../../components/common/noContent/NoContent.component'
import fetchErrorToast from '../../../hooks/fetchErrorToast'

export default function StudentsActive() {
  // STATE
  const navigate = useNavigate()
  const { archivateStudents, resetLessonData, activeStudents } = useStudents()
  const [searchInput, setSearchInput] = useState('')

  const [modalOpen, setModalOpen] = useState<TModalsActiveStudents>()
  const [sorting, setSorting] = useState<TSorting>({
    method: 'lastName',
    ascending: true,
  })
  const [isSelected, setIsSelected] = useState<number[]>([])
  const [inputAction, setInputAction] = useState<number>(0)
  const [isPending, setIsPending] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const modal = searchParams.get('modal') as TModalsActiveStudents
    if (modal) {
      setModalOpen(modal)
    }
  }, [])

  console.log(modalOpen)

  const filteredStudents = activeStudents?.filter(
    (student) =>
      student.firstName
        .toLowerCase()
        .includes(searchInput.toLowerCase().split(' ').join('')) ||
      student.lastName
        .toLowerCase()
        .includes(searchInput.toLowerCase().split(' ').join('')) ||
      `${student.firstName.toLowerCase()}${student.lastName.toLowerCase()}`.includes(
        searchInput.toLowerCase().split(' ').join('')
      ) ||
      student.instrument
        .toLowerCase()
        .includes(searchInput.toLowerCase().split(' ').join('')) ||
      student.location
        .toLowerCase()
        .includes(searchInput.toLowerCase().split(' ').join('')) ||
      student.dayOfLesson
        .toLowerCase()
        .includes(searchInput.toLowerCase().split(' ').join(''))
  )

  // HANDLER-FUNCTIONS //

  const closeModal = () => {
    setModalOpen(null)
    setSearchParams('')
  }

  const handlerSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setSearchInput(input)
  }

  const sortedStudents = sortStudents(filteredStudents, sorting)

  const sort = (method: TSortingMethods) => {
    sorting.method === method
      ? setSorting((prev) => {
          return { ...prev, ascending: !prev.ascending }
        })
      : setSorting({ method, ascending: true })
  }

  const onChangeAction = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputAction(+e.target.value)
  }

  const handlerAction = async () => {
    if (inputAction === 1) {
      try {
        await archivateStudents(isSelected)
        toast(`Schüler:in${isSelected.length > 1 ? 'nen' : ''} archiviert`)
        setInputAction(0)
        setIsSelected([])
      } catch (error) {
        fetchErrorToast()
      }
    }

    if (inputAction === 2) {
      setModalOpen('reset')
      setInputAction(0)
    }
  }

  const handlerReset = async () => {
    setIsPending(true)
    try {
      await resetLessonData(isSelected)
      closeModal()
      setIsSelected([])
      setInputAction(null)
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <div className="students">
        {activeStudents.length ? (
          <>
            <div className="header">
              <div className="container--heading">
                <span>Aktive Schüler:innen: {activeStudents.length}</span>
              </div>

              <div className="container--controls">
                <select
                  className="select-action"
                  onChange={onChangeAction}
                  value={inputAction}
                  disabled={isSelected.length === 0}
                >
                  <option disabled hidden value={0}>
                    Aktion
                  </option>
                  <option value={1}>Archivieren</option>
                  <option value={2}>Zurücksetzen</option>
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
                    autoFocus={window.screen.width > 1000 ? true : false}
                    onChange={handlerSearchInput}
                  />

                  <Button
                    handler={() => setModalOpen('add-student')}
                    btnStyle="primary"
                    type="button"
                    label="Neu"
                    icon={<IoAddOutline />}
                  />
                </div>
              </div>
            </div>
            <StudentList
              students={sortedStudents}
              sort={sort}
              sorting={sorting}
              isSelected={isSelected}
              setIsSelected={setIsSelected}
              isArchive={false}
            />
          </>
        ) : null}

        {activeStudents.length === 0 && (
          <NoContent
            heading="Keine Schüler:innen vorhanden"
            buttons={[
              {
                label: 'Neue Schüler:innen erfassen',
                handler: () => setModalOpen('add-student'),
              },
              {
                label: 'Aus Archiv wiederherstellen',
                handler: () => {
                  navigate('archive/')
                },
              },
            ]}
          >
            <p>
              Aktuell sind keine aktiven Schüler:innen vorhanden. Erfasse neue
              Schüler:innen oder geh ins Archiv und wähle welche aus, die du
              wiederherstellen möchtest
            </p>
          </NoContent>
        )}
      </div>
      {modalOpen === 'add-student' && (
        <ModalAddStudent handlerClose={closeModal} />
      )}
      {modalOpen === 'reset' && (
        <Modal
          handlerClose={closeModal}
          heading="Unterrichtsdaten zurücksetzen"
          className={isPending ? 'loading' : ''}
          buttons={[
            {
              label: 'Abbrechen',
              btnStyle: 'primary',
              handler: closeModal,
            },
            {
              label: 'Zurücksetzen',
              btnStyle: 'danger',
              handler: handlerReset,
            },
          ]}
        >
          <p>
            Möchtest du die Unterrichtsdaten{' '}
            <em>(Tag, Von, Bis, Dauer, Unterrichtsort)</em> der ausgewählten
            Schüler:innen zurücksetzen?
          </p>
        </Modal>
      )}
    </>
  )
}
