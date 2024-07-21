import {
  fetchLessonsByYearApi,
  fetchLatestLessons,
  fetchLessonYears,
  fetchAllLessonsApi,
  fetchAllLessonsCSVApi,
} from '@/services/api/lessons.api'
import { useUser } from '@/services/context/UserContext'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export function useLessonYears(holderId: number, holderType: 's' | 'g') {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ['lesson-years', { holder: `${holderType}-${holderId}` }],
    queryFn: () => fetchLessonYears(holderId),
    enabled: Boolean(user),
  })

  return result
}

export function useLatestLessons() {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ['latest-3-lessons'],
    queryFn: () => fetchLatestLessons(),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
  })

  return result
}

export function useAllLessonsPerYear(
  year: number,
  holderId: number,
  holderType: 's' | 'g',
) {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ['all-lessons', { year, holder: `${holderType}-${holderId}` }],
    queryFn: () => fetchLessonsByYearApi(holderId, year, holderType),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
    placeholderData: keepPreviousData,
  })

  return result
}

export function useAllLessons(
  holderIds: Array<number>,
  holderType: 's' | 'g',
  startDate?: Date,
  endDate?: Date,
) {
  const result = useQuery({
    queryKey: ['all-lessons', { holderIds, holderType }],
    queryFn: () =>
      fetchAllLessonsApi({ holderIds, holderType, startDate, endDate }),
    staleTime: 0,
    enabled: false,
  })

  return result
}

export function useAllLessonsCSV(
  holderId: number,
  holderType: 's' | 'g',
  startDate?: Date,
  endDate?: Date,
) {
  const result = useQuery({
    queryKey: ['all-lessons-csv', { holder: `${holderType}-${holderId}` }],
    queryFn: () =>
      fetchAllLessonsCSVApi({ holderId, holderType, startDate, endDate }),
    staleTime: 0,
    enabled: false,
  })

  return result
}
