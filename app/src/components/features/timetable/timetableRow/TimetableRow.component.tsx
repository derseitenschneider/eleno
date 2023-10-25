import { IoArrowForwardOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useStudents } from '../../../../contexts/StudentContext'
import { TStudent } from '../../../../types/types'
import { sortStudentsDateTime } from '../../../../utils/sortStudents'

interface TimeTableRowProps {
  currentStudent: TStudent
}

function TimeTableRow({ currentStudent }: TimeTableRowProps) {
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
      <button type="button" onClick={navigateTolesson} className="btn-go-to">
        <IoArrowForwardOutline />
      </button>
    </div>
  )
}

export default TimeTableRow
