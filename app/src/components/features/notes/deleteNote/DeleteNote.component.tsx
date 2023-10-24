import './deleteNote.style.scss'
import { FC, useState } from 'react'
import Button from '../../../common/button/Button.component'
import { useNotes } from '../../../../contexts/NotesContext'
import { toast } from 'react-toastify'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'

interface DeleteNoteProps {
  onCloseModal?: () => {}
  noteId: number
}

const DeleteNote: FC<DeleteNoteProps> = ({ onCloseModal, noteId }) => {
  const [isPending, setIsPending] = useState(false)
  const { deleteNote } = useNotes()

  const handleDelete = async () => {
    setIsPending(true)
    try {
      await deleteNote(noteId)
      toast('Notitz gelöscht.')
      onCloseModal?.()
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={`delete-note ${isPending ? 'loading' : ''}`}>
      <h2 className="heading-2">Notiz löschen</h2>
      <p>Möchtest du diese Notiz wirklich löschen?</p>
      <div className="delete-note__buttons">
        <Button btnStyle="secondary" handler={onCloseModal} label="Abbrechen" />
        <Button btnStyle="danger" handler={handleDelete} label="Löschen" />
      </div>
    </div>
  )
}

export default DeleteNote
