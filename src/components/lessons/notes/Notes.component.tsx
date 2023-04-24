import './notes.style.scss'
import { FunctionComponent, useState } from 'react'
import { useNotes } from '../../../contexts/NotesContext'
import Button from '../../button/Button.component'
import Note from '../note/Note.component'
import { IoAddOutline } from 'react-icons/io5'
import ModalAddNote from '../../modals/modalAddNotes/ModalAddNote.component'

interface NotesProps {
  currentStudentId: number
}

const Notes: FunctionComponent<NotesProps> = ({ currentStudentId }) => {
  const { notes } = useNotes()
  const [modalOpen, setModalOpen] = useState(false)

  const currentNotes = notes.filter(
    (note) => note.studentId === currentStudentId
  )

  return (
    <>
      <Button
        type="button"
        btnStyle="icon-only"
        className="button--add-note"
        icon={<IoAddOutline />}
        handler={() => setModalOpen((prev) => !prev)}
      />
      <h4 className="heading-4">Notizen</h4>
      {currentNotes &&
        currentNotes.map(({ id, title, text }) => (
          <Note key={id} id={id} title={title} text={text} />
        ))}
      {modalOpen ? (
        <ModalAddNote
          setModalOpen={setModalOpen}
          currentStudentId={currentStudentId}
        />
      ) : null}
    </>
  )
}

export default Notes
