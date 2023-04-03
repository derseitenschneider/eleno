import { useContext } from 'react'
import { LessonsContext } from '../contexts/LessonsContext'
import { ContextTypeLessons } from '../types/types'

export const useLessons = () => {
  const { lessons, setLessons } = useContext<ContextTypeLessons>(LessonsContext)

  return { lessons, setLessons }
}
