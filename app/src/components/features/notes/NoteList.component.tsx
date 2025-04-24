import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd'

import CreateNote from './CreateNote.component'
import Note from './Note.component'

import { useActiveNotesQuery } from './notesQueries'
import type { Note as TNote } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useUpdateNote } from './useUpdateNote'
import { cn } from '@/lib/utils'
import useCurrentHolder from '../lessons/useCurrentHolder'
import { Blocker } from '../subscription/Blocker'

function NoteList() {
  const { currentLessonHolder } = useCurrentHolder()
  const [openModal, setOpenModal] = useState<'ADD' | undefined>()
  const { updateNotes, isUpdating } = useUpdateNote()

  const { data } = useActiveNotesQuery()

  const [notes, setNotes] = useState<Array<TNote>>()
  const fieldType = currentLessonHolder?.type === 's' ? 'studentId' : 'groupId'

  useEffect(() => {
    const currentNotes = data?.filter(
      (note) => note[fieldType] === currentLessonHolder?.holder.id,
    )
    if (!currentNotes) return
    setNotes(currentNotes)
  }, [data, fieldType, currentLessonHolder?.holder.id])

  async function handleOnDragend(result: DropResult) {
    if (!result.destination) return
    const origin = result.source.index
    const destination = result.destination.index
    if (!notes) return

    const items = [...notes]

    const [reorderedItem] = items.splice(origin, 1)
    if (!reorderedItem) return
    items.splice(destination, 0, reorderedItem)

    const newNotes = items.map((item, index) => ({ ...item, order: index }))
    setNotes(newNotes)
    updateNotes(newNotes)
  }

  const sortedNotes = notes?.sort((a, b) => a?.order - b?.order) || []
  if (!currentLessonHolder?.holder) return null

  return (
    <div className='min-h-[250px] border-t border-hairline px-5 py-6 sm:pl-6 lg:h-[calc(100vh-88px)] lg:border-none lg:p-4 lg:pr-4'>
      <div className='mb-6'>
        <div className='flex items-baseline justify-between'>
          <h5 className='mb-0'>Notizen</h5>

          <Button
            variant='ghost'
            size='sm'
            title='Neue Notiz erstellen'
            onClick={() => setOpenModal('ADD')}
            className='flex items-center gap-1'
          >
            <Plus className='h-4 w-4 text-primary' />
            <span className='text-xs uppercase text-foreground/75'>Neu</span>
          </Button>
        </div>
      </div>
      {sortedNotes?.length > 0 ? (
        <DragDropContext onDragEnd={handleOnDragend}>
          <Droppable droppableId='notes'>
            {(provided, snapshot) => {
              return (
                <ul
                  data-isdraggingover={snapshot.isDraggingOver}
                  className={cn(
                    'lg:h-full pb-32 md:pb-20 lg:pb-32 overflow-auto min-h-8 no-scrollbar',
                    isUpdating && 'opacity-75',
                  )}
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
          </Droppable>
        </DragDropContext>
      ) : null}

      <Dialog
        open={openModal === 'ADD'}
        onOpenChange={() => setOpenModal(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Notiz erstellen</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Neue Notiz erstellen
          </DialogDescription>
          <Blocker blockerId='createNote' />
          <CreateNote
            holderType={currentLessonHolder.type}
            holderId={currentLessonHolder.holder.id}
            onCloseModal={() => setOpenModal(undefined)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NoteList
