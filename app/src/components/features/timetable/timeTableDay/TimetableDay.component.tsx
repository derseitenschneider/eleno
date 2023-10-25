import { TTimetableDay } from '../../../../types/types'

import TimeTableRow from '../timetableRow/TimetableRow.component'
import './timeTableDay.style.scss'

interface TimeTableDayProps {
  day: TTimetableDay
}

function TimeTableDay({ day }: TimeTableDayProps) {
  return (
    <div className="timetable__day">
      <div className="header">
        <h3 className="heading-3">{day.day}</h3>

        <span>Anz. Schüler:innen: {day.students.length}</span>
      </div>
      {day.students.map((student) => (
        <TimeTableRow currentStudent={student} key={student.id} />
      ))}
    </div>
  )
}

export default TimeTableDay
