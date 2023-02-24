import { useOutletContext } from 'react-router-dom'
import { ContextTypeLessons } from '../types/types'

export function useLessons() {
  return useOutletContext<ContextTypeLessons>()
}
