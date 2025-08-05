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
import type { Lesson } from '@/types/types'
import { PreviousLessonItem } from './PreviousLessonItem.component'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ChevronLeft, MessageSquareShare, PencilIcon, X } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import EditLesson from './UpdateLesson.component'
import ShareHomework from './homework/ShareHomework.component'

type PreviousLessonItemMobileProps = {
  lesson: Lesson
}

export function PreviousLessonItemMobile({
  lesson,
}: PreviousLessonItemMobileProps) {
  const { userLocale } = useUserLocale()
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState<'EDIT' | 'SHARE_HOMEWORK' | null>(
    null,
  )

  if (!lesson) return
  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <div className='w-full'>
            <PreviousLessonItem lesson={lesson} />
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Lektion vom{' '}
              {lesson.date.toLocaleDateString(userLocale, {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
              })}
            </DrawerTitle>
            <DrawerDescription className='hidden'>
              Lektion vom{' '}
              {lesson.date.toLocaleDateString(userLocale, {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
              })}
            </DrawerDescription>
          </DrawerHeader>
          <div className='flex flex-col gap-3'>
            <Button
              onClick={() => {
                setModalOpen('EDIT')
                setOpen(false)
              }}
              className='flex items-center gap-1'
              size='sm'
            >
              <PencilIcon className='size-4' />
              Bearbeiten
            </Button>

            <Button
              variant='outline'
              onClick={() => {
                setModalOpen('SHARE_HOMEWORK')
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
            <EditLesson
              onCloseModal={() => setModalOpen(null)}
              lessonId={lesson.id}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer
        open={modalOpen === 'SHARE_HOMEWORK'}
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
            <ShareHomework lessonId={lesson.id} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
