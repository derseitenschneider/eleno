import fetchErrorToast from "@/hooks/fetchErrorToast"
import { updateLessonAPI } from "@/services/api/lessons.api"
import type { Lesson } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateLesson() {
  const queryClient = useQueryClient()
  const { mutate: updateLesson, isPending: isUpdating } = useMutation({
    mutationFn: updateLessonAPI,
    onMutate: (updatedLesson) => {
      // Snapshot in case of a rollback.
      const allLessons = queryClient.getQueryData([
        "all-lessons",
        {
          studentId: updatedLesson.studentId,
          year: updatedLesson.date.getFullYear(),
        },
      ]) as Array<Lesson> | undefined

      const latestLessons = queryClient.getQueryData(["latest-3-lessons"]) as
        | Array<Lesson>
        | undefined

      const combinedLessons: Array<Lesson> = []

      if (allLessons) combinedLessons.push(...allLessons)
      if (latestLessons) combinedLessons.push(...latestLessons)

      queryClient.setQueryData(
        [
          "all-lessons",
          {
            studentId: updatedLesson.studentId,
            year: updatedLesson.date.getFullYear(),
          },
        ],
        (prev: Array<Lesson> | undefined) => {
          return prev?.map((oldLesson) =>
            oldLesson.id === updatedLesson.id ? updatedLesson : oldLesson,
          )
        },
      )

      queryClient.setQueryData(
        ["latest-3-lessons"],
        (prev: Array<Lesson> | undefined) => {
          return prev?.map((oldLesson) =>
            oldLesson.id === updatedLesson.id ? updatedLesson : oldLesson,
          )
        },
      )

      return { allLessons, latestLessons }
    },

    onSuccess: () => {
      toast.success("Änderungen gespeichert.")
      queryClient.invalidateQueries({
        queryKey: ["latest-3-lessons"],
      })
    },

    onError: (_, updatedLesson, context) => {
      fetchErrorToast()

      queryClient.setQueryData(
        [
          "all-lessons",
          {
            studentId: updatedLesson.studentId,
            year: updatedLesson.date.getFullYear(),
          },
        ],
        context?.allLessons,
      )
      queryClient.setQueryData(
        [
          "latest-3-lessons",
          {
            studentId: updatedLesson.studentId,
            year: updatedLesson.date.getFullYear(),
          },
        ],
        context?.latestLessons,
      )
    },
  })
  return { updateLesson, isUpdating }
}
