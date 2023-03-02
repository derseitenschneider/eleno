import { useOutletContext } from 'react-router-dom'
import { ContextTypeLoading } from '../types/types'

export function useLoading() {
  return useOutletContext<ContextTypeLoading>()
}
