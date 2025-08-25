import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { updateEmailApi } from '@/services/api/user.api'
import type { Profile } from '@/types/types'

export function useUpdateEmail() {
  const fetchErrorToast = useFetchErrorToast()
  const queryClient = useQueryClient()
  const { mutate: updateEmail, isPending: isUpdating } = useMutation({
    mutationFn: updateEmailApi,
    onMutate: () => {
      const oldData = queryClient.getQueryData(['profile']) as Profile
      return { oldData }
    },

    onSuccess: async (_, newEmail) => {
      queryClient.setQueryData(['profile'], (prev: Profile) => {
        return {
          ...prev,
          email: newEmail,
        }
      })
      toast.success('Bestätigungslink verschickt.')
    },

    onError: (_, __, context) => {
      fetchErrorToast()

      queryClient.setQueryData(['profile'], context?.oldData)
    },
  })

  return { updateEmail, isUpdating }
}
