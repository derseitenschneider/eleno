import { useQueryClient } from '@tanstack/react-query'
import { Layers2, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSubscription } from '@/services/context/SubscriptionContext'
import type { Note, PartialNote } from '@/types/types'
import DeleteNote from './DeleteNote.component'
import UpdateNote from './UpdateNote.component'
import { useDuplicateNote } from './useDuplicateNote'

type NoteDropdownProps = {
  noteId: number
}

export default function NoteDropdown({ noteId }: NoteDropdownProps) {
  const { hasAccess } = useSubscription()
  const queryClient = useQueryClient()
  const [openModal, setOpenModal] = useState<'EDIT' | 'DELETE' | undefined>()
  const notes = queryClient.getQueryData(['notes']) as Array<Note> | undefined
  const currentNote = notes?.find((note) => note.id === noteId)

  const { duplicateNote } = useDuplicateNote()

  function handleDuplication() {
    if (!currentNote) return
    const duplicatedNote: PartialNote = {
      title: `Kopie ${currentNote.title}`,
      text: currentNote.text,
      backgroundColor: currentNote.backgroundColor,
      order: currentNote.order,
      user_id: currentNote.user_id,
      groupId: currentNote.groupId,
      studentId: currentNote.studentId,
    }
    duplicateNote(duplicatedNote)
  }
  function closeModal() {
    setOpenModal(undefined)
  }
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <MoreVertical className='h-4 w-4 text-primary' />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mr-3'>
          <DropdownMenuItem
            onClick={() => setOpenModal('EDIT')}
            className='flex items-center gap-2'
          >
            <Pencil className='h-4 w-4 text-primary' />
            <span>Notiz bearbeiten</span>
          </DropdownMenuItem>

          {hasAccess && (
            <DropdownMenuItem
              onClick={() => handleDuplication()}
              className='flex items-center gap-2'
            >
              <Layers2 className='h-4 w-4 text-primary' />
              <span>Notiz duplizieren</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setOpenModal('DELETE')}
            className='flex items-center gap-2'
          >
            <Trash2 className='h-4 w-4 text-warning' />
            <span>Notiz löschen</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openModal === 'EDIT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notiz bearbeiten</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Bearbeite die Notiz.
          </DialogDescription>
          <UpdateNote noteId={noteId} onCloseModal={closeModal} />
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'DELETE'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notiz löschen</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Lösche die Notiz.
          </DialogDescription>
          <DeleteNote noteId={noteId} onCloseModal={closeModal} />
        </DialogContent>
      </Dialog>
    </>
  )
}
