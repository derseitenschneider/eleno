import { useState } from 'react'
import type { Lesson } from '../../../types/types'
import CustomEditor from '../../ui/CustomEditor.component'

import { DayPicker } from '@/components/ui/daypicker.component'
import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { useQueryClient } from '@tanstack/react-query'
import { useUpdateLesson } from './useUpdateLesson'
import { useParams, useSearchParams } from 'react-router-dom'

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
      { ...lessonToUpdate, lessonContent, homework, date },
      {
        onSuccess: () => onCloseModal?.(),
      },
    )
  }

  return (
    <div>
      <div className='md:flex items-center mb-3 gap-2'>
        <p className='text-foreground/70 mb-2'>Datum</p>
        <DayPicker disabled={isUpdating} date={date} setDate={handleSetDate} />
      </div>
      <div className='md:flex items-center mb-6 gap-8'>
        <div className='mb-3 sm:mb-0 md:w-[450px]'>
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
      <div className='justify-end gap-4 flex items-center'>
        <Button
          disabled={isUpdating}
          size='sm'
          variant='outline'
          onClick={onCloseModal}
        >
          Abbrechen
        </Button>
        <div className='flex items-center gap-2'>
          <Button disabled={isUpdating} size='sm' onClick={handleSave}>
            Speichern
          </Button>
          {isUpdating && <MiniLoader />}
        </div>
      </div>
    </div>
  )
}

export default EditLesson
