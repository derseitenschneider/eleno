import './todoAddItem.style.scss'
import { FunctionComponent, useState } from 'react'

import { useStudents } from '../../contexts/StudentContext'
import { sortStudents } from '../../utils/sortStudents'
import Button from '../button/Button.component'
interface TodoAddItemProps {}

const TodoAddItem: FunctionComponent<TodoAddItemProps> = () => {
  const { students } = useStudents()

  const [searchInput, setSearchInput] = useState('')
  const [isSearchListOpen, setIsSearchListOpen] = useState(false)
  const [studentId, setStudentId] = useState<number>(null)

  const filteredStudents = sortStudents(
    students.filter((student) => {
      const firstName = student.firstName.toLowerCase()
      const lastName = student.lastName.toLowerCase()
      const search = searchInput.toLowerCase()

      if (firstName.startsWith(search)) return student
    }),
    { method: 'lastName', ascending: true }
  )

  return (
    <div className="container--add">
      <div className="inputs">
        <input type="text" placeholder="Todo" />
        <input type="text" placeholder="Details" />
        <input type="date" />
        <div className="search-filter">
          <input
            className="search"
            type="text"
            value={searchInput}
            onFocus={() => setIsSearchListOpen(true)}
            onBlur={() => setIsSearchListOpen(false)}
            onChange={(e) => setSearchInput(e.target.value)}
            autoComplete={'true'}
          />
          {isSearchListOpen && (
            <ul className="searchlist">
              {filteredStudents.map((student) => (
                <li
                  key={student.id}
                  onClick={() => {
                    setSearchInput(`${student.firstName} ${student.lastName}`)
                    setIsSearchListOpen(false)
                    setStudentId(student.id)
                  }}
                >
                  <a>
                    {student.firstName} {student.lastName}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Button label="Speichern" type="button" btnStyle="primary" />
    </div>
  )
}

export default TodoAddItem
