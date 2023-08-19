import './newLesson.style.scss'

import { useState, useEffect } from 'react'
import Button from '../../common/button/Button.component'
import CustomEditor from '../../common/customEditor/CustomEditor.component'

import { toast } from 'react-toastify'
import { useLessons } from '../../../contexts/LessonsContext'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import { formatDateToDatabase } from '../../../utils/formateDate'
import { TLesson } from '../../../types/types'
import { useStudents } from '../../../contexts/StudentContext'

const NewLesson = () => {
  const [date, setDate] = useState('')
  const [lessonContent, setLessonContent] = useState('')
  const { currentStudentId } = useStudents()
  const [homework, setHomework] = useState('')
  const { saveNewLesson, drafts, setDrafts } = useLessons()
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    const today = new Date()
      .toLocaleDateString('de-CH')
      .split('.')
      .map((e) => e.padStart(2, '0'))
      .join('.')
    if (drafts.some((draft) => draft.studentId === currentStudentId)) {
      const currentDraft = drafts.find(
        (draft) => draft.studentId === currentStudentId
      )
      setLessonContent(currentDraft.lessonContent || '')
      setHomework(currentDraft.homework || '')

      if (currentDraft.date) {
        setDate(currentDraft.date)
      } else {
        setDate(today)
      }
    } else {
      setLessonContent('')
      setHomework('')
      setDate(today)
    }
  }, [currentStudentId, drafts])

  useEffect(() => {
    const input = [...document.querySelectorAll('.rsw-ce')].at(0) as HTMLElement
    if (input && window.innerWidth > 1084) {
      input && input.focus()
    }
  }, [currentStudentId])

  function handleLessonContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setLessonContent(e.target.value)
    setDrafts((prev) => {
      if (prev.some((draft) => draft.studentId === currentStudentId)) {
        return prev.map((draft) =>
          draft.studentId === currentStudentId
            ? { ...draft, lessonContent: e.target.value, date }
            : draft
        )
      } else {
        return [
          ...prev,
          { studentId: currentStudentId, lessonContent: e.target.value, date },
        ]
      }
    })
  }

  function handleHomework(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setHomework(e.target.value)

    setDrafts((prev) => {
      if (prev.some((draft) => draft.studentId === currentStudentId)) {
        return prev.map((draft) =>
          draft.studentId === currentStudentId
            ? { ...draft, homework: e.target.value, date }
            : draft
        )
      } else {
        return [
          ...prev,
          { studentId: currentStudentId, homework: e.target.value, date },
        ]
      }
    })
  }

  const handlerShowPicker = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.showPicker()
  }

  const handlerInputDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
    setDrafts((prev) => {
      if (prev.some((draft) => draft.studentId === currentStudentId)) {
        return prev.map((draft) =>
          draft.studentId === currentStudentId
            ? { ...draft, date: e.target.value }
            : draft
        )
      } else {
        return [...prev, { studentId: currentStudentId, date: e.target.value }]
      }
    })
  }

  const handleSaveLesson = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!date) {
      toast('Die Lektion hat kein Datum', { type: 'error' })
      return
    }
    if (!lessonContent) {
      toast('Die Lektion hat keinen Lektionsinhalt', { type: 'error' })
      return
    }
    try {
      setIsPending(true)
      const newLesson: TLesson = {
        lessonContent,
        homework,
        date,
        studentId: currentStudentId,
      }
      await saveNewLesson(newLesson)
      setLessonContent('')
      setHomework('')
      setDrafts((prev) =>
        prev.filter((draft) => draft.studentId !== currentStudentId)
      )
      toast('Lektion gespeichert')
    } catch (err) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="container container--lessons container--new-lesson">
      <div className="wrapper-date">
        <h3 className="heading-4">Aktuelle Lektion</h3>
        <input
          type="date"
          value={formatDateToDatabase(date)}
          onChange={handlerInputDate}
          onFocus={handlerShowPicker}
        />
      </div>
      <div className="container--two-rows">
        <div className="row-left">
          <h5 className="heading-5">Lektion</h5>
          <div className={`container--editor ${isPending ? 'loading' : ''}`}>
            <CustomEditor
              value={lessonContent}
              onChange={handleLessonContent}
            />
          </div>
        </div>
        <div className="row-right">
          <h5 className="heading-5">Hausaufgaben</h5>
          <div className={`container--editor ${isPending ? 'loading' : ''}`}>
            <CustomEditor value={homework} onChange={handleHomework} />
          </div>
        </div>
      </div>
      <Button
        type="button"
        btnStyle="primary"
        label="Speichern"
        className="btn--save"
        handler={handleSaveLesson}
        disabled={!lessonContent && !homework}
      />
    </div>
  )
}

export default NewLesson
