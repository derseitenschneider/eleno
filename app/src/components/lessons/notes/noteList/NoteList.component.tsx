import './noteList.style.scss'
import { useNotes } from '../../../../contexts/NotesContext'
import Button from '../../../common/button/Button.component'
import Note from '../note/Note.component'
import { IoAddOutline } from 'react-icons/io5'
import { useStudents } from '../../../../contexts/StudentContext'
import Modal from '../../../common/modal/Modal.component'
import AddNote from '../addNote/AddNote.component'
import Menus from '../../../common/menu/Menus.component'

const NoteList = () => {
  const { currentStudentId } = useStudents()
  const { notes } = useNotes()

  const currentNotes = notes.filter(
    (note) => note.studentId === currentStudentId
  )

  return (
    <div className="notes">
      <div className="notes__header">
        <h4 className="heading-4">Notizen</h4>
        <Modal>
          <Modal.Open opens="add-note">
            <Button btnStyle="icon-only" icon={<IoAddOutline />} />
          </Modal.Open>

          <Modal.Window name="add-note">
            <AddNote currentStudentId={currentStudentId} />
          </Modal.Window>
        </Modal>
      </div>

      <div className="notes__list">
        <Menus>
          {currentNotes &&
            currentNotes.map(({ id, title, text }) => (
              <Note key={id} id={id} title={title} text={text} />
            ))}
        </Menus>
      </div>
    </div>
  )
}

export default NoteList
