import { useState } from 'react'
import { toast } from 'react-toastify'
import { useStudents } from '../../../../services/context/StudentContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import Button from '../../../ui/button/Button.component'
import { useInactiveStudents } from '../inActiveStudents/InactiveStudents.component'
import './deleteStudents.style.scss'

interface DeleteStudentsProps {
  onCloseModal?: () => void
  studentIds?: number[]
}

function DeleteStudents({ onCloseModal, studentIds }: DeleteStudentsProps) {
  const [isPending, setIsPending] = useState(false)
  const { inactiveStudents, deleteStudents } = useStudents()
  const { selectedStudents, setSelectedStudents } = useInactiveStudents()

  const studentsToDelete = studentIds || selectedStudents

  const { firstName, lastName } = inactiveStudents.find(
    (student) => student.id === studentsToDelete[0],
  )

  const handleDeleteStudents = async () => {
    setIsPending(true)
    try {
      await deleteStudents(studentsToDelete)
      onCloseModal?.()
      toast(`Schüler:in${selectedStudents.length > 1 ? 'nen' : ''} gelöscht`)
      setSelectedStudents([])
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }
  return (
    <div className={`delete-students${isPending ? ' loading' : ''}`}>
      <h2 className="heading-2">
        {studentsToDelete.length === 1
          ? 'Schüler:in löschen'
          : 'Schüler:innen löschen'}
      </h2>
      {studentsToDelete.length === 1 ? (
        <p>
          Möchtest du{' '}
          <span className="delete-students__name">
            {firstName} {lastName}
          </span>{' '}
          und alle zugehörigen Daten endgültig löschen?
        </p>
      ) : (
        <p>
          Möchtest du die ausgewählten Schüler:innen und alle zugehörigen Daten
          endgültig löschen?
        </p>
      )}

      <div className="delete-students__buttons">
        <Button type="button" btnStyle="secondary" onClick={onCloseModal}>
          Abbrechen
        </Button>
        <Button type="button" btnStyle="danger" onClick={handleDeleteStudents}>
          Löschen
        </Button>
      </div>
    </div>
  )
}

export default DeleteStudents
