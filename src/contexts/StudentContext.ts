import { useOutletContext } from 'react-router-dom'
import { ContextTypeStudents } from '../types/types'

export function useStudents() {
  return useOutletContext<ContextTypeStudents>()
}
