import { ContextTypeLoading } from '../types/types'
import { createContext, useContext, useState, FunctionComponent } from 'react'

export const LoadingContext = createContext<ContextTypeLoading>({
  loading: true,
  setLoading: () => {},
})

export const LoadingProvider: FunctionComponent<{
  children: React.ReactNode
}> = ({ children }) => {
  const [loading, setLoading] = useState(true)

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
