import { motion } from 'framer-motion'
import parse from 'html-react-parser'
import { FiShare } from 'react-icons/fi'

import { HiArrowSmLeft, HiPencil, HiTrash } from 'react-icons/hi'

import { HiOutlineDocumentArrowDown } from 'react-icons/hi2'

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLessons } from '../../../../services/context/LessonsContext'
import { useStudents } from '../../../../services/context/StudentContext'

import Loader from '../../../ui/loader/Loader'

import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import { formatDateToDisplay } from '../../../../utils/formateDate'
import Menus from '../../../ui/menu/Menus.component'
import Modal from '../../../ui/modal/Modal.component'
import Table from '../../../ui/table/Table.component'
import EditLesson from '../editLesson/EditLesson.component'
import ShareHomework from '../shareHomework/ShareHomework.component'
import './allLessons.style.scss'

import SearchBar from '../../../ui/searchBar/SearchBar.component'

import DeleteLesson from '../deleteLesson/DeleteLesson.component'
import Button from '../../../ui/button/Button.component'
import ExportLessons from '../exportLessons/ExportLessons.component'

function AllLessons() {
  const { students } = useStudents()
  const [isPending, setIsPending] = useState(true)
  const { lessons } = useLessons()
  const { getAllLessons, setLessons } = useLessons()
  const { setCurrentStudentIndex, activeSortedStudentIds } = useStudents()
  const [searchInput, setSearchInput] = useState('')

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const studentId = Number(searchParams.get('studentId'))

  const isMobile = window.innerWidth < 680

  const studentsLessons = lessons.filter(
    (lesson) => lesson.studentId === studentId,
  )

  const { firstName, lastName } = students.find(
    (student) => student.id === studentId,
  )
  const studentName = `${firstName} ${lastName}`

  useEffect(() => {
    const fetchAllLessons = async () => {
      try {
        const allLessons = await getAllLessons(studentId)
        const allLessonsStudent = allLessons.filter(
          (lesson) => lesson.studentId === studentId,
        )
        const lessonsStudent = lessons.filter(
          (lesson) => lesson.studentId === studentId,
        )

        if (allLessonsStudent.length > lessonsStudent.length) {
          setLessons((prev) => {
            const cleanedUpLessons = prev.filter(
              (lesson) => lesson.studentId !== studentId,
            )
            return [...cleanedUpLessons, ...allLessons]
          })
        }
      } catch (error) {
        fetchErrorToast()
      } finally {
        setIsPending(false)
      }
    }
    fetchAllLessons()
  }, [getAllLessons, setLessons, studentId, lessons])

  const filteredLessons = studentsLessons.filter(
    (lesson) =>
      lesson.date
        .toLowerCase()
        .split(' ')
        .join('')
        .includes(searchInput.toLocaleLowerCase().split(' ').join('')) ||
      lesson.lessonContent
        .toLowerCase()
        .split(' ')
        .join('')
        .includes(searchInput.toLocaleLowerCase().split(' ').join('')) ||
      lesson.homework
        .toLowerCase()
        .split(' ')
        .join('')
        .includes(searchInput.toLocaleLowerCase().split(' ').join('')),
  )

  const handleNavigate = () => {
    const studentIndex = activeSortedStudentIds.indexOf(studentId)

    setCurrentStudentIndex(studentIndex)

    navigate('/lessons')
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const handleDownloadPDF = () => {}

  return (
    <motion.div
      className="all-lessons"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="all-lessons__buttons">
        <button type="button" className="link-back" onClick={handleNavigate}>
          <HiArrowSmLeft />
          <span>Zurück zur Lektion</span>
        </button>
      </div>
      <div className="header">
        <h2 className="heading-2">Lektionsliste {studentName}</h2>
        <div className="controlls">
          <Modal>
            <Modal.Open opens="export">
              <Button
                type="button"
                btnStyle="secondary"
                onClick={handleDownloadPDF}
                icon={<HiOutlineDocumentArrowDown />}
                size="sm"
              >
                Exportieren
              </Button>
            </Modal.Open>
            <Modal.Window name="export">
              <ExportLessons studentId={studentId} />
            </Modal.Window>
          </Modal>
          <SearchBar
            searchInput={searchInput}
            handlerSearchInput={handleSearch}
          />
        </div>
      </div>

      {isPending && <Loader loading={isPending} />}
      {!isPending && (
        <Table columns={isMobile ? '8rem 1fr 1fr' : '12rem 1fr 1fr 4rem'}>
          <Table.Header>
            <div>
              <span>Datum</span>
            </div>
            <div>
              <span>Lektion</span>
            </div>
            <div>
              <span>Hausaufgaben</span>
            </div>
            <div />
          </Table.Header>

          <Menus>
            <Table.Body
              alternateColor
              className="all-lessons__table"
              data={filteredLessons}
              emptyMessage="Keine Lektion vorhanden"
              render={(lesson) => (
                <Menus.Menu key={lesson.id}>
                  <Table.Row key={lesson.id}>
                    <div>{formatDateToDisplay(lesson.date)}</div>
                    <div>{parse(lesson.lessonContent)}</div>
                    <div>{parse(lesson.homework)}</div>
                    {!isMobile && <Menus.Toggle id={lesson.id} />}

                    <Modal>
                      <Menus.List id={lesson.id}>
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
                        <hr />

                        <Modal.Open opens="delete-lesson">
                          <Menus.Button
                            icon={<HiTrash />}
                            iconColor="var(--clr-warning)"
                          >
                            Lektion löschen
                          </Menus.Button>
                        </Modal.Open>
                      </Menus.List>
                      <Modal.Window name="edit-lesson">
                        <EditLesson lesson={lesson} />
                      </Modal.Window>

                      <Modal.Window name="share-homework">
                        <ShareHomework lessonId={lesson.id} />
                      </Modal.Window>

                      <Modal.Window name="delete-lesson">
                        <DeleteLesson lessonId={lesson.id} />
                      </Modal.Window>
                    </Modal>
                  </Table.Row>
                </Menus.Menu>
              )}
            />
          </Menus>
        </Table>
      )}
    </motion.div>
  )
}

export default AllLessons
