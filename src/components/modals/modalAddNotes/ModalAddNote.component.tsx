import { FunctionComponent, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from '../Modal.component'
import { useNotes } from '../../../contexts/NotesContext'

interface ModalAddNoteProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentStudentId: number
}

const ModalAddNote: FunctionComponent<ModalAddNoteProps> = ({
  setModalOpen,
  currentStudentId,
}) => {
  const [input, setInput] = useState({ title: '', text: '' })
  const { saveNote } = useNotes()

  // Toggle modal
  const toggleModal = () => {
    setModalOpen(false)
  }

  // Handler Input

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name
    const value = e.target.value
    setInput((prev) => {
      return { ...prev, [name]: value }
    })
  }

  // Save Note
  const saveHandler = () => {
    if (!input.title) {
      toast('Titel fehlt', { type: 'error' })
      return
    }

    if (!input.text) {
      toast('Inhalt der Notiz fehlt', { type: 'error' })
      return
    }

    saveNote({ ...input, studentId: currentStudentId })
    setInput({ title: '', text: '' })
    toggleModal()
  }

  return (
    <Modal
      className="modal--notes"
      heading="Neue Notiz erstellen"
      handlerClose={toggleModal}
      handlerOverlay={toggleModal}
      buttons={[
        { label: 'Speichern', btnStyle: 'primary', handler: saveHandler },
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

export default ModalAddNote
