import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { updateLessonAPI } from '@/services/api/lessons.api'
import type { Lesson } from '@/types/types'

export function useUpdateLessonMutation() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const { mutate: updateLesson, isPending: isUpdating } = useMutation({
    mutationFn: updateLessonAPI,
    onMutate: (updatedLesson) => {
      const holder = updatedLesson.studentId
        ? `s-${updatedLesson.studentId}`
        : `g-${updatedLesson.groupId}`

      const allLessons = queryClient.getQueryData([
        'all-lessons',
        {
          holder,
          year: updatedLesson.date.getFullYear(),
        },
      ]) as Array<Lesson> | undefined

      const latestLessons = queryClient.getQueryData(['latest-3-lessons']) as
        | Array<Lesson>
        | undefined

      const combinedLessons: Array<Lesson> = []

      if (allLessons) combinedLessons.push(...allLessons)
      if (latestLessons) combinedLessons.push(...latestLessons)

      queryClient.setQueryData(
        [
          'all-lessons',
          {
            holder,
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
        ['latest-3-lessons'],
        (prev: Array<Lesson> | undefined) => {
          return prev?.map((oldLesson) =>
            oldLesson.id === updatedLesson.id ? updatedLesson : oldLesson,
          )
        },
      )

      queryClient.setQueryData(
        ['prepared-lessons'],
        (prev: Array<Lesson> | undefined) => {
          const newPreparedLessons = prev?.map((oldLesson) =>
            oldLesson.id === updatedLesson.id ? updatedLesson : oldLesson,
          )
          return newPreparedLessons?.filter(
            (lesson) => lesson.status === 'prepared',
          )
        },
      )

      return { allLessons, latestLessons, holder }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['latest-3-lessons'],
      })
    },

    onError: (_, updatedLesson, context) => {
      fetchErrorToast()

      queryClient.setQueryData(
        [
          'all-lessons',
          {
            holder: context?.holder,
            year: updatedLesson.date.getFullYear(),
          },
        ],
        context?.allLessons,
      )
      queryClient.setQueryData(['latest-3-lessons'], context?.latestLessons)
    },
  })
  return { updateLesson, isUpdating }
}
