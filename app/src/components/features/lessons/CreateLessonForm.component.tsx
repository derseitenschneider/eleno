import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import CustomEditor from '@/components/ui/CustomEditor.component'
import { DayPicker } from '@/components/ui/daypicker.component'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { cn } from '@/lib/utils'
import { useDrafts } from '@/services/context/DraftsContext'
import { useSubscription } from '@/services/context/SubscriptionContext'
import type { Lesson } from '@/types/types'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import useSettingsQuery from '../settings/settingsQuery'
import { ButtonPlannedLessonAvailable } from './planning/ButtonPlannedLessonAvailable.component'
import { LessonStatusSelect } from './LessonStatusSelect.component'
import { useCreateLesson } from './useCreateLesson'
import useCurrentHolder from './useCurrentHolder'
import { useUpdateLesson } from './useUpdateLesson'
import type { AbsenceType } from '@/types/types'

export function CreateLessonForm() {
  const getInitialDate = () => {
    return new Date()
  }

  const [date, setDate] = useState<Date>(getInitialDate())
  const { data: settings } = useSettingsQuery()
  const { createLesson, isCreating } = useCreateLesson()
  const { updateLesson, isUpdating } = useUpdateLesson()
  const { hasAccess } = useSubscription()
  const { drafts, setDrafts } = useDrafts()
  const { currentLessonHolder } = useCurrentHolder()
  const [lessonContent, setLessonContent] = useState('')
  const [homework, setHomework] = useState('')
  const [lessonType, setLessonType] = useState<AbsenceType>('held')
  const [absenceReason, setAbsenceReason] = useState('')
  const [error, setError] = useState('')
  const isDisabledSave =
    isCreating ||
    isUpdating ||
    !hasAccess ||
    (lessonType === 'held' && !lessonContent && !homework) ||
    (lessonType !== 'held' && !absenceReason)

  const typeField: 'studentId' | 'groupId' =
    currentLessonHolder?.type === 's' ? 'studentId' : 'groupId'

  useEffect(() => {
    const currentDraft = drafts.find(
      (draft) => draft[typeField] === currentLessonHolder?.holder.id,
    )
    if (currentDraft) {
      setLessonContent(currentDraft.lessonContent || '')
      setHomework(currentDraft.homework || '')
      setDate(currentDraft.date || getInitialDate())
      setLessonType(currentDraft.lesson_type || 'held')
      setAbsenceReason(currentDraft.absence_reason || '')
    } else {
      setLessonContent('')
      setHomework('')
      setDate(getInitialDate())
      setLessonType('held')
      setAbsenceReason('')
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
            ? { ...draft, date: inputDate, lesson_type: lessonType, absence_reason: absenceReason }
            : draft,
        )
      }
      return [
        ...prev,
        {
          [typeField]: currentLessonHolder?.holder.id,
          date: inputDate,
          lesson_type: lessonType,
          absence_reason: absenceReason,
        },
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
            ? { ...draft, lessonContent: content, date, lesson_type: lessonType, absence_reason: absenceReason }
            : draft,
        )
      }
      return [
        ...prev,
        {
          [typeField]: currentLessonHolder?.holder.id,
          lessonContent: content,
          date,
          lesson_type: lessonType,
          absence_reason: absenceReason,
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
            ? { ...draft, homework: content, date, lesson_type: lessonType, absence_reason: absenceReason }
            : draft,
        )
      }
      return [
        ...prev,
        {
          [typeField]: currentLessonHolder?.holder.id,
          homework: content,
          date,
          lesson_type: lessonType,
          absence_reason: absenceReason,
        },
      ]
    })
  }

  function handleAbsenceReason(content: string) {
    setError('')
    setAbsenceReason(content)

    setDrafts((prev) => {
      if (
        prev.some(
          (draft) => draft[typeField] === currentLessonHolder?.holder.id,
        )
      ) {
        return prev.map((draft) =>
          draft[typeField] === currentLessonHolder?.holder.id
            ? { ...draft, absence_reason: content, date, lesson_type: lessonType }
            : draft,
        )
      }
      return [
        ...prev,
        {
          [typeField]: currentLessonHolder?.holder.id,
          absence_reason: content,
          date,
          lesson_type: lessonType,
        },
      ]
    })
  }

  function handleLessonType(type: AbsenceType) {
    setError('')
    setLessonType(type)

    setDrafts((prev) => {
      if (
        prev.some(
          (draft) => draft[typeField] === currentLessonHolder?.holder.id,
        )
      ) {
        return prev.map((draft) =>
          draft[typeField] === currentLessonHolder?.holder.id
            ? { ...draft, lesson_type: type, date, absence_reason: absenceReason }
            : draft,
        )
      }
      return [
        ...prev,
        {
          [typeField]: currentLessonHolder?.holder.id,
          lesson_type: type,
          date,
          absence_reason: absenceReason,
        },
      ]
    })
  }

  function resetFields() {
    window.scrollTo(0, 0)
    setHomework('')
    setLessonContent('')
    setAbsenceReason('')
    setLessonType('held')
    setDrafts((prev) =>
      prev.filter(
        (draft) => draft[typeField] !== currentLessonHolder?.holder.id,
      ),
    )
  }

  function handleSave() {
    if (lessonType === 'held' && !lessonContent && !homework) {
      return setError(
        'Die Lektion benötigt mindestens Inhalt oder Hausaufgaben.',
      )
    }
    if (lessonType !== 'held' && !absenceReason) {
      return setError('Ein Grund für die Abwesenheit ist erforderlich.')
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
          lesson_type: lessonType,
          absence_reason: absenceReason,
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
        lesson_type: lessonType,
        absence_reason: absenceReason,
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
        <LessonStatusSelect value={lessonType} onChange={handleLessonType} />

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
        {lessonType === 'held' ? (
          <>
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
          </>
        ) : (
          <div className="min-[1148px]:col-span-2">
            <p>Abwesenheitsgrund</p>
            <CustomEditor
              key={`absence-${currentLessonHolder.holder.id}`}
              disabled={isCreating}
              value={absenceReason}
              onChange={handleAbsenceReason}
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
          {(isCreating || isUpdating) && <MiniLoader />}
        </div>
      </div>
    </>
  )
}
