import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { getMessagesApi } from '@/services/api/messages.api'
import supabase from '@/services/api/supabase'
import { useUser } from '@/services/context/UserContext'
import type { Message } from '@/types/types'
import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

// Test
export default function useMessagesQuery() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const { user } = useUser()
  const result = useQuery({
    queryKey: ['messages'],
    queryFn: () => getMessagesApi(user?.id || ''),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
  })

  useEffect(() => {
    if (!user) return

    function handleRealtime(data: RealtimePostgresInsertPayload<Message>) {
      if (data.errors) {
        return fetchErrorToast()
      }
      queryClient.setQueryData(
        ['messages'],
        (oldData: Array<Message> | undefined) => {
          if (!oldData?.find((message) => message.id === data.new?.id)) {
            return [data.new, ...(oldData || [])]
          }
          return oldData
        },
      )
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
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [user, queryClient, fetchErrorToast])
  return result
}
