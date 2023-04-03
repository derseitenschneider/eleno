import { useContext } from 'react'
import { ContextTypeDateToday } from '../types/types'
import { DateTodayContext } from '../contexts/DateTodayContext'

export const useDateToday = () => {
  const { dateToday } = useContext<ContextTypeDateToday>(DateTodayContext)

  return { dateToday }
}
