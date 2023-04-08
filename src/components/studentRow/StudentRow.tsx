import './studentrow.styles.scss'
import { FunctionComponent, useState, useEffect, SetStateAction } from 'react'
import { IoEllipsisVertical } from 'react-icons/io5'
import DropDown from '../dropdown/Dropdown.component'
import { useStudents } from '../../contexts/StudentContext'

import ModalEditStudent from '../modals/modalEditStudent/ModalEditStudent.component'
import Modal from '../modals/Modal.component'
import { useNavigate } from 'react-router-dom'
import { sortStudentsDateTime } from '../../utils/sortStudents'
import { useClosestStudent } from '../../contexts/ClosestStudentContext'

interface StudentRowProps {
  studentId: number
  isSelected: number[]
  setIsSelected: React.Dispatch<SetStateAction<number[]>>
  isArchive: boolean
}

const StudentRow: FunctionComponent<StudentRowProps> = ({
  studentId,
  setIsSelected,
  isSelected,
  isArchive,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { students, archivateStudents, reactivateStudents, deleteStudents } =
    useStudents()
  const [modalOpen, setModalOpen] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const { setClosestStudentIndex } = useClosestStudent()
  const navigate = useNavigate()

  const {
    firstName,
    lastName,
    instrument,
    dayOfLesson,
    startOfLesson,
    endOfLesson,
    durationMinutes,
    location,
  } = students.find((student) => student.id === studentId)

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const button = target.closest('.button--edit') as HTMLElement
      if (!button) setDropdownOpen(false)
      if (+button?.dataset.id !== studentId) setDropdownOpen(false)
    }
    if (dropdownOpen) {
      window.addEventListener('click', closeDropdown)
    }
    return () => {
      window.removeEventListener('click', closeDropdown)
    }
  }, [dropdownOpen])

  const onChangeCb = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked((prev) => {
      return !prev
    })
    if (e.target.checked) {
      const newArray = [...isSelected, studentId]
      setIsSelected(newArray)
    }
    if (!e.target.checked) {
      const index = isSelected.indexOf(studentId)
      const newArray = [
        ...isSelected.slice(0, index),
        ...isSelected.slice(index + 1),
      ]
      setIsSelected(newArray)
    }
  }

  const navigateToLesson = () => {
    const filteredSortedStudents = sortStudentsDateTime(students).filter(
      (student) => !student.archive
    )
    const index = filteredSortedStudents.findIndex(
      (student) => student.id === studentId
    )

    setClosestStudentIndex(index)

    navigate('/lessons')
  }

  return (
    <div className="grid-row">
      <div
        className="checkbox"
        style={
          dropdownOpen
            ? {
                boxShadow: 'inset 3px 0 0 var(--clr-primary-600)',
                color: 'var(--clr-primary-600)',
              }
            : {}
        }
      >
        <input
          type="checkbox"
          value={studentId}
          checked={isSelected?.includes(studentId)}
          onChange={onChangeCb}
        />
      </div>
      <div
        style={
          dropdownOpen
            ? {
                color: 'var(--clr-primary-600)',
              }
            : {}
        }
      >
        {firstName}
      </div>
      <div style={dropdownOpen ? { color: 'var(--clr-primary-600)' } : {}}>
        {lastName}
      </div>
      <div style={dropdownOpen ? { color: 'var(--clr-primary-600)' } : {}}>
        {instrument}
      </div>
      <div style={dropdownOpen ? { color: 'var(--clr-primary-600)' } : {}}>
        {dayOfLesson}
      </div>
      <div style={dropdownOpen ? { color: 'var(--clr-primary-600)' } : {}}>
        {startOfLesson}
      </div>
      <div style={dropdownOpen ? { color: 'var(--clr-primary-600)' } : {}}>
        {endOfLesson}
      </div>
      <div style={dropdownOpen ? { color: 'var(--clr-primary-600)' } : {}}>
        {durationMinutes ? `${durationMinutes} Minuten` : `-`}
        {/* {durationMinutes} Minuten */}
      </div>
      <div style={dropdownOpen ? { color: 'var(--clr-primary-600)' } : {}}>
        {location}
      </div>
      <div
        className="container--button"
        style={
          dropdownOpen
            ? {
                boxShadow: 'inset -3px 0 0 var(--clr-primary-600)',
              }
            : {}
        }
      >
        <button
          className="button--edit"
          data-id={studentId}
          onClick={() => {
            setDropdownOpen((prev) => !prev)
          }}
        >
          <IoEllipsisVertical />
        </button>

        {dropdownOpen && !isArchive && (
          <DropDown
            className="dropdown--edit-student"
            positionX="right"
            positionY="top"
            buttons={[
              {
                label: 'Bearbeiten',
                handler: () => {
                  setModalOpen(true)
                },
                type: 'normal',
              },
              {
                label: 'Archivieren',
                handler: () => {
                  archivateStudents(studentId)
                },
                type: 'normal',
              },
              {
                label: '... zum Lektionsblatt',
                handler: navigateToLesson,
                type: 'normal',
              },
            ]}
          />
        )}

        {dropdownOpen && isArchive && (
          <DropDown
            className="dropdown--edit-student"
            positionX="right"
            positionY="top"
            buttons={[
              {
                label: 'Wiederherstellen',
                handler: () => reactivateStudents(studentId),
                type: 'normal',
              },
              {
                label: 'Löschen',
                handler: () => {
                  setModalOpen((prev) => !prev)
                },
                type: 'warning',
              },
            ]}
          />
        )}
      </div>
      {modalOpen && !isArchive && (
        <ModalEditStudent
          handlerClose={() => setModalOpen(false)}
          studentId={studentId}
        />
      )}

      {modalOpen && isArchive && (
        <Modal
          handlerClose={() => setModalOpen((prev) => !prev)}
          handlerOverlay={() => setModalOpen((prev) => !prev)}
          heading="Schüler:in löschen?"
          buttons={[
            {
              label: 'Abbrechen',
              handler: () => {
                setModalOpen((prev) => !prev)
              },
              btnStyle: 'primary',
            },
            {
              label: 'Löschen',
              handler: () => deleteStudents(studentId),
              btnStyle: 'danger',
            },
          ]}
        >
          <p>
            Möchtest du{' '}
            <strong
              style={{ borderBottom: '1px solid var(--clr-primary-600)' }}
            >
              {firstName} {lastName}
            </strong>{' '}
            und alle zugehörigen Daten endgültig löschen?{' '}
          </p>
        </Modal>
      )}
    </div>
  )
}

export default StudentRow
