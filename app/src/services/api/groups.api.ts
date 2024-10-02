import { isDemoMode } from '@/config'
import supabase from './supabase'
import type { Group, GroupPartial } from '@/types/types'
import mockGroups from './mock-db/mockGroups'

export const fetchGroupsApi = async (userId: string): Promise<Array<Group>> => {
  if (isDemoMode) return mockGroups
  const { data: groups, error } = await supabase
    .from('groups')
    .select('*')
    .eq('user_id', userId)
    .order('name')

  if (error) throw new Error(error.message)
  return groups as Array<Group>
}

export const createGroupApi = async (group: GroupPartial) => {
  if (isDemoMode) {
    const newGroup: Group = {
      ...group,
      user_id: 'mock-user-123456',
      created_at: new Date().toISOString(),
      id: Math.ceil(Math.random() * 1_000_000),
      archive: false,
    }
    mockGroups.push(newGroup)
    return [newGroup]
  }
  const { data: newGroup, error } = await supabase
    .from('groups')
    .insert(group)
    .select()
  if (error) throw new Error(error.message)
  return newGroup
}

export const deactivateGroupApi = async (groupIds: number[]) => {
  if (isDemoMode) {
    for (const groupId of groupIds) {
      const index = mockGroups.findIndex((group) => group.id === groupId)
      if (mockGroups[index]) {
        mockGroups[index] = { ...mockGroups[index], archive: true }
      }
    }
    return
  }

  const { error } = await supabase
    .from('groups')
    .update({ archive: true })
    .in('id', groupIds)

  if (error) throw new Error(error.message)
}

export const reactivateGroupsApi = async (groupIds: number[]) => {
  if (isDemoMode) {
    for (const groupId of groupIds) {
      const index = mockGroups.findIndex((group) => group.id === groupId)
      if (mockGroups[index]) {
        mockGroups[index] = { ...mockGroups[index], archive: false }
      }
    }
    return
  }

  const { error } = await supabase
    .from('groups')
    .update({ archive: false })
    .in('id', groupIds)

  if (error) throw new Error(error.message)
}

export const deleteGroupsApi = async (groupIds: number[]) => {
  if (isDemoMode) {
    for (const groupId of groupIds) {
      const index = mockGroups.findIndex((group) => group.id === groupId)
      if (mockGroups[index]) {
        mockGroups.splice(index, 1)
      }
    }
    return
  }

  const { error } = await supabase.from('groups').delete().in('id', groupIds)

  if (error) throw new Error(error.message)
}

export const updateGroupApi = async (group: Group) => {
  if (isDemoMode) {
    const index = mockGroups.findIndex((g) => g.id === group.id)
    if (mockGroups[index]) {
      mockGroups[index] = group
    }
    return group
  }

  const { data: updatedGroup, error } = await supabase
    .from('groups')
    .upsert(group)

  if (error) throw new Error(error.message)
  return updatedGroup
}

export const resetGroupsAPI = async (groupIds: number[]) => {
  if (isDemoMode) {
    for (const groupId of groupIds) {
      const index = mockGroups.findIndex((group) => group.id === groupId)
      if (mockGroups[index]) {
        mockGroups[index] = {
          ...mockGroups[index],
          dayOfLesson: null,
          startOfLesson: null,
          endOfLesson: null,
          durationMinutes: null,
          location: null,
        }
      }
    }
  }
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
