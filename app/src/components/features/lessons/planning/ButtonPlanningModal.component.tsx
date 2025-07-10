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
import { CreatePlannedLessonForm } from './CreatePlannedLessonForm.component'
import useCurrentHolder from '../useCurrentHolder'
import { usePlanLessons } from '@/services/context/LessonPlanningContext'

export function ButtonPlanningModal() {
  const [modalOpen, setModalOpen] = useState<'PLAN' | null>(null)
  const { setSelectedForUpdating } = usePlanLessons()
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
        onClick={() => setModalOpen('PLAN')}
        variant='ghost'
        size='sm'
        className='gap-2 font-normal'
      >
        <CalendarClockIcon className='size-4 text-primary' />
        Lektionsplanung
      </Button>
      <Dialog open={modalOpen === 'PLAN'} onOpenChange={closeModal}>
        <DialogContent className=''>
          <DialogHeader>
            <DialogTitle>Lektionen für {holderName} planen</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Bereite eine Lektion vor
          </DialogDescription>
          <div className='w-[80vw]'>
            <CreatePlannedLessonForm onClose={closeModal} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
