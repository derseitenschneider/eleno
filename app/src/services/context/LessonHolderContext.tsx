import useGroupsQuery from '@/components/features/groups/groupsQuery'
import useStudentsQuery from '@/components/features/students/studentsQueries'
import type { LessonHolder } from '@/types/types'
import { sortLessonHolders } from '@/utils/sortLessonHolders'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import calcNearestLessonIndex from '../../utils/calcNearestHolderIndex'

export type ContextTypeLessonHolder = {
  nearestLessonPointer: number
  setNearestLessonPointer: React.Dispatch<React.SetStateAction<number>>
  currentLessonPointer: number
  setCurrentLessonPointer: React.Dispatch<React.SetStateAction<number>>
  activeSortedHolders: Array<LessonHolder>
  activeSortedHolderTypeIds: Array<string>
  inactiveLessonHolders: Array<LessonHolder>
  currentLessonHolder: LessonHolder | null
  nearestLessonHolder: LessonHolder | null
}

export const LessonHolderContext = createContext<ContextTypeLessonHolder>({
  nearestLessonPointer: 0,
  setNearestLessonPointer: () => {},
  currentLessonPointer: 0,
  setCurrentLessonPointer: () => {},
  activeSortedHolders: [],
  activeSortedHolderTypeIds: [],
  inactiveLessonHolders: [],
  currentLessonHolder: null,
  nearestLessonHolder: null,
})

export function LessonHolderProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentLessonPointer, setCurrentLessonPointer] = useState(0)
  const [nearestLessonPointer, setNearestLessonPointer] = useState(0)

  const allStudents: Array<LessonHolder> | undefined =
    useStudentsQuery().data?.map((student) => ({ type: 's', holder: student }))

  const allGroups: Array<LessonHolder> | undefined = useGroupsQuery().data?.map(
    (group) => ({ type: 'g', holder: group }),
  )

  const activeStudents: Array<LessonHolder> | undefined = allStudents?.filter(
    (student) => !student.holder.archive,
  )

  const activeGroups: Array<LessonHolder> | undefined = allGroups?.filter(
    (group) => !group.holder.archive,
  )

  const inactiveStudents = allStudents?.filter(
    (student) => student.holder.archive,
  )
  const inactiveGroups = allGroups?.filter((group) => group.holder.archive)

  const activeLessonHolders: Array<LessonHolder> = useMemo(() => {
    return [...(activeStudents || []), ...(activeGroups || [])]
  }, [activeStudents, activeGroups])

  const inactiveLessonHolders: Array<LessonHolder> = useMemo(() => {
    return [...(inactiveStudents || []), ...(inactiveGroups || [])]
  }, [inactiveStudents, inactiveGroups])

  const activeSortedHolders: Array<LessonHolder> = useMemo(
    () => sortLessonHolders(activeLessonHolders),
    [activeLessonHolders],
  )

  const activeSortedHolderTypeIds = activeSortedHolders.map(
    (lessonHolder) => `${lessonHolder.type}-${lessonHolder.holder.id}`,
  )

  useEffect(() => {
    if (activeSortedHolders) {
      setNearestLessonPointer(calcNearestLessonIndex(activeSortedHolders))
    }
  }, [activeSortedHolders])

  useEffect(() => {
    setCurrentLessonPointer(nearestLessonPointer)
  }, [nearestLessonPointer])

  const currentLessonHolder = activeSortedHolders[currentLessonPointer] || null
  const nearestLessonHolder = activeSortedHolders[nearestLessonPointer] || null

  const value = useMemo(
    () => ({
      currentLessonPointer,
      setCurrentLessonPointer,
      nearestLessonPointer,
      setNearestLessonPointer,
      activeSortedHolders,
      activeSortedHolderTypeIds,
      inactiveLessonHolders,
      currentLessonHolder,
      nearestLessonHolder,
    }),
    [
      currentLessonPointer,
      nearestLessonPointer,
      activeSortedHolders,
      activeSortedHolderTypeIds,
      inactiveLessonHolders,
      currentLessonHolder,
      nearestLessonHolder,
    ],
  )
  return (
    <LessonHolderContext.Provider value={value}>
      {children}
    </LessonHolderContext.Provider>
  )
}

export const useLessonHolders = () => useContext(LessonHolderContext)
