import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ContextTypeDateToday } from '../types/types'

export const DateTodayContext = createContext<ContextTypeDateToday>({
  dateToday: '',
})

export function DateTodayProvider({ children }: { children: React.ReactNode }) {
  const [dateToday, setDateToday] = useState('')
  useEffect(() => {
    const today = new Date().toLocaleDateString()
    setDateToday(today)
  }, [])
  const value = useMemo(() => ({ dateToday }), [dateToday])
  return (
    <DateTodayContext.Provider value={value}>
      {children}
    </DateTodayContext.Provider>
  )
}

export const useDateToday = () => useContext(DateTodayContext)
