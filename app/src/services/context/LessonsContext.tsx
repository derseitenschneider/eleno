import { createContext, useContext, useMemo, useState } from "react"
import type { ContextTypeLessons, Draft } from "../../types/types"

export const LessonsContext = createContext<ContextTypeLessons>({
  drafts: [],
  setDrafts: () => { },
})

export function LessonsProvider({ children }: { children: React.ReactNode }) {
  const [drafts, setDrafts] = useState<Draft[]>([])

  const value = useMemo(
    () => ({
      drafts,
      setDrafts,
    }),
    [drafts],
  )

  return (
    <LessonsContext.Provider value={value}>{children}</LessonsContext.Provider>
  )
}

export const useLessons = () => useContext(LessonsContext)
