import './todoAddStudent.style.scss'
import { FunctionComponent, useState, useEffect, SetStateAction } from 'react'
import { useStudents } from '../../../contexts/StudentContext'
import { sortStudents } from '../../../utils/sortStudents'
import { IoPeopleCircleOutline } from 'react-icons/io5'
import { IoCloseOutline } from 'react-icons/io5'
import Button from '../../common/button/Button.component'
import DropDown from '../../common/dropdown/Dropdown.component'

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

  const width = window.innerWidth

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const button = target.closest('.wrapper-student') as HTMLElement
      const icon = target.closest('.button--student') as HTMLElement
      if (!button && !icon) setDropdownOpen(false)
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
      {currentStudentId ? (
        <div
          className="wrapper-student"
          onClick={() => {
            setDropdownOpen((prev) => !prev)
          }}
        >
          <span className="student">
            {`${
              students.find((student) => student.id === currentStudentId)
                .firstName
            } ${
              students.find((student) => student.id === currentStudentId)
                .lastName
            }`}
          </span>
          <button
            className="button--remove-student"
            onClick={() => setCurrentStudentId(null)}
          >
            <IoCloseOutline />
          </button>
        </div>
      ) : (
        <Button
          icon={<IoPeopleCircleOutline />}
          handler={() => setDropdownOpen((prev) => !prev)}
          className="button--student"
          type="button"
          btnStyle={'icon-only'}
        />
      )}

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
          positionX={width > 680 ? 'right' : 'left'}
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
