import type { Lesson, LessonHolder, Sorting, Student } from '../types/types'

export const compareLastName = (a: Student, b: Student) => {
  const studentA = a.lastName
  const studentB = b.lastName

  return studentA.localeCompare(studentB, 'de', { sensitivity: 'variant' })
}

const compareInstrument = (a: Student, b: Student) => {
  const instrumentA = a.instrument
  const instrumentB = b.instrument

  return instrumentA.localeCompare(instrumentB, 'de', {
    sensitivity: 'variant',
  })
}

const compareDays = (a: Student, b: Student) => {
  const days = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag']
  const dayA = a.dayOfLesson?.toLowerCase()
  const dayB = b.dayOfLesson?.toLowerCase()

  let comparison = 0
  if (!dayA || !dayB) return comparison

  if (days.indexOf(dayA) > days.indexOf(dayB)) {
    comparison = 1
  } else if (days.indexOf(dayA) < days.indexOf(dayB)) {
    comparison = -1
  }

  return comparison
}

const compareTime = (a: LessonHolder, b: LessonHolder) => {
  const studentA = a.holder?.startOfLesson
  const studentB = b.holder?.startOfLesson

  let comparison = 0
  if (!studentA || !studentB) return comparison

  if (studentA > studentB) {
    comparison = 1
  } else if (studentA < studentB) {
    comparison = -1
  }
  return comparison
}

const compareDurations = (a: Student, b: Student) => {
  const durationA = a.durationMinutes
  const durationB = b.durationMinutes

  let comparison = 0
  if (!durationA || !durationB) return 0
  if (durationA > durationB) {
    comparison = 1
  } else if (durationA < durationB) {
    comparison = -1
  }
  return comparison
}

export const sortStudents = (students: Student[], sorting: Sorting) => {
  if (!students) return
  const sortedbyTime = students.sort(compareTime)
  switch (sorting.sort) {
    case 'lastName':
      if (!sorting.ascending) {
        return students.sort(compareLastName).reverse()
      }
      return students.sort(compareLastName)

    case 'instrument':
      if (!sorting.ascending) {
        return students.sort(compareInstrument).reverse()
      }
      return students.sort(compareInstrument)

    case 'dayOfLesson':
      if (!sorting.ascending) {
        return sortedbyTime.sort(compareDays).reverse()
      }
      return sortedbyTime.sort(compareDays)

    case 'durationMinutes':
      if (!sorting.ascending) {
        return students.sort(compareDurations).reverse()
      }
      return students.sort(compareDurations)

    default:
      return students.sort(compareLastName)
  }
}

export const compareDateString = (a: Lesson, b: Lesson) => {
  const lessonA = a.date
  const lessonB = b.date

  let comparison = 0
  if (lessonA > lessonB) {
    comparison = 1
  } else if (lessonA < lessonB) {
    comparison = -1
  }

  return comparison
}

export const sortLessonHolders = (
  lessonHolders: Array<LessonHolder> | null,
) => {
  if (!lessonHolders) return []
  const mo: LessonHolder[] = []
  const tue: LessonHolder[] = []
  const wed: LessonHolder[] = []
  const thur: LessonHolder[] = []
  const fri: LessonHolder[] = []
  const sat: LessonHolder[] = []
  const sun: LessonHolder[] = []
  const undef: LessonHolder[] = []

  for (const lessonHolder of lessonHolders) {
    switch (lessonHolder.holder?.dayOfLesson?.toLowerCase()) {
      case 'montag':
        mo.push(lessonHolder)
        break
      case 'dienstag':
        tue.push(lessonHolder)
        break
      case 'mittwoch':
        wed.push(lessonHolder)
        break
      case 'donnerstag':
        thur.push(lessonHolder)
        break
      case 'freitag':
        fri.push(lessonHolder)
        break
      case 'samstag':
        sat.push(lessonHolder)
        break
      case 'sonntag':
        sun.push(lessonHolder)
        break
      case null:
        undef.push(lessonHolder)
        break
      default:
        undef.push(lessonHolder)
    }
  }

  const sortedArray = [
    ...mo.sort(compareTime),
    ...tue.sort(compareTime),
    ...wed.sort(compareTime),
    ...thur.sort(compareTime),
    ...fri.sort(compareTime),
    ...sat.sort(compareTime),
    ...sun.sort(compareTime),
    ...undef.sort(compareTime),
  ]
  return sortedArray
}
