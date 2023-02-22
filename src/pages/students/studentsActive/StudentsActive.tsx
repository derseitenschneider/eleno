// Style

// Icons
import { IoArchiveOutline } from 'react-icons/io5'
import { IoPersonAddOutline } from 'react-icons/io5'
import { IoSearchOutline } from 'react-icons/io5'
import { IoCloseOutline } from 'react-icons/io5'
import { IoSchoolOutline } from 'react-icons/io5'

// Hooks
import { useState } from 'react'
import { useStudents } from '../../../contexts/StudentContext'

// Functions
import { postArchiveStudent } from '../../../supabase/supabase'
import { postNewStudent } from '../../../supabase/supabase'

// Components
import StudentRow from '../../../components/studentRow/StudentRow'
import NewStudentRow from '../../../components/newStudentRow/NewStudentRow'
import { TStudent } from '../../../types/Students.type'

export default function StudentsActive() {
  const { students, setStudents } = useStudents()
  const [searchInput, setSearchInput] = useState('')
  const [newStudentRowOpen, setNewStudentRowOpen] = useState(false)

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
    const archivedStudent = students.find((student) => student.id === id)
    archivedStudent.archive = true
    setStudents([...students])
    postArchiveStudent(id)
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
  }

  const showInStudentList = students.filter((student) => !student.archive)

  const filteredStudents = showInStudentList.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchInput) ||
      student.lastName.toLocaleLowerCase().includes(searchInput) ||
      student.instrument.toLocaleLowerCase().includes(searchInput) ||
      student.location.toLocaleLowerCase().includes(searchInput) ||
      student.dayOfLesson.toLocaleLowerCase().includes(searchInput)
  )

  return (
    <div className="student-list">
      <h1>Liste Schüler:innen</h1>
      <div className="heading">
        <select name="" id="" defaultValue="Aktion">
          <option disabled hidden>
            Aktion
          </option>
          <option value="archive">Archivieren</option>
          <option value="delete">Löschen</option>
        </select>
        <div className="container-right">
          <IoSearchOutline className="icon icon-search" />
          <input
            type="search"
            placeholder="suchen"
            value={searchInput}
            onChange={onChangeHandlerInput}
          />
          <button
            title="Schüler:in erfassen"
            onClick={addStudentEventHandler}
            className={`button-add-student ${newStudentRowOpen && 'disabled'}`}
          >
            <span>Neu</span>

            <IoPersonAddOutline className="icon icon-add" />
          </button>
        </div>
      </div>

      <table className="student-list-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Vorname</th>
            <th>Nachname</th>
            <th>Instrument</th>
            <th>Tag</th>
            <th>Zeit</th>
            <th>Dauer</th>
            <th>Unterrichtsort</th>
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

      {newStudentRowOpen && (
        <NewStudentRow
          handlerSubmit={createNewStudent}
          handlerCloseButton={toggleNewStudentOpen}
        />
      )}
    </div>
  )
}
