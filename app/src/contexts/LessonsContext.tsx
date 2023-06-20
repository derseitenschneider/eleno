import { ContextTypeLessons, TDraft } from '../types/types'
import { createContext, useContext, useState } from 'react'
import { TLesson } from '../types/types'
import {
  deleteLessonSupabase,
  saveNewLessonSupabase,
  updateLessonSupabase,
} from '../supabase/lessons/lessons.supabase'
import { formatDateToDatabase } from '../utils/formateDate'
import { useUser } from './UserContext'

export const LessonsContext = createContext<ContextTypeLessons>({
  lessons: [],
  drafts: [],
  setDrafts: () => {},
  setLessons: () => {},
  saveNewLesson: () => new Promise(() => {}),
  deleteLesson: () => new Promise(() => {}),
  updateLesson: () => new Promise(() => {}),
})

export const LessonsProvider = ({ children }) => {
  const { user } = useUser()
  const [lessons, setLessons] = useState<TLesson[]>([])
  const [drafts, setDrafts] = useState<TDraft[]>([])

  const saveNewLesson = async (
    input: { lessonContent: string; homework: string },
    studentId: number,
    date: string
  ): Promise<void> => {
    const tempID = Math.floor(Math.random() * 10000000)
    const tempLesson: TLesson = {
      ...input,
      studentId,
      date: formatDateToDatabase(date),
      id: tempID,
    }

    try {
      const [data] = await saveNewLessonSupabase(tempLesson, user.id)
      setLessons((lessons) => [...lessons, data])
    } catch (error) {
      throw new Error(error)
    }
  }

  const deleteLesson = async (lessonId: number) => {
    try {
      await deleteLessonSupabase(lessonId)
      setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId))
    } catch (err) {
      throw new Error(err)
    }
  }

  const updateLesson = async (updatedLesson: TLesson) => {
    try {
      await updateLessonSupabase(updatedLesson)
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === updatedLesson.id
            ? {
                ...updatedLesson,
                date: formatDateToDatabase(updatedLesson.date),
              }
            : lesson
        )
      )
    } catch (error) {
      throw new Error(error)
    }
  }

  const value = {
    lessons,
    setLessons,
    drafts,
    setDrafts,
    saveNewLesson,
    deleteLesson,
    updateLesson,
  }

  return (
    <LessonsContext.Provider value={value}>{children}</LessonsContext.Provider>
  )
}

export const useLessons = () => useContext(LessonsContext)
