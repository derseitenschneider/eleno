import { FunctionComponent, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from '../Modal.component'
import { useNotes } from '../../../contexts/NotesContext'
import fetchErrorToast from '../../../hooks/fetchErrorToast'

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
  const [isPending, setIsPending] = useState(false)

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
  const saveHandler = async () => {
    if (!input.title && !input.text) {
      toast('Titel oder Inhalt fehlt.', { type: 'error' })
      return
    }
    setIsPending(true)
    try {
      await saveNote({ ...input, studentId: currentStudentId })
      setInput({ title: '', text: '' })
      toggleModal()
      toast('Notiz gespeichert')
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Modal
      className={`modal--notes ${isPending ? ' loading' : ''}`}
      heading="Neue Notiz erstellen"
      handlerClose={toggleModal}
      handlerOverlay={toggleModal}
      buttons={[
        { label: 'Speichern', btnStyle: 'primary', handler: saveHandler },
      ]}
    >
      <input
        autoFocus={window.screen.width > 1000 ? true : false}
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
