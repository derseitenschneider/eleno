import { FunctionComponent } from 'react'
import { TTimetableDay } from '../../types/types'
import './timeTableDay.style.scss'
interface TimeTableDayProps {
  day: TTimetableDay
}

const TimeTableDay: FunctionComponent<TimeTableDayProps> = ({ day }) => {
  return (
    <div className="timetable__day">
      <div className="header">
        <h3 className="heading-3">{day.day}</h3>
        <div className="meta-info">
          <span>{day.location}</span>
          <span>Anz. Schüler:innen: {day.students.length}</span>
        </div>
      </div>
      {day.students.map((student) => (
        <div className="row" key={student.id}>
          <div>
            {student.startOfLesson} - {student.endOfLesson}
          </div>

          <div>
            {student.firstName} {student.lastName}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TimeTableDay
