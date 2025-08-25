import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import CustomEditor from '@/components/ui/CustomEditor.component'
import { Card, CardContent } from '@/components/ui/card'
import { DayPicker } from '@/components/ui/daypicker.component'
import Empty from '@/components/ui/Empty.component'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { usePlanLessons } from '@/services/context/LessonPlanningContext'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import useSettingsQuery from '../../settings/settingsQuery'
import { usePlannedLessonsQuery } from '../lessonsQueries'
import { useCreateLesson } from '../useCreateLesson'
import useCurrentHolder from '../useCurrentHolder'
import { useUpdateLesson } from '../useUpdateLesson'
import { PreparedLessonItem } from './PlannedLessonItem.component'

export type CreatePlannedLessonFormProps = {
  onClose?: () => void
}

export function CreatePlannedLessonForm({
  onClose,
}: CreatePlannedLessonFormProps) {
  const { selectedForUpdating, setSelectedForUpdating } = usePlanLessons()
  const { data: plannedLessons } = usePlannedLessonsQuery()
  const { data: settings } = useSettingsQuery()
  const { createLesson, isCreating } = useCreateLesson()
  const { updateLesson, isUpdating } = useUpdateLesson()
  const { hasAccess } = useSubscription()
  const { currentLessonHolder } = useCurrentHolder()

  const [date, setDate] = useState<Date | undefined>(
    selectedForUpdating?.date || undefined,
  )
  const [lessonContent, setLessonContent] = useState(
    selectedForUpdating?.lessonContent || '',
  )
  const [homework, setHomework] = useState(selectedForUpdating?.homework)
  const [error, setError] = useState('')
  const isDisabledSave =
    isCreating ||
    isUpdating ||
    !hasAccess ||
    !date ||
    (!lessonContent && !homework)

  const currentHolderPlannedLessons = plannedLessons
    ?.filter((lesson) => {
      if (!currentLessonHolder) return false
      if (currentLessonHolder.type === 's') {
        return lesson.studentId === currentLessonHolder.holder.id
      }
      return lesson.groupId === currentLessonHolder?.holder.id
    })
    .sort((a, b) => {
      if (a.date > b.date) return 1
      return -1
    })

  const handlerInputDate = (inputDate: Date | undefined) => {
    if (!inputDate) return
    setError('')
    setDate(inputDate)
  }

  const typeField: 'studentId' | 'groupId' =
    currentLessonHolder?.type === 's' ? 'studentId' : 'groupId'

  // Focus input element on page load when not mobile.
  useEffect(() => {
    const input = [...document.querySelectorAll('.rsw-ce')].at(0) as HTMLElement
    if (input && window.innerWidth > 1366) {
      input.focus()
    }
  }, [])

  useEffect(() => {
    if (selectedForUpdating) {
      setDate(selectedForUpdating.date)
      setLessonContent(selectedForUpdating.lessonContent || '')
      setHomework(selectedForUpdating.homework || '')
    }
  }, [selectedForUpdating])

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
    setDate(undefined)
    setError('')
  }

  function handleSave() {
    if (!currentLessonHolder?.holder.id) return

    if (!lessonContent && !homework) {
      return setError(
        'Die Lektion benötigt mindestens Inhalt oder Hausaufgaben.',
      )
    }
    if (!date) {
      return setError('Datum fehlt.')
    }

    if (
      currentHolderPlannedLessons?.find(
        (lesson) => lesson.date.toDateString() === date.toDateString(),
      ) &&
      !selectedForUpdating
    ) {
      return setError(
        'Für dieses Datum existiert bereits eine geplante Lektion.',
      )
    }

    if (selectedForUpdating) {
      return updateLesson(
        {
          ...selectedForUpdating,
          homework: removeHTMLAttributes(homework || ''),
          lessonContent: removeHTMLAttributes(lessonContent),
          date,
        },
        {
          onSuccess: () => {
            toast.success('Änderungen gespeichert.')
            resetFields()
            setSelectedForUpdating(null)
          },
        },
      )
    }
    createLesson(
      {
        homework: removeHTMLAttributes(homework || ''),
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
    <div className='h-full gap-4 overflow-auto lg:grid lg:grid-cols-2'>
      <div className='mb-5'>
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
          <div className='mt-4'>
            <p>Hausaufgaben</p>
            <CustomEditor
              key={`homework-prep-${currentLessonHolder.holder.id}`}
              disabled={isCreating}
              value={homework || ''}
              onChange={handleHomework}
              placeholder='Hausaufgaben...'
            />
          </div>
        </div>
        {error !== '' && <p className='mt-2 text-sm text-warning'>{error}</p>}
        <div className='mt-4 flex flex-col-reverse items-center justify-end gap-2 sm:flex-row'>
          <Button
            variant='outline'
            size='sm'
            className='w-full sm:w-auto'
            onClick={onClose}
          >
            Abbrechen
          </Button>
          <div className='flex w-full items-center gap-1 sm:w-auto'>
            <Button
              disabled={isDisabledSave}
              size='sm'
              onClick={handleSave}
              className='ml-auto block w-full sm:w-auto'
            >
              Speichern
            </Button>
            {(isCreating || isUpdating) && <MiniLoader />}
          </div>
        </div>
      </div>

      <div className='mt-8 h-full flex-col gap-4  md:mt-0 lg:flex'>
        <p className='mb-2 font-medium md:mb-0'>Geplante Lektionen</p>
        {currentHolderPlannedLessons &&
        currentHolderPlannedLessons.length > 0 ? (
          <Card className='max-h-full lg:h-[538px] lg:overflow-hidden'>
            <CardContent className='h-full p-4 lg:overflow-hidden'>
              <ScrollArea className='h-full'>
                <div className='flex flex-col gap-4'>
                  {currentHolderPlannedLessons?.map((lesson) => (
                    <PreparedLessonItem
                      onClose={onClose}
                      key={lesson.id}
                      currentLesson={lesson}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Empty emptyMessage='Keine geplanten Lektionen vorhanden.' />
        )}
      </div>
    </div>
  )
}
