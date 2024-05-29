import { createContext, useContext, useMemo, useState } from "react"
import type { ContextTypeStudents } from "../../types/types"

import { sortStudentsDateTime } from "../../utils/sortStudents"
import useStudentsQuery from "@/components/features/students/studentsQuery"

export const StudentsContext = createContext<ContextTypeStudents>({
  currentStudentIndex: 0,
  setCurrentStudentIndex: () => {},
  currentStudentId: 0,
  activeStudents: [],
  activeSortedStudentIds: [],
  inactiveStudents: [],
})

export function StudentsProvider({ children }: { children: React.ReactNode }) {
  const students = useStudentsQuery().data
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0)

  const activeStudents = students?.filter((student) => !student.archive)
  const inactiveStudents = students?.filter((student) => student.archive)

  const activeSortedStudentIds: number[] = students
    ? sortStudentsDateTime(students?.filter((student) => !student.archive)).map(
        (student) => student.id || 0,
      )
    : []

  const currentStudentId = activeSortedStudentIds[currentStudentIndex]

  const value = useMemo(
    () => ({
      currentStudentIndex,
      setCurrentStudentIndex,
      currentStudentId,
      activeStudents,
      inactiveStudents,
      activeSortedStudentIds,
    }),
    [
      currentStudentIndex,
      currentStudentId,
      activeStudents,
      inactiveStudents,
      activeSortedStudentIds,
    ],
  )

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  )
}

export const useStudents = () => useContext(StudentsContext)
