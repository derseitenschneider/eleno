import './lessonHeader.style.scss'
import { FunctionComponent } from 'react'
import { useStudents } from '../../../contexts/StudentContext'

import { IoPersonCircleOutline } from 'react-icons/io5'

interface LessonHeaderProps {
  currentStudentId: number
}

const LessonHeader: FunctionComponent<LessonHeaderProps> = ({
  currentStudentId,
}) => {
  const { students } = useStudents()

  const {
    firstName,
    lastName,
    durationMinutes,
    dayOfLesson,
    startOfLesson,
    endOfLesson,
  } = students.find((student) => student.id === currentStudentId)

  return (
    <header className="container container--header">
      <div className="container--infos">
        <div className="row-1">
          <h2 className="student-name">
            <IoPersonCircleOutline className="icon" />
            {firstName} {lastName}
          </h2>
        </div>
        <span>
          {dayOfLesson && `${dayOfLesson}`}
          {startOfLesson && `, ${startOfLesson}`}
          {endOfLesson && ` - ${endOfLesson}`}
        </span>
        <span> | </span>
        <span>
          {durationMinutes > 0 && <span> {durationMinutes} Minuten</span>}
        </span>
      </div>
    </header>
  )
}

export default LessonHeader
