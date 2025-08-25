import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { Separator } from '@/components/ui/separator'
import type { Note, NotesBackgrounds } from '../../../types/types'
import CustomEditor from '../../ui/CustomEditor.component'
import { Blocker } from '../subscription/Blocker'
import NoteColor from './NoteColor.component'
import { useUpdateNote } from './useUpdateNote'

interface UpdateNoteProps {
  onCloseModal?: () => void
  noteId: number
}

function UpdateNote({ onCloseModal, noteId }: UpdateNoteProps) {
  const queryClient = useQueryClient()
  const notes = queryClient.getQueryData(['notes']) as Array<Note>
  const currentNote = notes.find((note) => note.id === noteId)

  const [title, setTitle] = useState(currentNote?.title || '')
  const [text, setText] = useState(currentNote?.text || '')
  const [backgroundColor, setBackgroundColor] = useState<NotesBackgrounds>(
    currentNote?.backgroundColor || null,
  )

  const { updateNotes, isUpdating } = useUpdateNote()

  const handleText = (inputText: string) => {
    setText(inputText)
  }

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  function handleSave() {
    if (!currentNote) return
    updateNotes([{ ...currentNote, title, text, backgroundColor }], {
      onSuccess: () => onCloseModal?.(),
    })
  }

  return (
    <div className='relative px-1 text-sm sm:min-w-[500px]'>
      <Blocker />
      <Label htmlFor='title'>Titel</Label>
      <Input
        id='title'
        className='text-base'
        type='text'
        name='title'
        placeholder='Titel'
        value={title}
        onChange={handleTitle}
      />

      <div className='mb-6 mt-5'>
        <CustomEditor value={text || ''} onChange={handleText} />
      </div>
      <div className='flex flex-col flex-wrap justify-between gap-x-4 sm:flex-row sm:items-end sm:gap-y-5'>
        <NoteColor color={backgroundColor} setColor={setBackgroundColor} />
        <Separator className='my-6 sm:hidden' />
        <div className='flex  flex-col-reverse items-center gap-2 sm:flex-row sm:gap-4'>
          <Button
            type='button'
            className='w-full'
            onClick={onCloseModal}
            size='sm'
            variant='outline'
            disabled={isUpdating}
          >
            Abbrechen
          </Button>
          <div className='flex w-full items-center gap-2'>
            <Button
              type='button'
              className='w-full'
              onClick={handleSave}
              size='sm'
              disabled={isUpdating}
            >
              Speichern
            </Button>
            {isUpdating && <MiniLoader />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateNote
