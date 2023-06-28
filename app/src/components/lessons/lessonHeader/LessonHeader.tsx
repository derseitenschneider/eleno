import './lessonHeader.style.scss'
import { FunctionComponent, useState, useEffect } from 'react'
import { useStudents } from '../../../contexts/StudentContext'
import { IoEllipsisVertical } from 'react-icons/io5'

import { IoPersonCircleOutline } from 'react-icons/io5'
import ModalEditStudent from '../../modals/modalEditStudent/ModalEditStudent.component'
import Modal from '../../modals/Modal.component'
import TodoAddItem from '../../todos/todoAddItem/TodoAddItem.component'
import DropDown from '../../common/dropdown/Dropdown.component'

interface LessonHeaderProps {
  currentStudentId: number
}

const LessonHeader: FunctionComponent<LessonHeaderProps> = ({
  currentStudentId,
}) => {
  const { students } = useStudents()
  const [modalEditStudentOpen, setModalEditStudentOpen] = useState(false)
  const [modalAddTodoOpen, setModalAddTodoOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const {
    firstName,
    lastName,
    durationMinutes,
    dayOfLesson,
    startOfLesson,
    endOfLesson,
  } = students.find((student) => student.id === currentStudentId)

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('.button--dropdown')) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      window.addEventListener('click', closeDropdown)
    }
    return () => {
      window.removeEventListener('click', closeDropdown)
    }
  }, [dropdownOpen])

  return (
    <header className="container container--header">
      <div className="container--infos">
        <div className="row-1">
          <h2 className="student-name">
            <IoPersonCircleOutline className="icon" />
            {firstName} {lastName}
          </h2>
          <div className="container--buttons">
            <button
              className="button--dropdown"
              onClick={() => {
                setDropdownOpen((prev) => !prev)
              }}
            >
              <IoEllipsisVertical />
            </button>
            {dropdownOpen && (
              <DropDown
                positionX="left"
                positionY="top"
                buttons={[
                  {
                    label: 'Schüler:in bearbeiten',
                    handler: () => {
                      setModalEditStudentOpen(true)
                      console.log('students')
                    },
                    type: 'normal',
                  },
                  {
                    label: 'To-Do erfassen',
                    handler: () => {
                      setModalAddTodoOpen(true)
                    },
                    type: 'normal',
                  },
                ]}
              />
            )}
          </div>
        </div>
        <span>
          {dayOfLesson && `${dayOfLesson}`}
          {startOfLesson && `, ${startOfLesson}`}
          {endOfLesson && ` - ${endOfLesson}`}
        </span>
        <span> | </span>
        <span>
          {durationMinutes > 0 && <span> {durationMinutes} Minuten</span>}
        </span>
      </div>
      {modalEditStudentOpen && (
        <ModalEditStudent
          studentId={currentStudentId}
          handlerClose={() => {
            setModalEditStudentOpen(false)
          }}
        />
      )}

      {modalAddTodoOpen && (
        <Modal
          heading="Neue To-Do erfassen"
          handlerClose={() => {
            setModalAddTodoOpen(false)
          }}
          handlerOverlay={() => {
            setModalAddTodoOpen(false)
          }}
          className="modal--add-todo"
        >
          <TodoAddItem
            studentId={currentStudentId}
            onSave={() => {
              setModalAddTodoOpen(false)
            }}
          />
        </Modal>
      )}
    </header>
  )
}

export default LessonHeader
