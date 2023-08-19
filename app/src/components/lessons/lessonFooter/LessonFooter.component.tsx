import './lessonFooter.style.scss'
import { FunctionComponent } from 'react'
import Button from '../../common/button/Button.component'
import { IoArrowBackOutline, IoArrowForwardOutline } from 'react-icons/io5'
import { useStudents } from '../../../contexts/StudentContext'

const LessonFooter = ({}) => {
  const {
    activeSortedStudentIds,
    currentStudentIndex,
    setCurrentStudentIndex,
  } = useStudents()
  const handlerPreviousStudent = () => {
    currentStudentIndex > 0
      ? setCurrentStudentIndex(currentStudentIndex - 1)
      : setCurrentStudentIndex(activeSortedStudentIds.length - 1)
  }

  const handlerNextStudent = () => {
    currentStudentIndex < activeSortedStudentIds.length - 1
      ? setCurrentStudentIndex(currentStudentIndex + 1)
      : setCurrentStudentIndex(0)
  }
  return (
    <footer className="footer--lessons">
      <div className="container--main"></div>
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
