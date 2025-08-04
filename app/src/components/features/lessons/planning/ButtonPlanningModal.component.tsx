import { Button } from '@/components/ui/button'
import { CalendarClockIcon } from 'lucide-react'
import { useState } from 'react'
import { CreatePlannedLessonForm } from './CreatePlannedLessonForm.component'
import useCurrentHolder from '../useCurrentHolder'
import { usePlanLessons } from '@/services/context/LessonPlanningContext'
import {
  DrawerOrDialog,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import useFeatureFlag from '@/hooks/useFeatureFlag'

export function ButtonPlanningModal() {
  const [modalOpen, setModalOpen] = useState<'PLAN' | null>(null)
  const isPlanningEnabled = useFeatureFlag('lesson-planning')
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

  if (!isPlanningEnabled) return null

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
      <DrawerOrDialog open={modalOpen === 'PLAN'} onOpenChange={closeModal}>
        <DrawerOrDialogContent className='md:max-h-[80vh] lg:overflow-hidden'>
          <DrawerOrDialogHeader>
            <DrawerOrDialogTitle>
              Lektionen für {holderName} planen
            </DrawerOrDialogTitle>
          </DrawerOrDialogHeader>
          <DrawerOrDialogDescription className='hidden'>
            Bereite eine Lektion vor
          </DrawerOrDialogDescription>
          <div className='md:w-[80vw]'>
            <CreatePlannedLessonForm onClose={closeModal} />
          </div>
        </DrawerOrDialogContent>
      </DrawerOrDialog>
    </>
  )
}
