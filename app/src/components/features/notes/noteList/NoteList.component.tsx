import { IoAddOutline } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { useNotes } from '../../../../services/context/NotesContext'
import { useStudents } from '../../../../services/context/StudentContext'

import Button from '../../../ui/button/Button.component'
import Menus from '../../../ui/menu/Menus.component'
import Modal from '../../../ui/modal/Modal.component'
import AddNote from '../addNote/AddNote.component'
import Note from '../note/Note.component'
import './noteList.style.scss'
import StrictModeDroppable from '../../../../utils/StrictModeDroppable'
import { TNotes } from '../../../../types/types'

function NoteList() {
  const { currentStudentId } = useStudents()
  const { notes } = useNotes()
  const [currentNotes, setCurrentNotes] = useState<TNotes[]>([])

  useEffect(() => {
    setCurrentNotes(notes.filter((note) => note.studentId === currentStudentId))
  }, [currentStudentId, notes])

  function handleOnDragend(result) {
    if (!result.destination) return
    const origin = result.source.index
    const destination = result.destination.index

    const items = [...currentNotes]
    const [reorderedItem] = items.splice(origin, 1)
    items.splice(destination, 0, reorderedItem)
    const newNotes = items.map((item, index) => ({ ...item, order: index }))

    setCurrentNotes(newNotes)
  }

  const sortedNotes = currentNotes.sort((a, b) => a.order - b.order)
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

      <DragDropContext onDragEnd={handleOnDragend}>
        <StrictModeDroppable droppableId="notes">
          {(provided) => (
            <ul
              className="notes__list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <Menus>
                {sortedNotes &&
                  sortedNotes.map(({ id, title, text }, index) => (
                    <Note
                      id={id}
                      title={title}
                      text={text}
                      key={id}
                      index={index}
                    />
                  ))}
              </Menus>
              {provided.placeholder}
            </ul>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </div>
  )
}

export default NoteList
