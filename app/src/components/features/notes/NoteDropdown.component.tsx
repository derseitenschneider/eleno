import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Note } from "@/types/types"
import { useQueryClient } from "@tanstack/react-query"
import { Layers2, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import DeleteNote from "./DeleteNote.component"
import UpdateNote from "./UpdateNote.component"
import { useDuplicateNote } from "./useDuplicateNote"

type NoteDropdownProps = {
  noteId: number
}

export default function NoteDropdown({ noteId }: NoteDropdownProps) {
  const queryClient = useQueryClient()
  const [openModal, setOpenModal] = useState<"EDIT" | "DELETE" | undefined>()
  const notes = queryClient.getQueryData(["notes"]) as Array<Note> | undefined
  const currentNote = notes?.find((note) => note.id === noteId)

  const { duplicateNote } = useDuplicateNote()

  function handleDuplication() {
    if (!currentNote) return
    duplicateNote({
      ...currentNote,
      id: new Date().getMilliseconds(),
      title: `Kopie ${currentNote.title}`,
    })
  }
  function closeModal() {
    setOpenModal(undefined)
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className='h-4 w-4 text-primary' />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setOpenModal("EDIT")}
            className='flex items-center gap-2'
          >
            <Pencil className='h-4 w-4 text-primary' />
            <span>Notiz bearbeiten</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleDuplication()}
            className='flex items-center gap-2'
          >
            <Layers2 className='h-4 w-4 text-primary' />
            <span>Notiz duplizieren</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setOpenModal("DELETE")}
            className='flex items-center gap-2'
          >
            <Trash2 className='h-4 w-4 text-warning' />
            <span>Notiz löschen</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openModal === "EDIT"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notiz bearbeiten</DialogTitle>
            <UpdateNote noteId={noteId} onCloseModal={closeModal} />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === "DELETE"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notiz löschen</DialogTitle>
            <DeleteNote noteId={noteId} onCloseModal={closeModal} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
