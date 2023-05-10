import { useOutletContext } from 'react-router-dom'
import { ContextTypeLoading } from '../types/types'
import { createContext, useContext, useState } from 'react'

export const LoadingContext = createContext<ContextTypeLoading>({
  loading: true,
  setLoading: () => {},
})

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
