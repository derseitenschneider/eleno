import './todoAddItem.style.scss'
import { FunctionComponent, useState, useEffect } from 'react'

import { useStudents } from '../../contexts/StudentContext'
import { sortStudents } from '../../utils/sortStudents'
import Button from '../button/Button.component'
import { TTodo } from '../../types/types'
import { useUser } from '../../contexts/UserContext'
import Select from 'react-select'
import { IoPeopleCircleOutline } from 'react-icons/io5'
import DropDown from '../dropdown/Dropdown.component'
import { formatDateToDisplay } from '../../utils/formateDate'
interface TodoAddItemProps {
  saveTodo: (todo: TTodo) => void
}

const todoData = {
  text: '',
  due: null,
  studentId: null,
  completed: false,
}

const TodoAddItem: FunctionComponent<TodoAddItemProps> = ({ saveTodo }) => {
  const { students } = useStudents()
  const { user } = useUser()
  const [inputTodo, setInputTodo] = useState(todoData)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const [searchInput, setSearchInput] = useState('')
  const [currentStudentId, setCurrentStudentId] = useState<number>(null)

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

  const onChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value

    setInputTodo((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const onClickDate = () => {
    setInputTodo((prev) => {
      return { ...prev, due: null }
    })
  }

  const onSelectDropdown = (studentId: number) => {
    setCurrentStudentId(studentId)
    setDropdownOpen((prev) => !prev)
    setSearchInput('')
  }

  const onSaveHandler = () => {
    const tempId = Math.floor(Math.random() * 1000000000)
    const newTodo: TTodo = {
      ...inputTodo,
      studentId: currentStudentId,
      id: tempId,
      userId: user.id,
    }
    saveTodo(newTodo)
    setInputTodo(todoData)
    setSearchInput('')
    setCurrentStudentId(null)
  }

  return (
    <div className="container--add">
      <div className="inputs">
        <input
          type="text"
          placeholder="Todo"
          name="text"
          value={inputTodo.text}
          required
          onChange={onChangeInputs}
          autoFocus={true}
        />
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
                students.find((student) => student.id === currentStudentId)
                  .lastName
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
        {inputTodo.due ? (
          <p className="date" onClick={onClickDate}>
            {formatDateToDisplay(inputTodo.due).slice(0, 6)}
          </p>
        ) : (
          <input
            type="date"
            name="due"
            className="datepicker"
            value={inputTodo.due}
            onChange={onChangeInputs}
          />
        )}

        <Button
          label="Speichern"
          type="button"
          btnStyle="primary"
          handler={onSaveHandler}
        />
      </div>
    </div>
  )
}

export default TodoAddItem
