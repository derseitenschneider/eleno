import { IoAddOutline } from 'react-icons/io5'
import { useNotes } from '../../../../services/context/NotesContext'
import { useStudents } from '../../../../services/context/StudentContext'
import Button from '../../../ui/button/Button.component'
import Menus from '../../../ui/menu/Menus.component'
import Modal from '../../../ui/modal/Modal.component'
import AddNote from '../addNote/AddNote.component'
import Note from '../note/Note.component'
import './noteList.style.scss'

function NoteList() {
  const { currentStudentId } = useStudents()
  const { notes } = useNotes()

  const currentNotes = notes.filter(
    (note) => note.studentId === currentStudentId,
  )

  return (
    <div className="notes">
      <div className="notes__header">
        <h4 className="heading-4">Notizen</h4>
        <Modal>
          <Modal.Open opens="add-note">
            <Button
              type="button"
              btnStyle="icon-only"
              icon={<IoAddOutline />}
            />
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
