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

        <span>Anz. Schüler:innen: {day.students.length}</span>
      </div>
      {day.students.map((student) => (
        <div className="row" key={student.id}>
          <div>
            {student.startOfLesson && (
              <>
                {student.startOfLesson} - {student.endOfLesson}
              </>
            )}
          </div>

          <div>
            {student.firstName} {student.lastName}
          </div>
          <div>{student.instrument}</div>
          <div>{student.location}</div>
        </div>
      ))}
    </div>
  )
}

export default TimeTableDay
