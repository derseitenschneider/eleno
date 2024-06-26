import fetchErrorToast from "@/hooks/fetchErrorToast"
import {
  createStudentsApi,
  resetStudentsApi,
} from "@/services/api/students.api"
import type { Student } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateStudents() {
  const queryClient = useQueryClient()
  const {
    mutate: createStudents,
    isPending: isCreating,
    isError,
  } = useMutation({
    mutationFn: createStudentsApi,
    onMutate: (newStudents) => {
      const previousStudents = queryClient.getQueryData([
        "students",
      ]) as Array<Student>

      queryClient.setQueryData(["students"], (prev: Array<Student>) => [
        ...prev,
        ...newStudents,
      ])

      return { previousStudents }
    },

    onSuccess: () => {
      toast.success("Neue Schüler:innen hinzugefügt")
      queryClient.invalidateQueries({
        queryKey: ["students"],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(["students"], context?.previousStudents)
    },
  })
  return { createStudents, isCreating, isError }
}
