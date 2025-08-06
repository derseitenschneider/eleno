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
import { LessonItem } from './LessonItem.component'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ChevronLeft, MessageSquareShare, PencilIcon, X } from 'lucide-react'
import EditLesson from './UpdateLesson.component'
import ShareHomework from './homework/ShareHomework.component'

type LessonItemMobileProps = {
  lesson: Lesson
}

export function LessonItemMobile({ lesson }: LessonItemMobileProps) {
  const { userLocale } = useUserLocale()
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState<'EDIT' | 'SHARE_HOMEWORK' | null>(
    null,
  )

  if (!lesson) return
  return (
    <>
      <Drawer direction='right' open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <div className='w-full'>
            <LessonItem lesson={lesson} />
          </div>
        </DrawerTrigger>
        <DrawerContent className='!w-full'>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon'>
              <ChevronLeft className='size-5' />
            </Button>
          </DrawerClose>
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
          <LessonItem lesson={lesson} isDisplayOnly={true} />
          <div className='mt-8 flex flex-col gap-3'>
            <Button
              onClick={() => {
                setModalOpen('EDIT')
                // setOpen(false)
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
        direction='right'
        open={modalOpen === 'SHARE_HOMEWORK'}
        onOpenChange={() => setModalOpen(null)}
      >
        <DrawerContent className='!w-screen'>
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
          <DrawerHeader>
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
