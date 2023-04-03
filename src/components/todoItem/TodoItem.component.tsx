import './todoItem.style.scss'
import { FunctionComponent, useState, useEffect } from 'react'
import { TTodo } from '../../types/types'
import {
  formatDateToDatabase,
  formatDateToDisplay,
} from '../../utils/formateDate'
import { useStudents } from '../../hooks/useStudents'
import { sortStudentsDateTime } from '../../utils/sortStudents'
import { useClosestStudent } from '../../hooks/useClosestStudent'
import { useNavigate } from 'react-router-dom'
import { useDateToday } from '../../hooks/useDateToday'
import Button from '../button/Button.component'
import { IoEllipsisVertical } from 'react-icons/io5'
import DropDown from '../dropdown/Dropdown.component'
import Modal from '../modals/Modal.component'
import ModalEditTodo from '../modals/modalEditTodo/ModalEditTodo.component'

interface TodoItemProps {
  todo: TTodo
  handleComplete: (todoId: number) => void
  listType: 'open' | 'completed'
}

const TodoItem: FunctionComponent<TodoItemProps> = ({
  todo,
  handleComplete,
  listType,
}) => {
  const { students } = useStudents()
  const { setClosestStudentIndex } = useClosestStudent()
  const { dateToday } = useDateToday()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const [attachedStudent] = students.filter(
    (student) => student.id === todo.studentId
  )
  const navigateToLesson = () => {
    const filteredSortedStudents = sortStudentsDateTime(students).filter(
      (student) => !student.archive
    )
    const index = filteredSortedStudents.findIndex(
      (student) => student.id === todo.studentId
    )

    setClosestStudentIndex(index)

    navigate('/lessons')
  }

  const onChangeComplete = () => {
    handleComplete(todo.id)
  }

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const button = target.closest('.button--edit') as HTMLElement
      if (!button) setDropdownOpen(false)
      // if (+button?.dataset.id !== studentId) setDropdownOpen(false)
    }
    if (dropdownOpen) {
      window.addEventListener('click', closeDropdown)
    }
    return () => {
      window.removeEventListener('click', closeDropdown)
    }
  }, [dropdownOpen])

  const overdue = todo.due < formatDateToDatabase(dateToday)
  // [ ] make editable
  return (
    <li className={`todo-item${overdue ? ' overdue' : ''}`}>
      {listType === 'open' ? (
        <input
          type="checkbox"
          className="checkbox"
          onChange={onChangeComplete}
        />
      ) : (
        <div></div>
      )}
      <div className="wrapper-text">
        <p className="">{todo.text}</p>
      </div>
      <div className="wrapper-student">
        {attachedStudent && (
          <p className="student" onClick={navigateToLesson}>
            {attachedStudent.firstName} {attachedStudent.lastName}
          </p>
        )}
      </div>
      <div className="wrapper-due">
        {todo.due && (
          <p className={`${overdue ? 'overdue' : null}`}>
            {formatDateToDisplay(todo.due)}
          </p>
        )}
      </div>
      <div className="container--button">
        <Button
          type="button"
          btnStyle="icon-only"
          icon={<IoEllipsisVertical />}
          className="button--edit"
          handler={() => setDropdownOpen(true)}
        />
        {dropdownOpen && listType === 'open' && (
          <DropDown
            positionX="right"
            positionY="top"
            buttons={[
              {
                label: 'Bearbeiten',
                type: 'normal',
                handler: () => {
                  setModalOpen((prev) => !prev)
                },
              },
            ]}
          />
        )}
      </div>
      {modalOpen && listType === 'open' && (
        <ModalEditTodo
          closeModal={() => setModalOpen(false)}
          todoId={todo.id}
        />
      )}
    </li>
  )
}

export default TodoItem
