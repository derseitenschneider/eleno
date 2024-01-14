import {
  HiOutlineDocumentArrowDown,
  HiOutlineListBullet,
} from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import './lessonHeader.style.scss'

import { HiPencil } from 'react-icons/hi'

import { IoCheckboxOutline, IoPersonCircleOutline } from 'react-icons/io5'
import { useStudents } from '../../../../services/context/StudentContext'

import Menus from '../../../ui/menu/Menus.component'
import Modal from '../../../ui/modal/Modal.component'
import AddTodo from '../../todos/addTodo/AddTodo.component'

import ExportLessons from '../exportLessons/ExportLessons.component'
import EditStudents from '../../students/editStudents/EditStudents.component'

function LessonHeader() {
  const { students, currentStudentId } = useStudents()
  const navigate = useNavigate()

  const {
    firstName,
    lastName,
    durationMinutes,
    dayOfLesson,
    startOfLesson,
    endOfLesson,
  } = students.find((student) => student.id === currentStudentId)

  const navigateRepertoire = () => {
    navigate(`repertoire?studentId=${currentStudentId}`)
  }

  return (
    <header className="container container--header">
      <div className="wrapper-center">
        <div className="container--infos">
          <div className="row-1">
            <h2 className="student-name">
              <IoPersonCircleOutline className="icon" />
              {firstName} {lastName}
            </h2>
            <div className="container--buttons">
              <Modal>
                <Menus>
                  <Menus.Toggle id="header-menu" />
                  <Menus.Menu>
                    <Menus.List id="header-menu">
                      <Modal.Open opens="edit-student">
                        <Menus.Button icon={<HiPencil />}>
                          Schüler:in bearbeiten
                        </Menus.Button>
                      </Modal.Open>

                      <Modal.Open opens="add-todo">
                        <Menus.Button icon={<IoCheckboxOutline />}>
                          Todo erfassen
                        </Menus.Button>
                      </Modal.Open>

                      <Modal.Open opens="export-lessons">
                        <Menus.Button icon={<HiOutlineDocumentArrowDown />}>
                          Lektionsliste exportieren
                        </Menus.Button>
                      </Modal.Open>
                    </Menus.List>
                  </Menus.Menu>
                </Menus>

                <Modal.Window name="edit-student">
                  <EditStudents studentIds={[currentStudentId]} />
                </Modal.Window>

                <Modal.Window name="add-todo" styles={{ overflowY: 'visible' }}>
                  <AddTodo studentId={currentStudentId} />
                </Modal.Window>

                <Modal.Window name="export-lessons">
                  <ExportLessons studentId={currentStudentId} />
                </Modal.Window>
              </Modal>
            </div>
          </div>
          <span>
            {dayOfLesson && `${dayOfLesson}`}
            {startOfLesson && `, ${startOfLesson}`}
            {endOfLesson && ` - ${endOfLesson}`}
          </span>
          {dayOfLesson && durationMinutes !== '0' && <span> | </span>}

          <span>
            {durationMinutes !== '0' && <span> {durationMinutes} Minuten</span>}
          </span>
        </div>
        <button
          type="button"
          className="button-repertoire"
          onClick={navigateRepertoire}
        >
          <HiOutlineListBullet />
          <span>Repertoire</span>
        </button>
      </div>
    </header>
  )
}

export default LessonHeader
