import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js'
import { createContext, useEffect } from 'react'
import { useUser } from './UserContext'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import supabase from '../api/supabase'
import type { Message } from '@/types/types'
import { useQueryClient } from '@tanstack/react-query'

const MessagesContext = createContext(null)

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const user = useUser()
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()

  useEffect(() => {
    if (!user) return

    function handleRealtime(data: RealtimePostgresInsertPayload<Message>) {
      if (data.errors) {
        return fetchErrorToast()
      }
      queryClient.setQueryData(['messages'], (prev: Array<Message>) => {
        return [data.new, ...prev]
      })
    }

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        handleRealtime,
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user, fetchErrorToast, queryClient.setQueryData])

  return (
    <MessagesContext.Provider value={null}>{children}</MessagesContext.Provider>
  )
}
