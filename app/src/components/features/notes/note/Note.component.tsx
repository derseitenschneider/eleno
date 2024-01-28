import './note.style.scss'

import parse from 'html-react-parser'
import { HiPencil, HiTrash } from 'react-icons/hi'
import Menus from '../../../ui/menu/Menus.component'
import Modal from '../../../ui/modal/Modal.component'
import DeleteNote from '../deleteNote/DeleteNote.component'
import EditNote from '../editNote/EditNote.component'

interface NoteProps {
  id: number
  title: string
  text: string
}

function Note({ id, title, text }: NoteProps) {
  return (
    <div className="note">
      <div className="container--edit-button">
        <Modal>
          <Menus.Toggle id={`note-${id}`} />
          <Menus.Menu>
            <Menus.List id={`note-${id}`}>
              <Modal.Open opens="edit-note">
                <Menus.Button icon={<HiPencil />}>
                  Notiz bearbeiten
                </Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete-note">
                <Menus.Button iconColor="var(--clr-warning)" icon={<HiTrash />}>
                  Notiz löschen
                </Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name="edit-note">
            <EditNote noteId={id} />
          </Modal.Window>

          <Modal.Window name="delete-note">
            <DeleteNote noteId={id} />
          </Modal.Window>
        </Modal>
      </div>
      {title && <h5 className="heading-5">{title}</h5>}
      <div>{parse(text)}</div>
    </div>
  )
}

export default Note
