import { TStudent, TWeekday } from '../types/types'
import { sortStudentsDateTime } from './sortStudents'

export const getClosestStudentIndex = (students: TStudent[]) => {
  const filteredSortedStudents = sortStudentsDateTime(students).filter(
    (student) => !student.archive
  )

  const day = new Date().getDay()
  const now = new Date().toTimeString().slice(0, 5)
  let today: TWeekday
  let in1Day: TWeekday
  let in2Days: TWeekday
  let in3Days: TWeekday
  let in4Days: TWeekday
  let in5Days: TWeekday
  let in6Days: TWeekday
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

  const studentsAfterToday = [
    filteredSortedStudents.filter((student) => student.dayOfLesson === in1Day),
    filteredSortedStudents.filter((student) => student.dayOfLesson === in2Days),
    filteredSortedStudents.filter((student) => student.dayOfLesson === in3Days),
    filteredSortedStudents.filter((student) => student.dayOfLesson === in4Days),
    filteredSortedStudents.filter((student) => student.dayOfLesson === in5Days),
    filteredSortedStudents.filter((student) => student.dayOfLesson === in6Days),
  ]

  let upcomingStudent: TStudent

  const todaysStudents = filteredSortedStudents.filter(
    (student) => student.dayOfLesson === today
  )
  const todaysNextStudent = todaysStudents.filter(
    (student) => student.endOfLesson > now
  )[0]

  if (todaysNextStudent) {
    upcomingStudent = todaysNextStudent
  } else {
    for (let i = 0; i < studentsAfterToday.length; i++) {
      if (studentsAfterToday[i].length) {
        upcomingStudent = studentsAfterToday[i][0]
        break
      }
    }
  }

  const closestStudentIndex = filteredSortedStudents.findIndex(
    (student) => student.id === upcomingStudent?.id
  )

  return closestStudentIndex
}
