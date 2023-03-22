import './newLesson.style.scss'

import { FunctionComponent, useState, useEffect } from 'react'
import Button from '../../button/Button.component'
import { TLesson } from '../../../types/types'
import { formatDateToDatabase } from '../../../utils/formateDate'

import { toast } from 'react-toastify'
import { useLessons } from '../../../contexts/LessonsContext'
import { postLessonSupabase } from '../../../supabase/lessons/lessons.supabase'
import { useUser } from '../../../contexts/UserContext'

interface NewLessonProps {
  studentId: number
}

const lessonData = { lessonContent: '', homework: '' }

const NewLesson: FunctionComponent<NewLessonProps> = ({ studentId }) => {
  const [date, setDate] = useState('')
  const [input, setInput] = useState(lessonData)
  const { setLessons } = useLessons()
  const { user } = useUser()

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

    const tempID = Math.floor(Math.random() * 10000000)
    const newLesson: TLesson = {
      ...input,
      studentId,
      date: formatDateToDatabase(date),
      id: tempID,
    }

    // const tempNewLessons: TLesson[] = [...lessons, newLesson]
    setLessons((lessons) => [...lessons, newLesson])

    const postNewLesson = async () => {
      const [data] = await postLessonSupabase(newLesson, user.id)
      const newId = data.id

      setLessons((lessons) => {
        const newLessonsArray = lessons.map((lesson) =>
          lesson.id === tempID ? { ...lesson, id: newId } : lesson
        )
        return newLessonsArray
      })
    }
    postNewLesson()
    setInput(lessonData)
    toast('Lektion gespeichert')
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
