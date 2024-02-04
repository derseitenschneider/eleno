import './note.style.scss'
import { Draggable } from 'react-beautiful-dnd'

import parse from 'html-react-parser'
import { HiPencil, HiTrash, HiDocumentDuplicate } from 'react-icons/hi'
import Menus from '../../../ui/menu/Menus.component'
import Modal from '../../../ui/modal/Modal.component'
import DeleteNote from '../deleteNote/DeleteNote.component'
import EditNote from '../editNote/EditNote.component'
import { TNote } from '../../../../types/types'
import { useNotes } from '../../../../services/context/NotesContext'

interface NoteProps {
  note: TNote
  index: number
}

function Note({ note, index }: NoteProps) {
  const { duplicateNote } = useNotes()
  const { id, title, text, backgroundColor } = note

  return (
    <Draggable key={id} draggableId={String(id)} index={index}>
      {(provided, snapshot) => {
        return (
          <li
            data-dragging={snapshot.isDragging}
            className={`note${snapshot.isDragging ? ' dragged' : ''} ${
              backgroundColor || ''
            }`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
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

                    <Menus.Button
                      icon={<HiDocumentDuplicate />}
                      onClick={() => duplicateNote(note)}
                    >
                      Notiz duplizieren
                    </Menus.Button>

                    <Modal.Open opens="delete-note">
                      <Menus.Button
                        iconColor="var(--clr-warning)"
                        icon={<HiTrash />}
                      >
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
          </li>
        )
      }}
    </Draggable>
  )
}

export default Note
