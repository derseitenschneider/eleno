import { Button } from '@/components/ui/button'
import { useResetGroups } from './useResetGroups'

interface ResetStudentsProps {
  selectedGroupIds: Array<number>
  onSuccess: () => void
}

export default function ResetGroups({
  onSuccess,
  selectedGroupIds,
}: ResetStudentsProps) {
  const { reset } = useResetGroups()

  const handleReset = () => {
    reset(selectedGroupIds, {
      onSuccess: () => onSuccess(),
    })
  }

  return (
    <div className=''>
      <p className='text-sm mb-6'>
        Möchtest du die Unterrichtsdaten
        <i> (Tag, Von, Bis, Dauer, Unterrichtsort) </i>
        der ausgewählten Gruppen zurücksetzen?
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