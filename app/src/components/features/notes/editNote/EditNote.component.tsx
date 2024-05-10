import { useState } from "react"
import { toast } from "react-toastify"
import { useNotes } from "../../../../services/context/NotesContext"
import Button from "../../../ui/button/Button.component"
import CustomEditor from "../../../ui/customEditor/CustomEditor.component"
import "./editNote.style.scss"
import type { NotesBackgrounds } from "../../../../types/types"
import NoteColor from "../noteColor/NoteColor.component"

interface EditNoteProps {
  onCloseModal?: () => void
  noteId: number
}

function EditNote({ onCloseModal, noteId }: EditNoteProps) {
  const { notes, updateNotes } = useNotes()
  const [isPending, setIsPending] = useState(false)
  const currentNote = notes.find((note) => note.id === noteId)
  const [text, setText] = useState(currentNote.text)
  const [backgroundColor, setBackgroundColor] =
    useState<NotesBackgrounds | null>(currentNote.backgroundColor)

  const [title, setTitle] = useState(currentNote.title)

  const handleText = (inputText: string) => {
    setText(inputText)
  }

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleUpdate = async () => {
    if (!title && !text) {
      toast("Titel oder Inhalt fehlt.", { type: "error" })
      return
    }
    setIsPending(true)
    try {
      const updatedNote = {
        ...currentNote,
        text,
        title,
        backgroundColor,
      }

      await updateNotes([updatedNote])
      toast("Anpassungen gespeichert")
      onCloseModal?.()
    } catch (error) {
      toast("Etwas ist schiefgelaufen. Versuchs nochmal!", { type: "error" })
    } finally {
      setIsPending(false)
    }
  }
  return (
    <div
      className={`edit-note ${isPending ? "loading" : ""}`}
      style={{
        boxShadow: `inset 12px 0 0  var(--bg-notes-${backgroundColor})`,
      }}
    >
      <h2 className='heading-2'>Notiz bearbeiten</h2>
      <input
        autoFocus={window.screen.width > 1000}
        type='text'
        name='title'
        placeholder='Titel'
        className='edit-note__title'
        value={title}
        onChange={handleTitle}
      />

      <div className='container--editor'>
        <CustomEditor value={text} onChange={handleText} />
      </div>
      <div className='edit-note__buttons'>
        <NoteColor color={backgroundColor} setColor={setBackgroundColor} />
        <div className='buttons-right'>
          <Button
            type='button'
            btnStyle='secondary'
            handler={onCloseModal}
            label='Abbrechen'
          />
          <Button
            type='button'
            btnStyle='primary'
            handler={handleUpdate}
            label='Speichern'
          />
        </div>
      </div>
    </div>
  )
}

export default EditNote
