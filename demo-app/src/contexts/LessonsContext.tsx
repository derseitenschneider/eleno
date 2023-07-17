import {
  ContextTypeLessons,
  TDraft,
  TLesson,
} from '../../../app/src/types/types'
import { createContext, useContext, useState } from 'react'

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

  const saveNewLesson = (lesson: TLesson) => {
    const newLesson: TLesson = {
      ...lesson,
    }

    setLessons((lessons) => [...lessons, newLesson])
  }

  const deleteLesson = (lessonId: number) => {
    setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId))
  }

  const updateLesson = (updatedLesson: TLesson) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === updatedLesson.id ? updatedLesson : lesson
      )
    )
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
