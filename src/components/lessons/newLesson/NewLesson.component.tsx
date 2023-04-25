import './newLesson.style.scss'

import { FunctionComponent, useState, useEffect, useRef } from 'react'
import Button from '../../button/Button.component'

import { toast } from 'react-toastify'
import { useLessons } from '../../../contexts/LessonsContext'

// [ ] on save open tab with most current/new lesson

// [ ] find a way to store new lesson when navigate to other page

interface NewLessonProps {
  studentId: number
}

const lessonData = { lessonContent: '', homework: '' }

const NewLesson: FunctionComponent<NewLessonProps> = ({ studentId }) => {
  const [date, setDate] = useState('')
  const [input, setInput] = useState(lessonData)
  const { saveNewLesson } = useLessons()
  const [isPending, setIsPending] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const today = new Date()
      .toLocaleDateString('de-CH')
      .split('.')
      .map((e) => e.padStart(2, '0'))
      .join('.')
    setDate(today)
  }, [])

  useEffect(() => {
    inputRef.current.focus()
  }, [studentId])

  const handlerInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = e.currentTarget.name
    const value = e.currentTarget.value
    setInput((prev) => {
      return { ...prev, [name]: value }
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
      toast('Etwas ist schiefgelaufen. Versuchs nochmal!', { type: 'error' })
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
            type="text"
            value={date}
            onChange={(e) => setDate(e.currentTarget.value)}
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
