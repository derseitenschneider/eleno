import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import type { RepertoireItem } from '@/types/types'
import { useQueryClient } from '@tanstack/react-query'
import { useDeleteRepertoireItem } from './useDeleteRepertoireItem'

interface DeleteRepertoireItemProps {
  itemId: number
  holder: string
  onCloseModal?: () => void
}

function DeleteRepertoireItem({
  itemId,
  holder,
  onCloseModal,
}: DeleteRepertoireItemProps) {
  const queryClient = useQueryClient()
  const repertoire = queryClient.getQueryData(['repertoire', { holder }]) as
    | Array<RepertoireItem>
    | undefined
  const itemToDelete = repertoire?.find((item) => item.id === itemId)

  const { deleteRepertoireItem, isDeleting, isError } =
    useDeleteRepertoireItem()

  function handleDelete() {
    deleteRepertoireItem(itemId, {
      onSuccess: () => onCloseModal?.(),
    })
  }
  if (!itemToDelete) return null

  return (
    <div className='max-w-[450px]'>
      <p>
        Möchtest du den Song <b>«{itemToDelete.title}»</b> wirklich aus dem
        Repertoire entfernen?
      </p>
      <div className='flex justify-end gap-4 mt-4'>
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
