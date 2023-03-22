import { TLesson, TSorting, TStudent } from '../types/types'

const compareLastName = (a: TStudent, b: TStudent) => {
  const studentA = a.lastName.toUpperCase()
  const studentB = b.lastName.toUpperCase()

  let comparison = 0
  if (studentA > studentB) {
    comparison = 1
  } else if (studentA < studentB) {
    comparison = -1
  }
  return comparison
}

const compareInstrument = (a: TStudent, b: TStudent) => {
  const studentA = a.instrument.toUpperCase()
  const studentB = b.instrument.toUpperCase()

  let comparison = 0
  if (studentA > studentB) {
    comparison = 1
  } else if (studentA < studentB) {
    comparison = -1
  }
  return comparison
}

const compareDays = (a: TStudent, b: TStudent) => {
  const days = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag']
  const dayA = a.dayOfLesson.toLowerCase()
  const dayB = b.dayOfLesson.toLowerCase()

  const timeA = +a.startOfLesson.split(':').join('')
  const timeB = +b.startOfLesson.split(':').join('')

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

  let comparison = 0
  if (locationA > locationB) {
    comparison = 1
  } else if (locationA < locationB) {
    comparison = -1
  }
  return comparison
}

export const sortStudents = (students: TStudent[], sorting: TSorting) => {
  switch (sorting.method) {
    case 'lastName':
      if (sorting.ascending) {
        return students.sort(compareLastName)
      }
      if (!sorting.ascending) {
        return students.sort(compareLastName).reverse()
      }
      break
    case 'instrument':
      if (sorting.ascending) {
        return students.sort(compareInstrument)
      }
      if (!sorting.ascending) {
        return students.sort(compareInstrument).reverse()
      }
      break
    case 'dayOfLesson':
      if (sorting.ascending) {
        return students.sort(compareDays)
      }
      if (!sorting.ascending) {
        return students.sort(compareDays).reverse()
      }
      break
    case 'duration':
      if (sorting.ascending) {
        return students.sort(compareDurations)
      }
      if (!sorting.ascending) {
        return students.sort(compareDurations).reverse()
      }
      break
    case 'location':
      if (sorting.ascending) {
        return students.sort(compareLocations)
      }
      if (!sorting.ascending) {
        return students.sort(compareLocations).reverse()
      }
      break
    default:
      return students
  }
}

export const compareDateString = (a: TLesson, b: TLesson) => {
  const lessonA = a.date
    .split('.')
    .reverse()
    .map((el) => el.trim())
    .join('')
  const lessonB = b.date
    .split('.')
    .reverse()
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

  students.forEach((student) => {
    switch (student.dayOfLesson.toLowerCase()) {
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
    }
  })
  const sortedArray = [
    ...mo.sort(compareTime),
    ...tue.sort(compareTime),
    ...wed.sort(compareTime),
    ...thur.sort(compareTime),
    ...thur.sort(compareTime),
    ...fri.sort(compareTime),
  ]
  return sortedArray
}
