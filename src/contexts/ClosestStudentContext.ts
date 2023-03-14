import { useOutletContext } from 'react-router-dom'
import { ContextTypeClosestStudent } from '../types/types'

export function useClosestStudent() {
  return useOutletContext<ContextTypeClosestStudent>()
}
