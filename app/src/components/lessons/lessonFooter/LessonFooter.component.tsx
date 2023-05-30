import './lessonFooter.style.scss'
import { FunctionComponent, useEffect, useCallback, useMemo } from 'react'
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
  const handlerKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'ArrowLeft') {
      handlerPreviousStudent()
    }
  }
  // useEffect(() => {
  //   window.addEventListener('keyup', handlerKeyUp)

  //   return () => document.removeEventListener('keyup', handlerKeyUp)
  // }, [studentIndex])

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
