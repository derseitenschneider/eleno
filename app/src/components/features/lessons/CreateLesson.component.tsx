import { useEffect, useState } from 'react'
import CustomEditor from '../../ui/CustomEditor.component'

import { useDrafts } from '../../../services/context/DraftsContext'
import { DayPicker } from '@/components/ui/daypicker.component'
import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { useCreateLesson } from './useCreateLesson'
import { cn } from '@/lib/utils'
import useCurrentHolder from './useCurrentHolder'

function CreateLesson() {
  const { drafts, setDrafts } = useDrafts()
  const { currentLessonHolder } = useCurrentHolder()
  const [date, setDate] = useState<Date>(new Date())
  const [lessonContent, setLessonContent] = useState('')
  const [homework, setHomework] = useState('')

  const typeField: 'studentId' | 'groupId' =
    currentLessonHolder?.type === 's' ? 'studentId' : 'groupId'

  const { createLesson, isCreating } = useCreateLesson()

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

  // Put Focus on input when desktop
  useEffect(() => {
    const input = [...document.querySelectorAll('.rsw-ce')].at(0) as HTMLElement
    if (input && window.innerWidth > 1366) {
      input.focus()
    }
  }, [])

  function handleLessonContent(content: string) {
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
    setHomework('')
    setLessonContent('')
    setDrafts((prev) =>
      prev.filter(
        (draft) => draft[typeField] !== currentLessonHolder?.holder.id,
      ),
    )
  }

  function handleSave() {
    if (!currentLessonHolder?.holder.id) return
    createLesson(
      {
        homework,
        lessonContent,
        [typeField]: currentLessonHolder.holder.id,
        date,
      },
      {
        onSuccess: resetFields,
      },
    )
  }

  return (
    <div className='p-4 sm:pr-4 sm:pl-8 sm:py-4'>
      <div className='flex mb-2 gap-4 items-baseline'>
        <h5 className='m-0'>Aktuelle Lektion</h5>
        <DayPicker
          setDate={handlerInputDate}
          date={date}
          disabled={isCreating}
        />
      </div>
      <div
        className={cn(isCreating && 'opacity-50', 'grid md:grid-cols-2 gap-6')}
      >
        <div>
          <p className='text-foreground/70'>Lektion</p>
          <CustomEditor
            disabled={isCreating}
            value={lessonContent}
            onChange={handleLessonContent}
          />
        </div>
        <div>
          <p className='capitalize text-foreground/70'>Hausaufgaben</p>
          <CustomEditor
            disabled={isCreating}
            value={homework}
            onChange={handleHomework}
          />
        </div>
      </div>
      <div className='flex mt-4 items-center gap-1'>
        <Button
          disabled={isCreating}
          size='sm'
          onClick={handleSave}
          className='block ml-auto'
        >
          Speichern
        </Button>
        {isCreating && <MiniLoader />}
      </div>
    </div>
  )
}

export default CreateLesson