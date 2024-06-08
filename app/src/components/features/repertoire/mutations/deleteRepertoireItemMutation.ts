import fetchErrorToast from "@/hooks/fetchErrorToast"
import { deleteLessonAPI } from "@/services/api/lessons.api"
import type { Lesson } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function deleteLessonMutation(lessonId: number, onClose?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteLessonAPI(lessonId),
    onMutate: () => {
      const previousAllLessons = queryClient.getQueryData([
        "all-lessons",
      ]) as Array<Lesson>
      const previousLatestLessons = queryClient.getQueryData([
        "latest-3-lessons",
      ]) as Array<Lesson>

      // Since we dont know if the lesson is in one or the other or both caches
      // we search until we find it.
      const lessonToDelete =
        previousAllLessons?.find((lesson) => lesson.id === lessonId) ||
        previousLatestLessons?.find((lesson) => lesson.id === lessonId)

      // Remove lesson from all lessons cache. This cache might still be empty
      // when the user hasn't previously visited that page but that should'nt
      // be an issue
      queryClient.setQueryData(
        [
          "all-lessons",
          {
            studentId: lessonToDelete?.studentId,
            year: lessonToDelete?.date.getFullYear(),
          },
        ],
        (prev: Array<Lesson>) =>
          prev?.filter((lesson) => lesson.id !== lessonId),
      )

      // Remove lessons from latest-3-lessons cache. This cache migth be empty
      // when the user deletes a lesson from the all lessons page that is not
      // currently part of the latest-3-lessons.
      queryClient.setQueryData(["latest-3-lessons"], (prev: Array<Lesson>) =>
        prev?.filter((lesson) => lesson.id !== lessonId),
      )
      onClose?.()
      return { previousAllLessons, previousLatestLessons, lessonToDelete }
    },

    onSuccess: async (_, __, context) => {
      toast.success("Lektion gelöscht.")
      queryClient.invalidateQueries({
        queryKey: ["latest-3-lessons"],
      })
      queryClient.invalidateQueries({
        queryKey: [
          "all-lessons",
          {
            studentId: context.lessonToDelete?.studentId,
            year: context.lessonToDelete?.date.getFullYear(),
          },
        ],
      })
    },

    onError: (error, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(["all-lessons"], context?.previousAllLessons)
      queryClient.setQueryData(
        ["latest-3-lessons"],
        context?.previousLatestLessons,
      )
    },
  })
}
