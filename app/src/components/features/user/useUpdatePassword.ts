import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { updatePasswordApi } from '@/services/api/user.api'

export function useUpdatePassword() {
  const fetchErrorToast = useFetchErrorToast()
  const { mutate: updatePassword, isPending: isUpdating } = useMutation({
    mutationFn: updatePasswordApi,

    onSuccess: async () => {
      toast.success('Password geändert.')
    },

    onError: (error) => {
      if ('same_password' !== error.message) {
        fetchErrorToast()
      }
    },
  })

  return { updatePassword, isUpdating }
}
