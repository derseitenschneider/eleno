import './newLesson.style.scss'

import {
  FunctionComponent,
  useState,
  useEffect,
  useRef,
  HtmlHTMLAttributes,
} from 'react'
import Button from '../../button/Button.component'

import { toast } from 'react-toastify'
import { useLessons } from '../../../contexts/LessonsContext'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import { formatDateToDatabase } from '../../../utils/formateDate'

interface NewLessonProps {
  studentId: number
}

const lessonData = { lessonContent: '', homework: '' }

const NewLesson: FunctionComponent<NewLessonProps> = ({ studentId }) => {
  const [date, setDate] = useState('')
  const [input, setInput] = useState(lessonData)
  const { saveNewLesson, drafts, setDrafts } = useLessons()
  const [isPending, setIsPending] = useState(false)
  const inputRef = useRef(null)
  // [ ] fix date input issue
  // [ ] take focus state from save button when saved
  useEffect(() => {
    const today = new Date()
      .toLocaleDateString('de-CH')
      .split('.')
      .map((e) => e.padStart(2, '0'))
      .join('.')
    if (drafts.some((draft) => draft.studentId === studentId)) {
      const currentDraft = drafts.find((draft) => draft.studentId === studentId)
      setInput({
        lessonContent: currentDraft.lessonContent,
        homework: currentDraft.homework || '',
      })
      if (currentDraft.date) {
        setDate(currentDraft.date)
      } else {
        setDate(today)
      }
    } else {
      setInput(lessonData)
      setDate(today)
    }
  }, [studentId])

  useEffect(() => {
    inputRef.current.focus()
  }, [studentId])

  const handlerInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = e.currentTarget.name
    const value = e.currentTarget.value
    setInput((prev) => {
      return { ...prev, [name]: value }
    })
    setDrafts((prev) => {
      if (prev.some((draft) => draft.studentId === studentId)) {
        return prev.map((draft) =>
          draft.studentId === studentId
            ? { ...draft, [name]: value, date }
            : draft
        )
      } else {
        return [...prev, { studentId, [name]: value, date }]
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

  const handlerSaveLesson = async () => {
    if (!date) {
      toast('Die Lektion hat kein Datum', { type: 'error' })
      return
    }
    if (!input.lessonContent) {
      toast('Die Lektion hat keinen Lektionsinhalt', { type: 'error' })
      return
    }
    try {
      setIsPending(true)
      await saveNewLesson(input, studentId, date)
      setInput(lessonData)
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
          <h4 className="heading-5">Lektion</h4>
          <textarea
            name="lessonContent"
            autoFocus={true}
            value={input.lessonContent}
            onChange={handlerInput}
            ref={inputRef}
            className={`${isPending ? 'loading' : ''}`}
          ></textarea>
        </div>
        <div className="row-right">
          <h4 className="heading-5">Hausaufgaben</h4>
          <textarea
            name="homework"
            value={input.homework}
            onChange={handlerInput}
            className={`${isPending ? 'loading' : ''}`}
          ></textarea>
        </div>
      </div>
      <Button
        type="button"
        btnStyle="primary"
        label="Speichern"
        className="btn--save"
        handler={handlerSaveLesson}
      />
    </div>
  )
}

export default NewLesson
