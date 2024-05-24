import { useState } from "react"
import { toast } from "react-toastify"
import { useLessons } from "../../../../services/context/LessonsContext"
import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import type { Lesson } from "../../../../types/types"
import CustomEditor from "../../../ui/CustomEditor.component"
import { DayPicker } from "@/components/ui/daypicker.component"
import { Button } from "@/components/ui/button"

interface EditLessonProps {
  lesson: Lesson
  onCloseModal?: () => void
}

function EditLesson({ lesson, onCloseModal }: EditLessonProps) {
  const { updateLesson } = useLessons()

  const { studentId, id } = lesson

  const [lessonContent, setLessonContent] = useState(lesson.lessonContent)
  const [homework, setHomework] = useState(lesson.homework)
  const [date, setDate] = useState(lesson.date)
  const [isPending, setIsPending] = useState(false)

  const handleLessonContent = (content: string) => {
    setLessonContent(content)
  }

  const handleHomework = (content: string) => {
    setHomework(content)
  }

  const handleUpdate = async () => {
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
      toast("Änderungen gespeichert")
      onCloseModal?.()
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className='edit-lesson'>
      <div className='flex items-center mb-3 gap-2'>
        <h5 className='mb-0'>Datum</h5>
        <DayPicker date={date} setDate={() => setDate} />
      </div>
      <div className='flex items-center mb-6 gap-8'>
        <div className='w-[450px]'>
          <h5>Lektion</h5>

          <CustomEditor
            value={lessonContent || ""}
            onChange={handleLessonContent}
          />
        </div>

        <div className='w-[450px]'>
          <h5>Hausaufgaben</h5>

          <CustomEditor value={homework} onChange={handleHomework} />
        </div>
      </div>
      <div className='justify-end gap-4 flex items-center'>
        <Button size='sm' variant='outline' onClick={onCloseModal}>
          Abbrechen
        </Button>
        <Button size='sm' onClick={handleUpdate}>
          Speichern
        </Button>
      </div>
    </div>
  )
}

export default EditLesson
