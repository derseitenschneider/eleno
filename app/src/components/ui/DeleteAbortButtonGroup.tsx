import { Button } from './button'
import MiniLoader from './MiniLoader.component'

type DeleteAbortButtonsProps = {
  isDeleting: boolean
  isDisabled: boolean
  onAbort?: () => void
  onDelete: () => void
}

export function DeleteAbortButtons({
  isDeleting,
  isDisabled = false,
  onAbort,
  onDelete,
}: DeleteAbortButtonsProps) {
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
          variant='destructive'
          onClick={onDelete}
        >
          Löschen
        </Button>
        {isDeleting && <MiniLoader />}
      </div>
    </div>
  )
}
