import { useState } from "react"
import CustomEditor from "../../ui/CustomEditor.component"
import type { Note, NotesBackgrounds } from "../../../types/types"
import NoteColor from "./NoteColor.component"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateNoteMutation } from "./mutations/updateNoteMutation"

interface EditNoteProps {
  onCloseModal?: () => void
  noteId: number
}

function EditNote({ onCloseModal, noteId }: EditNoteProps) {
  const queryClient = useQueryClient()
  const notes = queryClient.getQueryData(["notes"]) as Array<Note>
  const currentNote = notes.find((note) => note.id === noteId)
  const [text, setText] = useState(currentNote?.text || "")
  const [backgroundColor, setBackgroundColor] = useState<NotesBackgrounds>(
    currentNote?.backgroundColor || null,
  )

  const [title, setTitle] = useState(currentNote?.title || "")

  const handleText = (inputText: string) => {
    setText(inputText)
  }

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const { mutate: handleUpdate, isPending } = updateNoteMutation(
    {
      ...currentNote,
      text,
      backgroundColor,
      title,
    },
    onCloseModal,
  )

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
        <NoteColor color={backgroundColor} setColor={setBackgroundColor} />
        <div className='flex  gap-4 items-center'>
          <Button
            type='button'
            onClick={onCloseModal}
            size='sm'
            variant='outline'
            disabled={isPending}
          >
            Abbrechen
          </Button>
          <Button
            type='button'
            onClick={() => handleUpdate()}
            size='sm'
            disabled={isPending}
          >
            Speichern
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditNote
