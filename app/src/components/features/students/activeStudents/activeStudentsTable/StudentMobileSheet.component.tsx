import { useState } from 'react'
import type { Student } from '@/types/types'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Archive, ChevronRight, PencilIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UpdateStudentsDialogDrawer } from '../../UpdateStudentDialogDrawer.component'

interface StudentMobileSheetProps {
  student: Student
}

export function StudentMobileSheet({ student }: StudentMobileSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState<'EDIT' | null>(null)

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild onClick={() => setIsOpen(true)}>
          <div className='flex w-full cursor-pointer items-center justify-between text-base'>
            <span>
              {student.firstName} {student.lastName}
            </span>
            <ChevronRight className='h-4 w-4 text-muted-foreground' />
          </div>
        </SheetTrigger>
        <SheetContent className='w-full'>
          <SheetHeader>
            <SheetTitle>
              {student.firstName} {student.lastName}
            </SheetTitle>
          </SheetHeader>
          <Card>
            <CardContent>
              <div className='grid gap-4 py-6'>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-medium text-muted-foreground'>
                    Instrument
                  </span>
                  <span>{student.instrument}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-medium text-muted-foreground'>
                    Tag
                  </span>
                  <span>{student.dayOfLesson}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-medium text-muted-foreground'>
                    Zeit
                  </span>
                  <span>
                    {student.startOfLesson} - {student.endOfLesson}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-medium text-muted-foreground'>
                    Ort
                  </span>
                  <span>{student.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Separator className='my-6' />
          <div className='flex flex-col gap-3'>
            <Button
              onClick={() => setModalOpen('EDIT')}
              className='flex gap-2'
              size='sm'
            >
              <PencilIcon className='size-4' />
              Bearbeiten
            </Button>

            <Button variant='outline' className='flex gap-2' size='sm'>
              <Archive className='h-4 w-4' />
              Archivieren
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <UpdateStudentsDialogDrawer
        open={modalOpen === 'EDIT'}
        onOpenChange={() => setModalOpen(null)}
        onSuccess={() => setModalOpen(null)}
        studentIds={[student.id]}
      />
    </>
  )
}
