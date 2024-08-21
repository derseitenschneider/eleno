import { Button } from '@/components/ui/button'
import { useResetStudents } from './useResetStudents'
import MiniLoader from '@/components/ui/MiniLoader.component'

interface ResetStudentsProps {
  selectedStudentIds: Array<number>
  onSuccess: () => void
}

function ResetStudents({ onSuccess, selectedStudentIds }: ResetStudentsProps) {
  const { reset, isResetting } = useResetStudents()

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
        <div className='flex items-center gap-2'>
          <Button type='button' size='sm' onClick={handleReset}>
            Zurücksetzen
          </Button>
          {isResetting && <MiniLoader />}
        </div>
      </div>
    </div>
  )
}

export default ResetStudents
