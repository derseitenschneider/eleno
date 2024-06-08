import { Button } from "@/components/ui/button"
import MiniLoader from "@/components/ui/MiniLoader.component"
import type { RepertoireItem } from "@/types/types"
import { useQueryClient } from "@tanstack/react-query"
import { deleteRepertoireItemMutation } from "./mutations/deleteRepertoireItemMutation"

interface DeleteRepertoireItemProps {
  itemId: number
  studentId: number
  onCloseModal?: () => void
}

function DeleteRepertoireItem({
  itemId,
  studentId,
  onCloseModal,
}: DeleteRepertoireItemProps) {
  const queryClient = useQueryClient()
  const repertoire = queryClient.getQueryData(["repertoire", { studentId }]) as
    | Array<RepertoireItem>
    | undefined
  const itemToDelete = repertoire?.find((item) => item.id === itemId)

  const { mutate: handleDelete, isPending } = deleteRepertoireItemMutation(
    itemId,
    studentId,
    onCloseModal,
  )

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
          disabled={isPending}
          onClick={onCloseModal}
        >
          Abbrechen
        </Button>
        <Button
          disabled={isPending}
          size='sm'
          variant='destructive'
          onClick={() => handleDelete()}
        >
          Löschen
        </Button>
        {isPending && <MiniLoader />}
      </div>
    </div>
  )
}

export default DeleteRepertoireItem
