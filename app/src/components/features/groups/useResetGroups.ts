import fetchErrorToast from '@/hooks/fetchErrorToast'
import { resetGroupsAPI } from '@/services/api/groups.api'
import type { Group } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useResetGroups() {
  const queryClient = useQueryClient()
  const {
    mutate: reset,
    isPending: isResetting,
    isError,
  } = useMutation({
    mutationFn: resetGroupsAPI,
    onMutate: (data) => {
      const previousGroups = queryClient.getQueryData([
        'groups',
      ]) as Array<Group>

      queryClient.setQueryData(['groups'], (prev: Array<Group>) =>
        prev.map((group) => {
          if (group.id in data)
            return {
              ...group,
              dayOfLesson: null,
              startOfLesson: null,
              endOfLesson: null,
              durationMinutes: null,
              location: null,
            }
          return group
        }),
      )

      return { previousGroups }
    },

    onSuccess: () => {
      toast.success('Unterrichtsdaten zurückgesetzt')
      queryClient.invalidateQueries({
        queryKey: ['groups'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(['groups'], context?.previousGroups)
    },
  })
  return { reset, isResetting, isError }
}
