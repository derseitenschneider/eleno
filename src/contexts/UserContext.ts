import { useOutletContext } from 'react-router-dom'
import { ContextTypeUser } from '../types/types'

export function useUser() {
  return useOutletContext<ContextTypeUser>()
}
