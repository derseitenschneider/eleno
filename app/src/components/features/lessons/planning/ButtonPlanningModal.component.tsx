import { CalendarClockIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import useFeatureFlag from '@/hooks/useFeatureFlag'
import { usePlanLessons } from '@/services/context/LessonPlanningContext'
import useCurrentHolder from '../useCurrentHolder'
import { CreatePlannedLessonModal } from './CreatePlannedLessonModal.component'

export function ButtonPlanningModal() {
  const [modalOpen, setModalOpen] = useState<'PLAN' | null>(null)
  const isPlanningEnabled = useFeatureFlag('lesson-planning')
  const { setSelectedForUpdating } = usePlanLessons()

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
        <span className='hidden sm:inline'>Lektionsplanung</span>
      </Button>
      <CreatePlannedLessonModal
        open={modalOpen === 'PLAN'}
        onOpenChange={closeModal}
        onClose={closeModal}
      />
    </>
  )
}
