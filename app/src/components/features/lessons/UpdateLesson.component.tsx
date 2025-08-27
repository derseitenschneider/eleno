import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { DayPicker } from '@/components/ui/daypicker.component'
import { SaveAbortButtons } from '@/components/ui/SaveAbortButtonGroup'
import { Separator } from '@/components/ui/separator'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import type { Lesson, AbsenceType } from '../../../types/types'
import CustomEditor from '../../ui/CustomEditor.component'
import { Blocker } from '../subscription/Blocker'
import { useUpdateLesson } from './useUpdateLesson'
import { LessonStatusSelect } from './LessonStatusSelect.component'
import { Textarea } from '../../ui/textarea'

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

  const [lessonContent, setLessonContent] = useState(
    lessonToUpdate?.lessonContent || '',
  )
  const [homework, setHomework] = useState(lessonToUpdate?.homework || '')
  const [date, setDate] = useState<Date>(lessonToUpdate?.date || new Date())
  const [lessonType, setLessonType] = useState<AbsenceType>(lessonToUpdate?.lesson_type || 'held')
  const [absenceReason, setAbsenceReason] = useState(lessonToUpdate?.absence_reason || '')
  const [error, setError] = useState('')

  const { updateLesson, isUpdating } = useUpdateLesson()

  // Update state when lesson data becomes available
  useEffect(() => {
    if (lessonToUpdate) {
      setLessonContent(lessonToUpdate.lessonContent || '')
      setHomework(lessonToUpdate.homework || '')
      setDate(lessonToUpdate.date || new Date())
      setLessonType(lessonToUpdate.lesson_type || 'held')
      setAbsenceReason(lessonToUpdate.absence_reason || '')
    } else {
      // Reset to empty values when lesson is not found
      setLessonContent('')
      setHomework('')
      setDate(new Date())
      setLessonType('held')
      setAbsenceReason('')
    }
  }, [lessonToUpdate])

  const handleLessonContent = (content: string) => {
    setError('')
    setLessonContent(content)
  }

  const handleHomework = (content: string) => {
    setError('')
    setHomework(content)
  }

  const handleSetDate = (date: Date | undefined) => {
    setError('')
    if (date) setDate(date)
  }

  const handleLessonType = (type: AbsenceType) => {
    setError('')
    setLessonType(type)
  }

  const handleAbsenceReason = (content: string) => {
    setError('')
    setAbsenceReason(content)
  }

  function handleSave() {
    if (!lessonToUpdate) return

    if (lessonType === 'held' && !lessonContent && !homework) {
      return setError(
        'Die Lektion benötigt mindestens Inhalt oder Hausaufgaben.',
      )
    }
    if (lessonType !== 'held' && !absenceReason) {
      return setError('Ein Grund für die Abwesenheit ist erforderlich.')
    }

    updateLesson(
      {
        ...lessonToUpdate,
        lessonContent: removeHTMLAttributes(lessonContent),
        homework: removeHTMLAttributes(homework),
        date,
        lesson_type: lessonType,
        absence_reason: absenceReason,
      },
      {
        onSuccess: () => {
          toast.success('Änderungen gespeichert.')
          onCloseModal?.()
        },
      },
    )
  }

  const isDisabledSave =
    isUpdating ||
    (lessonType === 'held' && !lessonContent && !homework) ||
    (lessonType !== 'held' && !absenceReason)

  return (
    <div className='relative pb-4'>
      <Blocker />
      <div className='mb-3 flex items-center gap-2'>
        <p className='text-foreground/70'>Datum</p>
        <DayPicker disabled={isUpdating} date={date} setDate={handleSetDate} />
        <LessonStatusSelect value={lessonType} onChange={handleLessonType} disabled={isUpdating} />
      </div>
      <div className='mb-6 items-center gap-8 lg:flex'>
        {lessonType === 'held' ? (
          <>
            <div className='mb-6 md:w-[450px] lg:mb-0'>
              <p className='text-foreground/70'>Lektion</p>

              <CustomEditor
                disabled={isUpdating}
                value={lessonContent || ''}
                onChange={handleLessonContent}
              />
            </div>

            <div className='md:w-[450px]'>
              <p className='text-foreground/70'>Hausaufgaben</p>

              <CustomEditor
                disabled={isUpdating}
                value={homework || ''}
                onChange={handleHomework}
              />
            </div>
          </>
        ) : (
          <div className="md:w-[450px]">
            <p className='text-foreground/70'>Abwesenheitsgrund</p>
            <Textarea
              disabled={isUpdating}
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
        isSaving={isUpdating}
        isDisabledSaving={isDisabledSave}
        isDisabledAborting={isUpdating}
      />
    </div>
  )
}

export default EditLesson
