import './newLesson.style.scss'

import { FunctionComponent, useState, useEffect, useRef } from 'react'
import Button from '../../_reusables/button/Button.component'
import CustomEditor from '../../_reusables/customEditor/CustomEditor.component'

import { toast } from 'react-toastify'
import { useLessons } from '../../../contexts/LessonsContext'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import { formatDateToDatabase } from '../../../utils/formateDate'
import { TLesson } from '../../../types/types'

interface NewLessonProps {
  studentId: number
}

const lessonData = { lessonContent: '', homework: '' }

const NewLesson: FunctionComponent<NewLessonProps> = ({ studentId }) => {
  const [date, setDate] = useState('')
  const [lessonContent, setLessonContent] = useState('')
  const [homework, setHomework] = useState('')
  const { saveNewLesson, drafts, setDrafts } = useLessons()
  const [isPending, setIsPending] = useState(false)

  const inputRef = useRef(null)

  useEffect(() => {
    const today = new Date()
      .toLocaleDateString('de-CH')
      .split('.')
      .map((e) => e.padStart(2, '0'))
      .join('.')
    if (drafts.some((draft) => draft.studentId === studentId)) {
      const currentDraft = drafts.find((draft) => draft.studentId === studentId)
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
  }, [studentId])

  useEffect(() => {
    // if (window.screen.width > 1000) inputRef.current.focus()
  }, [studentId])

  function handleLessonContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setLessonContent(e.target.value)
    setDrafts((prev) => {
      if (prev.some((draft) => draft.studentId === studentId)) {
        return prev.map((draft) =>
          draft.studentId === studentId
            ? { ...draft, lessonContent: e.target.value, date }
            : draft
        )
      } else {
        return [...prev, { studentId, lessonContent: e.target.value, date }]
      }
    })
  }

  function handleHomework(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setHomework(e.target.value)

    setDrafts((prev) => {
      if (prev.some((draft) => draft.studentId === studentId)) {
        return prev.map((draft) =>
          draft.studentId === studentId
            ? { ...draft, homework: e.target.value, date }
            : draft
        )
      } else {
        return [...prev, { studentId, homework: e.target.value, date }]
      }
    })
  }

  const handlerShowPicker = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.showPicker()
  }

  const handlerInputDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
    setDrafts((prev) => {
      if (prev.some((draft) => draft.studentId === studentId)) {
        return prev.map((draft) =>
          draft.studentId === studentId
            ? { ...draft, date: e.target.value }
            : draft
        )
      } else {
        return [...prev, { studentId, date: e.target.value }]
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
        studentId,
      }
      await saveNewLesson(newLesson)
      setLessonContent('')
      setHomework('')
      setDrafts((prev) => prev.filter((draft) => draft.studentId !== studentId))
      toast('Lektion gespeichert')
    } catch (err) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="container container--lessons container--new-lesson">
      <h3 className="heading-4">
        Aktuelle Lektion
        <span>
          <input
            type="date"
            value={formatDateToDatabase(date)}
            onChange={handlerInputDate}
            onFocus={handlerShowPicker}
          />
        </span>
      </h3>
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
