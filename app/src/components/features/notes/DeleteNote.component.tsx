import { Button } from "@/components/ui/button"
import MiniLoader from "@/components/ui/MiniLoader.component"
import { deleteNoteMutation } from "./mutations/deleteNoteMutation"

interface DeleteNoteProps {
  onCloseModal?: () => void
  noteId: number
}

function DeleteNote({ onCloseModal, noteId }: DeleteNoteProps) {
  const {
    mutate: handleDelete,
    isPending,
    error,
  } = deleteNoteMutation(noteId, onCloseModal)

  return (
    <div>
      <p>Möchtest du diese Notiz wirklich löschen?</p>
      <div className='flex justify-end gap-4 mt-4'>
        <Button
          disabled={isPending}
          size='sm'
          variant='outline'
          onClick={onCloseModal}
        >
          Abbrechen
        </Button>
        <div className='flex items-center gap-2'>
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
      {error && (
        <p className='mt-4 text-center text-sm text-warning'>
          Es ist etwas schiefgelaufen. Versuch's nochmal.
        </p>
      )}
    </div>
  )
}

export default DeleteNote
