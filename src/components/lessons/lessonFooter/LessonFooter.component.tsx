import './lessonFooter.style.scss'
import { FunctionComponent } from 'react'
import Button from '../../button/Button.component'
import { IoArrowBackOutline, IoArrowForwardOutline } from 'react-icons/io5'
interface LessonFooterProps {
  studentIndex: number
  setStudentIndex: React.Dispatch<React.SetStateAction<number>>
  activeStudentsIds: number[]
}

const LessonFooter: FunctionComponent<LessonFooterProps> = ({
  studentIndex,
  setStudentIndex,
  activeStudentsIds,
}) => {
  const handlerPreviousStudent = () => {
    studentIndex > 0
      ? setStudentIndex(studentIndex - 1)
      : setStudentIndex(activeStudentsIds.length - 1)
  }

  const handlerNextStudent = () => {
    studentIndex < activeStudentsIds.length - 1
      ? setStudentIndex(studentIndex + 1)
      : setStudentIndex(0)
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
        />
        <Button
          type="button"
          btnStyle="icon-only"
          handler={handlerNextStudent}
          icon={<IoArrowForwardOutline />}
        />
      </div>
    </footer>
  )
}

export default LessonFooter