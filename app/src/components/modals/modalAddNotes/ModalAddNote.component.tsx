import './modalAddNote.style.scss'

import { FunctionComponent, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from '../Modal.component'
import { useNotes } from '../../../contexts/NotesContext'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import CustomEditor from '../../common/customEditor/CustomEditor.component'

interface ModalAddNoteProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentStudentId: number
}

const ModalAddNote: FunctionComponent<ModalAddNoteProps> = ({
  setModalOpen,
  currentStudentId,
}) => {
  const [input, setInput] = useState({ title: '', text: '' })
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const { saveNote } = useNotes()
  const [isPending, setIsPending] = useState(false)

  // Toggle modal
  const toggleModal = () => {
    setModalOpen(false)
  }

  // Handler Input

  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  // Save Note
  const saveHandler = async () => {
    if (!title && !text) {
      toast('Titel oder Inhalt fehlt.', { type: 'error' })
      return
    }
    setIsPending(true)
    try {
      await saveNote({ text, title, studentId: currentStudentId })
      setText('')
      setTitle('')
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
        {
          label: 'Speichern',
          btnStyle: 'primary',
          handler: saveHandler,
          disabled: !title && !text,
        },
      ]}
    >
      <input
        autoFocus={window.screen.width > 1000 ? true : false}
        type="text"
        name="title"
        placeholder="Titel"
        className="note-title"
        value={title}
        onChange={handleTitle}
      />
      <div className="container--editor">
        <CustomEditor value={text} onChange={handleText} />
      </div>
      {/* <textarea
        name="text"
        placeholder="Inhalt"
        className="note-content"
        value={input.text}
        onChange={inputHandler}
      /> */}
    </Modal>
  )
}

export default ModalAddNote
