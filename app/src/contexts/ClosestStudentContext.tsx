import { ContextTypeClosestStudent } from '../types/types'
import { createContext, useState, useEffect, useContext } from 'react'
import { useStudents } from './StudentContext'
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

export const useClosestStudent = () => useContext(ClosestStudentContext)
