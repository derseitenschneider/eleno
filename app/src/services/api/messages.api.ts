import type { Profile, UserMeta } from '../../types/types'
import supabase from './supabase'

export const getMessagesApi = async (userId: string) => {
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('recipient', userId)

  if (error) throw new Error(error.message)
  return messages
}

export const updateMessageApi = async (data: UserMeta) => {
  const { error } = await supabase.auth.updateUser({ data })
  if (error) throw new Error(error.message)
}
