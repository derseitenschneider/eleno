import type { TimetableDay } from '@/types/types'

export default function sortTimeTableDays(days: Array<TimetableDay>) {
  if (days.length === 0) return days
  const sortedDays = []
  for (const day of days) {
    switch (day.day) {
      case 'Montag':
        sortedDays[0] = day
        break
      case 'Dienstag':
        sortedDays[1] = day
        break
      case 'Mittwoch':
        sortedDays[2] = day
        break
      case 'Donnerstag':
        sortedDays[3] = day
        break
      case 'Freitag':
        sortedDays[4] = day
        break
      case 'Samstag':
        sortedDays[5] = day
        break
      case 'Sonntag':
        sortedDays[6] = day
        break
      case null:
        sortedDays[7] = day
        break
    }
  }

  return sortedDays.filter((day) => !!day)
}
