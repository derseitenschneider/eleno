import './note.style.scss'
import { FunctionComponent } from 'react'

import parse from 'html-react-parser'
import Menus from '../../../common/menu/Menus.component'
import { HiPencil, HiTrash } from 'react-icons/hi'
import Modal from '../../../common/modal/Modal.component'
import EditNote from '../editNote/EditNote.component'
import DeleteNote from '../deleteNote/DeleteNote.component'

interface NoteProps {
  id: number
  title: string
  text: string
}

const Note: FunctionComponent<NoteProps> = ({ id, title, text }) => {
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
      <h5 className="heading-5">{title}</h5>
      <div>{parse(text)}</div>
    </div>
  )
}

export default Note
