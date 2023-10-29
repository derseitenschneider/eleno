import { IoArrowBackOutline, IoArrowForwardOutline } from 'react-icons/io5'
import { useStudents } from '../../../../contexts/StudentContext'
import Button from '../../../common/button/Button.component'
import './lessonFooter.style.scss'

function LessonFooter() {
  const {
    activeSortedStudentIds,
    currentStudentIndex,
    setCurrentStudentIndex,
  } = useStudents()

  const handlerPreviousStudent = () => {
    if (currentStudentIndex > 0)
      return setCurrentStudentIndex(currentStudentIndex - 1)
    return setCurrentStudentIndex(activeSortedStudentIds.length - 1)
  }

  const handlerNextStudent = () => {
    if (currentStudentIndex < activeSortedStudentIds.length - 1)
      return setCurrentStudentIndex(currentStudentIndex + 1)
    return setCurrentStudentIndex(0)
  }

  return (
    <footer className="footer--lessons">
      <div className="container--main" />
      <div className="container--buttons">
        <Button
          type="button"
          btnStyle="icon-only"
          handler={handlerPreviousStudent}
          icon={<IoArrowBackOutline />}
          className="btn-arrow"
        />
        <Button
          type="button"
          btnStyle="icon-only"
          handler={handlerNextStudent}
          icon={<IoArrowForwardOutline />}
          className="btn-arrow"
        />
      </div>
    </footer>
  )
}

export default LessonFooter
