import { ContextTypeLessons } from '../types/types'
import { createContext, useState } from 'react'
import { TLesson } from '../types/types'

export const LessonsContext = createContext<ContextTypeLessons>({
  lessons: [],
  setLessons: () => {},
})

export const LessonsProvider = ({ children }) => {
  const [lessons, setLessons] = useState<TLesson[]>([])

  return (
    <LessonsContext.Provider value={{ lessons, setLessons }}>
      {children}
    </LessonsContext.Provider>
  )
}
