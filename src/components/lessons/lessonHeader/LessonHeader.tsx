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
  activeStudentsIds: number[]
  studentIndex: number
  setStudentIndex: React.Dispatch<React.SetStateAction<number>>
}

const LessonHeader: FunctionComponent<LessonHeaderProps> = ({
  currentStudentId,
  activeStudentsIds,
  studentIndex,
  setStudentIndex,
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

  const handlerPreviousStudent = () => {
    studentIndex > 0
      ? setStudentIndex(studentIndex - 1)
      : setStudentIndex(activeStudentsIds.length - 1)
  }
  // [ ] save input befor change if not empty
  const handlerNextStudent = () => {
    studentIndex < activeStudentsIds.length - 1
      ? setStudentIndex(studentIndex + 1)
      : setStudentIndex(0)
  }

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
        <p>
          {dayOfLesson}, {startOfLesson} - {endOfLesson}
        </p>
      </div>
      <div className="container--buttons">
        {/* // [ ] search field for student */}
        <Button
          type="button"
          btnStyle="icon-only"
          handler={handlerPreviousStudent}
          icon={<IoArrowBackOutline />}
        />
        <Button
          type="button"
          btnStyle="icon-only"
          handler={handlerNextStudent}
          icon={<IoArrowForwardOutline />}
        />
      </div>
    </header>
  )
}

export default LessonHeader
