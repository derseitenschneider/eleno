import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { DayPicker } from '@/components/ui/daypicker.component'
import { SaveAbortButtons } from '@/components/ui/SaveAbortButtonGroup'
import { Separator } from '@/components/ui/separator'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import type { Lesson } from '../../../types/types'
import CustomEditor from '../../ui/CustomEditor.component'
import { Blocker } from '../subscription/Blocker'
import { useUpdateLesson } from './useUpdateLesson'

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

  const { updateLesson, isUpdating } = useUpdateLesson()

  // Update state when lesson data becomes available
  useEffect(() => {
    if (lessonToUpdate) {
      setLessonContent(lessonToUpdate.lessonContent || '')
      setHomework(lessonToUpdate.homework || '')
      setDate(lessonToUpdate.date || new Date())
    } else {
      // Reset to empty values when lesson is not found
      setLessonContent('')
      setHomework('')
      setDate(new Date())
    }
  }, [lessonToUpdate])

  const handleLessonContent = (content: string) => {
    setLessonContent(content)
  }

  const handleHomework = (content: string) => {
    setHomework(content)
  }

  const handleSetDate = (date: Date | undefined) => {
    if (date) setDate(date)
  }

  function handleSave() {
    if (!lessonToUpdate) return
    updateLesson(
      {
        ...lessonToUpdate,
        lessonContent: removeHTMLAttributes(lessonContent),
        homework: removeHTMLAttributes(homework),
        date,
      },
      {
        onSuccess: () => {
          toast.success('Änderungen gespeichert.')
          onCloseModal?.()
        },
      },
    )
  }

  return (
    <div className='relative pb-4'>
      <Blocker />
      <div className='mb-3 flex items-center gap-2'>
        <p className='text-foreground/70'>Datum</p>
        <DayPicker disabled={isUpdating} date={date} setDate={handleSetDate} />
      </div>
      <div className='mb-6 items-center gap-8 lg:flex'>
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
      </div>
      <Separator className='my-6 sm:hidden' />
      <SaveAbortButtons
        onSave={handleSave}
        onAbort={onCloseModal}
        isSaving={isUpdating}
        isDisabledSaving={isUpdating}
        isDisabledAborting={isUpdating}
      />
    </div>
  )
}

export default EditLesson
