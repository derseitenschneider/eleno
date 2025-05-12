import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { reactivateHomeworkLinkApi } from '@/services/api/lessons.api'
import type { Lesson } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useReactivateHomeworkLink() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const { mutate: reactivateHomeworkLink, isPending: isReactivating } =
    useMutation({
      mutationFn: reactivateHomeworkLinkApi,
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
              oldLesson.id === updatedLesson.id
                ? {
                    ...updatedLesson,
                    expiration_base: new Date().toISOString(),
                  }
                : oldLesson,
            )
          },
        )

        queryClient.setQueryData(
          ['latest-3-lessons'],
          (prev: Array<Lesson> | undefined) => {
            return prev?.map((oldLesson) =>
              oldLesson.id === updatedLesson.id
                ? {
                    ...updatedLesson,
                    expiration_base: new Date().toISOString(),
                  }
                : oldLesson,
            )
          },
        )

        return { allLessons, latestLessons, holder }
      },

      onSuccess: () => {
        toast.success('Link reaktiviert.')
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
  return { reactivateHomeworkLink, isReactivating }
}
