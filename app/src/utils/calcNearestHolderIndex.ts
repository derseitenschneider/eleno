import type { LessonHolder, Weekday } from '../types/types'
import { sortLessonHolders } from './sortLessonHolders'

const calcNearestHolderIndex = (lessonHolder: Array<LessonHolder>) => {
  const filteredSortedHolders = sortLessonHolders(lessonHolder).filter(
    (lessonHolder) =>
      !lessonHolder.holder?.archive && lessonHolder.holder?.dayOfLesson,
  )

  const day = new Date().getDay()
  const now = new Date().toTimeString().slice(0, 5)
  let today: Weekday
  let in1Day: Weekday
  let in2Days: Weekday
  let in3Days: Weekday
  let in4Days: Weekday
  let in5Days: Weekday
  let in6Days: Weekday
  switch (day) {
    case 0:
      today = 'Sonntag'
      in1Day = 'Montag'
      in2Days = 'Dienstag'
      in3Days = 'Mittwoch'
      in4Days = 'Donnerstag'
      in5Days = 'Freitag'
      in6Days = 'Samstag'
      break
    case 1:
      today = 'Montag'
      in1Day = 'Dienstag'
      in2Days = 'Mittwoch'
      in3Days = 'Donnerstag'
      in4Days = 'Freitag'
      in5Days = 'Samstag'
      in6Days = 'Sonntag'
      break
    case 2:
      today = 'Dienstag'
      in1Day = 'Mittwoch'
      in2Days = 'Donnerstag'
      in3Days = 'Freitag'
      in4Days = 'Samstag'
      in5Days = 'Sonntag'
      in6Days = 'Montag'
      break
    case 3:
      today = 'Mittwoch'
      in1Day = 'Donnerstag'
      in2Days = 'Freitag'
      in3Days = 'Samstag'
      in4Days = 'Sonntag'
      in5Days = 'Montag'
      in6Days = 'Dienstag'
      break
    case 4:
      today = 'Donnerstag'
      in1Day = 'Freitag'
      in2Days = 'Samstag'
      in3Days = 'Sonntag'
      in4Days = 'Montag'
      in5Days = 'Dienstag'
      in6Days = 'Mittwoch'
      break
    case 5:
      today = 'Freitag'
      in1Day = 'Samstag'
      in2Days = 'Sonntag'
      in3Days = 'Montag'
      in4Days = 'Dienstag'
      in5Days = 'Mittwoch'
      in6Days = 'Donnerstag'
      break
    case 6:
      today = 'Samstag'
      in1Day = 'Sonntag'
      in2Days = 'Montag'
      in3Days = 'Dienstag'
      in4Days = 'Mittwoch'
      in5Days = 'Donnerstag'
      in6Days = 'Freitag'
      break
    default:
      today = 'Montag'
      in1Day = 'Dienstag'
      in2Days = 'Mittwoch'
      in3Days = 'Donnerstag'
      in4Days = 'Freitag'
      in5Days = 'Samstag'
      in6Days = 'Sonntag'
  }

  const holdersAfterToday = [
    filteredSortedHolders.filter(
      (lessonHolder) => lessonHolder?.holder.dayOfLesson === in1Day,
    ),
    filteredSortedHolders.filter(
      (lessonHolder) => lessonHolder?.holder.dayOfLesson === in2Days,
    ),
    filteredSortedHolders.filter(
      (lessonHolder) => lessonHolder?.holder.dayOfLesson === in3Days,
    ),
    filteredSortedHolders.filter(
      (lessonHolder) => lessonHolder?.holder.dayOfLesson === in4Days,
    ),
    filteredSortedHolders.filter(
      (lessonHolder) => lessonHolder?.holder.dayOfLesson === in5Days,
    ),
    filteredSortedHolders.filter(
      (lessonHolder) => lessonHolder?.holder.dayOfLesson === in6Days,
    ),
  ]

  let upcomingHolder: LessonHolder | undefined

  const todaysHolders = filteredSortedHolders.filter(
    (lessonHolder) => lessonHolder.holder.dayOfLesson === today,
  )
  const todaysNextHolder = todaysHolders.filter((lessonHolder) =>
    lessonHolder.holder?.endOfLesson
      ? lessonHolder.holder.endOfLesson > now
      : false,
  )[0]

  if (todaysNextHolder) {
    upcomingHolder = todaysNextHolder
  } else {
    for (let i = 0; i < holdersAfterToday.length; i++) {
      const currentHolders = holdersAfterToday[i]
      if (currentHolders && currentHolders.length > 0) {
        upcomingHolder = currentHolders[0]
        break
      }
    }
  }

  const nearestHolderIndex = filteredSortedHolders.findIndex(
    (lessonHolder) => lessonHolder.holder.id === upcomingHolder?.holder.id,
  )

  if (nearestHolderIndex === -1) return 0

  return nearestHolderIndex
}
export default calcNearestHolderIndex
