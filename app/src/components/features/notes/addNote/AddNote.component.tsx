import './addNote.style.scss'

import { FC, useState } from 'react'
import { useNotes } from '../../../../contexts/NotesContext'
import { toast } from 'react-toastify'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import CustomEditor from '../../../common/customEditor/CustomEditor.component'
import Button from '../../../common/button/Button.component'

interface AddNoteProps {
  onCloseModal?: () => void
  currentStudentId: number
}

const AddNote: FC<AddNoteProps> = ({ onCloseModal, currentStudentId }) => {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const { saveNote } = useNotes()
  const [isPending, setIsPending] = useState(false)

  const handleText = (text: string) => {
    setText(text)
  }
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleSave = async () => {
    if (!title && !text) {
      toast('Titel oder Inhalt fehlt.', { type: 'error' })
      return
    }
    setIsPending(true)
    try {
      await saveNote({ text, title, studentId: currentStudentId })
      setText('')
      setTitle('')
      onCloseModal?.()
      toast('Notiz gespeichert')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={`add-note ${isPending ? 'loading' : ''}`}>
      <h2 className="heading-2">Neue Notiz erstellen</h2>
      <input
        autoFocus={window.screen.width > 1000 ? true : false}
        type="text"
        name="title"
        placeholder="Titel"
        className="add-note__title"
        value={title}
        onChange={handleTitle}
      />
      <div className="container--editor">
        <CustomEditor value={text} onChange={handleText} />
      </div>
      <div className="add-note__buttons">
        <Button btnStyle="secondary" handler={onCloseModal} label="Abbrechen" />
        <Button btnStyle="primary" handler={handleSave} label="Speichern" />
      </div>
    </div>
  )
}

export default AddNote
