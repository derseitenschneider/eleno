import { useEffect, useState } from "react"
import CustomEditor from "../../ui/CustomEditor.component"

import { useLessons } from "../../../services/context/LessonsContext"
import { DayPicker } from "@/components/ui/daypicker.component"
import { Button } from "@/components/ui/button"
import MiniLoader from "@/components/ui/MiniLoader.component"
import { useCreateLesson } from "./useCreateLesson"
import { cn } from "@/lib/utils"
import { useParams } from "react-router-dom"

function CreateLesson() {
  const { drafts, setDrafts } = useLessons()
  const { studentId } = useParams()
  const [date, setDate] = useState<Date>(new Date())
  const [lessonContent, setLessonContent] = useState("")
  const [homework, setHomework] = useState("")

  const { createLesson, isCreating } = useCreateLesson()

  // Handle drafts
  useEffect(() => {
    const currentDraft = drafts.find(
      (draft) => draft.studentId === Number(studentId),
    )
    if (currentDraft) {
      setLessonContent(currentDraft.lessonContent || "")
      setHomework(currentDraft.homework || "")
      setDate(currentDraft.date || new Date())
    } else {
      setLessonContent("")
      setHomework("")
      setDate(new Date())
    }
  }, [drafts, studentId])

  // Put Focus on input when desktop
  useEffect(() => {
    const input = [...document.querySelectorAll(".rsw-ce")].at(0) as HTMLElement
    if (input && window.innerWidth > 1366) {
      input.focus()
    }
  }, [])

  function handleLessonContent(content: string) {
    setLessonContent(content)
    setDrafts((prev) => {
      if (prev.some((draft) => draft.studentId === Number(studentId))) {
        return prev.map((draft) =>
          draft.studentId === Number(studentId)
            ? { ...draft, lessonContent: content, date }
            : draft,
        )
      }
      return [
        ...prev,
        { studentId: Number(studentId), lessonContent: content, date },
      ]
    })
  }

  function handleHomework(content: string) {
    setHomework(content)

    setDrafts((prev) => {
      if (prev.some((draft) => draft.studentId === Number(studentId))) {
        return prev.map((draft) =>
          draft.studentId === Number(studentId)
            ? { ...draft, homework: content, date }
            : draft,
        )
      }
      return [
        ...prev,
        { studentId: Number(studentId), homework: content, date },
      ]
    })
  }

  const handlerInputDate = (inputDate: Date | undefined) => {
    if (!inputDate) return
    setDate(inputDate)
    setDrafts((prev) => {
      if (prev.some((draft) => draft.studentId === Number(studentId))) {
        return prev.map((draft) =>
          draft.studentId === Number(studentId)
            ? { ...draft, date: inputDate }
            : draft,
        )
      }
      return [...prev, { studentId: Number(studentId), date: inputDate }]
    })
  }

  function resetFields() {
    setHomework("")
    setLessonContent("")
    setDrafts((prev) =>
      prev.filter((draft) => draft.studentId !== Number(studentId)),
    )
  }

  function handleSave() {
    if (!studentId) return
    createLesson(
      {
        homework,
        lessonContent,
        studentId: Number(studentId),
        date,
      },
      {
        onSuccess: resetFields,
      },
    )
  }

  return (
    <div className='sm:pr-4 sm:pl-8 sm:py-4'>
      <div className='flex mb-2 gap-4 items-baseline'>
        <h5 className='m-0'>Aktuelle Lektion</h5>
        <DayPicker
          setDate={handlerInputDate}
          date={date}
          disabled={isCreating}
        />
      </div>
      <div className={cn(isCreating && "opacity-50", "grid grid-cols-2 gap-6")}>
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
      <div className='h-fit flex items-center gap-1'>
        <Button
          disabled={isCreating}
          size='sm'
          onClick={handleSave}
          className='block mt-4 ml-auto'
        >
          Speichern
        </Button>
        {isCreating && <MiniLoader />}
      </div>
    </div>
  )
}

export default CreateLesson
