import useGroupsQuery from '@/components/features/groups/groupsQuery'
import useStudentsQuery from '@/components/features/students/studentsQueries'
import { LessonHolder } from '@/types/types'
import { sortLessonHolders } from '@/utils/sortStudents'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import calcNearestLessonIndex from '../../utils/getClosestStudentIndex'

export type ContextTypeLessonPointer = {
  lessonPointer: number
  setLessonPointer: React.Dispatch<React.SetStateAction<number>>
  lessonHolders: Array<LessonHolder>
  lessonHolderTypeIds: Array<string>
}

export const LessonPointerContext = createContext<ContextTypeLessonPointer>({
  lessonPointer: 0,
  setLessonPointer: () => { },
  lessonHolders: [],
  lessonHolderTypeIds: [],
})

export function LessonPointerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [lessonPointer, setLessonPointer] = useState(0)
  const activeStudents: Array<LessonHolder> | undefined = useStudentsQuery()
    .data?.filter((student) => !student.archive)
    .map((student) => ({ type: 's', holder: student }))

  const activeGroups: Array<LessonHolder> | undefined = useGroupsQuery()
    .data?.filter((group) => !group.archive)
    .map((group) => ({ type: 'g', holder: group }))

  const lessonHolders: Array<LessonHolder> = useMemo(
    () =>
      sortLessonHolders([...(activeStudents || []), ...(activeGroups || [])]),
    [activeStudents, activeGroups],
  )

  const lessonHolderTypeIds = lessonHolders.map(
    (lessonHolder) => `${lessonHolder.type}-${lessonHolder.holder.id}`,
  )

  // useEffect(() => {
  //   if (lessonHolders) {
  //     setLessonPointer(calcNearestLessonIndex(lessonHolders))
  //   }
  // }, [lessonHolders])

  const value = useMemo(
    () => ({
      lessonPointer,
      setLessonPointer,
      lessonHolders,
      lessonHolderTypeIds,
    }),
    [lessonPointer, lessonHolders, lessonHolderTypeIds],
  )
  return (
    <LessonPointerContext.Provider value={value}>
      {children}
    </LessonPointerContext.Provider>
  )
}

export const useLessonPointer = () => useContext(LessonPointerContext)
