import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { cn } from '@/lib/utils'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { Blocker } from '../subscription/Blocker'
import { useResetStudents } from './useResetStudents'

interface ResetStudentsProps {
  selectedStudentIds: Array<number>
  onSuccess: () => void
}

function ResetStudents({ onSuccess, selectedStudentIds }: ResetStudentsProps) {
  const { reset, isResetting } = useResetStudents()
  const { hasAccess } = useSubscription()

  const handleReset = () => {
    reset(selectedStudentIds, {
      onSuccess: () => onSuccess(),
    })
  }

  return (
    <div className={cn(!hasAccess && 'h-[150px]')}>
      <Blocker />
      <p className='mb-6'>
        Möchtest du die Unterrichtsdaten
        <i> (Tag, Von, Bis, Dauer, Unterrichtsort) </i>
        der ausgewählten Schüler:innen zurücksetzen?
      </p>
      <div className='flex items-center justify-end gap-4'>
        <Button variant='outline' size='sm' onClick={onSuccess}>
          Abbrechen
        </Button>
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            disabled={!hasAccess}
            size='sm'
            onClick={handleReset}
          >
            Zurücksetzen
          </Button>
          {isResetting && <MiniLoader />}
        </div>
      </div>
    </div>
  )
}

export default ResetStudents
