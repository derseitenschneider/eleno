import type { Message, Profile, UserMeta } from '../../types/types'
import supabase from './supabase'

export const getMessagesApi = async (userId: string) => {
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('recipient', userId)
    .order('created_at', {
      ascending: false,
    })

  if (error) throw new Error(error.message)
  return messages
}

export const updateMessageApi = async (message: Message) => {
  const { error } = await supabase
    .from('messages')
    .update({ ...message })
    .eq('id', message.id)

  if (error) throw new Error(error.message)
}

export const deleteMessageApi = async (id: string) => {
  const { error } = await supabase.from('messages').delete().eq('id', id)

  if (error) throw new Error(error.message)
}
