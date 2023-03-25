import { useOutletContext } from 'react-router-dom'
import { ContextTypeTodos } from '../types/types'

export function useTodos() {
  return useOutletContext<ContextTypeTodos>()
}
