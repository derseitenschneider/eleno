import './lessonHeader.style.scss'

import { HiPencil } from 'react-icons/hi'
import { HiOutlineListBullet } from 'react-icons/hi2'
import { IoCheckboxOutline, IoPersonCircleOutline } from 'react-icons/io5'
import { useStudents } from '../../../../contexts/StudentContext'

import Menus from '../../../common/menu/Menus.component'
import Modal from '../../../common/modal/Modal.component'
import AddTodo from '../../todos/addTodo/AddTodo.component'

import Repertoire from '../../repertoire/Repertoire.component'
import EditStudent from '../../students/editStudents/EditStudent.component'

function LessonHeader() {
  const { students, currentStudentId } = useStudents()

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
                    </Menus.List>
                  </Menus.Menu>
                </Menus>

                <Modal.Window name="edit-student">
                  <EditStudent studentId={currentStudentId} />
                </Modal.Window>

                <Modal.Window name="add-todo" styles={{ overflowY: 'visible' }}>
                  <AddTodo studentId={currentStudentId} />
                </Modal.Window>
              </Modal>
            </div>
          </div>
          <span>
            {dayOfLesson && `${dayOfLesson}`}
            {startOfLesson && `, ${startOfLesson}`}
            {endOfLesson && ` - ${endOfLesson}`}
          </span>
          {dayOfLesson && durationMinutes && <span> | </span>}

          <span>
            {durationMinutes > 0 && <span> {durationMinutes} Minuten</span>}
          </span>
        </div>
        <Modal>
          <Modal.Open opens="repertoire">
            <button type="button" className="button-repertoire">
              <HiOutlineListBullet />
              <span>Repertoire</span>
            </button>
          </Modal.Open>
          <Modal.Window name="repertoire">
            <Repertoire studentId={currentStudentId} />
          </Modal.Window>
        </Modal>
      </div>
    </header>
  )
}

export default LessonHeader
