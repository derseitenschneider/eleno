import { useOutletContext } from 'react-router-dom'
import { ContextTypeClosestStudent } from '../types/types'
import { createContext, useState, useEffect, useContext } from 'react'
import { useStudents } from '../contexts/StudentContext'
import { getClosestStudentIndex } from '../utils/getClosestStudentIndex'

export const ClosestStudentContext = createContext<ContextTypeClosestStudent>({
  closestStudentIndex: 0,
  setClosestStudentIndex: () => {},
})

// [ ] Fix modal design when deleting via button

export const ClosestStudentProvider = ({ children }) => {
  const { students } = useStudents()
  const [closestStudentIndex, setClosestStudentIndex] = useState<number>(0)

  // FIXME: reset closest student index after changing it e.g. by clicking on student tag in todos
  useEffect(() => {
    if (students) {
      setClosestStudentIndex(getClosestStudentIndex(students))
    }
  }, [students])

  const value = { closestStudentIndex, setClosestStudentIndex }

  return (
    <ClosestStudentContext.Provider
      value={{ closestStudentIndex, setClosestStudentIndex }}
    >
      {children}
    </ClosestStudentContext.Provider>
  )
}

export const useClosestStudent = () => useContext(ClosestStudentContext)
