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
import type { Note } from '@/types/types'
import { useQueryClient } from '@tanstack/react-query'
import { Layers2, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import DeleteNote from './DeleteNote.component'
import UpdateNote from './UpdateNote.component'
import { useDuplicateNote } from './useDuplicateNote'
import { isDemoMode } from '@/config'
import { useSubscription } from '@/services/context/SubscriptionContext'

type NoteDropdownProps = {
  noteId: number
}

export default function NoteDropdown({ noteId }: NoteDropdownProps) {
  const { subscriptionIsActive } = useSubscription()
  const queryClient = useQueryClient()
  const [openModal, setOpenModal] = useState<'EDIT' | 'DELETE' | undefined>()
  const notes = queryClient.getQueryData(['notes']) as Array<Note> | undefined
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
        <DropdownMenuContent className='mr-3'>
          <DropdownMenuItem
            onClick={() => setOpenModal('EDIT')}
            className='flex items-center gap-2'
          >
            <Pencil className='h-4 w-4 text-primary' />
            <span>Notiz bearbeiten</span>
          </DropdownMenuItem>

          {subscriptionIsActive ||
            (isDemoMode && (
              <DropdownMenuItem
                onClick={() => handleDuplication()}
                className='flex items-center gap-2'
              >
                <Layers2 className='h-4 w-4 text-primary' />
                <span>Notiz duplizieren</span>
              </DropdownMenuItem>
            ))}
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
