import { useState } from "react"
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoSearchOutline,
} from "react-icons/io5"
import { useStudents } from "../../../../services/context/StudentContext"
import Button from "../../../ui/button/Button.component"
import NavigateToStudent from "../navigateToStudent/NavigateToStudent.component"
import "./lessonFooter.style.scss"
import useOutsideClick from "../../../../hooks/useOutsideClick"

function LessonFooter() {
  const {
    activeSortedStudentIds,
    currentStudentIndex,
    setCurrentStudentIndex,
  } = useStudents()

  const [navigateToStudentOpen, setNavigateToStudentOpen] = useState(false)

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

  const panelRef = useOutsideClick<HTMLDivElement>(
    () => setNavigateToStudentOpen(false),
    false,
  )

  return (
    <footer className=''>
      <div className='' />
      <div className=''>
        <div className='' ref={panelRef}>
          <Button
            type='button'
            btnStyle='icon-only'
            handler={() => setNavigateToStudentOpen((prev) => !prev)}
            icon={<IoSearchOutline />}
            className='btn btn-search'
          />
          <NavigateToStudent
            isOpen={navigateToStudentOpen}
            close={() => setNavigateToStudentOpen(false)}
          />
        </div>
        <Button
          type='button'
          btnStyle='icon-only'
          handler={handlerPreviousStudent}
          icon={<IoArrowBackOutline />}
          className='btn btn-arrow'
        />

        <Button
          type='button'
          btnStyle='icon-only'
          handler={handlerNextStudent}
          icon={<IoArrowForwardOutline />}
          className='btn btn-arrow'
        />
      </div>
    </footer>
  )
}

export default LessonFooter
