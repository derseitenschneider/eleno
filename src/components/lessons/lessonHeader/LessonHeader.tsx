import './lessonHeader.style.scss'
import { FunctionComponent } from 'react'
import { useStudents } from '../../../contexts/StudentContext'

import Button from '../../button/Button.component'
import {
  IoPersonCircleOutline,
  IoArrowBackOutline,
  IoArrowForwardOutline,
} from 'react-icons/io5'

import { MdKeyboardArrowLeft } from 'react-icons/md'

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

          <span> {durationMinutes} Minuten</span>
        </div>
        <span>
          {dayOfLesson}, {startOfLesson} - {endOfLesson}
        </span>
      </div>
    </header>
  )
}

export default LessonHeader
