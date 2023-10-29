import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNotes } from '../../../../contexts/NotesContext'
import Button from '../../../common/button/Button.component'
import CustomEditor from '../../../common/customEditor/CustomEditor.component'
import './editNote.style.scss'

interface EditNoteProps {
  onCloseModal?: () => void
  noteId: number
}

function EditNote({ onCloseModal, noteId }: EditNoteProps) {
  const { notes, updateNote } = useNotes()
  const [isPending, setIsPending] = useState(false)
  const currentNote = notes.find((note) => note.id === noteId)
  const [text, setText] = useState(currentNote.text)

  const [title, setTitle] = useState(currentNote.title)

  const handleText = (inputText: string) => {
    setText(inputText)
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
      const updatedNote = { ...currentNote, text, title }
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
        autoFocus={window.screen.width > 1000}
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
        <Button
          type="button"
          btnStyle="secondary"
          handler={onCloseModal}
          label="Abbrechen"
        />
        <Button
          type="button"
          btnStyle="primary"
          handler={handleUpdate}
          label="Speichern"
        />
      </div>
    </div>
  )
}

export default EditNote
