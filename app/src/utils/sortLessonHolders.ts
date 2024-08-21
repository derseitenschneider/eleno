import type { Lesson, LessonHolder, Student } from '../types/types'

export const compareLastName = (a: Student, b: Student) => {
  const studentA = a.lastName
  const studentB = b.lastName

  return studentA.localeCompare(studentB, 'de', { sensitivity: 'variant' })
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
