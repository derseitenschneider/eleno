import { useState } from "react"
import type { Lesson } from "../../../types/types"
import CustomEditor from "../../ui/CustomEditor.component"

import { DayPicker } from "@/components/ui/daypicker.component"
import { Button } from "@/components/ui/button"
import MiniLoader from "@/components/ui/MiniLoader.component"
import { updateLessonMutation } from "./mutations/updateLessonMutation"
import { useQueryClient } from "@tanstack/react-query"

type EditLessonProps = {
  lessonId: number
  onCloseModal?: () => void
}

function EditLesson({ lessonId, onCloseModal }: EditLessonProps) {
  const queryClient = useQueryClient()
  const allLessons = queryClient.getQueryData(["all-lessons"]) as
    | Array<Lesson>
    | undefined
  const latestLessons = queryClient.getQueryData(["latest-3-lessons"]) as
    | Array<Lesson>
    | undefined

  const combinedLessons: Array<Lesson> = []
  if (allLessons) combinedLessons.push(...allLessons)
  if (latestLessons) combinedLessons.push(...latestLessons)

  const lessonToEdit = combinedLessons.find((lesson) => lesson.id === lessonId)
  const [lessonContent, setLessonContent] = useState(
    lessonToEdit?.lessonContent || "",
  )
  const [homework, setHomework] = useState(lessonToEdit?.homework || "")
  const [date, setDate] = useState<Date>(lessonToEdit?.date || new Date())

  const handleLessonContent = (content: string) => {
    setLessonContent(content)
  }

  const handleHomework = (content: string) => {
    setHomework(content)
  }

  const handleSetDate = (date: Date | undefined) => {
    if (date) setDate(date)
  }
  if (!lessonToEdit?.homeworkKey || !lessonToEdit.id) return null

  const { mutate: saveLesson, isPending } = updateLessonMutation(
    {
      ...lessonToEdit,
      lessonContent,
      homework,
      date,
    },
    onCloseModal,
  )

  return (
    <div>
      <div className='flex items-center mb-3 gap-2'>
        <h5 className='mb-0'>Datum</h5>
        <DayPicker disabled={isPending} date={date} setDate={handleSetDate} />
      </div>
      <div className='flex items-center mb-6 gap-8'>
        <div className='w-[450px]'>
          <h5>Lektion</h5>

          <CustomEditor
            disabled={isPending}
            value={lessonContent || ""}
            onChange={handleLessonContent}
          />
        </div>

        <div className='w-[450px]'>
          <h5>Hausaufgaben</h5>

          <CustomEditor
            disabled={isPending}
            value={homework || ""}
            onChange={handleHomework}
          />
        </div>
      </div>
      <div className='justify-end gap-4 flex items-center'>
        <Button
          disabled={isPending}
          size='sm'
          variant='outline'
          onClick={onCloseModal}
        >
          Abbrechen
        </Button>
        <div className='flex items-center gap-2'>
          <Button disabled={isPending} size='sm' onClick={() => saveLesson()}>
            Speichern
          </Button>
          {isPending && <MiniLoader />}
        </div>
      </div>
    </div>
  )
}

export default EditLesson
