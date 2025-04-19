import type { Lesson } from '@/types/types'
import getNewestLessonYear from './getNewestLessonYear'

export function buildAllLessonsQuery(
  currentPath: string,
  latestLessons: Array<Lesson>,
  nextHolderId: string,
) {
  if (!currentPath.includes('all')) {
    return ''
  }
  const newestYear =
    getNewestLessonYear(latestLessons, nextHolderId) || new Date().getFullYear()

  return `?year=${newestYear}`
}
