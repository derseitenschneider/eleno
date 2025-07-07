import { useEffect, useState } from 'react'
import { useCreateLesson } from './useCreateLesson'
import useCurrentHolder from './useCurrentHolder'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import useSettingsQuery from '../settings/settingsQuery'
import CustomEditor from '@/components/ui/CustomEditor.component'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { DayPicker } from '@/components/ui/daypicker.component'
import { usePreparedLessons } from './lessonsQueries'
import { PreparedLessonItem } from './PreparedLessonItem.component'
import { Card, CardContent } from '@/components/ui/card'

export function CreatePreparationForm() {
  const [date, setDate] = useState<Date | undefined>()
  const { data: preparedLessons } = usePreparedLessons()
  const { data: settings } = useSettingsQuery()
  const { createLesson, isCreating } = useCreateLesson()
  const { hasAccess } = useSubscription()
  const { currentLessonHolder } = useCurrentHolder()
  const [lessonContent, setLessonContent] = useState('')
  const [homework, setHomework] = useState('')
  const [error, setError] = useState('')
  const isDisabledSave =
    isCreating || !hasAccess || (!lessonContent && !homework)

  const currentHolderPreparedLessons = preparedLessons?.filter((lesson) => {
    if (!currentLessonHolder) return false
    if (currentLessonHolder.type === 's') {
      return lesson.studentId === currentLessonHolder.holder.id
    }
    if (currentLessonHolder.type === 'g') {
      return lesson.groupId === currentLessonHolder?.holder.id
    }
  })

  const handlerInputDate = (inputDate: Date | undefined) => {
    if (!inputDate) return
    setDate(inputDate)
  }

  const typeField: 'studentId' | 'groupId' =
    currentLessonHolder?.type === 's' ? 'studentId' : 'groupId'

  useEffect(() => {
    const input = [...document.querySelectorAll('.rsw-ce')].at(0) as HTMLElement
    if (input && window.innerWidth > 1366) {
      input.focus()
    }
  }, [])

  function handleLessonContent(content: string) {
    setError('')
    setLessonContent(content)
  }

  function handleHomework(content: string) {
    setError('')
    setHomework(content)
  }

  function resetFields() {
    window.scrollTo(0, 0)
    setHomework('')
    setLessonContent('')
  }

  function handleSave() {
    if (!lessonContent && !homework) {
      return setError(
        'Die Lektion benötigt mindestens Inhalt oder Hausaufgaben.',
      )
    }
    if (!date) {
      return setError('Datum fehlt.')
    }
    if (!currentLessonHolder?.holder.id) return
    createLesson(
      {
        homework: removeHTMLAttributes(homework),
        lessonContent: removeHTMLAttributes(lessonContent),
        [typeField]: currentLessonHolder.holder.id,
        date,
        expiration_base: new Date().toISOString(),
        status: 'prepared',
      },
      {
        onSuccess: resetFields,
      },
    )
  }

  if (!currentLessonHolder || !settings) return null
  return (
    <div className='grid grid-cols-2 gap-4'>
      <div>
        <div className='mb-3 flex  items-center gap-2'>
          <p>Datum</p>
          <DayPicker
            setDate={handlerInputDate}
            date={date}
            disabled={isCreating}
          />
        </div>
        <div className={cn(isCreating && 'opacity-50', '')}>
          <div>
            <p>Lektion</p>
            <CustomEditor
              key={`lessonContent-prep-${currentLessonHolder.holder.id}`}
              disabled={isCreating}
              value={lessonContent}
              onChange={handleLessonContent}
              placeholder='Lektion...'
            />
          </div>
          <div>
            <p>Hausaufgaben</p>
            <CustomEditor
              key={`homework-prep-${currentLessonHolder.holder.id}`}
              disabled={isCreating}
              value={homework}
              onChange={handleHomework}
              placeholder='Hausaufgaben...'
            />
          </div>
        </div>
        <div className='flex justify-between gap-1'>
          {error !== '' && <p className='mt-2 text-sm text-warning'>{error}</p>}
          <div className='ml-auto  mt-4 flex items-center gap-1 lg:mb-8'>
            <Button
              disabled={isDisabledSave}
              size='sm'
              onClick={handleSave}
              className='ml-auto block'
            >
              Speicher
            </Button>
            {isCreating && <MiniLoader />}
          </div>
        </div>
      </div>
      <div className='h-full'>
        <p className='font-medium'>Vorbereitete Lektionen</p>
        <Card className='h-full p-4'>
          <CardContent className='h-full'>
            {currentHolderPreparedLessons?.map((lesson) => (
              <PreparedLessonItem key={lesson.id} currentLesson={lesson} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
