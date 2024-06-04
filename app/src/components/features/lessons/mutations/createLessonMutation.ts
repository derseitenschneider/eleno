import fetchErrorToast from "@/hooks/fetchErrorToast"
import { createLessonAPI } from "@/services/api/lessons.api"
import type { Lesson } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function createLessonMutation(newLesson: Lesson, onSuccess: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => createLessonAPI(newLesson, newLesson.user_id || ""),

    onMutate: async () => {
      // Snapshot in case of a rollback.
      const previousLessons = queryClient.getQueryData(["latest-3-lessons"])
      queryClient.setQueryData(["latest-3-lessons"], (prev: Array<Lesson>) => [
        ...prev,
        newLesson,
      ])
      return { previousLessons }
    },

    onSuccess: async (data) => {
      toast.success("Lektion gespeichert.")
      onSuccess()
      queryClient.invalidateQueries({
        queryKey: ["latest-3-lessons"],
      })
      queryClient.invalidateQueries({
        queryKey: [
          "all-lessons",
          { studentId: data?.studentId, year: data?.date.getFullYear() },
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          "lesson-years",
          { studentId: data?.studentId, year: data?.date.getFullYear() },
        ],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(["latest-3-lessons"], context?.previousLessons)
    },
  })
}
