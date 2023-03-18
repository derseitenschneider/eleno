import { FunctionComponent, useState } from 'react'
import { useUser } from '../../../contexts/UserContext'
import { TNotes, TStudent } from '../../../types/types'
import { postNotesSupabase } from '../../../supabase/notes/notes.supabase'
import { toast } from 'react-toastify'
import Modal from '../Modal.component'

interface ModalAddNoteProps {
  modalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentStudent: TStudent
  notes: TNotes[]
  setNotes: React.Dispatch<React.SetStateAction<TNotes[]>>
}

const ModalAddNote: FunctionComponent<ModalAddNoteProps> = ({
  modalOpen,
  setModalOpen,
  currentStudent,
  notes,
  setNotes,
}) => {
  const [input, setInput] = useState({ title: '', text: '' })
  const { user } = useUser()

  // Toggle modal
  const toggleModal = () => {
    setModalOpen((prev) => !prev)
  }

  // Handler Input

  const handlerInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name
    const value = e.target.value
    setInput((prev) => {
      return { ...prev, [name]: value }
    })
  }

  // Save Note
  const saveNote = () => {
    const tempID = Math.floor(Math.random() * 10000000)
    const newNote = { ...input, studentId: currentStudent.id }
    const tempNotes: TNotes[] = [...notes, { ...newNote, id: tempID }]
    setNotes(tempNotes)
    setInput({ title: '', text: '' })
    toggleModal()
    const postData = async () => {
      const [data] = await postNotesSupabase(newNote, user.id)
      setNotes((notes) =>
        notes.map((note) =>
          note.id === tempID ? { ...note, id: data.id } : note
        )
      )
    }
    postData()
    toast('Notiz gespeichert')
  }
  return (
    <Modal
      className="modal--notes"
      heading="Neue Notiz erstellen"
      handlerClose={toggleModal}
      handlerOverlay={toggleModal}
      buttons={[{ label: 'Speichern', btnStyle: 'primary', handler: saveNote }]}
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

export default ModalAddNote
