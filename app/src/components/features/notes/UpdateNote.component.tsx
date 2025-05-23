import { useState } from 'react'
import CustomEditor from '../../ui/CustomEditor.component'
import type { Note, NotesBackgrounds } from '../../../types/types'
import NoteColor from './NoteColor.component'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateNote } from './useUpdateNote'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { Blocker } from '../subscription/Blocker'

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
    <div className='relative sm:min-w-[500px] text-sm'>
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

      <div className='mt-5 mb-6'>
        <CustomEditor value={text || ''} onChange={handleText} />
      </div>
      <div className='flex flex-wrap gap-y-5 gap-x-4 justify-between items-end'>
        <NoteColor color={backgroundColor} setColor={setBackgroundColor} />
        <div className='flex  gap-4 items-center'>
          <Button
            type='button'
            onClick={onCloseModal}
            size='sm'
            variant='outline'
            disabled={isUpdating}
          >
            Abbrechen
          </Button>
          <div className='flex items-center gap-2'>
            <Button
              type='button'
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
