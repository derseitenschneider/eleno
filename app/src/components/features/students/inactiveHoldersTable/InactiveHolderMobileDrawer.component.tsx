import { type MouseEvent, useState } from 'react'
import { format } from 'date-fns'
import type { LessonHolder } from '@/types/types'

import { ChevronLeft, ChevronRight, Trash2, Undo2, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { toast } from 'sonner'
import { useReactivateStudents } from '../useReactivateStudents'
import { DeleteHoldersDialogDrawer } from '../DeleteHoldersDialogDrawer.component'
import { Separator } from '@/components/ui/separator'
import { useReactivateGroups } from '../../groups/useReactivateGroups'

interface InactiveHolderMobileDrawerProps {
  holder: LessonHolder
}

export function InactiveHolderMobileDrawer({
  holder,
}: InactiveHolderMobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState<'DELETE' | null>()
  const { reactivateStudents } = useReactivateStudents()
  const { reactivateGroups } = useReactivateGroups()

  const { holder: lessonHolder, type } = holder

  let name = ''
  if (type === 's') {
    name = `${lessonHolder.firstName} ${lessonHolder.lastName}`
  } else {
    name = lessonHolder.name
  }

  async function reactivateHolders(e: MouseEvent<HTMLButtonElement>) {
    setIsOpen(false)
    e.stopPropagation()
    if (type === 's') {
      await reactivateStudents([lessonHolder.id])
      toast.success('Schüler:in wiederhergestellt.')
    } else {
      await reactivateGroups([lessonHolder.id])
      toast.success('Gruppe wiederhergestellt.')
    }
  }

  let timeString = ''
  if (lessonHolder.startOfLesson && lessonHolder.endOfLesson) {
    const startTime = format(
      new Date(`1970-01-01T${lessonHolder.startOfLesson}`),
      'HH:mm',
    )
    const endTime = format(
      new Date(`1970-01-01T${lessonHolder.endOfLesson}`),
      'HH:mm',
    )
    timeString = `${startTime} – ${endTime}`
  } else if (lessonHolder.startOfLesson) {
    const startTime = format(
      new Date(`1970-01-01T${lessonHolder.startOfLesson}`),
      'HH:mm',
    )
    timeString = startTime
  } else {
    timeString = '–'
  }

  return (
    <>
      <Drawer
        modal={false}
        direction='right'
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DrawerTrigger asChild onClick={() => setIsOpen(true)}>
          <div className='flex w-full cursor-pointer items-center justify-between text-base'>
            <span>{name}</span>
            <ChevronRight className='h-4 w-4 text-muted-foreground' />
          </div>
        </DrawerTrigger>
        <DrawerContent className='!w-screen p-4'>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon'>
              <ChevronLeft className='size-5' />
              <span className='sr-only'>Close</span>
            </Button>
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle>{name}</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className='hidden'>{name}</DrawerDescription>
          <Card>
            <CardContent>
              <div className='grid gap-4 py-6'>
                {type === 's' && (
                  <>
                    <div className='flex flex-col'>
                      <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                        Vorname
                      </span>
                      <span>{lessonHolder.firstName}</span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                        Nachname
                      </span>
                      <span>{lessonHolder.lastName}</span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                        Instrument
                      </span>
                      <span>{lessonHolder.instrument}</span>
                    </div>
                  </>
                )}
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                    Tag
                  </span>
                  <span>{lessonHolder.dayOfLesson || '–'}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                    Zeit
                  </span>
                  <span>{timeString}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                    Ort
                  </span>
                  <span>{lessonHolder.location || '–'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Separator className='my-6' />
          <div className='flex flex-col gap-3'>
            <Button
              onClick={reactivateHolders}
              variant='outline'
              className='flex w-full gap-2'
              size='sm'
            >
              <Undo2 className='size-4' />
              Wiederherstellen
            </Button>

            <div className='flex w-full items-center gap-2'>
              <Button
                className='flex w-full gap-2'
                size='sm'
                variant='destructive'
                onClick={() => setModalOpen('DELETE')}
              >
                <Trash2 className='size-4' />
                Löschen
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      <DeleteHoldersDialogDrawer
        open={modalOpen === 'DELETE'}
        onOpenChange={() => setModalOpen(null)}
        onSuccess={() => setModalOpen(null)}
        holderIds={[`${type}-${lessonHolder.id}`]}
      />
    </>
  )
}
