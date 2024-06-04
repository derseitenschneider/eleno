import { useEffect, useState } from "react"
import CustomEditor from "../../../ui/CustomEditor.component"

import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import { useLessons } from "../../../../services/context/LessonsContext"
import { useStudents } from "../../../../services/context/StudentContext"
import type { Lesson } from "../../../../types/types"
import { DayPicker } from "@/components/ui/daypicker.component"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import MiniLoader from "@/components/ui/MiniLoader.component"
import { createLessonMutation } from "../mutations/createLessonMutation"
import { useUser } from "@/services/context/UserContext"
import { randomInt, randomUUID } from "crypto"

function NewLesson() {
  const [date, setDate] = useState<Date>(new Date())
  const { user } = useUser()
  const [lessonContent, setLessonContent] = useState("")
  const { currentStudentId } = useStudents()
  const [homework, setHomework] = useState("")
  const { drafts, setDrafts } = useLessons()

  // Handle drafts
  useEffect(() => {
    const today = new Date()
    if (drafts.some((draft) => draft.studentId === currentStudentId)) {
      const currentDraft = drafts.find(
        (draft) => draft.studentId === currentStudentId,
      )
      if (currentDraft) {
        setLessonContent(currentDraft.lessonContent || "")
        setHomework(currentDraft.homework || "")
        setDate(currentDraft.date || today)
      }
    } else {
      setLessonContent("")
      setHomework("")
      setDate(today)
    }
  }, [currentStudentId, drafts])

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
      if (prev.some((draft) => draft.studentId === currentStudentId)) {
        return prev.map((draft) =>
          draft.studentId === currentStudentId
            ? { ...draft, lessonContent: content, date }
            : draft,
        )
      }
      return [
        ...prev,
        { studentId: currentStudentId, lessonContent: content, date },
      ]
    })
  }

  function handleHomework(content: string) {
    setHomework(content)

    setDrafts((prev) => {
      if (prev.some((draft) => draft.studentId === currentStudentId)) {
        return prev.map((draft) =>
          draft.studentId === currentStudentId
            ? { ...draft, homework: content, date }
            : draft,
        )
      }
      return [...prev, { studentId: currentStudentId, homework: content, date }]
    })
  }

  const handlerInputDate = (inputDate: Date | undefined) => {
    if (!inputDate) return
    setDate(inputDate)
    setDrafts((prev) => {
      if (prev.some((draft) => draft.studentId === currentStudentId)) {
        return prev.map((draft) =>
          draft.studentId === currentStudentId
            ? { ...draft, date: inputDate }
            : draft,
        )
      }
      return [...prev, { studentId: currentStudentId, date: inputDate }]
    })
  }
  function resetFields() {
    setHomework("")
    setLessonContent("")
    setDrafts((prev) =>
      prev.filter((draft) => draft.studentId !== currentStudentId),
    )
  }

  const { mutate: saveLesson, isPending } = createLessonMutation(
    {
      user_id: user?.id || null,
      studentId: currentStudentId || null,
      date,
      lessonContent,
      homework,
      homeworkKey: null,
      id: new Date().getMilliseconds(),
    },
    resetFields,
  )

  return (
    <div className='sm:pr-4 sm:pl-8 sm:py-4'>
      <div className='flex mb-2 gap-4 items-baseline'>
        <h5 className='m-0'>Aktuelle Lektion</h5>
        <DayPicker setDate={handlerInputDate} date={date} />
      </div>
      <div className='grid grid-cols-2 gap-6'>
        <div>
          <p className='text-foreground/70'>Lektion</p>
          <CustomEditor value={lessonContent} onChange={handleLessonContent} />
        </div>
        <div>
          <p className='capitalize text-foreground/70'>Hausaufgaben</p>
          <CustomEditor value={homework} onChange={handleHomework} />
        </div>
      </div>
      <div className='h-fit flex items-center gap-1'>
        <Button
          disabled={isPending}
          size='sm'
          onClick={() => saveLesson()}
          className='block mt-4 ml-auto'
        >
          Speichern
        </Button>
        {isPending && <MiniLoader />}
      </div>
    </div>
  )
}

export default NewLesson
