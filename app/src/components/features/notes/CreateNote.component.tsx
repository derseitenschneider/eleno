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
import { useSubscription } from '@/services/context/SubscriptionContext'

type CreateNoteProps = {
  onCloseModal?: () => void
  holderId: number
  holderType: 's' | 'g'
}

function CreateNote({ onCloseModal, holderId, holderType }: CreateNoteProps) {
  const { hasAccess } = useSubscription()
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
    <div className='relative text-sm sm:w-[500px]'>
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
        <CustomEditor
          placeholder='Notiz erstellen...'
          value={text || ''}
          onChange={handleText}
        />
        {error && (
          <span className='block pt-2 text-sm text-warning'>{error}</span>
        )}
      </div>
      <div className='flex flex-wrap items-end justify-between gap-x-4 gap-y-5'>
        <NoteColor color={color} setColor={setColor} />
        <div className='flex items-center gap-4'>
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
              disabled={isCreating || !hasAccess}
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
