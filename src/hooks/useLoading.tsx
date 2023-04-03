import { useContext } from 'react'
import { ContextTypeLoading } from '../types/types'
import { LoadingContext } from '../contexts/LoadingContext'

export function useLoading() {
  const { loading, setLoading } = useContext<ContextTypeLoading>(LoadingContext)
  return { loading, setLoading }
}
