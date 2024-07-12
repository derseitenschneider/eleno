import fetchErrorToast from '@/hooks/fetchErrorToast'
import { createGroupApi } from '@/services/api/groups.api'
import type { Group } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCreateGroup() {
  const queryClient = useQueryClient()
  const {
    mutate: createGroup,
    isPending: isCreating,
    isError,
  } = useMutation({
    mutationFn: createGroupApi,

    onSuccess: (newGroup) => {
      toast.success('Neue Gruppe hinzugefügt')
      queryClient.setQueryData(['groups'], (prev: Array<Group>) => [
        ...prev,
        ...newGroup,
      ])
    },

    onError: () => {
      fetchErrorToast()
    },
  })
  return { createGroup, isCreating, isError }
}
