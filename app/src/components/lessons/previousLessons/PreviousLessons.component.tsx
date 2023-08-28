import './previousLessons.style.scss'
// React components
import { FunctionComponent, useState, useEffect } from 'react'
import { useLessons } from '../../../contexts/LessonsContext'

// Components
import { IoEllipsisHorizontal } from 'react-icons/io5'
import Button from '../../common/button/Button.component'
import DropDown from '../../common/dropdown/Dropdown.component'
import ModalEditLesson from '../../modals/modalEditLesson/ModalEditLesson.component'

// Functions
import { formatDateToDisplay } from '../../../utils/formateDate'
import { toast } from 'react-toastify'
import ModalViewLessons from '../../modals/modalViewLessons/ModalViewLessons.component'
import Modal from '../../modals/Modal.component'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import parse from 'html-react-parser'
import { useSearchParams } from 'react-router-dom'
import { useStudents } from '../../../contexts/StudentContext'

// [ ] padding bottom (s. Benjamin Häusler 23.08.)

type TModals = 'edit-lesson' | 'view-all' | 'delete-lesson' | ''

const PreviousLessons = ({}) => {
  const { lessons, deleteLesson } = useLessons()
  const { currentStudentId } = useStudents()

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)

  const [modalOpen, setModalOpen] = useState<TModals>('')
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

  useEffect(() => {
    setTabIndex(0)
  }, [lessons, currentStudentId])

  const deleteHandler = async () => {
    setModalOpen('')
    try {
      setIsPending(true)
      await deleteLesson(previousLessonsIds[tabIndex])
      setTabIndex(0)
      toast('Lektion gelöscht')
    } catch (err) {
      fetchErrorToast()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      {prevLessonsSorted.length ? (
        <div className="container container--lessons container--previous-lessons">
          <div className="container--tabs">
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
            {prevLessonsSorted.length >= 1 && (
              <button
                className="tab"
                onClick={() => {
                  setModalOpen('view-all')
                }}
              >
                ...
              </button>
            )}
          </div>

          <div className={`container--two-rows${isPending ? ' loading' : ''}`}>
            <div className="row-left">
              <h4 className="heading-4">Lektion</h4>
              <div className="content--previous-lesson">
                {parse(
                  lessons.find(
                    (lesson) => lesson.id === prevLessonsSorted[tabIndex]
                  )?.lessonContent
                )}
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
                      setModalOpen('edit-lesson')
                    },
                    type: 'normal',
                  },
                  {
                    label: 'Lektion löschen',
                    handler: () => {
                      setModalOpen('delete-lesson')
                    },
                    type: 'warning',
                  },
                ]}
              />
            ) : null}
          </div>
          {modalOpen === 'edit-lesson' && (
            <ModalEditLesson
              handleClose={() => {
                setModalOpen('')
              }}
              previousLessonsIds={previousLessonsIds}
              tabIndex={tabIndex}
            />
          )}
          {modalOpen === 'view-all' && (
            <ModalViewLessons
              handlerClose={() => {
                setModalOpen('')
              }}
              studentId={currentStudentId}
            />
          )}

          {modalOpen === 'delete-lesson' && (
            <Modal
              heading="Lektion löschen"
              handlerClose={() => {
                setModalOpen('')
              }}
              buttons={[
                {
                  label: 'Abbrechen',
                  btnStyle: 'primary',
                  handler: () => {
                    setModalOpen('')
                  },
                },
                {
                  label: 'Löschen',
                  btnStyle: 'danger',
                  handler: deleteHandler,
                },
              ]}
            >
              <p>Möchtest du die Lektion wirklich löschen?</p>
            </Modal>
          )}
        </div>
      ) : null}
    </>
  )
}

export default PreviousLessons
