import useGroupsQuery from '@/components/features/groups/groupsQuery'
import useStudentsQuery from '@/components/features/students/studentsQueries'
import { LessonHolder } from '@/types/types'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import calcNearestLessonIndex from '../../utils/getClosestStudentIndex'

export type ContextTypeLessonPointer = {
  lessonPointer: number
  setLessonPointer: React.Dispatch<React.SetStateAction<number>>
}

export const LessonPointerContext = createContext<ContextTypeLessonPointer>({
  lessonPointer: 0,
  setLessonPointer: () => { },
})

// export type CanHaveLesson = {
//   dayOfLesson?:
// }

export function LessonPointerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const students = useStudentsQuery().data
  const groups = useGroupsQuery().data
  let lessonHolders: Array<LessonHolder> = []
  if (students) {
    lessonHolders = [...lessonHolders, ...students]
  }
  if (groups) {
    lessonHolders = [...lessonHolders, ...groups]
  }
  const [lessonPointer, setLessonPointer] = useState(0)

  useEffect(() => {
    if (lessonHolders) {
      setLessonPointer(calcNearestLessonIndex(lessonHolders))
    }
  }, [lessonHolders])

  const value = useMemo(
    () => ({
      lessonPointer,
      setLessonPointer,
    }),
    [lessonPointer],
  )
  return (
    <LessonPointerContext.Provider value={value}>
      {children}
    </LessonPointerContext.Provider>
  )
}

export const useLessonPointer = () => useContext(LessonPointerContext)
