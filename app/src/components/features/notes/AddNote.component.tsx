import { useState } from "react"
import CustomEditor from "../../ui/CustomEditor.component"
import NoteColor from "./NoteColor.component"
import type { NotesBackgrounds } from "../../../types/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AddNoteProps {
  onCloseModal?: () => void
  studentId: number
}

function AddNote({ onCloseModal, studentId }: AddNoteProps) {
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [color, setColor] = useState<NotesBackgrounds>(null)

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
          // disabled={isPending}
          >
            Abbrechen
          </Button>
          <Button
            type='button'
            // onClick={() => handleUpdate()}
            size='sm'
          // disabled={isPending}
          >
            Speichern
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddNote
