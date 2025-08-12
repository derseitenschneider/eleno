import MiniLoader from '@/components/ui/MiniLoader.component'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { RepertoireItem } from '@/types/types'
import { useDeleteRepertoireItem } from './useDeleteRepertoireItem'

interface DeleteRepertoireItemProps {
  item: RepertoireItem
  onCloseModal?: () => void
}

function DeleteRepertoireItem({
  item,
  onCloseModal,
}: DeleteRepertoireItemProps) {
  const { deleteRepertoireItem, isDeleting, isError } =
    useDeleteRepertoireItem()

  function handleDelete() {
    deleteRepertoireItem(item.id, {
      onSuccess: () => onCloseModal?.(),
    })
  }
  if (!item) return null

  return (
    <div>
      <div className='mt-6 flex w-full flex-col-reverse justify-end gap-3  sm:mt-4 sm:flex-row'>
        <Button
          variant='outline'
          size='sm'
          disabled={isDeleting}
          onClick={onCloseModal}
          className='w-full sm:w-auto'
        >
          Abbrechen
        </Button>
        <div className='flex items-center gap-2'>
          <Button
            disabled={isDeleting}
            size='sm'
            variant='destructive'
            onClick={handleDelete}
            className='w-full sm:w-auto'
          >
            Löschen
          </Button>
          {isDeleting && <MiniLoader />}
        </div>
      </div>
      {isError && (
        <p className='mt-4 text-center text-sm text-warning'>
          Es ist etwas schiefgelaufen. Versuch's nochmal.
        </p>
      )}
    </div>
  )
}

export default DeleteRepertoireItem
