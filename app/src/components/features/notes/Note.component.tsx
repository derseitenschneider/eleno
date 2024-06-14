import parse from "html-react-parser"
import type { NotesBackgrounds, Note as TNote } from "../../../types/types"
import { cn } from "@/lib/utils"
import NoteDropdown from "./NoteDropdown.component"
import { Draggable } from "@hello-pangea/dnd"

interface NoteProps {
  note: TNote
  index: number
}

function Note({ note, index }: NoteProps) {
  const { id, title, text, backgroundColor } = note
  const borderVariants: Record<Exclude<NotesBackgrounds, null>, string> = {
    red: "border-noteRed",
    blue: "border-noteBlue",
    yellow: "border-noteYellow",
    green: "border-noteGreen",
    none: "border-transparent",
  }

  return (
    <Draggable key={id} draggableId={String(id)} index={index}>
      {(provided, snapshot) => {
        return (
          <li
            data-dragging={snapshot.isDragging}
            className={cn(
              "relative mb-6 rounded-sm shadow leading-8 p-4 bg-background50 border-l-[5px]",
              backgroundColor
                ? borderVariants[backgroundColor]
                : "border-transparent",
              snapshot.isDragging && "outline outline-ring",
            )}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className='absolute top-3 right-3'>
              <NoteDropdown noteId={id} />
            </div>
            {title && (
              <h4 className='text-lg text-foreground max-w-[25ch] leading-1'>
                {title}
              </h4>
            )}
            <div className='[&_*]:!text-foreground text-foreground has-list text-sm'>
              {parse(text || "")}
            </div>
          </li>
        )
      }}
    </Draggable>
  )
}

export default Note
