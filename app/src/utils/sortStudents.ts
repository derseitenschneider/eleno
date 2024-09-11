import { TLesson, TSorting, TStudent } from '../types/types'

const compareLastName = (a: TStudent, b: TStudent) => {
  const studentA = a.lastName
  const studentB = b.lastName

  return studentA.localeCompare(studentB, 'de', { sensitivity: 'variant' })
}

const compareInstrument = (a: TStudent, b: TStudent) => {
  const instrumentA = a.instrument
  const instrumentB = b.instrument

  return instrumentA.localeCompare(instrumentB, 'de', {
    sensitivity: 'variant',
  })
}

const compareDays = (a: TStudent, b: TStudent) => {
  const days = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag']
  const dayA = a.dayOfLesson?.toLowerCase()
  const dayB = b.dayOfLesson?.toLowerCase()

  let comparison = 0
  if (days.indexOf(dayA) > days.indexOf(dayB)) {
    comparison = 1
  } else if (days.indexOf(dayA) < days.indexOf(dayB)) {
    comparison = -1
  }

  return comparison
}

const compareTime = (a: TStudent, b: TStudent) => {
  const studentA = a.startOfLesson
  const studentB = b.startOfLesson

  let comparison = 0
  if (studentA > studentB) {
    comparison = 1
  } else if (studentA < studentB) {
    comparison = -1
  }
  return comparison
}

const compareDurations = (a: TStudent, b: TStudent) => {
  const durationA = a.durationMinutes
  const durationB = b.durationMinutes

  let comparison = 0
  if (durationA > durationB) {
    comparison = 1
  } else if (durationA < durationB) {
    comparison = -1
  }
  return comparison
}

const compareLocations = (a: TStudent, b: TStudent) => {
  const locationA = a.location
  const locationB = b.location

  return locationA.localeCompare(locationB, 'de', { sensitivity: 'variant' })
}

export const sortStudents = (students: TStudent[], sorting: TSorting) => {
  const sortedbyTime = students.sort(compareTime)
  switch (sorting.sort) {
    case 'lastName':
      if (sorting.ascending === 'false') {
        return students.sort(compareLastName).reverse()
      }
      return students.sort(compareLastName)

    case 'instrument':
      if (sorting.ascending === 'false') {
        return students.sort(compareInstrument).reverse()
      }
      return students.sort(compareInstrument)

    case 'dayOfLesson':
      if (sorting.ascending === 'false') {
        return sortedbyTime.sort(compareDays).reverse()
      }
      return sortedbyTime.sort(compareDays)

    case 'durationMinutes':
      if (sorting.ascending === 'false') {
        return students.sort(compareDurations).reverse()
      }
      return students.sort(compareDurations)

    case 'location':
      if (sorting.ascending === 'false') {
        return students.sort(compareLocations).reverse()
      }
      return students.sort(compareLocations)

    default:
      return students.sort(compareLastName)
  }
}

export const compareDateString = (a: TLesson, b: TLesson) => {
  const lessonA = a.date
    .split('-')
    .map((el) => el.trim())
    .join('')
  const lessonB = b.date
    .split('-')
    .map((el) => el.trim())
    .join('')

  let comparison = 0
  if (lessonA > lessonB) {
    comparison = 1
  } else if (lessonA < lessonB) {
    comparison = -1
  }

  return comparison
}

export const sortStudentsDateTime = (students: TStudent[]) => {
  const mo: TStudent[] = []
  const tue: TStudent[] = []
  const wed: TStudent[] = []
  const thur: TStudent[] = []
  const fri: TStudent[] = []
  const sat: TStudent[] = []
  const sun: TStudent[] = []
  const undef: TStudent[] = []

  students.forEach((student) => {
    switch (student.dayOfLesson?.toLowerCase()) {
      case 'montag':
        mo.push(student)
        break
      case 'dienstag':
        tue.push(student)
        break
      case 'mittwoch':
        wed.push(student)
        break
      case 'donnerstag':
        thur.push(student)
        break
      case 'freitag':
        fri.push(student)
        break
      case 'samstag':
        sat.push(student)
        break
      case 'sonntag':
        sun.push(student)
        break
      case '':
        undef.push(student)
        break
      default:
        undef.push(student)
    }
  })
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
