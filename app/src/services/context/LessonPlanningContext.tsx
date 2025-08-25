import { createContext, useContext, useMemo, useState } from 'react'
import type { ContextTypeLessonPlanning, Lesson } from '../../types/types'

export const LessonPlanningContext = createContext<ContextTypeLessonPlanning>({
  selectedForUpdating: null,
  setSelectedForUpdating: () => null,
})

export function LessonPlanningProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [selectedForUpdating, setSelectedForUpdating] = useState<Lesson | null>(
    null,
  )

  const value = useMemo(
    () => ({
      selectedForUpdating,
      setSelectedForUpdating,
    }),
    [selectedForUpdating],
  )
  return (
    <LessonPlanningContext.Provider value={value}>
      {children}
    </LessonPlanningContext.Provider>
  )
}

export const usePlanLessons = () => useContext(LessonPlanningContext)
