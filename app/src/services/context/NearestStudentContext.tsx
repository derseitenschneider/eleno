import useStudentsQuery from "@/components/features/students/studentsQuery"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { ContextTypeClosestStudent as ContextTypeNearestStudent } from "../../types/types"
import calcNearestStudentIndex from "../../utils/getClosestStudentIndex"
import { useStudents } from "./StudentContext"

export const NearestStudentContext = createContext<ContextTypeNearestStudent>({
  nearestStudentIndex: 0,
  setNearestStudentIndex: () => {},
})

export function NearestStudentProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const students = useStudentsQuery().data
  const [nearestStudentIndex, setNearestStudentIndex] = useState(0)

  useEffect(() => {
    if (students) {
      setNearestStudentIndex(calcNearestStudentIndex(students))
    }
  }, [students])

  const value = useMemo(
    () => ({ nearestStudentIndex, setNearestStudentIndex }),
    [nearestStudentIndex],
  )
  return (
    <NearestStudentContext.Provider value={value}>
      {children}
    </NearestStudentContext.Provider>
  )
}

export const useNearestStudent = () => useContext(NearestStudentContext)
