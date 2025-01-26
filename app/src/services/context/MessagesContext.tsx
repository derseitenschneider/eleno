import { createContext, useCallback, useContext, useState } from 'react'
import type { ContextTypeMessages, Message } from '../../types/types'
import supabase from '../api/supabase'
import type { RealtimePostgresUpdatePayload } from '@supabase/supabase-js'
import fetchErrorToast from '@/hooks/fetchErrorToast'
import { getMessagesApi } from '../api/messages.api'

export const MessagesContext = createContext<ContextTypeMessages>({
  messages: [],
})

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Array<Message> | null>(null)

  const getMessages = useCallback(async (userId: string) => {
    try {
      const messages = await getMessagesApi(userId)
      setMessages(messages)
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
    }
  }, [])

  function handleRealtime(data: RealtimePostgresUpdatePayload<Array<Message>>) {
    if (data.errors) {
      return fetchErrorToast()
    }
    setMessages(data.new)
  }

  supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
      },
      handleRealtime,
    )
    .subscribe()

  const value = {
    messages,
  }

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  )
}

export const useMessages = () => useContext(MessagesContext)
