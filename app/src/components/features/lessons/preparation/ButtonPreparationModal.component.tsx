import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CalendarClockIcon } from 'lucide-react'
import { useState } from 'react'
import { CreatePreparationForm } from './CreatePreparationForm.component'
import useCurrentHolder from '../useCurrentHolder'
import { usePrepLessons } from '@/services/context/LessonPrepContext'

export function ButtonPreparationModal() {
  const [modalOpen, setModalOpen] = useState<'PREPARE' | null>(null)
  const { setSelectedForUpdating } = usePrepLessons()
  const { currentLessonHolder } = useCurrentHolder()
  let holderName = ''

  if (currentLessonHolder?.type === 's') {
    holderName = `${currentLessonHolder.holder.firstName} ${currentLessonHolder.holder.lastName}`
  } else if (currentLessonHolder?.type === 'g') {
    holderName = currentLessonHolder.holder.name
  }

  function closeModal() {
    setModalOpen(null)
    setSelectedForUpdating(null)
  }

  return (
    <>
      <Button
        onClick={() => setModalOpen('PREPARE')}
        variant='ghost'
        size='sm'
        className='gap-2 font-normal'
      >
        <CalendarClockIcon className='size-4 text-primary' />
        Lektion planen
      </Button>
      <Dialog open={modalOpen === 'PREPARE'} onOpenChange={closeModal}>
        <DialogContent className='max-h-[80vh]'>
          <DialogHeader>
            <DialogTitle>Lektionen für {holderName} planen</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Bereite eine Lektion vor
          </DialogDescription>
          <div className='w-[80vw]'>
            <CreatePreparationForm onClose={closeModal} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
