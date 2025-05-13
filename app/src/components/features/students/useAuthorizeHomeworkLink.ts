import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { updateStudentsApi } from '@/services/api/students.api'
import type { Student } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useAuthorizeStudentHomeworkLink() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const {
    mutate: authorizeStudent,
    isPending: isAuthorizing,
    isSuccess,
  } = useMutation({
    mutationFn: updateStudentsApi,

    onMutate: (updatedStudents) => {
      const previousStudents = queryClient.getQueryData(['students']) as
        | Array<Student>
        | undefined
      queryClient.setQueryData(
        ['students'],
        (prev: Array<Student> | undefined) => {
          if (!prev) return updatedStudents
          return prev.map((prevStudent) => {
            const updatedStudent = updatedStudents.find(
              (student) => student.id === prevStudent.id,
            )
            return updatedStudent
              ? { ...prevStudent, ...updatedStudent }
              : prevStudent
          })
        },
      )
      return { previousStudents }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['students'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()

      queryClient.setQueryData(['students'], context?.previousStudents)
    },
  })
  return { authorizeStudent, isAuthorizing, isSuccess }
}
