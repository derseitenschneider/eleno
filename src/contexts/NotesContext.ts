import { useOutletContext } from 'react-router-dom'
import { ContextTypeNotes } from '../types/types'

export function useNotes() {
  return useOutletContext<ContextTypeNotes>()
}
