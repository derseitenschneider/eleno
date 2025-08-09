import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import type { PartialNote, Note as TNote } from '@/types/types'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ChevronLeft, Layers2, PencilIcon, Trash2, X } from 'lucide-react'
import Note from './Note.component'
import { Separator } from '@/components/ui/separator'
import UpdateNote from './UpdateNote.component'
import { useDuplicateNote } from './useDuplicateNote'
import DeleteNote from './DeleteNote.component'

type NoteMobileProps = {
  note: TNote
  index: number
}

export function NoteMobile({ note, index }: NoteMobileProps) {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState<'EDIT' | 'DELETE' | null>(null)
  const { duplicateNote, isDuplicating } = useDuplicateNote()

  function handleDuplication() {
    if (!note) return
    const duplicatedNote: PartialNote = {
      title: `Kopie ${note.title}`,
      text: note.text,
      backgroundColor: note.backgroundColor,
      order: note.order,
      user_id: note.user_id,
      groupId: note.groupId,
      studentId: note.studentId,
    }
    duplicateNote(duplicatedNote)
    setOpen(false)
  }

  if (!note) return
  return (
    <>
      <Drawer direction='right' open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <div className='w-full'>
            <Note note={note} index={index} />
          </div>
        </DrawerTrigger>
        <DrawerContent className='!w-full'>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon'>
              <ChevronLeft className='size-5' />
            </Button>
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle className='hidden'>{note.title}</DrawerTitle>
            <DrawerDescription className='hidden'>
              {note.title}
            </DrawerDescription>
          </DrawerHeader>

          <Note note={note} index={0} isDisplay={true} />
          <Separator className='my-6' />
          <div className='flex flex-col gap-3'>
            <Button
              disabled={isDuplicating}
              variant='outline'
              onClick={() => {
                setModalOpen('EDIT')
              }}
              className='flex items-center gap-2'
              size='sm'
            >
              <PencilIcon className='size-4' />
              Notiz bearbeiten
            </Button>

            <Button
              variant='outline'
              disabled={isDuplicating}
              onClick={handleDuplication}
              className='flex items-center gap-2'
              size='sm'
            >
              <Layers2 className='size-4' />
              Notiz duplizieren
            </Button>

            <Button
              variant='destructive'
              disabled={isDuplicating}
              onClick={() => {
                setModalOpen('DELETE')
              }}
              className='mt-3 flex items-center gap-2'
              size='sm'
            >
              <Trash2 className='size-4' />
              Notiz löschen
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer
        direction='right'
        open={modalOpen === 'EDIT'}
        onOpenChange={() => setModalOpen(null)}
      >
        <DrawerContent className='!w-screen'>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon'>
              <ChevronLeft className='size-5' />
              <span className='sr-only'>Close</span>
            </Button>
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle>Notiz bearbeiten</DrawerTitle>
            <DrawerDescription className='hidden'>
              Notiz bearbeiten
            </DrawerDescription>
          </DrawerHeader>
          <div className='overflow-y-auto'>
            <UpdateNote
              noteId={note.id}
              onCloseModal={() => setModalOpen(null)}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer
        open={modalOpen === 'DELETE'}
        onOpenChange={() => setModalOpen(null)}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerClose asChild>
              <Button
                variant='ghost'
                className='absolute right-4 top-4'
                size='icon'
              >
                <X className='size-5' />
                <span className='sr-only'>Close</span>
              </Button>
            </DrawerClose>
            <DrawerTitle>Notiz löschen</DrawerTitle>
            <DrawerDescription className='hidden'>
              Notiz löschen
            </DrawerDescription>
          </DrawerHeader>
          <div className='overflow-y-auto'>
            <DeleteNote noteId={note.id} />
            {/* <ShareHomework lessonId={lesson.id} /> */}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
