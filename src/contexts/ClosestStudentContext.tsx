import { useOutletContext } from 'react-router-dom'
import { ContextTypeClosestStudent } from '../types/types'
import { createContext, useState, useEffect } from 'react'
import { useStudents } from '../hooks/useStudents'
import { getClosestStudentIndex } from '../utils/getClosestStudentIndex'

export const ClosestStudentContext = createContext<ContextTypeClosestStudent>({
  closestStudentIndex: 0,
  setClosestStudentIndex: () => {},
})

export const ClosestStudentProvider = ({ children }) => {
  const { students } = useStudents()
  const [closestStudentIndex, setClosestStudentIndex] = useState<number>(0)

  useEffect(() => {
    if (students) {
      setClosestStudentIndex(getClosestStudentIndex(students))
    }
  }, [students])

  return (
    <ClosestStudentContext.Provider
      value={{ closestStudentIndex, setClosestStudentIndex }}
    >
      {children}
    </ClosestStudentContext.Provider>
  )
}
