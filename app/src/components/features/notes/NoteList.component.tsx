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
    <div className='border-t lg:border-none border-hairline min-h-[150px] py-6 px-5 sm:pl-6 lg:pr-4 lg:p-4 lg:h-[calc(100vh-88px)]'>
      <div className='mb-6'>
        <div className='flex justify-between items-baseline'>
          <h4 className='mb-0'>Notizen</h4>

          <Button
            variant='ghost'
            size='sm'
            title='Neue Notiz erstellen'
            onClick={() => setOpenModal('ADD')}
            className='flex gap-1 items-center'
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
                    'h-full overflow-auto min-h-8 pb-20 no-scrollbar',
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
