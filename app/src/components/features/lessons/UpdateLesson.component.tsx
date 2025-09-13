import { useQueryClient } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { DayPicker } from '@/components/ui/daypicker.component'
import { SaveAbortButtons } from '@/components/ui/SaveAbortButtonGroup'
import { Separator } from '@/components/ui/separator'
import { useLessonForm } from '@/hooks/useLessonForm'
import type { Lesson } from '../../../types/types'
import CustomEditor from '../../ui/CustomEditor.component'
import { Textarea } from '../../ui/textarea'
import { Blocker } from '../subscription/Blocker'
import { LessonStatusSelect } from './LessonStatusSelect.component'

type EditLessonProps = {
  lessonId: number
  onCloseModal?: () => void
}

function EditLesson({ lessonId, onCloseModal }: EditLessonProps) {
  const queryClient = useQueryClient()
  const { holderId } = useParams()
  const [searchParams] = useSearchParams()
  const allLessons = queryClient.getQueryData([
    'all-lessons',
    {
      holder: holderId || '',
      year: Number(searchParams.get('year')),
    },
  ]) as Array<Lesson> | undefined
  const latestLessons = queryClient.getQueryData(['latest-3-lessons']) as
    | Array<Lesson>
    | undefined

  const combinedLessons: Array<Lesson> = []
  if (allLessons) combinedLessons.push(...allLessons)
  if (latestLessons) combinedLessons.push(...latestLessons)

  const lessonToUpdate = combinedLessons.find(
    (lesson) => lesson.id === lessonId,
  )

  const {
    date,
    lessonContent,
    homework,
    attendanceStatus,
    absenceReason,
    error,
    handleDate,
    handleLessonContent,
    handleHomework,
    handleAttendanceStatus,
    handleAbsenceReason,
    handleSave,
    isLoading,
    isDisabledSave,
  } = useLessonForm({
    mode: 'update',
    initialLesson: lessonToUpdate,
    onSuccess: onCloseModal,
  })

  return (
    <div className='relative px-1 pb-4'>
      <Blocker />
      <div className='mb-3 flex items-center gap-2'>
        <p className='text-foreground/70'>Datum</p>
        <DayPicker disabled={isLoading} date={date} setDate={handleDate} />
        <LessonStatusSelect
          value={attendanceStatus}
          onChange={handleAttendanceStatus}
          disabled={isLoading}
        />
      </div>
      <div className='mb-6 items-center gap-8 lg:flex'>
        {attendanceStatus === 'held' ? (
          <>
            <div className='mb-6 md:w-[450px] lg:mb-0'>
              <p className='text-foreground/70'>Lektion</p>

              <CustomEditor
                disabled={isLoading}
                value={lessonContent || ''}
                onChange={handleLessonContent}
              />
            </div>

            <div className='md:w-[450px]'>
              <p className='text-foreground/70'>Hausaufgaben</p>

              <CustomEditor
                disabled={isLoading}
                value={homework || ''}
                onChange={handleHomework}
              />
            </div>
          </>
        ) : (
          <div className='md:w-[450px]'>
            <p className='text-foreground/70'>Abwesenheitsgrund</p>
            <Textarea
              disabled={isLoading}
              value={absenceReason || ''}
              onChange={(e) => handleAbsenceReason(e.target.value)}
              placeholder='Grund für die Abwesenheit...'
            />
          </div>
        )}
      </div>
      <Separator className='my-6 sm:hidden' />
      {error !== '' && <p className='mt-2 text-sm text-warning'>{error}</p>}
      <SaveAbortButtons
        onSave={handleSave}
        onAbort={onCloseModal}
        isSaving={isLoading}
        isDisabledSaving={isDisabledSave}
        isDisabledAborting={isLoading}
      />
    </div>
  )
}

export default EditLesson
