import './previousLessons.style.scss'
// React components
import { FunctionComponent, useState, useEffect } from 'react'
import { useLessons } from '../../../contexts/LessonsContext'

// Components
import { IoEllipsisHorizontal } from 'react-icons/io5'
import { MdOutlineReadMore } from 'react-icons/md'
import Button from '../../button/Button.component'
import DropDown from '../../dropdown/Dropdown.component'
import ModalEditLesson from '../../modals/modalEditLesson/ModalEditLesson.component'

// Types
import { TStudent } from '../../../types/types'

// Functions
import { formatDateToDisplay } from '../../../utils/formateDate'
import { deleteLessonSupabase } from '../../../supabase/lessons/lessons.supabase'
import { toast } from 'react-toastify'
import ModalViewLessons from '../../modals/modalViewLessons/ModalViewLessons.component'

interface PreviousLessonsProps {
  currentStudentId: number
}

const PreviousLessons: FunctionComponent<PreviousLessonsProps> = ({
  currentStudentId,
}) => {
  const { lessons, setLessons } = useLessons()

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const [modalEditLessonOpen, setModalEditLessonOpen] = useState(false)
  const [modalViewAllOpen, setModalViewAllOpen] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('.button--edit')) setDropdownOpen(false)
    }
    if (dropdownOpen) {
      window.addEventListener('click', closeDropdown)
    }
    return () => {
      window.removeEventListener('click', closeDropdown)
    }
  }, [dropdownOpen])

  const previousLessonsIds = lessons
    .filter((lesson) => lesson.studentId === currentStudentId)
    ?.slice(-3)
    .map((lesson) => lesson.id)
    .reverse()

  const deleteLesson = () => {
    const lessonId = previousLessonsIds[tabIndex]
    const newLessons = lessons.filter((lesson) => lesson.id !== lessonId)
    setLessons(newLessons)
    setTabIndex(0)
    deleteLessonSupabase(lessonId)
    toast('Lektion gelöscht')
  }

  return (
    <>
      {previousLessonsIds.length ? (
        <div className="container container--lessons container--previous-lessons">
          <div className="container--tabs">
            {previousLessonsIds.map((prev, index) => (
              <button
                className={`tab ${tabIndex === index && 'tab--active'}`}
                onClick={() => setTabIndex(index)}
              >
                {formatDateToDisplay(
                  lessons.find((lesson) => lesson.id === prev).date
                )}
              </button>
            ))}
            <button className="tab" onClick={() => setModalViewAllOpen(true)}>
              ...
            </button>
          </div>

          <div className="container--two-rows">
            <div className="row-left">
              <h4 className="heading-4">Lektion</h4>
              <div className="content--previous-lesson">
                {
                  lessons.find(
                    (lesson) => lesson.id === previousLessonsIds[tabIndex]
                  ).lessonContent
                }
              </div>
            </div>
            <div className="row-right">
              <h4 className="heading-4">Hausaufgaben</h4>
              <div className="content--previous-lesson">
                {
                  lessons.find(
                    (lesson) => lesson.id === previousLessonsIds[tabIndex]
                  ).homework
                }
              </div>
            </div>
          </div>

          <div className="container--edit-buttons">
            <Button
              type="button"
              btnStyle="icon-only"
              icon={<IoEllipsisHorizontal />}
              className="button--edit"
              handler={() => setDropdownOpen((prev) => !prev)}
            />
            {dropdownOpen ? (
              <DropDown
                positionX="right"
                positionY="top"
                buttons={[
                  {
                    label: 'Lektion bearbeiten',
                    handler: () => {
                      setModalEditLessonOpen(true)
                    },
                    type: 'normal',
                  },
                  {
                    label: 'Lektion löschen',
                    handler: deleteLesson,
                    type: 'warning',
                  },
                ]}
              />
            ) : null}
          </div>
          {modalEditLessonOpen && (
            <ModalEditLesson
              setModalOpen={setModalEditLessonOpen}
              previousLessonsIds={previousLessonsIds}
              tabIndex={tabIndex}
            />
          )}
          {modalViewAllOpen && (
            <ModalViewLessons
              handlerClose={() => setModalViewAllOpen(false)}
              studentId={currentStudentId}
            />
          )}
        </div>
      ) : null}
    </>
  )
}

export default PreviousLessons
