import { createContext, useContext, useMemo, useState } from 'react'
import type { ContextTypeLoading } from '../../types/types'

export const LoadingContext = createContext<ContextTypeLoading>({
  isLoading: true,
  setIsLoading: () => {},
})

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const value = useMemo(
    () => ({
      isLoading,
      setIsLoading,
    }),
    [isLoading],
  )
  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
