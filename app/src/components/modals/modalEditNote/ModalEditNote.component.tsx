import { FunctionComponent, useState } from 'react'
import Modal from '../Modal.component'
import { useNotes } from '../../../contexts/NotesContext'
import { toast } from 'react-toastify'
interface ModalEditNoteProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentNote: number
}

const ModalEditNote: FunctionComponent<ModalEditNoteProps> = ({
  setModalOpen,
  currentNote,
}) => {
  const { notes, updateNote } = useNotes()
  const [isPending, setIsPending] = useState(false)
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

  const updateHandler = async () => {
    setIsPending(true)
    try {
      await updateNote(input)
      toast('Anpassungen gespeichert')
      closeModal()
    } catch (error) {
      toast('Etwas ist schiefgelaufen. Versuchs nochmal!', { type: 'error' })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Modal
      className={`modal--notes ${isPending ? 'loading' : ''}`}
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
