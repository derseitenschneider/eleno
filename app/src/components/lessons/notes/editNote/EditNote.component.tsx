import './editNote.style.scss'
import { FC, useState } from 'react'
import { useNotes } from '../../../../contexts/NotesContext'
import { toast } from 'react-toastify'
import CustomEditor from '../../../common/customEditor/CustomEditor.component'
import Button from '../../../common/button/Button.component'

interface EditNoteProps {
  onCloseModal?: () => void
  noteId: number
}

const EditNote: FC<EditNoteProps> = ({ onCloseModal, noteId }) => {
  const { notes, updateNote } = useNotes()
  const [isPending, setIsPending] = useState(false)
  const note = notes.find((note) => note.id === noteId)
  const [text, setText] = useState(note.text)

  const [title, setTitle] = useState(note.title)

  const handleText = (text: string) => {
    setText(text)
  }

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleUpdate = async () => {
    if (!title && !text) {
      toast('Titel oder Inhalt fehlt.', { type: 'error' })
      return
    }
    setIsPending(true)
    try {
      const updatedNote = { ...note, text, title }
      await updateNote(updatedNote)
      toast('Anpassungen gespeichert')
      onCloseModal?.()
    } catch (error) {
      toast('Etwas ist schiefgelaufen. Versuchs nochmal!', { type: 'error' })
    } finally {
      setIsPending(false)
    }
  }
  return (
    <div className={`edit-note ${isPending ? 'loading' : ''}`}>
      <h2 className="heading-2">Notiz bearbeiten</h2>
      <input
        autoFocus={window.screen.width > 1000 ? true : false}
        type="text"
        name="title"
        placeholder="Titel"
        className="edit-note__title"
        value={title}
        onChange={handleTitle}
      />

      <div className="container--editor">
        <CustomEditor value={text} onChange={handleText} />
      </div>
      <div className="edit-note__buttons">
        <Button btnStyle="secondary" handler={onCloseModal} label="Abbrechen" />
        <Button btnStyle="primary" handler={handleUpdate} label="Speichern" />
      </div>
    </div>
  )
}

export default EditNote
