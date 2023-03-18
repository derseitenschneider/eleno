// Types
import { TSorting } from '../../../types/types'

// Icons
import { IoArchiveOutline } from 'react-icons/io5'
import { IoPersonAddOutline } from 'react-icons/io5'
import { IoSearchOutline } from 'react-icons/io5'
import { IoCloseOutline } from 'react-icons/io5'
import { IoSchoolOutline } from 'react-icons/io5'

// Hooks
import { useEffect, useState } from 'react'
import { useStudents } from '../../../contexts/StudentContext'

// Functions
import { postNewStudent } from '../../../supabase/students/students.supabase'
import { NavLink } from 'react-router-dom'
import { sortStudents } from '../../../utils/sortStudents'

// Components
import StudentRow from '../../../components/studentRow/StudentRow'
import NewStudentRow from '../../../components/newStudentRow/NewStudentRow'
import { TStudent } from '../../../types/types'
import Button from '../../../components/button/Button.component'
import { toast } from 'react-toastify'
import Loader from '../../../components/loader/Loader'
import { useLoading } from '../../../contexts/LoadingContext'
import { useUser } from '../../../contexts/UserContext'
import NoActiveStudent from '../../../components/noActiveStudent/NoActiveStudent'
import StudentList from '../../../components/studentlist/StudentList.component'

export default function StudentsActive() {
  // STATE
  const { user } = useUser()
  const { students, setStudents } = useStudents()
  const [searchInput, setSearchInput] = useState('')
  const [newStudentRowOpen, setNewStudentRowOpen] = useState(false)
  const [sorting, letSorting] = useState<TSorting>('lastName')
  const { loading, setLoading } = useLoading()

  const [activeStudents, setActiveStudents] = useState<TStudent[]>(students)
  const [sortedStudents, setSortedStudents] =
    useState<TStudent[]>(activeStudents)
  const [filteredStudents, setFilteredStudents] =
    useState<TStudent[]>(sortedStudents)

  // HANDLER-FUNCTIONS //
  const toggleNewStudentOpen = () => {
    setNewStudentRowOpen(!newStudentRowOpen)
  }

  const addStudentEventHandler = () => {
    toggleNewStudentOpen()
  }

  const onChangeHandlerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value.toLowerCase())
  }

  // const handlerArchive = (e: React.MouseEvent) => {
  //   const target = e.target as Element
  //   const id = +target.closest('button').dataset.id
  //   const newStudents = students.map((student) =>
  //     student.id === id ? { ...student, archive: true } : student
  //   )
  //   setStudents(newStudents)
  //   postArchiveStudent(id)
  //   toast('Schüler:in archiviert')
  // }

  const createNewStudent = (input: TStudent) => {
    const tempNewStudent = { ...input }
    const tempId = Math.floor(Math.random() * 10000000)
    tempNewStudent.id = tempId
    setStudents((students) => [...students, tempNewStudent])
    const postAndFetchStudent = async () => {
      const [data] = await postNewStudent(input, user.id)
      const newId = data.id
      setStudents((students) => {
        const newStudents = students.map((student) =>
          student.id === tempId ? { ...student, id: newId } : student
        )
        return newStudents
      })
    }
    postAndFetchStudent()
    setNewStudentRowOpen(false)
    toast('Schüler:in erstellt')
  }

  // [ ] implement sorting functionallity with buttons
  // SORT & FILTER STUDENTS
  // const activeStudents = students.filter((student) => !student.archive)

  // [ ] get rid of effects -> change them to memo or none
  useEffect(() => {
    const activeStudents = students.filter((student) => !student.archive)
    setActiveStudents(activeStudents)
  }, [students])

  useEffect(() => {
    // const sortedStudents = sortStudents(activeStudents, sorting)
    // setSortedStudents(activeStudents)
  }, [activeStudents])

  useEffect(() => {
    const filteredStudents = activeStudents.filter(
      (student) =>
        student.firstName.toLowerCase().includes(searchInput) ||
        student.lastName.toLocaleLowerCase().includes(searchInput) ||
        student.instrument.toLocaleLowerCase().includes(searchInput) ||
        student.location.toLocaleLowerCase().includes(searchInput) ||
        student.dayOfLesson.toLocaleLowerCase().includes(searchInput)
    )

    setFilteredStudents(filteredStudents)
  }, [searchInput, activeStudents])

  // useEffect(() => {
  //   const handleEvent = (e: KeyboardEvent) => {
  //     e.key === 'n' && toggleNewStudentOpen()
  //   }
  //   window.addEventListener('keyup', handleEvent)

  //   return () => {
  //     window.removeEventListener('keyup', handleEvent)
  //   }
  // }, [])

  return (
    <>
      <Loader loading={loading} />
      <div className="students-active">
        {!loading && activeStudents.length ? (
          <>
            <h1>Liste Schüler:innen</h1>
            <span>
              Anzahl Schüler:innen <span>{activeStudents.length}</span>
            </span>
            <div className="container-list">
              <div className="heading">
                <select
                  name=""
                  id=""
                  defaultValue="Aktion"
                  className="select-action"
                >
                  <option disabled hidden>
                    Aktion
                  </option>
                  <option value="archive">Archivieren</option>
                  <option value="delete">Löschen</option>
                </select>

                <div className="container-right">
                  <IoSearchOutline className="icon icon-search" />
                  <input
                    className="input input--search"
                    type="search"
                    placeholder="suchen"
                    value={searchInput}
                    onChange={onChangeHandlerInput}
                  />

                  <Button
                    handler={addStudentEventHandler}
                    btnStyle="primary"
                    type="button"
                    label="Neu"
                    icon={<IoPersonAddOutline />}
                    className={`${newStudentRowOpen && 'inactive'}  `}
                  />
                </div>
              </div>
              <StudentList students={filteredStudents} />
              {/* <div className="student-list">
                <div className="student-list__head">
                  <div>
                    <input type="checkbox" />
                  </div>
                  <div className="th--firstName">Vorname</div>
                  <div className="th--lastName">Nachname</div>
                  <div className="th--instrument">Instrument</div>
                  <div className="th--day">Tag</div>
                  <div className="th--time">Zeit</div>
                  <div className="th--duration">Dauer</div>
                  <div>Unterrichtsort</div>
                  <div></div>
                </div>

                <tbody>
                  {filteredStudents.map((student) => (
                    <StudentRow
                      key={student.id}
                      form={true}
                      student={student}
                      buttons={[
                        {
                          label: 'Unterrichtsblatt',
                          icon: IoSchoolOutline,
                          handler: () => {},
                        },
                        {
                          label: 'Archivieren',
                          icon: IoArchiveOutline,
                          handler: handlerArchive,
                        },
                      ]}
                    />
                  ))}
                </tbody>
              </div> */}
            </div>
          </>
        ) : null}

        {!loading && activeStudents.length <= 0 && !newStudentRowOpen && (
          <NoActiveStudent handler={addStudentEventHandler} />
        )}

        {newStudentRowOpen && (
          <NewStudentRow
            handlerSubmit={createNewStudent}
            handlerCloseButton={toggleNewStudentOpen}
          />
        )}
      </div>
    </>
  )
}
