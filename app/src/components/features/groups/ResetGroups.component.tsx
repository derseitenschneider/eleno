import { Button } from '@/components/ui/button'
import { useResetGroups } from './useResetGroups'
import { DialogDescription } from '@/components/ui/dialog'
import { Blocker } from '../subscription/Blocker'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { cn } from '@/lib/utils'

interface ResetStudentsProps {
  selectedGroupIds: Array<number>
  onSuccess: () => void
}

export default function ResetGroups({
  onSuccess,
  selectedGroupIds,
}: ResetStudentsProps) {
  const { reset } = useResetGroups()
  const { hasAccess } = useSubscription()

  const handleReset = () => {
    reset(selectedGroupIds, {
      onSuccess: () => onSuccess(),
    })
  }

  return (
    <div className={cn(!hasAccess && 'h-[150px]')}>
      <Blocker />
      <DialogDescription className='mb-6 text-sm'>
        Möchtest du die Unterrichtsdaten
        <i> (Tag, Von, Bis, Dauer, Unterrichtsort) </i>
        der ausgewählten Gruppen zurücksetzen?
      </DialogDescription>
      <div className='flex items-center justify-end gap-4'>
        <Button variant='outline' size='sm' onClick={onSuccess}>
          Abbrechen
        </Button>
        <Button
          type='button'
          disabled={!hasAccess}
          size='sm'
          onClick={handleReset}
        >
          Zurücksetzen
        </Button>
      </div>
    </div>
  )
}
