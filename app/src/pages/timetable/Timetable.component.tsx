import { useEffect } from 'react'
import NoContent from '../../components/ui/noContent/NoContent.component'
import TimeTableDay from '../../components/features/timetable/timeTableDay/TimetableDay.component'
import { useStudents } from '../../services/context/StudentContext'
import { TTimetableDay } from '../../types/types'
import { sortStudentsDateTime } from '../../utils/sortStudents'
import './timetable.style.scss'

function Timetable() {
  const { students } = useStudents()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const sortedStudents = sortStudentsDateTime(
    students.filter((student) => !student.archive),
  )
  const monday: TTimetableDay = {
    day: 'Montag',
    students: [],
  }
  const tuesday: TTimetableDay = {
    day: 'Dienstag',
    students: [],
  }
  const wednesday: TTimetableDay = {
    day: 'Mittwoch',
    students: [],
  }
  const thursday: TTimetableDay = {
    day: 'Donnerstag',
    students: [],
  }
  const friday: TTimetableDay = {
    day: 'Freitag',
    students: [],
  }
  const saturday: TTimetableDay = {
    day: 'Samstag',
    students: [],
  }
  const sunday: TTimetableDay = {
    day: 'Sonntag',
    students: [],
  }
  const noDayAssigned: TTimetableDay = {
    day: 'Kein Tag angegeben',
    students: [],
  }

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

  return (
    <div className="container">
      <h1 className="heading-1">Stundenplan</h1>
      {days.some((day) => day.students.length) ? (
        <div className="container--timetable">
          {days.map((day) =>
            day.students.length ? (
              <TimeTableDay day={day} key={day.day} />
            ) : null,
          )}
        </div>
      ) : (
        <NoContent heading="Keine Unterrichtsdaten">
          <p>
            Ergänze die Unterrichtsdaten (Zeit, Unterrichtstag, Unterrichtsort)
            deiner Schüler:innen, damit sie im Stundenplan erscheinen.
          </p>
        </NoContent>
      )}
    </div>
  )
}

export default Timetable
