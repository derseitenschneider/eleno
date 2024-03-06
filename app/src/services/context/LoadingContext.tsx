import { createContext, useContext, useMemo, useState } from 'react'
import { ContextTypeLoading } from '../../types/types'

export const LoadingContext = createContext<ContextTypeLoading>({
  isLoading: true,
  setIsLoading: () => {},
})

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const value = useMemo(
    () => ({
      isLoading,
      setIsLoading,
    }),
    [isLoading, setIsLoading],
  )
  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
