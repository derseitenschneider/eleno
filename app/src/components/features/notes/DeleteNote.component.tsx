import MiniLoader from '@/components/ui/MiniLoader.component'
import { Button } from '@/components/ui/button'
import { useDeleteNote } from './useDeleteNote'

interface DeleteNoteProps {
  onCloseModal?: () => void
  noteId: number
}

function DeleteNote({ onCloseModal, noteId }: DeleteNoteProps) {
  const { deleteNote, isDeleting } = useDeleteNote()

  function handleDelete() {
    deleteNote(noteId, {
      onSettled: () => onCloseModal?.(),
    })
  }

  return (
    <div>
      <p>Möchtest du diese Notiz wirklich löschen?</p>
      <div className='mt-4 flex flex-col-reverse justify-end gap-4 sm:flex-row'>
        <Button
          disabled={isDeleting}
          size='sm'
          variant='outline'
          onClick={onCloseModal}
        >
          Abbrechen
        </Button>
        <div className='flex w-full items-center gap-2 sm:w-auto'>
          <Button
            className='w-full'
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
