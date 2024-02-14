import {
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import { Tables } from '../../types/supabase'
import {
  createNewGroupSupabase,
  deleteGroupsSupabase,
  updateGroupSupabase,
} from '../api/groups.api'

export interface IGroupsContext {
  groups: Array<Tables<'groups'>>
  setGroups: React.Dispatch<SetStateAction<Array<Tables<'groups'>>>>
  createNewGroup: (group: Tables<'groups'>) => void
  deleteGroups: (id: number[]) => void
  editGroup: (group: Tables<'groups'>) => void
}

export const GroupsContext = createContext<IGroupsContext>({
  groups: [],
  setGroups: () => {},
  createNewGroup: () => {},
  deleteGroups: () => {},
  editGroup: () => {},
})

export function GroupsProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Array<Tables<'groups'>>>([])

  // const mode = import.meta.env.VITE_MODE

  const createNewGroup = useCallback(
    async (group: Tables<'groups'>): Promise<void> => {
      // if (mode === 'demo') {
      //   setLessons((prev) => [...prev, tempLesson])
      //   return
      // }

      try {
        const [data] = await createNewGroupSupabase(group)
        setGroups((prev) => [...prev, data])
      } catch (error) {
        throw new Error(error)
      }
    },
    [],
  )

  const deleteGroups = useCallback(async (ids: number[]) => {
    // if (mode === 'demo') {
    //   setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId))
    //   return
    // }
    try {
      await deleteGroupsSupabase(ids)
      setGroups((prev) => prev.filter((group) => !ids.includes(group.id)))
    } catch (err) {
      throw new Error(err)
    }
  }, [])

  const editGroup = useCallback(async (group: Tables<'groups'>) => {
    // if (mode === 'demo') {
    //   setLessons((prev) =>
    //     prev.map((lesson) =>
    //       lesson.id === updatedLesson.id
    //         ? {
    //             ...updatedLesson,
    //             date: formatDateToDatabase(updatedLesson.date),
    //           }
    //         : lesson,
    //     ),
    //   )
    // }
    try {
      await updateGroupSupabase(group)
      setGroups((prev) =>
        prev.map((oldGroup) => (oldGroup.id === group.id ? group : oldGroup)),
      )
    } catch (error) {
      throw new Error(error)
    }
  }, [])

  const value = useMemo(
    () => ({
      groups,
      createNewGroup,
      deleteGroups,
      editGroup,
      setGroups,
    }),
    [groups, createNewGroup, deleteGroups, editGroup, setGroups],
  )

  return (
    <GroupsContext.Provider value={value}>{children}</GroupsContext.Provider>
  )
}

export const useGroups = () => useContext(GroupsContext)
