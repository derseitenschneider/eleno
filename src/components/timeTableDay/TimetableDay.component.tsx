import { FunctionComponent } from 'react'
import { TTimetableDay } from '../../types/types'
import './timeTableDay.style.scss'
interface TimeTableDayProps {
  day: TTimetableDay
}

const TimeTableDay: FunctionComponent<TimeTableDayProps> = ({ day }) => {
  return (
    <div className="timetable__day">
      <div className="row">
        <h4 className="heading-4">{day.day}</h4>
      </div>
      {day.students.map((student) => (
        <div className="row">
          <div>
            {student.startOfLesson} - {student.endOfLesson}
          </div>

          <div>{student.firstName}</div>
          <div>{student.lastName}</div>
        </div>
      ))}
    </div>
  )
}

export default TimeTableDay
