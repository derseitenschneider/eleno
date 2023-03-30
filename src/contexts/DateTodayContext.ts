import { useOutletContext } from 'react-router-dom'
import { ContextTypeDateToday } from '../types/types'

export function useDateToday() {
  return useOutletContext<ContextTypeDateToday>()
}
