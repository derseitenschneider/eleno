import { ContextTypeClosestStudent } from '../../../app/src/types/types'
import { createContext, useState, useEffect, useContext } from 'react'
import { useStudents } from './StudentContext'

import { getClosestStudentIndex } from '../../../app/src/utils/getClosestStudentIndex'

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

  const value = { closestStudentIndex, setClosestStudentIndex }

  return (
    <ClosestStudentContext.Provider value={value}>
      {children}
    </ClosestStudentContext.Provider>
  )
}

export const useClosestStudent = () => useContext(ClosestStudentContext)
