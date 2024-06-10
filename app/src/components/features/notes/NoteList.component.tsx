import { LegacyRef, useEffect, useRef, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"

import Menus from "../../ui/menu/Menus.component"
import Modal from "../../ui/modal/Modal.component"
import AddNote from "./AddNote.component"
import Note from "./Note.component"
import StrictModeDroppable from "../../../utils/StrictModeDroppable"

import fetchErrorToast from "../../../hooks/fetchErrorToast"
import { useParams } from "react-router-dom"
import { useActiveNotesQuery } from "./notesQueries"
import type { Note as TNote } from "@/types/types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"

function NoteList() {
  const { studentId } = useParams()
  const [openModal, setOpenModal] = useState<"ADD" | undefined>()

  const { data } = useActiveNotesQuery()

  const [notes, setNotes] = useState<Array<TNote>>()

  useEffect(() => {
    const currentNotes = data?.filter(
      (note) => note.studentId === Number(studentId),
    )
    setNotes(currentNotes)
  }, [studentId, data])

  const notesContainer = useRef<LegacyRef<HTMLDivElement>>()

  async function handleOnDragend(result) {
    console.log(result)
    if (!result.destination) return
    const origin = result.source.index
    const destination = result.destination.index

    if (!notes) return

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
      <div className='h-full mb-6'>
        <div className='flex justify-between items-center'>
          <h4 className=''>Notizen</h4>

          <Button variant='ghost' size='sm' onClick={() => setOpenModal("ADD")}>
            <Plus className='h-4 w-4 text-primary' />
          </Button>
        </div>
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
                  {sortedNotes.map((note, index) => (
                    <Note note={note} index={index} key={note.id} />
                  ))}
                  {provided.placeholder}
                </ul>
              )
            }}
          </StrictModeDroppable>
        </DragDropContext>
      ) : null}

      <Dialog
        open={openModal === "ADD"}
        onOpenChange={() => setOpenModal(undefined)}
      >
        <DialogContent>
          <DialogTitle>Neue Notiz erstellen</DialogTitle>
          <AddNote
            studentId={Number(studentId)}
            onCloseModal={() => setOpenModal(undefined)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NoteList
