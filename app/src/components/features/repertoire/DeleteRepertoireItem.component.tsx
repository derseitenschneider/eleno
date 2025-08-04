import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import type { RepertoireItem } from '@/types/types'
import { useDeleteRepertoireItem } from './useDeleteRepertoireItem'
import { Separator } from '@/components/ui/separator'

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
    <div className='max-w-[450px]'>
      <Separator className='my-6 sm:hidden' />
      <div className='mt-4 flex flex-col justify-end gap-4 sm:flex-row'>
        <Button
          variant='outline'
          size='sm'
          disabled={isDeleting}
          onClick={onCloseModal}
        >
          Abbrechen
        </Button>
        <Button
          disabled={isDeleting}
          size='sm'
          variant='destructive'
          onClick={handleDelete}
        >
          Löschen
        </Button>
        {isDeleting && <MiniLoader />}
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
