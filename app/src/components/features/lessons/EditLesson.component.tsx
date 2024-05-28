import { useState } from "react"
import { useLessons } from "../../../services/context/LessonsContext"
import fetchErrorToast from "../../../hooks/fetchErrorToast"
import type { Lesson } from "../../../types/types"
import CustomEditor from "../../ui/CustomEditor.component"
import { DayPicker } from "@/components/ui/daypicker.component"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import MiniLoader from "@/components/ui/MiniLoader.component"
import { useQuery } from "@tanstack/react-query"
import { fetchAllLessonsPerStudentSupabase } from "@/services/api/lessons.api"

interface EditLessonProps {
  studentId: number
  onCloseModal?: () => void
}

function EditLesson({ studentId, lessonId, onCloseModal }: EditLessonProps) {
  const {
    data: lessons,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["lessons", studentId],
    queryFn: () => fetchAllLessonsPerStudentSupabase(studentId),
  })

  const currentLesson = lessons.find((lesson) => lesson.id === lessonId)

  const [lessonContent, setLessonContent] = useState(lesson.lessonContent)
  const [homework, setHomework] = useState(lesson.homework)
  const [date, setDate] = useState<Date | undefined>(lesson.date)
  const [isPending, setIsPending] = useState(false)

  const handleLessonContent = (content: string) => {
    setLessonContent(content)
  }

  const handleHomework = (content: string) => {
    setHomework(content)
  }

  const handleUpdate = async () => {
    if (!date) return toast.error("Datum fehlt")
    setIsPending(true)

    try {
      const newLesson: Lesson = {
        lessonContent,
        homework,
        date,
        studentId,
        id,
      }
      await updateLesson(newLesson)
      toast.success("Änderungen gespeichert")
      onCloseModal?.()
    } catch (error) {
      fetchErrorToast()
      onCloseModal?.()
    } finally {
      setIsPending(false)
    }
  }

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
          <Button disabled={isPending} size='sm' onClick={handleUpdate}>
            Speichern
          </Button>
          {isPending && <MiniLoader />}
        </div>
      </div>
    </div>
  )
}

export default EditLesson
