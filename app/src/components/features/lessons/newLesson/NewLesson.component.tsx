import "./newLesson.style.scss"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import CustomEditor from "../../../ui/CustomEditor.component"

import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import { useLessons } from "../../../../services/context/LessonsContext"
import { useStudents } from "../../../../services/context/StudentContext"
import type { Lesson } from "../../../../types/types"
import { formatDateToDatabase } from "../../../../utils/formateDate"
import { DayPicker } from "@/components/ui/daypicker.component"
import { Button } from "@/components/ui/button"

function NewLesson() {
  const [date, setDate] = useState("")
  const [lessonContent, setLessonContent] = useState("")
  const { currentStudentId } = useStudents()
  const [homework, setHomework] = useState("")
  const { saveNewLesson, drafts, setDrafts } = useLessons()
  const [isPending, setIsPending] = useState(false)

  // Handle drafts
  useEffect(() => {
    const today = new Date()
      .toLocaleDateString("de-CH")
      .split(".")
      .map((e) => e.padStart(2, "0"))
      .join(".")
    if (drafts.some((draft) => draft.studentId === currentStudentId)) {
      const currentDraft = drafts.find(
        (draft) => draft.studentId === currentStudentId,
      )
      setLessonContent(currentDraft.lessonContent || "")
      setHomework(currentDraft.homework || "")

      if (currentDraft.date) {
        setDate(currentDraft.date)
      } else {
        setDate(today)
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

  const handlerInputDate = (inputDate: string) => {
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

  const handleSaveLesson = async () => {
    if (!date) {
      toast("Die Lektion hat kein Datum", { type: "error" })
      return
    }
    if (!lessonContent) {
      toast("Die Lektion hat keinen Lektionsinhalt", { type: "error" })
      return
    }
    try {
      setIsPending(true)
      const newLesson: Lesson = {
        lessonContent,
        homework,
        date,
        studentId: currentStudentId,
      }
      await saveNewLesson(newLesson)
      setLessonContent("")
      setHomework("")
      setDrafts((prev) =>
        prev.filter((draft) => draft.studentId !== currentStudentId),
      )
      toast("Lektion gespeichert")
    } catch (err) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className='sm:pr-4 sm:pl-8 sm:py-4'>
      <div className='flex mb-2 gap-4 items-baseline'>
        <h5 className='m-0'>Aktuelle Lektion</h5>
        <DayPicker />
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
      <Button
        size='sm'
        onClick={handleSaveLesson}
        className='block mt-4 ml-auto'
      >
        Speichern
      </Button>
    </div>
  )
}

export default NewLesson
