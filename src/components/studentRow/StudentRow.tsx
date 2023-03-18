import './studentrow.styles.scss'
import { FunctionComponent, useState, useEffect } from 'react'
import { TStudent } from '../../types/types'
import { IoEllipsisVertical } from 'react-icons/io5'
import DropDown from '../dropdown/Dropdown.component'
import Button from '../button/Button.component'
import { useStudents } from '../../contexts/StudentContext'
import { archivateStudentSupabase } from '../../supabase/students/students.supabase'
import { toast } from 'react-toastify'

interface StudentRowProps {
  student: TStudent
}

const StudentRow: FunctionComponent<StudentRowProps> = ({
  student: currentStudent,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { students, setStudents } = useStudents()

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const button = target.closest('.button--edit') as HTMLElement
      if (!button) setDropdownOpen(false)
      if (+button?.dataset.id !== currentStudent.id) setDropdownOpen(false)
    }
    if (dropdownOpen) {
      window.addEventListener('click', closeDropdown)
    }
    return () => {
      window.removeEventListener('click', closeDropdown)
    }
  }, [dropdownOpen])

  const archivateStudent = () => {
    const newStudents = students.map((student) =>
      student.id === currentStudent.id ? { ...student, archive: true } : student
    )
    setStudents(newStudents)
    archivateStudentSupabase(currentStudent.id)
    toast('Schüler:in archiviert')
  }

  return (
    <>
      <div
        className="checkbox"
        style={
          dropdownOpen
            ? {
                // boxShadow: 'inset 1px 1px 0 var(--clr-primary)',
                color: 'var(--clr-primary)',
              }
            : {}
        }
      >
        <input type="checkbox" />
      </div>
      <div
        style={
          dropdownOpen
            ? {
                color: 'var(--clr-primary)',
              }
            : {}
        }
      >
        {currentStudent.firstName}
      </div>
      <div style={dropdownOpen ? { color: 'var(--clr-primary)' } : {}}>
        {currentStudent.lastName}
      </div>
      <div style={dropdownOpen ? { color: 'var(--clr-primary)' } : {}}>
        {currentStudent.instrument}
      </div>
      <div style={dropdownOpen ? { color: 'var(--clr-primary)' } : {}}>
        {currentStudent.dayOfLesson}
      </div>
      <div style={dropdownOpen ? { color: 'var(--clr-primary)' } : {}}>
        {currentStudent.startOfLesson}
      </div>
      <div style={dropdownOpen ? { color: 'var(--clr-primary)' } : {}}>
        {currentStudent.endOfLesson}
      </div>
      <div style={dropdownOpen ? { color: 'var(--clr-primary)' } : {}}>
        {currentStudent.durationMinutes} Minuten
      </div>
      <div style={dropdownOpen ? { color: 'var(--clr-primary)' } : {}}>
        {currentStudent.location}
      </div>
      <div className="container--button">
        <button
          className="button--edit"
          data-id={currentStudent.id}
          onClick={() => {
            setDropdownOpen((prev) => !prev)
          }}
        >
          <IoEllipsisVertical />
        </button>
        {dropdownOpen && (
          <DropDown
            className="dropdown--edit-student"
            positionX="right"
            positionY="top"
            buttons={[
              {
                label: 'Bearbeiten',
                handler: () => {},
                type: 'normal',
              },
              {
                label: 'Archivieren',
                handler: archivateStudent,
                type: 'normal',
              },
              {
                label: '... zum Lektionsblatt',
                handler: () => {},
                type: 'normal',
              },
            ]}
          />
        )}
      </div>
    </>
  )
}

export default StudentRow
