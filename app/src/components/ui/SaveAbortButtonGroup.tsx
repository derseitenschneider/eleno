import { Button } from './button'
import MiniLoader from './MiniLoader.component'

type SaveAbortButtonsProps = {
  isSaving: boolean
  isDisabledSaving: boolean
  isDisabledAborting: boolean
  onAbort?: () => void
  onSave: () => void
}

export function SaveAbortButtons({
  isSaving,
  isDisabledSaving,
  isDisabledAborting,
  onAbort,
  onSave,
}: SaveAbortButtonsProps) {
  return (
    <div className='flex flex-col-reverse items-center justify-end gap-4 sm:flex-row'>
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
