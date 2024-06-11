import fetchErrorToast from "@/hooks/fetchErrorToast"
import { deleteLessonAPI } from "@/services/api/lessons.api"
import type { Lesson } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

export function useDeleteLesson() {
  const queryClient = useQueryClient()
  const { studentId } = useParams()
  const [searchParams] = useSearchParams()
  const year = searchParams.get("year")
  const {
    mutate: deleteLesson,
    isPending: isDeleting,
    isError,
  } = useMutation({
    mutationFn: deleteLessonAPI,
    onMutate: (lessonId) => {
      const previousAllLessons = queryClient.getQueryData([
        "all-lessons",
        {
          studentId: Number(studentId),
          year: Number(year),
        },
      ]) as Array<Lesson>
      const previousLatestLessons = queryClient.getQueryData([
        "latest-3-lessons",
      ]) as Array<Lesson>

      // Remove lesson from all lessons cache. This cache might still be empty
      // when the user hasn't previously visited that page but that should'nt
      // be an issue
      queryClient.setQueryData(
        [
          "all-lessons",
          {
            studentId: Number(studentId),
            year: Number(year),
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

      return { previousAllLessons, previousLatestLessons, studentId, year }
    },

    onSuccess: () => {
      toast.success("Lektion gelöscht.")
      queryClient.invalidateQueries({
        queryKey: ["latest-3-lessons"],
      })
      queryClient.invalidateQueries({
        queryKey: ["all-lessons"],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(["all-lessons"], context?.previousAllLessons)
      queryClient.setQueryData(
        ["latest-3-lessons"],
        context?.previousLatestLessons,
      )
    },
  })
  return { deleteLesson, isDeleting, isError }
}
