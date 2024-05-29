import type { Lesson, Sorting, Student } from "../types/types"

const compareLastName = (a: Student, b: Student) => {
  const studentA = a.lastName
  const studentB = b.lastName

  return studentA.localeCompare(studentB, "de", { sensitivity: "variant" })
}

const compareInstrument = (a: Student, b: Student) => {
  const instrumentA = a.instrument
  const instrumentB = b.instrument

  return instrumentA.localeCompare(instrumentB, "de", {
    sensitivity: "variant",
  })
}

const compareDays = (a: Student, b: Student) => {
  const days = ["montag", "dienstag", "mittwoch", "donnerstag", "freitag"]
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

const compareTime = (a: Student, b: Student) => {
  const studentA = a.startOfLesson
  const studentB = b.startOfLesson

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
  if (durationA > durationB) {
    comparison = 1
  } else if (durationA < durationB) {
    comparison = -1
  }
  return comparison
}

const compareLocations = (a: Student, b: Student) => {
  const locationA = a.location
  const locationB = b.location

  return locationA.localeCompare(locationB, "de", { sensitivity: "variant" })
}

export const sortStudents = (students: Student[], sorting: Sorting) => {
  if (!students) return
  const sortedbyTime = students.sort(compareTime)
  switch (sorting.sort) {
    case "lastName":
      if (!sorting.ascending) {
        return students.sort(compareLastName).reverse()
      }
      return students.sort(compareLastName)

    case "instrument":
      if (!sorting.ascending) {
        return students.sort(compareInstrument).reverse()
      }
      return students.sort(compareInstrument)

    case "dayOfLesson":
      if (!sorting.ascending) {
        return sortedbyTime.sort(compareDays).reverse()
      }
      return sortedbyTime.sort(compareDays)

    case "durationMinutes":
      if (!sorting.ascending) {
        return students.sort(compareDurations).reverse()
      }
      return students.sort(compareDurations)

    case "location":
      if (!sorting.ascending) {
        return students.sort(compareLocations).reverse()
      }
      return students.sort(compareLocations)

    default:
      return students.sort(compareLastName)
  }
}

export const compareDateString = (a: Lesson, b: Lesson) => {
  const lessonA = a.date
    .split("-")
    .map((el) => el.trim())
    .join("")
  const lessonB = b.date
    .split("-")
    .map((el) => el.trim())
    .join("")

  let comparison = 0
  if (lessonA > lessonB) {
    comparison = 1
  } else if (lessonA < lessonB) {
    comparison = -1
  }

  return comparison
}

export const sortStudentsDateTime = (students: Student[] | null) => {
  if (!students) return []
  const mo: Student[] = []
  const tue: Student[] = []
  const wed: Student[] = []
  const thur: Student[] = []
  const fri: Student[] = []
  const sat: Student[] = []
  const sun: Student[] = []
  const undef: Student[] = []

  for (const student of students) {
    switch (student.dayOfLesson?.toLowerCase()) {
      case "montag":
        mo.push(student)
        break
      case "dienstag":
        tue.push(student)
        break
      case "mittwoch":
        wed.push(student)
        break
      case "donnerstag":
        thur.push(student)
        break
      case "freitag":
        fri.push(student)
        break
      case "samstag":
        sat.push(student)
        break
      case "sonntag":
        sun.push(student)
        break
      case "":
        undef.push(student)
        break
      default:
        undef.push(student)
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
