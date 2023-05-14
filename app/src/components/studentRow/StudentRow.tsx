import './studentrow.styles.scss'
import { FunctionComponent, useState, useEffect, SetStateAction } from 'react'
import { IoEllipsisVertical } from 'react-icons/io5'
import DropDown from '../dropdown/Dropdown.component'
import { useStudents } from '../../contexts/StudentContext'

import ModalEditStudent from '../modals/modalEditStudent/ModalEditStudent.component'
import Modal from '../modals/Modal.component'
import { useNavigate } from 'react-router-dom'
import { sortStudentsDateTime } from '../../utils/sortStudents'
import { toast } from 'react-toastify'
import fetchErrorToast from '../../hooks/fetchErrorToast'

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
  const {
    students,
    archivateStudents,
    reactivateStudents,
    deleteStudents,
    setStudentIndex,
  } = useStudents()
  const [modalOpen, setModalOpen] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [isPending, setIsPending] = useState(false)
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
    if (isSelected.includes(studentId)) {
      setIsChecked(true)
    } else setIsChecked(false)
  }, [isSelected])

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
    setStudentIndex(index)

    navigate('/lessons')
  }

  const handlerArchivate = async () => {
    setIsPending(true)
    try {
      await archivateStudents([studentId])
      toast('Schüler:in archiviert')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  const handlerReactivate = async () => {
    setIsPending(true)
    try {
      await reactivateStudents([studentId])
      toast('Schüler:in wiederhergestellt.')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  const handlerDelete = async () => {
    try {
      await deleteStudents([studentId])
      toast('Schüler:in gelöscht.')
    } catch (error) {
      fetchErrorToast()
    }
  }

  return (
    <div className={`grid-row ${isPending ? 'loading' : ''}`}>
      <div
        className="checkbox"
        style={
          dropdownOpen || isChecked
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
          dropdownOpen || isChecked
            ? {
                color: 'var(--clr-primary-600)',
              }
            : {}
        }
      >
        {firstName}
      </div>
      <div
        style={
          dropdownOpen || isChecked ? { color: 'var(--clr-primary-600)' } : {}
        }
      >
        {lastName}
      </div>
      <div
        style={
          dropdownOpen || isChecked ? { color: 'var(--clr-primary-600)' } : {}
        }
      >
        {instrument}
      </div>
      <div
        style={
          dropdownOpen || isChecked ? { color: 'var(--clr-primary-600)' } : {}
        }
      >
        {dayOfLesson}
      </div>
      <div
        style={
          dropdownOpen || isChecked ? { color: 'var(--clr-primary-600)' } : {}
        }
      >
        {startOfLesson}
      </div>
      <div
        style={
          dropdownOpen || isChecked ? { color: 'var(--clr-primary-600)' } : {}
        }
      >
        {endOfLesson}
      </div>
      <div
        style={
          dropdownOpen || isChecked ? { color: 'var(--clr-primary-600)' } : {}
        }
      >
        {durationMinutes ? `${durationMinutes} Minuten` : `-`}
      </div>
      <div
        style={
          dropdownOpen || isChecked ? { color: 'var(--clr-primary-600)' } : {}
        }
      >
        {location}
      </div>
      <div
        className="container--button"
        style={
          dropdownOpen || isChecked
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
                handler: handlerArchivate,
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
                handler: handlerReactivate,
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
              handler: handlerDelete,
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
