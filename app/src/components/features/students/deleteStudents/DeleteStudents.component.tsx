import { FC, useState } from 'react'
import './deleteStudents.style.scss'
import { useStudents } from '../../../../contexts/StudentContext'
import Button from '../../../common/button/Button.component'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import { toast } from 'react-toastify'
import { useInactiveStudents } from '../inActiveStudents/InactiveStudents.component'

interface DeleteStudentsProps {
  onCloseModal?: () => void
  studentIds?: number[]
}

const DeleteStudents: FC<DeleteStudentsProps> = ({
  onCloseModal,
  studentIds,
}) => {
  const [isPending, setIsPending] = useState(false)
  const { inactiveStudents, deleteStudents } = useStudents()
  const { isSelected, setIsSelected } = useInactiveStudents()

  const studentsToDelete = studentIds || isSelected

  const { firstName, lastName } = inactiveStudents.find(
    (student) => student.id === studentsToDelete[0],
  )

  const handleDeleteStudents = async () => {
    setIsPending(true)
    try {
      await deleteStudents(studentsToDelete)
      onCloseModal?.()
      toast(`Schüler:in${isSelected.length > 1 ? 'nen' : ''} gelöscht`)
      setIsSelected([])
    } catch (error) {
      fetchErrorToast
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
        <Button btnStyle="secondary" onClick={onCloseModal}>
          Abbrechen
        </Button>
        <Button btnStyle="danger" onClick={handleDeleteStudents}>
          Löschen
        </Button>
      </div>
    </div>
  )
}

export default DeleteStudents
