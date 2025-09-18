import { useLesson } from '@/hooks/useLesson'
import { cn } from '@/lib/utils'
import { LessonPlanningProvider } from '@/services/context/LessonPlanningContext'
import { Blocker } from '../subscription/Blocker'
import { AttendanceStatusSelect } from './AttendanceStatusSelect.component'
import { CreateLessonForm } from './CreateLessonForm.component'
import { ButtonPlanningModal } from './planning/ButtonPlanningModal.component'

function CreateLesson() {
  const { attendanceStatus, handleAttendanceStatus, settings } = useLesson()

  return (
    <LessonPlanningProvider>
      <div
        data-testid='lesson-form'
        className={cn(
          settings?.lesson_main_layout === 'regular' && 'border-b',
          'relative border-hairline px-5 pb-6 pt-6 sm:pl-6 lg:py-4 lg:pb-16 lg:pr-4 min-[1148px]:pb-0',
        )}
      >
        <Blocker blockerId='createLesson' />
        <div className='mb-1 flex items-center justify-between'>
          <div className='flex flex-wrap items-center gap-2'>
            <h5 className=' m-0'>Neue Lektion</h5>
            <AttendanceStatusSelect
              value={attendanceStatus}
              onChange={handleAttendanceStatus}
            />
          </div>
          <ButtonPlanningModal />
        </div>
        <CreateLessonForm />
      </div>
    </LessonPlanningProvider>
  )
}

export default CreateLesson
