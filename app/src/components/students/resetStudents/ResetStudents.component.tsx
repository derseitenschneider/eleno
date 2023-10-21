import './resetStudents.style.scss'

import { FC, useState } from 'react'
import { TStudent } from '../../../types/types'
import Button from '../../common/button/Button.component'
import { useStudents } from '../../../contexts/StudentContext'
import { useActiveStudents } from '../activeStudents/ActiveStudents.component'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import { toast } from 'react-toastify'

interface ResetStudentsProps {
  onCloseModal?: () => void
}

const ResetStudents: FC<ResetStudentsProps> = ({ onCloseModal }) => {
  const [isPending, setIsPending] = useState(false)
  const { resetLessonData } = useStudents()
  const { isSelected, setIsSelected } = useActiveStudents()

  const handleReset = async () => {
    setIsPending(true)
    try {
      await resetLessonData(isSelected)
      onCloseModal?.()
      setIsSelected([])
      toast('Unterrichtsdaten zurückgesetzt')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={`reset-students${isPending ? ' loading' : ''}`}>
      <h2 className="heading-2">Unterrichtsdaten zurücksetzen</h2>
      <p>
        Möchtest du die Unterrichtsdaten
        <i> (Tag, Von, Bis, Dauer, Unterrichtsort) </i>
        der ausgewählten Schüler:innen zurücksetzen?
      </p>
      <div className="reset-students__buttons">
        <Button btnStyle="secondary" onClick={onCloseModal}>
          Abbrechen
        </Button>
        <Button btnStyle="danger" onClick={handleReset}>
          Zurücksetzen
        </Button>
      </div>
    </div>
  )
}

export default ResetStudents
