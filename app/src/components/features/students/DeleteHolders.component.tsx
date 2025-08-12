import { DeleteAbortButtons } from '@/components/ui/DeleteAbortButtonGroup'
import { useDeleteHolders } from '@/hooks/useDeleteHolders'

interface DeleteStudentsProps {
  onSuccess: () => void
  holderIds: string[]
}

function DeleteHolders({ onSuccess, holderIds }: DeleteStudentsProps) {
  const { handleDeleteHolders, isDeletingStudents, isDeletingGroups } =
    useDeleteHolders(holderIds, onSuccess)
  return (
    <div className='mt-6'>
      <DeleteAbortButtons
        onDelete={handleDeleteHolders}
        isDeleting={isDeletingStudents || isDeletingGroups}
        onAbort={onSuccess}
        isDisabled={isDeletingStudents || isDeletingGroups}
      />
    </div>
  )
}

export default DeleteHolders
