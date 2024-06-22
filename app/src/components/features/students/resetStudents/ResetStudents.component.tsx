import "./resetStudents.style.scss"

import { toast } from "react-toastify"
import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import type { Student } from "@/types/types"
import { Button } from "@/components/ui/button"
import { useResetStudents } from "../useResetStudents"

interface ResetStudentsProps {
  selectedStudentIds: Array<number>
  onSuccess: () => void
}

function ResetStudents({ onSuccess, selectedStudentIds }: ResetStudentsProps) {
  const { reset, isResetting, isError } = useResetStudents()

  const handleReset = () => {
    reset(selectedStudentIds, {
      onSuccess: () => onSuccess(),
    })
  }

  return (
    <div className=''>
      <p className='text-sm'>
        Möchtest du die Unterrichtsdaten
        <i> (Tag, Von, Bis, Dauer, Unterrichtsort) </i>
        der ausgewählten Schüler:innen zurücksetzen?
      </p>
      <div className='flex items-center gap-4 justify-end'>
        <Button variant='outline' size='sm' onClick={onSuccess}>
          Abbrechen
        </Button>
        <Button type='button' size='sm' onClick={handleReset}>
          Zurücksetzen
        </Button>
      </div>
    </div>
  )
}

export default ResetStudents
