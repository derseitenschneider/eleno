import { Button } from './button'
import MiniLoader from './MiniLoader.component'

type SaveAbortButtonsProps = {
  isSaving: boolean
  isDisabled: boolean
  onAbort?: () => void
  onSave: () => void
}

export function SaveAbortButtons({
  isSaving,
  isDisabled = false,
  onAbort,
  onSave,
}: SaveAbortButtonsProps) {
  return (
    <div className='flex flex-col-reverse items-center justify-end gap-4 sm:flex-row'>
      <Button
        disabled={isDisabled}
        className='w-full sm:w-auto'
        size='sm'
        variant='outline'
        onClick={onAbort}
      >
        Abbrechen
      </Button>
      <div className='flex w-full items-center gap-2 sm:w-auto'>
        <Button
          disabled={isDisabled}
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
