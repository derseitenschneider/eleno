import { createContext, useContext, useMemo, useState } from 'react'
import type { ContextTypeLessonPreps, Lesson } from '../../types/types'

export const LessonPrepContext = createContext<ContextTypeLessonPreps>({
  selectedForUpdating: null,
  setSelectedForUpdating: () => null,

  selectedForUsing: null,
  setSelectedForUsing: () => null,
})

export function LessonPrepProvider({
  children,
}: { children: React.ReactNode }) {
  const [selectedForUpdating, setSelectedForUpdating] = useState<Lesson | null>(
    null,
  )
  const [selectedForUsing, setSelectedForUsing] = useState<Lesson | null>(null)

  const value = useMemo(
    () => ({
      selectedForUpdating,
      setSelectedForUpdating,
      selectedForUsing,
      setSelectedForUsing,
    }),
    [selectedForUpdating, selectedForUsing],
  )
  return (
    <LessonPrepContext.Provider value={value}>
      {children}
    </LessonPrepContext.Provider>
  )
}

export const usePrepLessons = () => useContext(LessonPrepContext)
