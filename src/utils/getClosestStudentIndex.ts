import { TStudent } from '../types/types'
import { sortStudentsDateTime } from './sortStudents'

export const getClosestStudentIndex = (students: TStudent[]) => {
  const filteredSortedStudents = sortStudentsDateTime(students).filter(
    (student) => !student.archive
  )

  const day = new Date().getDay()
  const now = new Date().toTimeString().slice(0, 5)
  let today: string
  switch (day) {
    case 1:
      today = 'Montag'
      break
    case 2:
      today = 'Dienstag'
      break
    case 3:
      today = 'Mittwoch'
      break
    case 4:
      today = 'Donnerstag'
      break
    case 5:
      today = 'Freitag'
      break
    case 6:
      today = 'Samstag'
      break
    case 7:
      today = 'Sonntag'
      break
  }
  const todayStudents = filteredSortedStudents.filter(
    (student) => student.dayOfLesson === today
  )

  // When there is no student today, return 0 to get the next student of the weekly cycle
  if (!todayStudents.length) return 0

  const upcomingStudent = todayStudents.filter(
    (student) => student.endOfLesson > now
  )[0]

  // When the last student of the current day passed, show the first one of the next
  if (!upcomingStudent) return 0

  const closestStudentIndex = filteredSortedStudents.findIndex(
    (student) => student.id === upcomingStudent.id
  )

  return closestStudentIndex
}
