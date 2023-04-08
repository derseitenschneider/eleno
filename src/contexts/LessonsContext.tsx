import { ContextTypeLessons } from '../types/types'
import { createContext, useContext, useState } from 'react'
import { TLesson } from '../types/types'
import {
  deleteLessonSupabase,
  saveNewLessonSupabase,
  updateLessonSupabase,
} from '../supabase/lessons/lessons.supabase'
import { toast } from 'react-toastify'
import { formatDateToDatabase } from '../utils/formateDate'
import { useUser } from './UserContext'

export const LessonsContext = createContext<ContextTypeLessons>({
  lessons: [],
  setLessons: () => {},
  saveNewLesson: () => {},
  deleteLesson: () => {},
  updateLesson: () => {},
})

export const LessonsProvider = ({ children }) => {
  const { user } = useUser()
  const [lessons, setLessons] = useState<TLesson[]>([])

  const saveNewLesson = async (
    input: { lessonContent: string; homework: string },
    studentId: number,
    date: string
  ) => {
    const tempID = Math.floor(Math.random() * 10000000)
    const newLesson: TLesson = {
      ...input,
      studentId,
      date: formatDateToDatabase(date),
      id: tempID,
    }
    setLessons((lessons) => [...lessons, newLesson])

    try {
      const [data] = await saveNewLessonSupabase(newLesson, user.id)
      const newId = data.id
      setLessons((lessons) => {
        const newLessonsArray = lessons.map((lesson) =>
          lesson.id === tempID ? { ...lesson, id: newId } : lesson
        )
        return newLessonsArray
      })
      toast('Lektion gespeichert')
    } catch (err) {
      console.log(err)
    }
  }

  const deleteLesson = async (lessonId: number) => {
    setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId))
    try {
      await deleteLessonSupabase(lessonId)
      toast('Lektion gelöscht')
    } catch (err) {
      console.log(err)
    }
  }

  const updateLesson = async (updatedLesson: TLesson) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === updatedLesson.id
          ? { ...updatedLesson, date: formatDateToDatabase(updatedLesson.date) }
          : lesson
      )
    )
    try {
      await updateLessonSupabase(updatedLesson)
      toast('Änderungen gespeichert')
    } catch (err) {
      console.log('etwas ist schiefgelaufen')
    }
  }

  const value = {
    lessons,
    setLessons,
    saveNewLesson,
    deleteLesson,
    updateLesson,
  }

  return (
    <LessonsContext.Provider value={value}>{children}</LessonsContext.Provider>
  )
}

export const useLessons = () => useContext(LessonsContext)
