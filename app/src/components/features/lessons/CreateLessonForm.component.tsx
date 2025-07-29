import { useEffect, useState } from 'react'
import { useCreateLesson } from './useCreateLesson'
import { useDrafts } from '@/services/context/DraftsContext'
import useCurrentHolder from './useCurrentHolder'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import useSettingsQuery from '../settings/settingsQuery'
import CustomEditor from '@/components/ui/CustomEditor.component'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { DayPicker } from '@/components/ui/daypicker.component'
import { useUpdateLesson } from './useUpdateLesson'
import { toast } from 'sonner'
import { ButtonPlannedLessonAvailable } from './planning/ButtonPlannedLessonAvailable.component'
import type { Lesson } from '@/types/types'

export function CreateLessonForm() {
  const [date, setDate] = useState<Date>(new Date())
  const { data: settings } = useSettingsQuery()
  const { createLesson, isCreating } = useCreateLesson()
  const { updateLesson, isUpdating } = useUpdateLesson()
  const { hasAccess } = useSubscription()
  const { drafts, setDrafts } = useDrafts()
  const { currentLessonHolder } = useCurrentHolder()
  const [lessonContent, setLessonContent] = useState('')
  const [homework, setHomework] = useState('')
  const [error, setError] = useState('')
  const isDisabledSave =
    isCreating || isUpdating || !hasAccess || (!lessonContent && !homework)

  const typeField: 'studentId' | 'groupId' =
    currentLessonHolder?.type === 's' ? 'studentId' : 'groupId'

  useEffect(() => {
    const currentDraft = drafts.find(
      (draft) => draft[typeField] === currentLessonHolder?.holder.id,
    )
    if (currentDraft) {
      setLessonContent(currentDraft.lessonContent || '')
      setHomework(currentDraft.homework || '')
      setDate(currentDraft.date || new Date())
    } else {
      setLessonContent('')
      setHomework('')
      setDate(new Date())
    }
  }, [drafts, typeField, currentLessonHolder?.holder.id])

  useEffect(() => {
    const input = [...document.querySelectorAll('.rsw-ce')].at(0) as HTMLElement
    if (input && window.innerWidth > 1366) {
      input.focus()
    }
  }, [])

  function handleDate(inputDate: Date | undefined) {
    if (!inputDate) return
    setDate(inputDate)
    setDrafts((prev) => {
      if (
        prev.some(
          (draft) => draft[typeField] === currentLessonHolder?.holder.id,
        )
      ) {
        return prev.map((draft) =>
          draft[typeField] === currentLessonHolder?.holder.id
            ? { ...draft, date: inputDate }
            : draft,
        )
      }
      return [
        ...prev,
        { [typeField]: currentLessonHolder?.holder.id, date: inputDate },
      ]
    })
  }
  function handleLessonContent(content: string) {
    setError('')
    setLessonContent(content)
    setDrafts((prev) => {
      if (
        prev.some(
          (draft) => draft[typeField] === currentLessonHolder?.holder.id,
        )
      ) {
        return prev.map((draft) =>
          draft[typeField] === currentLessonHolder?.holder.id
            ? { ...draft, lessonContent: content, date }
            : draft,
        )
      }
      return [
        ...prev,
        {
          [typeField]: currentLessonHolder?.holder.id,
          lessonContent: content,
          date,
        },
      ]
    })
  }

  function handleHomework(content: string) {
    setError('')
    setHomework(content)

    setDrafts((prev) => {
      if (
        prev.some(
          (draft) => draft[typeField] === currentLessonHolder?.holder.id,
        )
      ) {
        return prev.map((draft) =>
          draft[typeField] === currentLessonHolder?.holder.id
            ? { ...draft, homework: content, date }
            : draft,
        )
      }
      return [
        ...prev,
        {
          [typeField]: currentLessonHolder?.holder.id,
          homework: content,
          date,
        },
      ]
    })
  }

  function resetFields() {
    window.scrollTo(0, 0)
    setHomework('')
    setLessonContent('')
    setDrafts((prev) =>
      prev.filter(
        (draft) => draft[typeField] !== currentLessonHolder?.holder.id,
      ),
    )
  }

  function handleSave() {
    if (!lessonContent && !homework) {
      return setError(
        'Die Lektion benötigt mindestens Inhalt oder Hausaufgaben.',
      )
    }
    if (!currentLessonHolder?.holder.id) return
    const fieldType = currentLessonHolder.type === 's' ? 'studentId' : 'groupId'
    const currentDraft = drafts.find((draft) => draft[fieldType])
    if (currentDraft && currentDraft.status === 'prepared') {
      const updatedPlannedLesson = currentDraft as Lesson
      return updateLesson(
        {
          ...updatedPlannedLesson,
          homework: removeHTMLAttributes(homework),
          lessonContent: removeHTMLAttributes(lessonContent),
          date,
          status: 'documented',
          expiration_base: new Date().toISOString(),
        },
        {
          onSuccess: () => {
            toast.success('Lektion gespeichert.')
            resetFields()
          },
        },
      )
    }

    createLesson(
      {
        homework: removeHTMLAttributes(homework),
        lessonContent: removeHTMLAttributes(lessonContent),
        [typeField]: currentLessonHolder.holder.id,
        date,
        expiration_base: new Date().toISOString(),
        status: 'documented',
      },
      {
        onSuccess: resetFields,
      },
    )
  }

  if (!currentLessonHolder || !settings) return null
  return (
    <>
      <div className='mb-3 items-center md:flex md:gap-2'>
        <div className='flex items-center gap-2'>
          <p>Datum</p>
          <DayPicker setDate={handleDate} date={date} disabled={isCreating} />
        </div>

        <div>
          <ButtonPlannedLessonAvailable date={date} />
        </div>
      </div>
      <div
        className={cn(
          isCreating && 'opacity-50',
          'grid min-[1148px]:grid-cols-2 gap-6',
        )}
      >
        <div>
          <p>Lektion</p>
          <CustomEditor
            key={`lessonContent-${currentLessonHolder.holder.id}`}
            disabled={isCreating}
            value={lessonContent}
            onChange={handleLessonContent}
            placeholder='Lektion...'
          />
        </div>
        <div>
          <p>Hausaufgaben</p>
          <CustomEditor
            key={`homework-${currentLessonHolder.holder.id}`}
            disabled={isCreating}
            value={homework}
            onChange={handleHomework}
            placeholder='Hausaufgaben...'
          />
        </div>
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
          {(isCreating || isUpdating) && <MiniLoader />}
        </div>
      </div>
    </>
  )
}
