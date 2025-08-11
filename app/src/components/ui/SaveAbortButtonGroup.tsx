import { cn } from '@/lib/utils'
import MiniLoader from './MiniLoader.component'
import { Button } from './button'
import { Separator } from './separator'

type SaveAbortButtonsProps = {
  isSaving: boolean
  isDisabledSaving: boolean
  isDisabledAborting: boolean
  onAbort?: () => void
  onSave: () => void
  className?: string
}

export function SaveAbortButtons({
  isSaving,
  isDisabledSaving,
  isDisabledAborting,
  onAbort,
  onSave,
  className,
}: SaveAbortButtonsProps) {
  return (
    <div
      className={cn(
        className,
        'flex w-full flex-col-reverse items-center justify-end gap-3 sm:flex-row',
      )}
    >
      <Button
        disabled={isDisabledAborting}
        className='w-full sm:w-auto'
        size='sm'
        variant='outline'
        onClick={onAbort}
      >
        Abbrechen
      </Button>
      <div className='flex w-full items-center gap-2 sm:w-auto'>
        <Button
          disabled={isDisabledSaving}
          className='w-full'
          size='sm'
          onClick={onSave}
        >
          Speichern
        </Button>
        {isSaving && <MiniLoader />}
      </div>
    </div>
  )
}
