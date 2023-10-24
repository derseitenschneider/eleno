import { createContext, useContext, useMemo, useState } from 'react'
import { ContextTypeLoading } from '../types/types'

export const LoadingContext = createContext<ContextTypeLoading>({
  loading: true,
  setLoading: () => {},
})

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const value = useMemo(
    () => ({
      loading,
      setLoading,
    }),
    [loading, setLoading],
  )
  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
