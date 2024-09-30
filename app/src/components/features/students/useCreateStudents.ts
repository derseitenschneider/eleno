import { appConfig } from '@/config'
import fetchErrorToast from '@/hooks/fetchErrorToast'
import { createStudentsApi } from '@/services/api/students.api'
import type { Student } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCreateStudents() {
  const queryClient = useQueryClient()
  const {
    mutate: createStudents,
    isPending: isCreating,
    isError,
  } = useMutation({
    mutationFn: createStudentsApi,

    onSuccess: (newStudents) => {
      toast.success('Neue Schüler:innen hinzugefügt')
      queryClient.setQueryData(['students'], (prev: Array<Student>) => [
        ...prev,
        ...newStudents,
      ])
      if (appConfig.isDemoMode) {
        queryClient.invalidateQueries({ queryKey: ['students'] })
      }
    },

    onError: () => {
      fetchErrorToast()
    },
  })
  return { createStudents, isCreating, isError }
}
