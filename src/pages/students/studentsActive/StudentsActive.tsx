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
import { postArchiveStudent } from '../../../supabase/supabase'
import { postNewStudent } from '../../../supabase/supabase'
import { NavLink } from 'react-router-dom'
import { sortStudents } from '../../../utils/sortStudents'

// Components
import StudentRow from '../../../components/studentRow/StudentRow'
import NewStudentRow from '../../../components/newStudentRow/NewStudentRow'
import { TStudent } from '../../../types/types'
import Button from '../../../components/button/Button.component'
import { toast } from 'react-toastify'

export default function StudentsActive() {
  // STATE
  const { students, setStudents } = useStudents()
  const [searchInput, setSearchInput] = useState('')
  const [newStudentRowOpen, setNewStudentRowOpen] = useState(false)
  const [sorting, letSorting] = useState<TSorting>('lastName')

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

  const handlerArchive = (e: React.MouseEvent) => {
    const target = e.target as Element
    const id = +target.closest('button').dataset.id
    const newStudents = students.map((student) =>
      student.id === id ? { ...student, archive: true } : student
    )
    setStudents(newStudents)
    postArchiveStudent(id)
    toast('Schüler:in archiviert')
  }

  const createNewStudent = (input: TStudent) => {
    const tempNewStudent = { ...input }
    const tempId = Math.floor(Math.random() * 10000000)
    tempNewStudent.id = tempId
    setStudents((students) => [...students, tempNewStudent])
    const postAndFetchStudent = async () => {
      const [data] = await postNewStudent(input)
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

  // SORT & FILTER STUDENTS //
  // const activeStudents = students.filter((student) => !student.archive)

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
    <div className="student-list">
      <h1>Liste Schüler:innen</h1>
      {activeStudents.length > 0 && (
        <>
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

            <table className="student-list-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th className="th--firstName">Vorname</th>
                  <th className="th--lastName">Nachname</th>
                  <th className="th--instrument">Instrument</th>
                  <th className="th--day">Tag</th>
                  <th className="th--time">Zeit</th>
                  <th className="th--duration">Dauer</th>
                  <th>Unterrichtsort</th>
                  <th></th>
                </tr>
              </thead>

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
            </table>
          </div>
          <div className="count-students">
            <p>
              Anzahl Schüler:innen <span>{activeStudents.length}</span>
            </p>
          </div>
        </>
      )}

      {activeStudents.length <= 0 && !newStudentRowOpen && (
        <>
          <h2>Keine Aktiven Schüler:innen in der Liste</h2>
          <div className="container-buttons">
            <Button
              type="button"
              btnStyle="primary"
              label="Neue Schüler:in erfassen"
              handler={addStudentEventHandler}
            />

            <NavLink to="archive">
              <Button
                type="button"
                btnStyle="secondary"
                label="Aus Archiv wiederherstellen"
              />
            </NavLink>
          </div>
        </>
      )}

      {newStudentRowOpen && (
        <NewStudentRow
          handlerSubmit={createNewStudent}
          handlerCloseButton={toggleNewStudentOpen}
        />
      )}
    </div>
  )
}
