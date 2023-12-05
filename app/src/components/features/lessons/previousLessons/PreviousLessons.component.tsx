import './previousLessons.style.scss'
// Types

// Hooks
import parse from 'html-react-parser'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { HiPencil, HiTrash } from 'react-icons/hi'
import { FiShare } from 'react-icons/fi'

import { useLessons } from '../../../../services/context/LessonsContext'
import { useStudents } from '../../../../services/context/StudentContext'

// Functions
import { formatDateToDisplay } from '../../../../utils/formateDate'

import { TLesson } from '../../../../types/types'
// Components
import Modal from '../../../ui/modal/Modal.component'

import Emtpy from '../../../ui/emtpy/Empty.component'
import Menus from '../../../ui/menu/Menus.component'

import DeleteLesson from '../deleteLesson/DeleteLesson.component'
import EditLesson from '../editLesson/EditLesson.component'
import ShareHomework from '../shareHomework/ShareHomework.component'
import Button from '../../../ui/button/Button.component'

function PreviousLessons() {
  const { lessons } = useLessons()
  const { currentStudentId } = useStudents()
  const navigate = useNavigate()

  const [tabIndex, setTabIndex] = useState(0)
  const [isPending] = useState(false)

  const previousLessonsIds = lessons
    .sort((a, b) => {
      return (
        +b.date.split('-').reduce((acc, curr) => acc + curr) -
        +a.date.split('-').reduce((acc, curr) => acc + curr)
      )
    })
    .filter((lesson) => lesson.studentId === currentStudentId)
    ?.slice(0, 3)
    .map((lesson) => lesson.id)

  const currentLesson: TLesson = lessons.find(
    (lesson) => lesson.id === previousLessonsIds[tabIndex],
  )

  useEffect(() => {
    setTabIndex(0)
  }, [lessons, currentStudentId])

  return (
    <div className="container--lessons container--previous-lessons">
      <div className="container--tabs">
        {previousLessonsIds.length > 0 ? (
          <>
            {previousLessonsIds.map((prev, index) => (
              <button
                type="button"
                className={`tab ${tabIndex === index && 'tab--active'}`}
                onClick={() => {
                  setTabIndex(index)
                }}
                key={prev}
              >
                {formatDateToDisplay(
                  lessons.find((lesson) => lesson.id === prev).date,
                )}
              </button>
            ))}
            <button
              type="button"
              className="tab"
              onClick={() =>
                navigate(`/lessons/all/?studentId=${currentStudentId}`)
              }
            >
              {' '}
              ...{' '}
            </button>
          </>
        ) : null}
      </div>
      {previousLessonsIds.length > 0 ? (
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
                    (lesson) => lesson.id === previousLessonsIds[tabIndex],
                  )?.homework,
                )}
              </div>
            </div>
          </div>

          <div className="container--edit-buttons">
            <Modal>
              <Modal.Open opens="share-homework">
                <Button
                  type="button"
                  btnStyle="icon-only"
                  icon={<FiShare />}
                  title="Hausaufgaben teilen"
                />
              </Modal.Open>
              <Menus>
                <Menus.Toggle id="edit-lesson" />
                <Menus.Menu>
                  <Menus.List id="edit-lesson">
                    <Modal.Open opens="edit-lesson">
                      <Menus.Button icon={<HiPencil />}>
                        Lektion bearbeiten
                      </Menus.Button>
                    </Modal.Open>

                    <Modal.Open opens="share-homework">
                      <Menus.Button icon={<FiShare />}>
                        Hausaufgaben teilen
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
              <Modal.Window name="share-homework">
                <ShareHomework lessonId={currentLesson.id} />
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
