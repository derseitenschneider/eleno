import { FunctionComponent } from 'react'
import { TStudent } from '../../../../types/types'
import { IoArrowForwardOutline } from 'react-icons/io5'
import { useStudents } from '../../../../contexts/StudentContext'
import { sortStudentsDateTime } from '../../../../utils/sortStudents'
import { useNavigate } from 'react-router-dom'

interface TimeTableRowProps {
  currentStudent: TStudent
}

const TimeTableRow: FunctionComponent<TimeTableRowProps> = ({
  currentStudent,
}) => {
  const { students, setCurrentStudentIndex } = useStudents()
  const navigate = useNavigate()

  const navigateTolesson = () => {
    const filteredSortedStudents = sortStudentsDateTime(students).filter(
      (student) => !student.archive,
    )
    const index = filteredSortedStudents.findIndex(
      (student) => student.id === currentStudent.id,
    )
    setCurrentStudentIndex(index)

    navigate('/lessons')
  }

  return (
    <div className="row" key={currentStudent.id}>
      <div>
        {currentStudent.startOfLesson && (
          <>
            {currentStudent.startOfLesson} - {currentStudent.endOfLesson}
          </>
        )}
      </div>
      <div>
        {currentStudent.firstName} {currentStudent.lastName}
      </div>
      <div>{currentStudent.instrument}</div>
      <div>{currentStudent.location}</div>
      <button onClick={navigateTolesson} className="btn-go-to">
        <IoArrowForwardOutline />
      </button>
    </div>
  )
}

export default TimeTableRow
