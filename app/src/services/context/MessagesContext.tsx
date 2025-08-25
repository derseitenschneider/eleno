import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js'
import { useQueryClient } from '@tanstack/react-query'
import { createContext, useEffect } from 'react'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import type { Message } from '@/types/types'
import supabase from '../api/supabase'
import { useUser } from './UserContext'

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
      queryClient.invalidateQueries({ queryKey: ['messages'] })
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
  }, [
    user,
    fetchErrorToast,
    queryClient.setQueryData,
    queryClient.invalidateQueries,
  ])

  return (
    <MessagesContext.Provider value={null}>{children}</MessagesContext.Provider>
  )
}
