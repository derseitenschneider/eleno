import { ContextTypeDateToday } from '../../../app/src/types/types'
import { createContext, useState, useEffect, useContext } from 'react'

export const DateTodayContext = createContext<ContextTypeDateToday>({
  dateToday: '',
})

export const DateTodayProvider = ({ children }) => {
  const [dateToday, setDateToday] = useState('')
  useEffect(() => {
    const today = new Date().toLocaleDateString()
    setDateToday(today)
  }, [])

  return (
    <DateTodayContext.Provider value={{ dateToday }}>
      {children}
    </DateTodayContext.Provider>
  )
}

export const useDateToday = () => useContext(DateTodayContext)
