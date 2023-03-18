import { FunctionComponent, useState } from 'react'
import { editNoteSupabase } from '../../../supabase/notes/notes.supabase'
import { TNotes } from '../../../types/types'
import Modal from '../Modal.component'
import { useNotes } from '../../../contexts/NotesContext'
interface ModalEditNoteProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentNote: TNotes
}

const ModalEditNote: FunctionComponent<ModalEditNoteProps> = ({
  setModalOpen,
  currentNote,
}) => {
  const { notes, setNotes } = useNotes()
  const [input, setInput] = useState(currentNote)
  const closeModal = () => {
    setModalOpen(false)
  }

  const handlerInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name
    const value = e.target.value
    setInput((prev) => {
      return { ...prev, [name]: value }
    })
  }
  const updateNote = () => {
    const newNotes = notes.map((note) =>
      note.id === currentNote.id ? input : note
    )
    setNotes(newNotes)
    closeModal()
    editNoteSupabase(input)
  }

  return (
    <Modal
      className="modal--notes"
      heading="Notiz bearbeiten"
      handlerClose={closeModal}
      handlerOverlay={closeModal}
      buttons={[
        { label: 'Speichern', btnStyle: 'primary', handler: updateNote },
      ]}
    >
      <input
        type="text"
        name="title"
        placeholder="Titel"
        className="note-title"
        value={input.title}
        onChange={handlerInput}
      />
      <textarea
        name="text"
        placeholder="Inhalt"
        className="note-content"
        value={input.text}
        onChange={handlerInput}
      />
    </Modal>
  )
}

export default ModalEditNote
