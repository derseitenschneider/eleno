import { Button } from "@/components/ui/button"
import MiniLoader from "@/components/ui/MiniLoader.component"
import { useDeleteNote } from "./useDeleteNote"

interface DeleteNoteProps {
  onCloseModal?: () => void
  noteId: number
}

function DeleteNote({ onCloseModal, noteId }: DeleteNoteProps) {
  const { deleteNote, isDeleting, isError } = useDeleteNote()

  function handleDelete() {
    deleteNote(noteId, {
      onSettled: () => onCloseModal?.(),
    })
  }

  return (
    <div>
      <p>Möchtest du diese Notiz wirklich löschen?</p>
      <div className='flex justify-end gap-4 mt-4'>
        <Button
          disabled={isDeleting}
          size='sm'
          variant='outline'
          onClick={onCloseModal}
        >
          Abbrechen
        </Button>
        <div className='flex items-center gap-2'>
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
      </div>
    </div>
  )
}

export default DeleteNote
