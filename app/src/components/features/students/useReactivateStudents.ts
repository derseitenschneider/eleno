import fetchErrorToast from "@/hooks/fetchErrorToast"
import { reactivateStudentsApi } from "@/services/api/students.api"
import type { Student } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useReactivateStudents() {
  const queryClient = useQueryClient()
  const {
    mutate: reactivateStudents,
    isPending: isReactivating,
    isError,
  } = useMutation({
    mutationFn: reactivateStudentsApi,
    onMutate: (reactivatedStudents) => {
      const previousStudents = queryClient.getQueryData([
        "students",
      ]) as Array<Student>

      queryClient.setQueryData(["students"], (prev: Array<Student>) =>
        prev.map((student) =>
          student.id in reactivatedStudents
            ? { ...student, archive: false }
            : student,
        ),
      )

      return { previousStudents }
    },

    onSuccess: () => {
      toast.success("Schüler:in wiederhergestellt.")
      queryClient.invalidateQueries({
        queryKey: ["students"],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(["students"], context?.previousStudents)
    },
  })
  return { reactivateStudents, isReactivating, isError }
}
