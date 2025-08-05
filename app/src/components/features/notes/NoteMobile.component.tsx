import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import type { Lesson, Note as TNote } from '@/types/types'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { MessageSquareShare, PencilIcon, X } from 'lucide-react'
import Note from './Note.component'

type NoteMobileProps = {
  note: TNote
  index: number
}

export function NoteMobile({ note, index }: NoteMobileProps) {
  const { userLocale } = useUserLocale()
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState<
    'EDIT' | 'DUPLICATE' | 'DELETE' | null
  >(null)

  if (!note) return
  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <div className='w-full'>
            <Note note={note} index={index} />
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{note.title}</DrawerTitle>
            <DrawerDescription className='hidden'>
              {note.title}
            </DrawerDescription>
          </DrawerHeader>
          <div className='flex flex-col gap-3'>
            <Button
              variant='outline'
              onClick={() => {
                setModalOpen('EDIT')
                setOpen(false)
              }}
              className='flex items-center gap-1'
              size='sm'
            >
              <PencilIcon className='size-4' />
              Notiz bearbeiten
            </Button>

            <Button
              variant='outline'
              onClick={() => {
                setModalOpen('EDIT')
                setOpen(false)
              }}
              className='flex items-center gap-1'
              size='sm'
            >
              <MessageSquareShare className='size-4' />
              Hausaufgaben teilen
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
            <DrawerTitle>Lektion bearbeiten</DrawerTitle>
            <DrawerDescription className='hidden'>
              Lektion bearbeiten
            </DrawerDescription>
          </DrawerHeader>
          <div className='overflow-y-auto'>
            {/* <EditLesson */}
            {/*   onCloseModal={() => setModalOpen(null)} */}
            {/*   lessonId={lesson.id} */}
            {/* /> */}
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer
        // open={modalOpen === 'SHARE_HOMEWORK'}
        onOpenChange={() => setModalOpen(null)}
      >
        <DrawerContent className='!w-screen'>
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
            <DrawerTitle>Hausaufgaben teilen</DrawerTitle>
            <DrawerDescription className='hidden'>
              Hausaufgaben teilen
            </DrawerDescription>
          </DrawerHeader>
          <div className='overflow-y-auto'>
            {/* <ShareHomework lessonId={lesson.id} /> */}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
