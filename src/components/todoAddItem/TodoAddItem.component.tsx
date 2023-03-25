import './todoAddItem.style.scss'
import { FunctionComponent, useState } from 'react'

import { useStudents } from '../../contexts/StudentContext'
import { sortStudents } from '../../utils/sortStudents'
import Button from '../button/Button.component'
import { TTodo } from '../../types/types'
import { useUser } from '../../contexts/UserContext'
interface TodoAddItemProps {
  saveTodo: (todo: TTodo) => void
}

const todoData = {
  title: '',
  details: '',
  due: null,
  studentId: null,
  completed: false,
}

const TodoAddItem: FunctionComponent<TodoAddItemProps> = ({ saveTodo }) => {
  const { students } = useStudents()
  const { user } = useUser()
  const [inputTodo, setInputTodo] = useState(todoData)

  const [searchInput, setSearchInput] = useState('')
  const [isSearchListOpen, setIsSearchListOpen] = useState(false)
  const [currentStudentId, setCurrentStudentId] = useState<number>(null)

  const filteredStudents = sortStudents(
    students.filter((student) => {
      const firstName = student.firstName.toLowerCase()
      const lastName = student.lastName.toLowerCase()
      const search = searchInput.toLowerCase()

      if (firstName.startsWith(search)) return student
    }),
    { method: 'lastName', ascending: true }
  )

  const onChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    const value = e.target.value

    setInputTodo((prev) => {
      return { ...prev, [name]: value }
    })
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
  }

  return (
    <div className="container--add">
      <div className="labels">
        <h5 className="heading-5 label--due">fällig</h5>
      </div>
      <div className="inputs">
        <input
          type="text"
          placeholder="Todo"
          name="title"
          value={inputTodo.title}
          required
          onChange={onChangeInputs}
          autoFocus={true}
        />
        <input
          type="text"
          placeholder="Details"
          name="details"
          value={inputTodo.details}
          onChange={onChangeInputs}
        />
        <input
          type="date"
          name="due"
          value={inputTodo.due}
          onChange={onChangeInputs}
        />
        <div className="search-filter">
          <input
            className="search"
            placeholder="Schüler:in"
            type="text"
            value={searchInput}
            onFocus={() => setIsSearchListOpen(true)}
            // onBlur={() => setIsSearchListOpen(false)}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {isSearchListOpen && (
            <ul className="searchlist">
              {filteredStudents.map((student) => (
                <li
                  key={student.id}
                  onClick={() => {
                    setSearchInput(`${student.firstName} ${student.lastName}`)
                    setIsSearchListOpen(false)
                    setCurrentStudentId(student.id)
                  }}
                >
                  {student.firstName} {student.lastName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Button
        label="Speichern"
        type="button"
        btnStyle="primary"
        handler={onSaveHandler}
      />
    </div>
  )
}

export default TodoAddItem
