import './resetStudents.style.scss'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { useStudents } from '../../../../services/context/StudentContext'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import Button from '../../../ui/button/Button.component'
import { useActiveStudents } from '../activeStudents/ActiveStudents.component'

interface ResetStudentsProps {
  onCloseModal?: () => void
}

function ResetStudents({ onCloseModal }: ResetStudentsProps) {
  const [isPending, setIsPending] = useState(false)
  const { resetLessonData } = useStudents()
  const { selectedStudents, setSelectedStudents } = useActiveStudents()

  const handleReset = async () => {
    setIsPending(true)
    try {
      await resetLessonData(selectedStudents)
      onCloseModal?.()
      setSelectedStudents([])
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
        <Button type="button" btnStyle="secondary" onClick={onCloseModal}>
          Abbrechen
        </Button>
        <Button type="button" btnStyle="danger" onClick={handleReset}>
          Zurücksetzen
        </Button>
      </div>
    </div>
  )
}

export default ResetStudents
