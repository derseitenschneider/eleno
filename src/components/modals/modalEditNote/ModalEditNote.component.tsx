import { FunctionComponent, useState } from 'react'
import Modal from '../Modal.component'
import { useNotes } from '../../../hooks/useNotes'
interface ModalEditNoteProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentNote: number
}

const ModalEditNote: FunctionComponent<ModalEditNoteProps> = ({
  setModalOpen,
  currentNote,
}) => {
  const { notes, updateNote } = useNotes()
  const [input, setInput] = useState(
    notes.find((note) => note.id === currentNote)
  )
  const closeModal = () => {
    setModalOpen(false)
  }

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name
    const value = e.target.value
    setInput((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const updateHandler = () => {
    updateNote(input)
    closeModal()
  }

  return (
    <Modal
      className="modal--notes"
      heading="Notiz bearbeiten"
      handlerClose={closeModal}
      handlerOverlay={closeModal}
      buttons={[
        { label: 'Speichern', btnStyle: 'primary', handler: updateHandler },
      ]}
    >
      <input
        autoFocus={true}
        type="text"
        name="title"
        placeholder="Titel"
        className="note-title"
        value={input.title}
        onChange={inputHandler}
      />
      <textarea
        name="text"
        placeholder="Inhalt"
        className="note-content"
        value={input.text}
        onChange={inputHandler}
      />
    </Modal>
  )
}

export default ModalEditNote
