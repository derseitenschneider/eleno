import './newLesson.style.scss'

import { FunctionComponent, useState, useEffect } from 'react'
import Button from '../../button/Button.component'

import { toast } from 'react-toastify'
import { useLessons } from '../../../contexts/LessonsContext'

// [ ] on save open tab with most current/new lesson

interface NewLessonProps {
  studentId: number
}

const lessonData = { lessonContent: '', homework: '' }

const NewLesson: FunctionComponent<NewLessonProps> = ({ studentId }) => {
  const [date, setDate] = useState('')
  const [input, setInput] = useState(lessonData)
  const { saveNewLesson } = useLessons()

  useEffect(() => {
    const today = new Date()
      .toLocaleDateString('de-CH')
      .split('.')
      .map((e) => e.padStart(2, '0'))
      .join('.')
    setDate(today)
  }, [])

  const handlerInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = e.currentTarget.name
    const value = e.currentTarget.value
    setInput((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const handlerSaveLesson = () => {
    if (!date) {
      toast('Die Lektion hat kein Datum', { type: 'error' })
      return
    }
    if (!input.lessonContent) {
      toast('Die Lektion hat keinen Lektionsinhalt', { type: 'error' })
      return
    }
    saveNewLesson(input, studentId, date)

    setInput(lessonData)
  }

  // [ ] create todo functionallity from here
  // [ ] save state locally to preserve it on page refresh but delete it when student-index changes or page is left

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
          {/* // [ ] focus on textarea when student changes */}
          <textarea
            name="lessonContent"
            autoFocus={true}
            value={input.lessonContent}
            onChange={handlerInput}
          ></textarea>
        </div>
        <div className="row-right">
          <h4 className="heading-5">Hausaufgaben</h4>
          <textarea
            name="homework"
            value={input.homework}
            onChange={handlerInput}
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
