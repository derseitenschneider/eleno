import './previousLessons.style.scss'
// Types
import { TLesson } from '../../../types/types'

// Hooks
import { useState, useEffect } from 'react'
import { useLessons } from '../../../contexts/LessonsContext'
import { useStudents } from '../../../contexts/StudentContext'

// Functions
import { formatDateToDisplay } from '../../../utils/formateDate'
import parse from 'html-react-parser'

// Components
import Modal from '../../common/modal/Modal.component'

import Emtpy from '../../common/emtpy/Empty.component'
import Menus from '../../common/menu/Menus.component'
import AllLessons from '../allLessons/AllLessons.component'
import DeleteLesson from '../deleteLesson/DeleteLesson.component'
import EditLesson from '../editLesson/EditLesson.component'

import { HiPencil, HiTrash } from 'react-icons/hi'

const PreviousLessons = ({}) => {
  const { lessons } = useLessons()
  const { currentStudentId } = useStudents()

  const [tabIndex, setTabIndex] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const previousLessonsIds = lessons
    .filter((lesson) => lesson.studentId === currentStudentId)
    ?.slice(-3)
    .map((lesson) => lesson.id)
    .reverse()

  const prevLessonsSorted = previousLessonsIds
    .map((prevLesson) => {
      return {
        id: prevLesson,
        date: lessons.find((lesson) => lesson.id === prevLesson).date,
      }
    })
    .sort((a, b) => {
      return (
        +b.date.split('-').reduce((acc, curr) => acc + curr) -
        +a.date.split('-').reduce((acc, curr) => acc + curr)
      )
    })
    .map((el) => el.id)

  const currentLesson: TLesson = lessons.find(
    (lesson) => lesson.id === prevLessonsSorted[tabIndex]
  )

  useEffect(() => {
    setTabIndex(0)
  }, [lessons, currentStudentId])

  return (
    <div className="container--lessons container--previous-lessons">
      <div className="container--tabs">
        {prevLessonsSorted.length > 0 ? (
          <>
            {prevLessonsSorted.map((prev, index) => (
              <button
                className={`tab ${tabIndex === index && 'tab--active'}`}
                onClick={() => {
                  setTabIndex(index)
                }}
                key={prev}
              >
                {formatDateToDisplay(
                  lessons.find((lesson) => lesson.id === prev).date
                )}
              </button>
            ))}
            <Modal>
              <Modal.Open opens="all-lessons">
                <button className="tab"> ... </button>
              </Modal.Open>
              <Modal.Window name="all-lessons">
                <AllLessons studentId={currentStudentId} />
              </Modal.Window>
            </Modal>
          </>
        ) : null}
      </div>
      {prevLessonsSorted.length > 0 ? (
        <>
          <div className={`container--two-rows${isPending ? ' loading' : ''}`}>
            <div className="row-left">
              <h4 className="heading-4">Lektion</h4>
              <div className="content--previous-lesson">
                {parse(currentLesson.lessonContent)}
              </div>
            </div>
            <div className="row-right">
              <h4 className="heading-4">Hausaufgaben</h4>
              <div className="content--previous-lesson">
                {parse(
                  lessons.find(
                    (lesson) => lesson.id === prevLessonsSorted[tabIndex]
                  )?.homework
                )}
              </div>
            </div>
          </div>

          <div className="container--edit-buttons">
            <Modal>
              <Menus>
                <Menus.Toggle id="edit-lesson" />
                <Menus.Menu>
                  <Menus.List id="edit-lesson">
                    <Modal.Open opens="edit-lesson">
                      <Menus.Button icon={<HiPencil />}>
                        Lektion bearbeiten
                      </Menus.Button>
                    </Modal.Open>

                    <Modal.Open opens="delete-lesson">
                      <Menus.Button
                        icon={<HiTrash />}
                        iconColor="var(--clr-warning)"
                      >
                        Lektion löschen
                      </Menus.Button>
                    </Modal.Open>
                  </Menus.List>
                </Menus.Menu>
              </Menus>

              <Modal.Window name="edit-lesson">
                <EditLesson lesson={currentLesson} />
              </Modal.Window>

              <Modal.Window name="delete-lesson">
                <DeleteLesson lessonId={currentLesson.id} />
              </Modal.Window>
            </Modal>
          </div>
        </>
      ) : (
        <Emtpy emptyMessage="Noch keine Lektion erfasst" />
      )}
    </div>
  )
}

export default PreviousLessons
