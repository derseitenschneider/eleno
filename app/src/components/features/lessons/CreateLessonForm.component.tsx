import { Button } from '@/components/ui/button'
import CustomEditor from '@/components/ui/CustomEditor.component'
import { DayPicker } from '@/components/ui/daypicker.component'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { Textarea } from '@/components/ui/textarea'
import { useLessonForm } from '@/hooks/useLessonForm'
import { cn } from '@/lib/utils'
import { ButtonPlannedLessonAvailable } from './planning/ButtonPlannedLessonAvailable.component'

export function CreateLessonForm() {
  const {
    currentLessonHolder,
    settings,
    handleDate,
    date,
    lessonType,
    lessonContent,
    handleLessonContent,
    homework,
    handleHomework,
    absenceReason,
    handleAbsenceReason,
    error,
    isDisabledSave,
    handleSave,
    isLoading,
  } = useLessonForm({ mode: 'create' })

  if (!currentLessonHolder || !settings) return null
  return (
    <>
      <div className='mb-3 flex flex-col items-start gap-1 sm:flex-row'>
        <div className='flex items-center gap-2'>
          <p>Datum</p>
          <DayPicker setDate={handleDate} date={date} disabled={isLoading} />
        </div>
        <ButtonPlannedLessonAvailable date={date} />
      </div>
      <div
        className={cn(
          isLoading && 'opacity-50',
          'grid min-[1148px]:grid-cols-2 gap-6',
        )}
      >
        {lessonType === 'held' ? (
          <>
            <div>
              <p>Lektion</p>
              <CustomEditor
                key={`lessonContent-${currentLessonHolder.holder.id}`}
                disabled={isLoading}
                value={lessonContent}
                onChange={handleLessonContent}
                placeholder='Lektion...'
              />
            </div>
            <div>
              <p>Hausaufgaben</p>
              <CustomEditor
                key={`homework-${currentLessonHolder.holder.id}`}
                disabled={isLoading}
                value={homework}
                onChange={handleHomework}
                placeholder='Hausaufgaben...'
              />
            </div>
          </>
        ) : (
          <div className='min-[1148px]:col-span-2'>
            <p className='mb-2'>Abwesenheitsgrund</p>
            <Textarea
              autoFocus
              key={`absence-${currentLessonHolder.holder.id}`}
              disabled={isLoading}
              rows={5}
              value={absenceReason}
              onChange={(e) => handleAbsenceReason(e.target.value)}
              placeholder='Grund für die Abwesenheit...'
            />
          </div>
        )}
      </div>
      <div className='flex justify-between gap-1'>
        {error !== '' && <p className='mt-2 text-sm text-warning'>{error}</p>}
        <div className='ml-auto mt-4  flex w-full items-center gap-1 sm:w-auto lg:mb-4'>
          <Button
            disabled={isDisabledSave}
            size='sm'
            onClick={handleSave}
            className='ml-auto block w-full'
          >
            Speichern
          </Button>
          {isLoading && <MiniLoader />}
        </div>
      </div>
    </>
  )
}
