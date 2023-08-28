import './quicklinks.style.scss'

import {
  IoBookOutline,
  IoCheckboxOutline,
  IoPeopleCircleOutline,
  IoSchoolSharp,
  IoSettingsOutline,
} from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { useStudents } from '../../../contexts/StudentContext'
import { useClosestStudent } from '../../../contexts/ClosestStudentContext'

const QuickLinks = () => {
  const { setCurrentStudentIndex } = useStudents()

  const { closestStudentIndex } = useClosestStudent()
  const navigateToClosestStudent = () => {
    setCurrentStudentIndex(closestStudentIndex)
  }

  return (
    <div className="container quick-links">
      <h2 className="heading-2">Quick-Links</h2>
      <div className="quick-links__content">
        <Link
          to={'lessons'}
          className="quick-links__item"
          onClick={navigateToClosestStudent}
        >
          <IoSchoolSharp className="icon" />
          <p className="card-title">Unterricht starten</p>
        </Link>
        <Link to={'students?modal=add-student'} className="quick-links__item">
          <IoPeopleCircleOutline className="icon" />
          <p className="card-title">Schüler:in hinzufügen</p>
        </Link>
        <Link to={'todos'} className="quick-links__item">
          <IoCheckboxOutline className="icon" />
          <p className="card-title">Todo erfassen</p>
        </Link>

        <Link to={'settings'} className="quick-links__item">
          <IoSettingsOutline className="icon" />
          <p className="card-title">Einstellungen</p>
        </Link>
        <Link to={'manual'} className="quick-links__item">
          <IoBookOutline className="icon" />
          <p className="card-title">Anleitung</p>
        </Link>
      </div>
    </div>
  )
}

export default QuickLinks
