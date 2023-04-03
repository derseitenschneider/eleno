import { useContext } from 'react'
import { ContextTypeClosestStudent } from '../types/types'
import { ClosestStudentContext } from '../contexts/ClosestStudentContext'

export function useClosestStudent() {
  const { closestStudentIndex, setClosestStudentIndex } =
    useContext<ContextTypeClosestStudent>(ClosestStudentContext)

  return { closestStudentIndex, setClosestStudentIndex }
}
