import { IoAddOutline } from 'react-icons/io5'
import { useEffect, useRef, useState } from 'react'
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
import { TNote } from '../../../../types/types'

import fetchErrorToast from '../../../../hooks/fetchErrorToast'

function NoteList() {
  const { currentStudentId } = useStudents()
  const { notes, updateNotes } = useNotes()
  const [currentNotes, setCurrentNotes] = useState<TNote[]>([])
  // const [isDragging, setIsDragging] = useState(false)
  const notesContainer = useRef<HTMLDivElement>()

  useEffect(() => {
    setCurrentNotes(notes.filter((note) => note.studentId === currentStudentId))
  }, [currentStudentId, notes])

  async function handleOnDragend(result) {
    if (!result.destination) return
    const origin = result.source.index
    const destination = result.destination.index

    const items = [...currentNotes]

    const preservedNotes = [...currentNotes]
    const [reorderedItem] = items.splice(origin, 1)
    items.splice(destination, 0, reorderedItem)
    const newNotes = items.map((item, index) => ({ ...item, order: index }))

    try {
      setCurrentNotes(newNotes)
      await updateNotes(newNotes)
    } catch (error) {
      fetchErrorToast()
      setCurrentNotes(preservedNotes)
    }
  }

  // const sortedNotes = currentNotes.sort((a, b) => a.order - b.order)

  return (
    <div className="notes" ref={notesContainer}>
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
      {currentNotes.length > 0 ? (
        <DragDropContext onDragEnd={handleOnDragend}>
          <StrictModeDroppable droppableId="notes">
            {(provided, snapshot) => {
              return (
                <ul
                  data-isdraggingover={snapshot.isDraggingOver}
                  className="notes__list no-scrollbar"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <Menus>
                    {currentNotes.map((note, index) => (
                      <Note note={note} index={index} key={note.id} />
                    ))}
                  </Menus>
                  {provided.placeholder}
                </ul>
              )
            }}
          </StrictModeDroppable>
        </DragDropContext>
      ) : null}
    </div>
  )
}

export default NoteList
