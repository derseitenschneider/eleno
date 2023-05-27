import './lessonHeader.style.scss'
import { FunctionComponent, useState } from 'react'
import { useStudents } from '../../../contexts/StudentContext'
import { HiOutlinePencilSquare } from 'react-icons/hi2'

import { IoPersonCircleOutline } from 'react-icons/io5'
import ModalEditStudent from '../../modals/modalEditStudent/ModalEditStudent.component'

interface LessonHeaderProps {
  currentStudentId: number
}

const LessonHeader: FunctionComponent<LessonHeaderProps> = ({
  currentStudentId,
}) => {
  const { students } = useStudents()
  const [modalEditStudentOpen, setModalEditStudentOpen] = useState(false)

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
          <button
            className="button--edit-student"
            onClick={() => setModalEditStudentOpen(true)}
          >
            <HiOutlinePencilSquare />
          </button>
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
      {modalEditStudentOpen && (
        <ModalEditStudent
          studentId={currentStudentId}
          handlerClose={() => setModalEditStudentOpen(false)}
        />
      )}
    </header>
  )
}

export default LessonHeader
