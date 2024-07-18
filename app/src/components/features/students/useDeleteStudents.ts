import fetchErrorToast from '@/hooks/fetchErrorToast'
import { deletestudentsApi } from '@/services/api/students.api'
import type { Student } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useDeleteStudents() {
  const queryClient = useQueryClient()
  const {
    mutateAsync: deleteStudents,
    isPending: isDeleting,
    isError,
  } = useMutation({
    mutationFn: deletestudentsApi,
    onMutate: (deletedStudents) => {
      const previousStudents = queryClient.getQueryData([
        'students',
      ]) as Array<Student>

      queryClient.setQueryData(['students'], (prev: Array<Student>) =>
        prev.filter((student) => !(student.id in deletedStudents)),
      )

      return { previousStudents }
    },

    onSuccess: () => {
      // toast.success('Schüler:innen gelöscht.')
      queryClient.invalidateQueries({
        queryKey: ['students'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(['students'], context?.previousStudents)
    },
  })
  return { deleteStudents, isDeleting, isError }
}
