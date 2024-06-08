import { useRef, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"

import Menus from "../../ui/menu/Menus.component"
import Modal from "../../ui/modal/Modal.component"
import AddNote from "./addNote/AddNote.component"
import Note from "./note/Note.component"
import StrictModeDroppable from "../../../utils/StrictModeDroppable"

import fetchErrorToast from "../../../hooks/fetchErrorToast"
import { useParams } from "react-router-dom"
import { useActiveNotesQuery } from "./notesQueries"

function NoteList() {
  const { studentId } = useParams()

  const { data } = useActiveNotesQuery()

  const currentNotes = data?.filter(
    (note) => note.studentId === Number(studentId),
  )

  const [notes, setNotes] = useState(currentNotes)

  const notesContainer = useRef<HTMLDivElement>()

  async function handleOnDragend(result) {
    if (!result.destination) return
    const origin = result.source.index
    const destination = result.destination.index

    const items = [...notes]

    const preservedNotes = [...notes]
    const [reorderedItem] = items.splice(origin, 1)
    items.splice(destination, 0, reorderedItem)

    const newNotes = items.map((item, index) => ({ ...item, order: index }))

    try {
      setNotes(newNotes)
      // await updateNotes(newNotes)
    } catch (error) {
      fetchErrorToast()
      setNotes(preservedNotes)
    }
  }

  const sortedNotes = notes?.sort((a, b) => a?.order - b?.order) || []

  return (
    <div className='sm:p-4' ref={notesContainer}>
      <div className='h-full'>
        <h5 className=''>Notizen</h5>
      </div>
      {sortedNotes?.length > 0 ? (
        <DragDropContext onDragEnd={handleOnDragend}>
          <StrictModeDroppable droppableId='notes'>
            {(provided, snapshot) => {
              return (
                <ul
                  data-isdraggingover={snapshot.isDraggingOver}
                  className='min-h-8 h-full overflow-y-auto pb-20'
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <Menus>
                    {sortedNotes.map((note, index) => (
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
