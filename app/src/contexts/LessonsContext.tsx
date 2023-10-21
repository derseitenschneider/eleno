import { ContextTypeLessons, TDraft } from '../types/types'
import { createContext, useContext, useState } from 'react'
import { TLesson } from '../types/types'
import {
  deleteLessonSupabase,
  fetchAllLessonsSupabase,
  saveNewLessonSupabase,
  updateLessonSupabase,
} from '../supabase/lessons.supabase'
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
  getAllLessons: () => new Promise(() => []),
})

export const LessonsProvider = ({ children }) => {
  const { user } = useUser()
  const [lessons, setLessons] = useState<TLesson[]>([])
  const [drafts, setDrafts] = useState<TDraft[]>([])

  const saveNewLesson = async (lesson: TLesson): Promise<void> => {
    const tempLesson: TLesson = {
      ...lesson,
      date: formatDateToDatabase(lesson.date),
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

  const getAllLessons = async (studentId: number) => {
    try {
      const allLessons = await fetchAllLessonsSupabase(studentId)
      return allLessons
    } catch (error) {
      throw new Error(error.mesage)
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
    getAllLessons,
  }

  return (
    <LessonsContext.Provider value={value}>{children}</LessonsContext.Provider>
  )
}

export const useLessons = () => useContext(LessonsContext)
