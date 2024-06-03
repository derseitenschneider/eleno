import { useState } from "react"
import fetchErrorToast from "../../../hooks/fetchErrorToast"
import type { Lesson } from "../../../types/types"
import CustomEditor from "../../ui/CustomEditor.component"
import type { Database } from "../../../types/supabase"

import { DayPicker } from "@/components/ui/daypicker.component"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import MiniLoader from "@/components/ui/MiniLoader.component"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateLessonAPI } from "@/services/api/lessons.api"
import { updateLessonMutation } from "./mutations/updateLessonMutation"

type EditLessonProps = {
  lesson: Lesson
  onCloseModal?: () => void
}

function EditLesson({ lesson, onCloseModal }: EditLessonProps) {
  const [lessonContent, setLessonContent] = useState(lesson.lessonContent)
  const [homework, setHomework] = useState(lesson.homework)
  const [date, setDate] = useState<Date | undefined>(lesson.date)

  const handleLessonContent = (content: string) => {
    setLessonContent(content)
  }

  const handleHomework = (content: string) => {
    setHomework(content)
  }

  // TODO: define datepicker to not return undefined since a lesson always has
  // to have a date.
  const { mutate: saveLesson, isPending } = updateLessonMutation(
    {
      ...lesson,
      lessonContent,
      homework,
      date,
    },
    onCloseModal,
  )

  return (
    <div className='edit-lesson'>
      <div className='flex items-center mb-3 gap-2'>
        <h5 className='mb-0'>Datum</h5>
        <DayPicker
          disabled={isPending}
          date={date}
          setDate={(e) => setDate(e)}
        />
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
