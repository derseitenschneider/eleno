import './todoAddStudent.style.scss'
import { FunctionComponent, useState, useEffect, SetStateAction } from 'react'
import { useStudents } from '../../contexts/StudentContext'
import { sortStudents } from '../../utils/sortStudents'
import { IoPeopleCircleOutline } from 'react-icons/io5'
import Button from '../button/Button.component'
import DropDown from '../dropdown/Dropdown.component'

interface TodoAddStudentProps {
  currentStudentId: number
  setCurrentStudentId: React.Dispatch<SetStateAction<number>>
}

const TodoAddStudent: FunctionComponent<TodoAddStudentProps> = ({
  currentStudentId,
  setCurrentStudentId,
}) => {
  const { students } = useStudents()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const button = target.closest('.button--student') as HTMLElement
      if (!button) setDropdownOpen(false)
    }
    if (dropdownOpen) {
      window.addEventListener('click', closeDropdown)
    }
    return () => {
      window.removeEventListener('click', closeDropdown)
    }
  }, [dropdownOpen])

  const filteredStudents = sortStudents(
    students.filter((student) => {
      const firstName = student.firstName.toLowerCase()
      const lastName = student.lastName.toLowerCase()
      const search = searchInput.toLowerCase()

      if (firstName.startsWith(search) || lastName.startsWith(search))
        return student
    }),
    { method: 'lastName', ascending: true }
  )

  const onSelectDropdown = (studentId: number) => {
    setCurrentStudentId(studentId)
    setDropdownOpen((prev) => !prev)
    setSearchInput('')
  }

  return (
    <div className="add-student">
      <Button
        className="button--student"
        type="button"
        btnStyle={currentStudentId ? 'secondary' : 'icon-only'}
        label={
          currentStudentId &&
          `${
            students.find((student) => student.id === currentStudentId)
              .firstName
          } ${
            students.find((student) => student.id === currentStudentId).lastName
          }`
        }
        icon={!currentStudentId ? <IoPeopleCircleOutline /> : null}
        handler={() => setDropdownOpen((prev) => !prev)}
      >
        {currentStudentId && (
          <button
            className="button--remove-student"
            onClick={() => setCurrentStudentId(null)}
          >
            x
          </button>
        )}
      </Button>

      {dropdownOpen && (
        <DropDown
          buttons={filteredStudents.map((student) => {
            return {
              label: `${student.firstName}  ${student.lastName}`,
              type: 'normal',
              handler: () => {
                onSelectDropdown(student.id)
              },
            }
          })}
          positionX="right"
          positionY="top"
          searchField={true}
          valueSearchfield={searchInput}
          onChangeSearchfield={(e) => setSearchInput(e.target.value)}
        />
      )}
    </div>
  )
}

export default TodoAddStudent