import { appConfig } from '@/config'
import supabase from './supabase'
import type { Group, GroupPartial } from '@/types/types'
import mockGroups from './mock-db/mockGroups'

export const fetchGroupsApi = async (userId: string): Promise<Array<Group>> => {
  if (appConfig.isDemoMode) return mockGroups
  const { data: groups, error } = await supabase
    .from('groups')
    .select('*')
    .eq('user_id', userId)
    .order('name')

  if (error) throw new Error(error.message)
  return groups as Array<Group>
}

export const createGroupApi = async (group: GroupPartial) => {
  const { data: newGroup, error } = await supabase
    .from('groups')
    .insert(group)
    .select()
  if (error) throw new Error(error.message)
  return newGroup
}

export const deactivateGroupApi = async (groupIds: number[]) => {
  const { error } = await supabase
    .from('groups')
    .update({ archive: true })
    .in('id', groupIds)

  if (error) throw new Error(error.message)
}

export const reactivateGroupsApi = async (groupIds: number[]) => {
  const { error } = await supabase
    .from('groups')
    .update({ archive: false })
    .in('id', groupIds)

  if (error) throw new Error(error.message)
}

export const deleteGroupsApi = async (groupIds: number[]) => {
  const { error } = await supabase.from('groups').delete().in('id', groupIds)

  if (error) throw new Error(error.message)
}

export const updateGroupApi = async (group: Group) => {
  const { data: updatedGroup, error } = await supabase
    .from('groups')
    .upsert(group)

  if (error) throw new Error(error.message)
  return updatedGroup
}

export const resetGroupsAPI = async (groupIds: number[]) => {
  const { data, error } = await supabase
    .from('groups')
    .update({
      dayOfLesson: null,
      startOfLesson: null,
      endOfLesson: null,
      durationMinutes: null,
      location: null,
    })
    .in('id', groupIds)
    .select('id')

  if (error) throw new Error(error.message)
  return data
}
