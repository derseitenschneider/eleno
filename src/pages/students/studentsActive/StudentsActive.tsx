import './studentsActive.style.scss'

// Types
import { TSorting, TSortingMethods } from '../../../types/types'

// Icons
import { IoSearchOutline, IoAddOutline } from 'react-icons/io5'

// Hooks
import { useEffect, useState } from 'react'
import { useStudents } from '../../../contexts/StudentContext'

// Functions
import { NavLink, useActionData } from 'react-router-dom'
import { sortStudents } from '../../../utils/sortStudents'
import { toast } from 'react-toastify'

// Components
import Button from '../../../components/button/Button.component'
import Loader from '../../../components/loader/Loader'
import { useLoading } from '../../../contexts/LoadingContext'
import NoStudents from '../../../components/noStudents/NoStudents'
import StudentList from '../../../components/studentlist/StudentList.component'
import ModalAddStudent from '../../../components/modals/modalAddStudent/ModalAddStudent.component'
import {
  archivateStudentSupabase,
  resetStudentSupabase,
  updateStudentSupabase,
} from '../../../supabase/students/students.supabase'
import Modal from '../../../components/modals/Modal.component'
import { useNavigate } from 'react-router-dom'

export default function StudentsActive() {
  // STATE
  const navigate = useNavigate()
  const { students, setStudents } = useStudents()
  const [searchInput, setSearchInput] = useState('')
  const [modalAddOpen, setModalAddOpen] = useState(false)
  const [modalResetOpen, setModalResetOpen] = useState(false)
  const [sorting, setSorting] = useState<TSorting>({
    method: 'lastName',
    ascending: true,
  })
  const { loading } = useLoading()
  const [isSelected, setIsSelected] = useState<number[]>([])
  const [inputAction, setInputAction] = useState<number>(null)

  const activeStudents = students.filter((student) => !student.archive) || []

  const filteredStudents = activeStudents?.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchInput) ||
      student.lastName.toLocaleLowerCase().includes(searchInput) ||
      student.instrument.toLocaleLowerCase().includes(searchInput) ||
      student.location.toLocaleLowerCase().includes(searchInput) ||
      student.dayOfLesson.toLocaleLowerCase().includes(searchInput)
  )

  // HANDLER-FUNCTIONS //

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
      const newStudents = students.map((student) =>
        isSelected.includes(student.id)
          ? { ...student, archive: true }
          : student
      )
      setStudents(newStudents)
      setInputAction(0)
      try {
        await archivateStudentSupabase(isSelected)
        setIsSelected([])
        toast('Schüler:innen archiviert')
      } catch (err) {
        console.log(err)
      }
    }

    if (inputAction === 2) {
      setModalResetOpen(true)
      setInputAction(0)
    }
  }

  const resetLessonData = async () => {
    const newStudents = students.map((student) =>
      isSelected.includes(student.id)
        ? {
            ...student,
            dayOfLesson: '',
            startOfLesson: '',
            endOfLesson: '',
            durationMinutes: 0,
            location: '',
          }
        : student
    )
    setStudents(newStudents)
    setModalResetOpen(false)
    setIsSelected([])
    setInputAction(null)
    try {
      await resetStudentSupabase(isSelected)
      toast('Unterrichtsdaten zurückgesetzt')
    } catch (error) {}
  }

  console.log(inputAction)

  return (
    <>
      <Loader loading={loading} />
      <div className="students">
        {!loading && activeStudents.length ? (
          <>
            <div className="header">
              <div className="container--heading">
                <h1 className="heading-1">Aktive Schüler:innen</h1>
                <span>Aktive Schüler:innen: {activeStudents.length}</span>
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
                    onChange={(e) =>
                      setSearchInput(e.target.value.toLowerCase())
                    }
                  />

                  <Button
                    handler={() => setModalAddOpen((prev) => !prev)}
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

        {!loading && activeStudents.length === 0 && (
          <NoStudents
            heading="Keine Schüler:innen vorhanden"
            buttons={[
              {
                label: 'Neue Schüler:in erfassen',
                handler: () => setModalAddOpen((prev) => !prev),
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
          </NoStudents>
        )}
      </div>
      {modalAddOpen && (
        <ModalAddStudent handlerClose={() => setModalAddOpen(false)} />
      )}
      {modalResetOpen && (
        <Modal
          handlerClose={() => {
            setModalResetOpen((prev) => !prev)
          }}
          handlerOverlay={() => {
            setModalResetOpen((prev) => !prev)
          }}
          heading="Unterrichtsdaten zurücksetzen"
          buttons={[
            {
              label: 'Abbrechen',
              btnStyle: 'primary',
              handler: () => {
                setModalResetOpen((prev) => !prev)
              },
            },
            {
              label: 'Zurücksetzen',
              btnStyle: 'danger',
              handler: resetLessonData,
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
