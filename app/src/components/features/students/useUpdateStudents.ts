import fetchErrorToast from "@/hooks/fetchErrorToast"
import { updateStudentsApi } from "@/services/api/students.api"
import type { Student } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateStudents() {
  const queryClient = useQueryClient()
  const { mutate: updateStudents, isPending: isUpdating } = useMutation({
    mutationFn: updateStudentsApi,
    onMutate: (updatedStudents) => {
      // Snapshot in case of a rollback.
      const previousStudents = queryClient.getQueryData(["students"]) as
        | Array<Student>
        | undefined

      queryClient.setQueryData(
        ["students"],
        (prev: Array<Student> | undefined) => {
          return prev?.map((prevStudent) => {
            const updatedStudentsIds = updatedStudents.map(
              (student) => student.id,
            )
            if (prevStudent.id in updatedStudentsIds)
              return updatedStudents.find(
                (student) => student.id === prevStudent.id,
              )
            return prevStudent
          })
        },
      )

      return { previousStudents }
    },

    onSuccess: () => {
      toast.success("Änderungen gespeichert.")
      queryClient.invalidateQueries({
        queryKey: ["students"],
      })
    },

    onError: (_, updatedLesson, context) => {
      fetchErrorToast()

      queryClient.setQueryData(["students"], context?.previousStudents)
    },
  })
  return { updateStudents, isUpdating }
}
