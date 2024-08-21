import { createContext, useContext, useMemo, useState } from 'react'
import type { ContextTypeDrafts, Draft } from '../../types/types'

export const DraftsContext = createContext<ContextTypeDrafts>({
  drafts: [],
  setDrafts: () => {},
})

export function DraftsProvider({ children }: { children: React.ReactNode }) {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const value = useMemo(
    () => ({
      drafts,
      setDrafts,
    }),
    [drafts],
  )
  return (
    <DraftsContext.Provider value={value}>{children}</DraftsContext.Provider>
  )
}

export const useDrafts = () => useContext(DraftsContext)
