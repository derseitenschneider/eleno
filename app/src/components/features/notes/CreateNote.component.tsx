import { useState } from 'react'
import CustomEditor from '../../ui/CustomEditor.component'
import NoteColor from './NoteColor.component'
import type { NotesBackgrounds, PartialNote } from '../../../types/types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUser } from '@/services/context/UserContext'
import { useCreateNote } from './useCreateNote'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'

type CreateNoteProps = {
  onCloseModal?: () => void
  holderId: number
  holderType: 's' | 'g'
}

function CreateNote({ onCloseModal, holderId, holderType }: CreateNoteProps) {
  const { user } = useUser()
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [color, setColor] = useState<NotesBackgrounds>(null)
  const [error, setError] = useState('')

  const { createNote, isCreating } = useCreateNote()
  const typeField = holderType === 's' ? 'studentId' : 'groupId'

  function handleSave() {
    if (!text && !title) return setError('Titel oder Inhalt fehlt.')
    if (!user?.id) return
    const newNote: PartialNote = {
      [typeField]: holderId,
      title,
      text: removeHTMLAttributes(text),
      backgroundColor: color,
      user_id: user?.id,
      id: new Date().valueOf(),
      order: 0,
    }
    createNote(newNote, {
      onSuccess: () => onCloseModal?.(),
    })
  }

  const handleText = (inputText: string) => {
    setError('')
    setText(inputText)
  }
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setTitle(e.target.value)
  }

  return (
    <div className='sm:min-w-[500px] text-sm'>
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
        <CustomEditor
          placeholder='Notiz erstellen...'
          value={text || ''}
          onChange={handleText}
        />
        {error && (
          <span className='block pt-2 text-warning text-sm'>{error}</span>
        )}
      </div>
      <div className='flex flex-wrap gap-y-5 gap-x-4 justify-between items-end'>
        <NoteColor color={color} setColor={setColor} />
        <div className='flex gap-4 items-center'>
          <Button
            type='button'
            onClick={onCloseModal}
            size='sm'
            variant='outline'
            disabled={isCreating}
          >
            Abbrechen
          </Button>
          <div className='flex items-center gap-2'>
            <Button
              type='button'
              onClick={handleSave}
              size='sm'
              disabled={isCreating}
            >
              Speichern
            </Button>
            {isCreating && <MiniLoader />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateNote
