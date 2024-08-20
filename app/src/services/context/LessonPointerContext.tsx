import useGroupsQuery from '@/components/features/groups/groupsQuery'
import useStudentsQuery from '@/components/features/students/studentsQueries'
import type { LessonHolder } from '@/types/types'
import { sortLessonHolders } from '@/utils/sortStudents'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import calcNearestLessonIndex from '../../utils/getClosestStudentIndex'

export type ContextTypeLessonPointer = {
  nearestLessonPointer: number
  setNearestLessonPointer: React.Dispatch<React.SetStateAction<number>>
  currentLessonPointer: number
  setCurrentLessonPointer: React.Dispatch<React.SetStateAction<number>>
  lessonHolders: Array<LessonHolder>
  lessonHolderTypeIds: Array<string>
  currentLessonHolder: LessonHolder | null
  nearestLessonHolder: LessonHolder | null
}

export const LessonPointerContext = createContext<ContextTypeLessonPointer>({
  nearestLessonPointer: 0,
  setNearestLessonPointer: () => { },
  currentLessonPointer: 0,
  setCurrentLessonPointer: () => { },
  lessonHolders: [],
  lessonHolderTypeIds: [],
  currentLessonHolder: null,
  nearestLessonHolder: null,
})

export function LessonPointerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentLessonPointer, setCurrentLessonPointer] = useState(0)
  const [nearestLessonPointer, setNearestLessonPointer] = useState(0)

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

  useEffect(() => {
    if (lessonHolders) {
      setNearestLessonPointer(calcNearestLessonIndex(lessonHolders))
    }
  }, [lessonHolders])

  const currentLessonHolder = lessonHolders[currentLessonPointer] || null
  const nearestLessonHolder = lessonHolders[nearestLessonPointer] || null

  const value = useMemo(
    () => ({
      currentLessonPointer,
      setCurrentLessonPointer,
      nearestLessonPointer,
      setNearestLessonPointer,
      lessonHolders,
      lessonHolderTypeIds,
      currentLessonHolder,
      nearestLessonHolder,
    }),
    [
      currentLessonPointer,
      nearestLessonPointer,
      lessonHolders,
      lessonHolderTypeIds,
      currentLessonHolder,
      nearestLessonHolder,
    ],
  )
  return (
    <LessonPointerContext.Provider value={value}>
      {children}
    </LessonPointerContext.Provider>
  )
}

export const useLessonPointer = () => useContext(LessonPointerContext)
