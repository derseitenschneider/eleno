import { useEffect, useState } from 'react'
import CustomEditor from '../../ui/CustomEditor.component'

import { useDrafts } from '../../../services/context/DraftsContext'
import { DayPicker } from '@/components/ui/daypicker.component'
import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { useCreateLesson } from './useCreateLesson'
import { cn } from '@/lib/utils'
import useCurrentHolder from './useCurrentHolder'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import { Blocker } from '../subscription/Blocker'
import { useSubscription } from '@/services/context/SubscriptionContext'

function CreateLesson() {
  const { hasAccess } = useSubscription()
  const { drafts, setDrafts } = useDrafts()
  const { currentLessonHolder } = useCurrentHolder()
  const { createLesson, isCreating } = useCreateLesson()
  const [date, setDate] = useState<Date>(new Date())
  const [lessonContent, setLessonContent] = useState('')
  const [homework, setHomework] = useState('')
  const [error, setError] = useState('')

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

  const handlerInputDate = (inputDate: Date | undefined) => {
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
    createLesson(
      {
        homework: removeHTMLAttributes(homework),
        lessonContent: removeHTMLAttributes(lessonContent),
        [typeField]: currentLessonHolder.holder.id,
        date,
      },
      {
        onSuccess: resetFields,
      },
    )
  }

  if (!currentLessonHolder) return null

  return (
    <div className='relative border-b border-hairline px-5 pb-6 pt-6 sm:pl-6 lg:py-4 lg:pb-16 lg:pr-4 min-[1148px]:pb-0'>
      <Blocker blockerId='createLesson' />
      <div className='mb-2 flex items-baseline gap-4'>
        <h5 className='m-0'>Aktuelle Lektion</h5>
        <DayPicker
          setDate={handlerInputDate}
          date={date}
          disabled={isCreating}
        />
      </div>
      <div
        className={cn(
          isCreating && 'opacity-50',
          'grid min-[1148px]:grid-cols-2 gap-6',
        )}
      >
        <div>
          <p className='text-foreground/70'>Lektion</p>
          <CustomEditor
            key={`lessonContent-${currentLessonHolder.holder.id}`}
            disabled={isCreating}
            value={lessonContent}
            onChange={handleLessonContent}
            placeholder='Lektion...'
          />
        </div>
        <div>
          <p className='capitalize text-foreground/70'>Hausaufgaben</p>
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
        <div className='ml-auto  mt-4 flex items-center gap-1 lg:mb-8'>
          <Button
            disabled={isCreating || !hasAccess}
            size='sm'
            onClick={handleSave}
            className='ml-auto block'
          >
            Speichern
          </Button>
          {isCreating && <MiniLoader />}
        </div>
      </div>
    </div>
  )
}

export default CreateLesson
