import './timetable.style.scss'
import React from 'react'
import TimeTableDay from '../../components/timeTableDay/TimetableDay.component'
import { useStudents } from '../../contexts/StudentContext'
import { sortStudentsDateTime } from '../../utils/sortStudents'

// [ ] add instrument, put first and last name in same cell
function Timetable() {
  const { students, setStudents } = useStudents()

  const sortedStudents = sortStudentsDateTime(
    students.filter((student) => !student.archive)
  )

  const monday = {
    day: 'Montag',
    location: 'Steffisburg, Bernstrasse',
    students: [],
  }
  const tuesday = { day: 'Dienstag', location: 'Spiez, Dorfhuus', students: [] }
  const wednesday = {
    day: 'Mittwoch',
    location: 'Steffisburg, Bernstrasse',
    students: [],
  }
  const thursday = { day: 'Donnerstag', location: '', students: [] }
  const friday = { day: 'Freitag', location: '', students: [] }
  const saturday = { day: 'Samstag', location: '', students: [] }
  const sunday = { day: 'Sonntag', location: '', students: [] }
  const noDayAssigned = { day: 'none', location: '', students: [] }

  sortedStudents.forEach((student) => {
    switch (student.dayOfLesson) {
      case 'Montag':
        monday.students.push(student)
        break
      case 'Dienstag':
        tuesday.students.push(student)
        break
      case 'Mittwoch':
        wednesday.students.push(student)
        break
      case 'Donnerstag':
        thursday.students.push(student)
        break
      case 'Freitag':
        friday.students.push(student)
        break
      case 'Samstag':
        saturday.students.push(student)
        break
      case 'Sonntag':
        sunday.students.push(student)
        break
      default:
        noDayAssigned.students.push(student)
    }
  })

  const days = [
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    noDayAssigned,
  ]
  // [ ] take into account that there might be two or more locations on the same day
  return (
    <>
      <div className="container">
        <h1 className="heading-1">Stundenplan</h1>
        <div className="container--timetable">
          {days.map((day) =>
            day.students.length ? <TimeTableDay day={day} /> : null
          )}
        </div>
      </div>
    </>
  )
}

export default Timetable
