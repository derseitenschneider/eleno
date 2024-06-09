import { Draggable } from "react-beautiful-dnd"

import parse from "html-react-parser"
import type { Note as TNote } from "../../../../types/types"
import { cn } from "@/lib/utils"
import NoteDropdown from "../NoteDropdown.component"

interface NoteProps {
  note: TNote
  index: number
}

function Note({ note, index }: NoteProps) {
  const { id, title, text, backgroundColor } = note
  const borderVariants = {
    red: "border-noteRed",
    blue: "border-noteBlue",
    yellow: "border-noteYellow",
    green: "border-noteGreen",
  }

  return (
    <Draggable key={id} draggableId={String(id)} index={index}>
      {(provided, snapshot) => {
        return (
          <li
            data-dragging={snapshot.isDragging}
            className={cn(
              "relative mb-6 rounded-sm shadow leading-8 p-4 bg-background50 border-l-4",
              borderVariants[backgroundColor],
            )}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className='absolute top-3 right-3'>
              <NoteDropdown id={id} />
            </div>
            {title && (
              <h4 className='text-lg text-foreground mb-4 max-w-[25ch] leading-3'>
                {title}
              </h4>
            )}
            <div className='[&_*]:!text-foreground has-list text-sm'>
              {parse(text || "")}
            </div>
          </li>
        )
      }}
    </Draggable>
  )
}

export default Note
