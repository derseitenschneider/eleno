import "./newLesson.style.scss"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import CustomEditor from "../../../ui/customEditor/CustomEditor.component"

import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import { useLessons } from "../../../../services/context/LessonsContext"
import { useStudents } from "../../../../services/context/StudentContext"
import type { Lesson } from "../../../../types/types"
import { formatDateToDatabase } from "../../../../utils/formateDate"

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
    <div className=''>
      <div className='wrapper-date'>
        <h3 className='heading-4'>Aktuelle Lektion</h3>
      </div>
      <div className='grid grid-cols-2 gap-6'>
        <div className='row-left'>
          <h5 className='heading-5'>Lektion</h5>
          <div
            className={`container--editor ${isPending ? "loading" : ""}`}
          ></div>
        </div>
        <div className='row-right'>
          <h5 className='heading-5'>Hausaufgaben</h5>
          <div className={`container--editor ${isPending ? "loading" : ""}`}>
            <CustomEditor value={homework} onChange={handleHomework} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewLesson
