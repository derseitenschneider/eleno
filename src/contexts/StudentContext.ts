import { useOutletContext } from 'react-router-dom'
import { ContextType } from '../types/types'

export function useStudents() {
  return useOutletContext<ContextType>()
}
