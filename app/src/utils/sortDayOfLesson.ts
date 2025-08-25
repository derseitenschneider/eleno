import type { Row, SortingFn } from '@tanstack/react-table'
import type { Group, Student } from '@/types/types'

export const customDaySorting: SortingFn<Student | Group> = (
  rowA: Row<Student | Group>,
  rowB: Row<Student | Group>,
  columnId: string,
) => {
  const weekDays = [
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
    'Sonntag',
  ]
  const getWeekdayIndex = (day: string | null | undefined): number => {
    if (day == null) return -1
    return weekDays.indexOf(day)
  }

  const dayA = rowA.getValue(columnId) as string | null | undefined
  const dayB = rowB.getValue(columnId) as string | null | undefined

  // Handle null/undefined values for dayOfLesson
  if (dayA == null && dayB == null) return 0
  if (dayA == null) return 1
  if (dayB == null) return -1

  const dayIndexA = getWeekdayIndex(dayA)
  const dayIndexB = getWeekdayIndex(dayB)

  if (dayIndexA !== dayIndexB) {
    return dayIndexA - dayIndexB
  }

  // If days are the same, sort by startOfLesson
  const startA = rowA.getValue('startOfLesson') as string | null | undefined
  const startB = rowB.getValue('startOfLesson') as string | null | undefined

  // Handle null/undefined values for startOfLesson
  if (startA == null && startB == null) return 0
  if (startA == null) return 1
  if (startB == null) return -1

  // Ensure we have string values before comparing
  if (typeof startA !== 'string' || typeof startB !== 'string') {
    console.warn('Unexpected non-string value for startOfLesson', {
      startA,
      startB,
    })
    // Convert to string if possible, or use a default value
    const strA = String(startA || '')
    const strB = String(startB || '')
    return strA.localeCompare(strB)
  }

  return startA.localeCompare(startB)
}
