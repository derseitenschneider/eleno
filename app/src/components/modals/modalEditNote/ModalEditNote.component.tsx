import './modalEditNote.style.scss'

import { FunctionComponent, useState } from 'react'
import Modal from '../Modal.component'
import { useNotes } from '../../../contexts/NotesContext'
import { toast } from 'react-toastify'
import CustomEditor from '../../common/customEditor/CustomEditor.component'
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
  const note = notes.find((note) => note.id === currentNote)
  const [text, setText] = useState(note.text)

  const [title, setTitle] = useState(note.title)

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  // const inputHandler = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const name = e.target.name
  //   const value = e.target.value
  //   setInput((prev) => {
  //     return { ...prev, [name]: value }
  //   })
  // }

  const handleSaveUpdate = async () => {
    if (!title && !text) {
      toast('Titel oder Inhalt fehlt.', { type: 'error' })
      return
    }
    setIsPending(true)
    try {
      const updatedNote = { ...note, text, title }
      await updateNote(updatedNote)
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
        {
          label: 'Speichern',
          btnStyle: 'primary',
          handler: handleSaveUpdate,
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

export default ModalEditNote
