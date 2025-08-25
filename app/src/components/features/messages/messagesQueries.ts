import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { getMessagesApi } from '@/services/api/messages.api'
import supabase from '@/services/api/supabase'
import { useUser } from '@/services/context/UserContext'
import type { Message } from '@/types/types'

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

  return result
}
