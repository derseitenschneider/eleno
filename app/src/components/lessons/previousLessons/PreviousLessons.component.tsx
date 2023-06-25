import './previousLessons.style.scss'
// React components
import { FunctionComponent, useState, useEffect } from 'react'
import { useLessons } from '../../../contexts/LessonsContext'

// Components
import { IoEllipsisHorizontal } from 'react-icons/io5'
import Button from '../../_reusables/button/Button.component'
import DropDown from '../../_reusables/dropdown/Dropdown.component'
import ModalEditLesson from '../../modals/modalEditLesson/ModalEditLesson.component'

// Functions
import { formatDateToDisplay } from '../../../utils/formateDate'
import { toast } from 'react-toastify'
import ModalViewLessons from '../../modals/modalViewLessons/ModalViewLessons.component'
import Modal from '../../modals/Modal.component'
import fetchErrorToast from '../../../hooks/fetchErrorToast'
import parse from 'html-react-parser'

interface PreviousLessonsProps {
  currentStudentId: number
  previousLessonsIds: number[]
}

const PreviousLessons: FunctionComponent<PreviousLessonsProps> = ({
  currentStudentId,
  previousLessonsIds,
}) => {
  const { lessons, deleteLesson } = useLessons()

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const [modalEditLessonOpen, setModalEditLessonOpen] = useState(false)
  const [modalViewAllOpen, setModalViewAllOpen] = useState(false)
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [isPending, setIsPending] = useState(false)

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
    setModalDeleteOpen(false)
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
                onClick={() => setTabIndex(index)}
                key={prev}
              >
                {formatDateToDisplay(
                  lessons.find((lesson) => lesson.id === prev).date
                )}
              </button>
            ))}
            {prevLessonsSorted.length >= 1 && (
              <button className="tab" onClick={() => setModalViewAllOpen(true)}>
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
                      setModalEditLessonOpen(true)
                    },
                    type: 'normal',
                  },
                  {
                    label: 'Lektion löschen',
                    handler: () => setModalDeleteOpen(true),
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

          {modalDeleteOpen && (
            <Modal
              heading="Lektion löschen"
              handlerClose={() => setModalDeleteOpen(false)}
              handlerOverlay={() => setModalDeleteOpen(false)}
              buttons={[
                {
                  label: 'Abbrechen',
                  btnStyle: 'primary',
                  handler: () => setModalDeleteOpen(false),
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
