import { useState } from "react"
import CustomEditor from "../../ui/CustomEditor.component"
import NoteColor from "./NoteColor.component"
import type { Note, NotesBackgrounds } from "../../../types/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@/services/context/UserContext"
import { useCreateNote } from "./useCreateNote"
import MiniLoader from "@/components/ui/MiniLoader.component"

interface CreateNoteProps {
  onCloseModal?: () => void
  studentId: number
}

function CreateNote({ onCloseModal, studentId }: CreateNoteProps) {
  const { user } = useUser()
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [color, setColor] = useState<NotesBackgrounds>(null)

  const { createNote, isCreating } = useCreateNote()

  function handleSave() {
    if (!user?.id) return
    const newNote: Note = {
      studentId,
      title,
      text,
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
    setText(inputText)
  }
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  return (
    <div className='min-w-[500px] text-sm'>
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
        <CustomEditor value={text || ""} onChange={handleText} />
      </div>
      <div className='flex justify-between items-end'>
        <NoteColor color={color} setColor={setColor} />
        <div className='flex  gap-4 items-center'>
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
