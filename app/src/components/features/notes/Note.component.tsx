import parse from 'html-react-parser'
import type { NotesBackgrounds, Note as TNote } from '../../../types/types'
import { cn } from '@/lib/utils'
import NoteDropdown from './NoteDropdown.component'
import { Draggable } from '@hello-pangea/dnd'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'

interface NoteProps {
  note: TNote
  index: number
}

function Note({ note, index }: NoteProps) {
  const { id, title, text, backgroundColor } = note
  const borderVariants: Record<Exclude<NotesBackgrounds, null>, string> = {
    red: 'border-l-noteRed border-l-[5px]',
    blue: 'border-l-noteBlue border-l-[5px]',
    yellow: 'border-l-noteYellow border-l-[5px]',
    green: 'border-l-noteGreen border-l-[5px]',
  }

  return (
    <Draggable key={id} draggableId={String(id)} index={index}>
      {(provided, snapshot) => {
        return (
          <li
            data-dragging={snapshot.isDragging}
            className={cn(
              'relative mb-6 rounded-sm border-hairline shadow leading-8 px-5 py-6 sm:p-4 bg-background100 border-t border-r border-b',
              backgroundColor
                ? borderVariants[backgroundColor]
                : 'border-hairline border-l',
              snapshot.isDragging && 'outline outline-ring',
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
            <div className='[&_*:not(a:link)]:!text-foreground [&_a:link]:underline [&_a:link]:text-primary text-foreground has-list text-sm'>
              {parse(removeHTMLAttributes(text || ''))}
            </div>
          </li>
        )
      }}
    </Draggable>
  )
}

export default Note
