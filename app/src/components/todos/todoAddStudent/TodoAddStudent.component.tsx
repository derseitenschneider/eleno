import './todoAddStudent.style.scss'
import { FunctionComponent, useState, useEffect, SetStateAction } from 'react'
import { useStudents } from '../../../contexts/StudentContext'
import { sortStudents } from '../../../utils/sortStudents'
import { IoPeopleCircleOutline } from 'react-icons/io5'
import { IoCloseOutline } from 'react-icons/io5'
import Button from '../../common/button/Button.component'
import DropdownSearch from '../../common/dropdownSearch/DropdownSearch.component'
import ButtonRemove from '../../common/buttonRemove/ButtonRemove'

interface TodoAddStudentProps {
  currentStudentId: number
  setCurrentStudentId: React.Dispatch<SetStateAction<number>>
}

const TodoAddStudent: FunctionComponent<TodoAddStudentProps> = ({
  currentStudentId,
  setCurrentStudentId,
}) => {
  const { students } = useStudents()
  const [dropdownSearchOpen, setDropdownSearchOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const width = window.innerWidth

  useEffect(() => {
    const closeDropdownSearch = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const button = target.closest('.add-student__student') as HTMLElement
      const icon = target.closest('.button--icon-only')

      if (!button && !icon) setDropdownSearchOpen(false)
    }
    if (dropdownSearchOpen) {
      window.addEventListener('click', closeDropdownSearch)
    }
    return () => {
      window.removeEventListener('click', closeDropdownSearch)
    }
  }, [dropdownSearchOpen])

  const filteredStudents = sortStudents(
    students.filter((student) => {
      const firstName = student.firstName.toLowerCase()
      const lastName = student.lastName.toLowerCase()
      const search = searchInput.toLowerCase()

      if (firstName.startsWith(search) || lastName.startsWith(search))
        return student
    }),
    { sort: 'lastName', ascending: 'true' }
  )

  const onSelectDropdownSearch = (studentId: number) => {
    setCurrentStudentId(studentId)
    setDropdownSearchOpen((prev) => !prev)
    setSearchInput('')
  }

  return (
    <div className="add-student">
      {currentStudentId ? (
        <div className="add-student__wrapper">
          <span
            className="add-student__student"
            onClick={() => {
              setDropdownSearchOpen((prev) => !prev)
            }}
          >
            {`${
              students.find((student) => student.id === currentStudentId)
                .firstName
            } ${
              students.find((student) => student.id === currentStudentId)
                .lastName
            }`}
          </span>
          <ButtonRemove onRemove={() => setCurrentStudentId(null)} />
        </div>
      ) : (
        <Button
          icon={<IoPeopleCircleOutline />}
          handler={() => setDropdownSearchOpen((prev) => !prev)}
          className="button--student"
          type="button"
          btnStyle={'icon-only'}
        />
      )}

      {dropdownSearchOpen && (
        <DropdownSearch
          buttons={filteredStudents.map((student) => {
            return {
              label: `${student.firstName}  ${student.lastName}`,
              type: 'normal',
              handler: () => {
                onSelectDropdownSearch(student.id)
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
