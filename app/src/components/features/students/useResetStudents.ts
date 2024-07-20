import fetchErrorToast from '@/hooks/fetchErrorToast'
import { resetStudentsApi } from '@/services/api/students.api'
import type { Student } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useResetStudents() {
  const queryClient = useQueryClient()
  const {
    mutate: reset,
    isPending: isResetting,
    isError,
  } = useMutation({
    mutationFn: resetStudentsApi,
    onMutate: (data) => {
      const previousStudents = queryClient.getQueryData([
        'students',
      ]) as Array<Student>

      queryClient.setQueryData(['students'], (prev: Array<Student>) =>
        prev.map((student) => {
          if (student.id in data)
            return {
              ...student,
              dayOfLesson: null,
              startOfLesson: null,
              endOfLesson: null,
              durationMinutes: null,
              location: null,
            }
          return student
        }),
      )

      return { previousStudents }
    },

    onSuccess: () => {
      toast.success('Unterrichtsdaten zurückgesetzt')
      queryClient.invalidateQueries({
        queryKey: ['students'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(['students'], context?.previousStudents)
    },
  })
  return { reset, isResetting, isError }
}
