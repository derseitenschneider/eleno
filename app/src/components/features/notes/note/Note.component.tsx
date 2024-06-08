import "./note.style.scss"
// import { lazy, Suspense } from 'react'
import { Draggable } from "react-beautiful-dnd"

import parse from "html-react-parser"
import { HiPencil, HiTrash, HiDocumentDuplicate } from "react-icons/hi"
import Menus from "../../../ui/menu/Menus.component"
import Modal from "../../../ui/modal/Modal.component"
import DeleteNote from "../deleteNote/DeleteNote.component"
import EditNote from "../editNote/EditNote.component"
import type { Note } from "../../../../types/types"
import { useNotes } from "../../../../services/context/NotesContext"
import { cn } from "@/lib/utils"

interface NoteProps {
  note: Note
  index: number
}

function Note({ note, index }: NoteProps) {
  const { id, title, text, backgroundColor } = note
  const border = `border-${"red"}-400`

  return (
    <Draggable key={id} draggableId={String(id)} index={index}>
      {(provided, snapshot) => {
        return (
          <li
            data-dragging={snapshot.isDragging}
            className={cn(
              "relative mb-6 rounded-sm leading-8 p-4 bg-background50 border-l-4",
              border,
            )}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className='absolute top-3 right-3'>trigger</div>
            {title && (
              <h4 className='text-base font-medium mb-4 max-w-[25ch] leading-3'>
                {title}
              </h4>
            )}
            <div className='text-sm'>{parse(text || "")}</div>
          </li>
        )
      }}
    </Draggable>
  )
}

export default Note
